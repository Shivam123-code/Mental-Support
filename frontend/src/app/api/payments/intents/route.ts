// POST /api/payments/intents  — open a payment and get somewhere to pay it
// GET  /api/payments/intents  — the caller's own payments
//
// Amounts are decided here, never accepted from the body. A price the client
// sends is a price the client chooses.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';
import { getProvider, automatchPrice, CURRENCY, formatMinor } from '@/lib/server/payments/provider';

const PURPOSES = ['AUTOMATCH', 'BOOKING'] as const;
type Purpose = (typeof PURPOSES)[number];

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

function present(i: any) {
  return {
    id: i.id,
    purpose: i.purpose,
    bookingId: i.bookingId,
    amount: i.amount,
    currency: i.currency,
    amountLabel: formatMinor(i.amount, i.currency),
    status: i.status,
    provider: i.provider,
    paidAt: i.paidAt,
    consumedAt: i.consumedAt,
    failureReason: i.failureReason,
    createdAt: i.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const purpose = searchParams.get('purpose');

    const rows = await prisma.paymentIntent.findMany({
      where: {
        userId: user.id,
        ...(status && ['CREATED', 'PAID', 'FAILED', 'REFUNDED'].includes(status) ? { status: status as any } : {}),
        ...(purpose && PURPOSES.includes(purpose as Purpose) ? { purpose: purpose as any } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // What the caller can actually use right now, so the UI does not have to
    // re-derive the entitlement rule and get it subtly different.
    const entitlement = rows.find(
      r => r.purpose === 'AUTOMATCH' && r.status === 'PAID' && r.consumedAt === null
    );

    return successResponse(
      { items: rows.map(present), automatchEntitlement: entitlement ? present(entitlement) : null },
      `${rows.length} payment(s)`
    );
  } catch (error: any) {
    console.error('Payment intents fetch error:', error);
    return errorResponse('Failed to load payments: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const limit = await rateLimit(`payment:${user.id || getClientIp(request)}`, 20, 60 * 60 * 1000);
    if (!limit.allowed) {
      return errorResponse(
        `Too many payment attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
        429
      );
    }

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const purpose = body?.purpose as Purpose;
    if (!PURPOSES.includes(purpose)) {
      return errorResponse(`purpose must be one of: ${PURPOSES.join(', ')}`, 400);
    }

    let amount: number;
    let currency = CURRENCY;
    let bookingId: string | null = null;
    let description: string;

    if (purpose === 'AUTOMATCH') {
      // One unspent match at a time. Without this, an impatient double-click is
      // two charges for one thing the caller can only use once.
      const existing = await prisma.paymentIntent.findFirst({
        where: { userId: user.id, purpose: 'AUTOMATCH', status: 'PAID', consumedAt: null },
      });
      if (existing) {
        return successResponse(
          { intent: present(existing), checkoutUrl: null, alreadyPaid: true },
          'You already have an auto-match available'
        );
      }
      amount = automatchPrice();
      description = 'KleverKlues auto-match';
    } else {
      bookingId = typeof body.bookingId === 'string' ? body.bookingId : '';
      if (!bookingId) return errorResponse('bookingId is required for a BOOKING payment', 400);

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return errorResponse('Booking not found', 404);
      // Ownership, not just existence — otherwise anyone can enumerate ids and
      // read back what somebody else's session costs.
      if (booking.userId !== user.id) return errorResponse('Booking not found', 404);
      if (booking.isPaid) return errorResponse('This session is already paid for', 409);
      if (['CANCELLED', 'NO_SHOW'].includes(booking.status)) {
        return errorResponse('This session is no longer active', 409);
      }
      if (!booking.amount || booking.amount <= 0) {
        return errorResponse('This session has no price set. Please contact support.', 409);
      }

      // Booking.amount is a Float in the major unit; money is held in the minor
      // unit everywhere in this module. Round rather than truncate, so a 49.995
      // does not quietly lose a paisa on every transaction.
      amount = Math.round(booking.amount * 100);
      currency = booking.currency;
      description = 'KleverKlues session';
    }

    const provider = getProvider();
    const intentId = crypto.randomUUID();
    const { providerRef, checkoutUrl } = await provider.createCheckout({
      intentId, userId: user.id, amount, currency, description,
    });

    const intent = await prisma.paymentIntent.create({
      data: {
        id: intentId,
        userId: user.id,
        purpose,
        bookingId,
        amount,
        currency,
        provider: provider.name,
        providerRef,
        status: 'CREATED',
      },
    });

    return successResponse({ intent: present(intent), checkoutUrl, alreadyPaid: false }, 'Payment started', 201);
  } catch (error: any) {
    console.error('Payment intent create error:', error);
    return errorResponse('Failed to start payment: ' + (error?.message ?? 'Unknown'), 500);
  }
}
