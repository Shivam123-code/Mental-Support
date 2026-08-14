// POST /api/payments/dummy/pay — stands in for the gateway's checkout page
//
// This is the only piece that disappears when real keys arrive. It does not
// mark anything paid itself; it does what a gateway does — signs a webhook and
// POSTs it back at us over HTTP. So the path exercised in testing today is the
// exact path Razorpay will drive tomorrow, signature check included, and the
// browser still has no way to settle its own payment.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { sign, SIGNATURE_HEADER } from '@/lib/server/payments/provider';

export async function POST(request: NextRequest) {
  try {
    if ((process.env.PAYMENT_PROVIDER || 'dummy') !== 'dummy') {
      return errorResponse('Test payments are disabled', 404);
    }

    const h = request.headers.get('authorization');
    if (!h?.startsWith('Bearer ')) return unauthorizedResponse();
    const user = await getUserFromToken(h.substring(7));
    if (!user) return unauthorizedResponse();

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const intentId = typeof body.intentId === 'string' ? body.intentId : '';
    if (!intentId) return errorResponse('intentId is required', 400);
    const succeed = body.outcome !== 'fail'; // failures need testing too

    const intent = await prisma.paymentIntent.findUnique({ where: { id: intentId } });
    if (!intent || intent.userId !== user.id) return errorResponse('Payment not found', 404);
    if (intent.status !== 'CREATED') {
      return errorResponse(`This payment is already ${intent.status.toLowerCase()}`, 409);
    }

    const payload = JSON.stringify({
      event: succeed ? 'payment.captured' : 'payment.failed',
      providerRef: intent.providerRef,
      amount: intent.amount,
      currency: intent.currency,
      ...(succeed ? {} : { reason: 'Card declined (test)' }),
    });

    // Same-origin, so a tunnelled or proxied dev server still reaches itself.
    const url = new URL('/api/payments/webhook', request.nextUrl.origin);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [SIGNATURE_HEADER]: sign(payload) },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[payments] dummy webhook was rejected:', res.status, detail);
      return errorResponse('The test gateway could not confirm this payment', 502);
    }

    // Read the intent back rather than reporting what we hoped happened — the
    // webhook is the authority and it has now run.
    const settled = await prisma.paymentIntent.findUnique({ where: { id: intentId } });
    return successResponse({ id: intentId, status: settled?.status ?? intent.status }, 'Test payment processed');
  } catch (error: any) {
    console.error('Dummy payment error:', error);
    return errorResponse('Test payment failed: ' + (error?.message ?? 'Unknown'), 500);
  }
}
