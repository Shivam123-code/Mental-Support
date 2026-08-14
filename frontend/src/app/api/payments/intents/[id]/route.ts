// GET /api/payments/intents/[id] — poll one payment
//
// The browser is sent back from checkout before the webhook necessarily lands,
// so the success page polls this rather than trusting whatever the redirect
// says. The status here comes from the webhook and nowhere else.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { formatMinor } from '@/lib/server/payments/provider';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = request.headers.get('authorization');
    if (!h?.startsWith('Bearer ')) return unauthorizedResponse();
    const user = await getUserFromToken(h.substring(7));
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const intent = await prisma.paymentIntent.findUnique({ where: { id } });

    // Not-found rather than forbidden for someone else's payment: a 403 here
    // would confirm the id exists.
    if (!intent || intent.userId !== user.id) return errorResponse('Payment not found', 404);

    return successResponse({
      id: intent.id,
      purpose: intent.purpose,
      bookingId: intent.bookingId,
      amount: intent.amount,
      currency: intent.currency,
      amountLabel: formatMinor(intent.amount, intent.currency),
      status: intent.status,
      // providerRef is deliberately not returned: it is what the webhook
      // signature is checked against, and it does not belong in a browser.
      paidAt: intent.paidAt,
      consumedAt: intent.consumedAt,
      failureReason: intent.failureReason,
      createdAt: intent.createdAt,
    });
  } catch (error: any) {
    console.error('Payment intent fetch error:', error);
    return errorResponse('Failed to load payment: ' + (error?.message ?? 'Unknown'), 500);
  }
}
