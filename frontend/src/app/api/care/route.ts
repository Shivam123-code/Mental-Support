// GET    /api/care  — who the caller is in care with (or caring for)
// POST   /api/care  — spend a paid auto-match on one professional
// DELETE /api/care  — end it
//
// This is where a payment turns into something. Taking the money and running
// the quiz is not the product; being connected to a specific person is, and
// that connection is what unlocks messaging before any session is booked.
//
// Spending is deliberately not done by the webhook. The caller has to see their
// matches and choose, so the paid intent sits unconsumed until they do.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { automatchRequiresPayment } from '@/lib/server/payments/provider';

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    // A professional looks at this from the other side: these are their clients.
    const profile = await prisma.professional.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    const rows = await prisma.careRelationship.findMany({
      where: profile ? { professionalId: profile.id, endedAt: null } : { userId: user.id, endedAt: null },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });

    // Two batched lookups instead of one per row.
    const [pros, clients] = await Promise.all([
      profile ? [] : prisma.professional.findMany({
        where: { id: { in: rows.map(r => r.professionalId) } },
        select: { id: true, userId: true, displayName: true, type: true, profileImage: true, hourlyRate: true, currency: true },
      }),
      profile ? prisma.user.findMany({
        where: { id: { in: rows.map(r => r.userId) } },
        select: { id: true, firstName: true, lastName: true, email: true },
      }) : [],
    ]);
    const proById = new Map(pros.map(p => [p.id, p]));
    const clientById = new Map(clients.map(c => [c.id, c]));

    return successResponse(
      {
        side: profile ? 'PROFESSIONAL' : 'USER',
        items: rows.map(r => {
          const pro = proById.get(r.professionalId);
          const client = clientById.get(r.userId);
          return {
            id: r.id,
            source: r.source,
            matchPercent: r.matchPercent,
            startedAt: r.startedAt,
            professional: pro
              ? {
                  id: pro.id,
                  // Messaging keys on the account, not the profile.
                  userId: pro.userId,
                  name: pro.displayName || 'Professional',
                  type: pro.type,
                  profileImage: pro.profileImage,
                  hourlyRate: pro.hourlyRate,
                  currency: pro.currency,
                }
              : null,
            client: client
              ? {
                  id: client.id,
                  name: `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim() || client.email,
                }
              : null,
          };
        }),
      },
      `${rows.length} active care relationship(s)`
    );
  } catch (error: any) {
    console.error('Care fetch error:', error);
    return errorResponse('Failed to load care relationships: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const professionalId = typeof body.professionalId === 'string' ? body.professionalId : '';
    if (!professionalId) return errorResponse('professionalId is required', 400);
    const matchPercent = Number.isInteger(body.matchPercent) ? body.matchPercent : null;

    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: { id: true, userId: true, displayName: true, verificationStatus: true, isAcceptingClients: true },
    });
    if (!professional) return errorResponse('Professional not found', 404);
    if (professional.userId === user.id) return errorResponse('You cannot start care with yourself', 400);
    if (professional.verificationStatus !== 'VERIFIED') {
      return errorResponse('This professional is not yet verified', 409);
    }
    if (!professional.isAcceptingClients) {
      return errorResponse('This professional is not accepting new clients', 409);
    }

    // Already connected: hand back what exists rather than charging again for
    // something the caller already has.
    const existing = await prisma.careRelationship.findUnique({
      where: { userId_professionalId: { userId: user.id, professionalId } },
    });
    if (existing && !existing.endedAt) {
      return successResponse(
        { id: existing.id, professionalId, alreadyActive: true, entitlementSpent: false },
        'You are already in care with this professional'
      );
    }

    const paywalled = automatchRequiresPayment();
    let spentIntentId: string | null = null;

    if (paywalled) {
      const entitlement = await prisma.paymentIntent.findFirst({
        where: { userId: user.id, purpose: 'AUTOMATCH', status: 'PAID', consumedAt: null },
        orderBy: { paidAt: 'asc' }, // oldest first, so nothing sits unused
      });
      if (!entitlement) {
        return errorResponse('This needs a paid auto-match. Please complete payment first.', 402);
      }

      // Conditional spend. Two tabs clicking "Start care" with different
      // professionals must not both succeed on one payment, and reading the
      // intent then writing it would let them.
      const { count } = await prisma.paymentIntent.updateMany({
        where: { id: entitlement.id, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      if (count === 0) {
        return errorResponse('That auto-match has already been used. Please pay again.', 409);
      }
      spentIntentId = entitlement.id;
    }

    try {
      const relationship = existing
        // A previously ended relationship is restarted in place — the unique
        // pair means a second row is impossible anyway.
        ? await prisma.careRelationship.update({
            where: { id: existing.id },
            data: { endedAt: null, startedAt: new Date(), matchPercent, paymentIntentId: spentIntentId },
          })
        : await prisma.careRelationship.create({
            data: {
              userId: user.id,
              professionalId,
              source: 'AUTOMATCH',
              matchPercent,
              paymentIntentId: spentIntentId,
            },
          });

      await prisma.notification.create({
        data: {
          userId: professional.userId,
          type: 'SYSTEM_ALERT',
          title: 'New client matched with you',
          message: 'Someone chose you through auto-match. You can message each other now.',
          link: '/dashboard/professional',
        },
      }).catch(err => console.error('[care] notification failed:', err));

      return successResponse(
        {
          id: relationship.id,
          professionalId,
          professionalUserId: professional.userId,
          professionalName: professional.displayName,
          alreadyActive: false,
          entitlementSpent: !!spentIntentId,
        },
        'You are now in care with this professional',
        201
      );
    } catch (err) {
      // The entitlement was spent a moment ago and the thing it paid for did
      // not happen. Give it back rather than leaving the caller out of pocket.
      if (spentIntentId) {
        await prisma.paymentIntent.updateMany({
          where: { id: spentIntentId },
          data: { consumedAt: null },
        }).catch(e => console.error(`[care] COULD NOT REFUND entitlement ${spentIntentId}:`, e));
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Care create error:', error);
    return errorResponse('Failed to start care: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id is required', 400);

    const row = await prisma.careRelationship.findUnique({ where: { id } });
    if (!row) return errorResponse('Not found', 404);

    // Either side may end it — a client must be able to walk away, and a
    // professional must be able to close a case.
    const profile = await prisma.professional.findUnique({
      where: { userId: user.id }, select: { id: true },
    });
    const mine = row.userId === user.id || row.professionalId === profile?.id;
    if (!mine) return errorResponse('Not found', 404);

    // The spent entitlement is deliberately not returned. It bought the
    // introduction, and that happened.
    await prisma.careRelationship.updateMany({
      where: { id, endedAt: null },
      data: { endedAt: new Date() },
    });

    return successResponse({ id, ended: true }, 'Care relationship ended');
  } catch (error: any) {
    console.error('Care delete error:', error);
    return errorResponse('Failed to end care relationship: ' + (error?.message ?? 'Unknown'), 500);
  }
}
