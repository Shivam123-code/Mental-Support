/**
 * Turning a webhook into a settled payment, exactly once.
 *
 * Gateways redeliver. They redeliver on timeout, on a 500, on a deploy that
 * dropped the connection, and sometimes for no reason at all — so "this webhook
 * arrives twice" is the normal case, not the edge case. Everything here is
 * built to make the second delivery a no-op.
 *
 * The guard is a conditional update: the status may only move out of CREATED,
 * and whichever delivery wins that write is the one that fulfils. Reading the
 * status and then writing it would let two concurrent deliveries both decide
 * they were first, which for a booking means confirming it twice and for an
 * auto-match means handing out two entitlements for one payment.
 */

import { prisma } from '@/lib/db';
import type { WebhookEvent } from './provider';

export type SettleResult =
  | { ok: true; intentId: string; alreadySettled: boolean }
  | { ok: false; reason: 'unknown_ref' | 'amount_mismatch' };

export async function settle(event: WebhookEvent): Promise<SettleResult> {
  const intent = await prisma.paymentIntent.findUnique({
    where: { providerRef: event.providerRef },
  });
  if (!intent) return { ok: false, reason: 'unknown_ref' };

  // The provider echoes back what it actually charged. If that is not what we
  // asked for, something is wrong on one side or the other and this is not a
  // payment we can act on — refunds are a human decision, not an automatic one.
  if (event.outcome === 'PAID' &&
      (event.amount !== intent.amount || event.currency !== intent.currency)) {
    console.error(
      `[payments] amount mismatch on ${intent.id}: expected ${intent.amount} ${intent.currency}, ` +
      `provider reported ${event.amount} ${event.currency}`
    );
    return { ok: false, reason: 'amount_mismatch' };
  }

  const paid = event.outcome === 'PAID';

  const { count } = await prisma.paymentIntent.updateMany({
    // Only a still-open intent may settle. This is the whole idempotency
    // mechanism — a redelivery finds status already moved and writes nothing.
    where: { id: intent.id, status: 'CREATED' },
    data: paid
      ? { status: 'PAID', paidAt: new Date() }
      : { status: 'FAILED', failureReason: event.reason?.slice(0, 500) ?? 'Payment failed' },
  });

  if (count === 0) return { ok: true, intentId: intent.id, alreadySettled: true };

  if (paid) await fulfil(intent.id);

  return { ok: true, intentId: intent.id, alreadySettled: false };
}

/**
 * What the money bought. Runs once, after the status write has been won.
 *
 * Deliberately separate from taking payment: a failure here must not roll back
 * a payment that really happened, because the money is gone either way and a
 * rolled-back intent would look unpaid to the payer. So every step is
 * best-effort and loud, and the paid intent stays as the record of truth that
 * an admin can fulfil by hand.
 */
async function fulfil(intentId: string): Promise<void> {
  const intent = await prisma.paymentIntent.findUnique({ where: { id: intentId } });
  if (!intent) return;

  try {
    if (intent.purpose === 'BOOKING' && intent.bookingId) {
      await prisma.booking.update({
        where: { id: intent.bookingId },
        data: { isPaid: true },
      });
    }
    // AUTOMATCH needs nothing built here. The paid, unconsumed intent *is* the
    // entitlement; it is spent later when the caller picks somebody, because
    // choosing a professional is a decision they make after seeing the matches,
    // not something a webhook can do for them.

    await prisma.notification.create({
      data: {
        userId: intent.userId,
        type: 'SYSTEM_ALERT',
        title: 'Payment received',
        message: intent.purpose === 'AUTOMATCH'
          ? 'Your auto-match is unlocked. Answer a few questions and we will find your match.'
          : 'Your session payment went through.',
        link: intent.purpose === 'AUTOMATCH' ? '/professionals' : '/dashboard/user',
      },
    });
  } catch (err) {
    // Loud, because someone has paid and not received what they paid for.
    console.error(`[payments] FULFILMENT FAILED for paid intent ${intentId}:`, err);
  }
}
