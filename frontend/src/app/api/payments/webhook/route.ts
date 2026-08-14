// POST /api/payments/webhook — the gateway tells us what happened
//
// Public by necessity: a payment gateway has no login. The HMAC signature is
// the authentication, which is why the raw body is read before anything parses
// it — signing a re-serialised object would compare against different bytes and
// every legitimate webhook would be rejected.
//
// This is the only place in the codebase that may mark a payment PAID.

import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { getProvider } from '@/lib/server/payments/provider';
import { settle } from '@/lib/server/payments/settle';

export async function POST(request: NextRequest) {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return errorResponse('Unreadable body', 400);
  }

  // A body big enough to be a denial-of-service is not a body a gateway sent.
  if (raw.length > 64 * 1024) return errorResponse('Payload too large', 413);

  let event;
  try {
    event = getProvider().parseWebhook(raw, request.headers);
  } catch (err: any) {
    // Thrown, not returned null — a missing PAYMENT_WEBHOOK_SECRET lands here.
    console.error('[payments] webhook could not be verified:', err?.message);
    return errorResponse('Webhook verification unavailable', 503);
  }

  if (!event) {
    console.warn('[payments] rejected an unsigned or malformed webhook');
    return errorResponse('Invalid signature', 401);
  }

  const result = await settle(event);

  if (!result.ok) {
    // 200 on an unknown reference on purpose: a 4xx makes the gateway retry
    // forever on a payment we will never recognise. An amount mismatch is a
    // real problem, but retrying does not fix it either — it needs a human, and
    // settle() has already logged it.
    console.warn(`[payments] webhook not actioned (${result.reason}) for ${event.providerRef}`);
    return successResponse({ received: true, actioned: false, reason: result.reason });
  }

  return successResponse({
    received: true,
    actioned: !result.alreadySettled,
    intentId: result.intentId,
  });
}
