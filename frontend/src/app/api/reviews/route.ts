// GET  /api/reviews?professionalId=…  — public reviews for one professional
// GET  /api/reviews?pending=1         — the caller's sessions still awaiting a review
// GET  /api/reviews?mine=1            — reviews the caller has written
// POST /api/reviews                   — review a completed session
//
// The Review model has existed since the schema was written with nothing ever
// writing to it, so every professional on the site sits at 0 stars and the
// match ranking — which sorts on averageRating — has been sorting on a column
// of zeroes.
//
// A rating is only worth showing if it cannot be manufactured, so a review must
// name a COMPLETED booking that belongs to the reviewer, and one booking yields
// one review. That is enforced by a unique column, not by a check-then-insert,
// because two tabs submitting at once would both pass the check.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { rateLimit } from '@/lib/server/rate-limit';

const MAX_COMMENT = 2000;

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

/**
 * Recompute a professional's headline rating from the reviews themselves.
 *
 * Kept as a derived value rather than incremented in place: an increment that
 * misses once is wrong forever, and nothing would ever tell you. Recomputing
 * from source is one extra query on a write that happens rarely.
 */
async function refreshRating(tx: any, professionalId: string) {
  const agg = await tx.review.aggregate({
    where: { professionalId },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await tx.professional.update({
    where: { id: professionalId },
    data: {
      // One decimal place — "4.3", not "4.333333333333333".
      averageRating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      totalReviews: agg._count._all,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');
    const pending = searchParams.get('pending') === '1';
    const mine = searchParams.get('mine') === '1';

    // ── Sessions the caller could review but has not ────────────────────────
    if (pending || mine) {
      const user = await caller(request);
      if (!user) return unauthorizedResponse();

      if (mine) {
        const rows = await prisma.review.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
        return successResponse({ items: rows }, `${rows.length} review(s) written`);
      }

      const completed = await prisma.booking.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        orderBy: { scheduledAt: 'desc' },
        take: 50,
        include: {
          professional: { select: { id: true, displayName: true, type: true, profileImage: true } },
        },
      });

      // One lookup rather than one per booking.
      const reviewed = new Set(
        (await prisma.review.findMany({
          where: { bookingId: { in: completed.map(b => b.id) } },
          select: { bookingId: true },
        })).map(r => r.bookingId)
      );

      const items = completed
        .filter(b => !reviewed.has(b.id))
        .map(b => ({
          bookingId: b.id,
          scheduledAt: b.scheduledAt,
          sessionType: b.sessionType,
          professional: b.professional
            ? {
                id: b.professional.id,
                name: b.professional.displayName || 'Professional',
                type: b.professional.type,
                profileImage: b.professional.profileImage,
              }
            : null,
        }));

      return successResponse({ items }, `${items.length} session(s) awaiting a review`);
    }

    // ── Public reviews for one professional ─────────────────────────────────
    if (!professionalId) return errorResponse('professionalId is required', 400);

    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '20'), 1), 50);
    const cursor = searchParams.get('cursor');

    const rows = await prisma.review.findMany({
      where: { professionalId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    // Names for the ones who did not ask to be anonymous. Anonymous reviewers
    // are not looked up at all, so their id cannot leak through a mistake here.
    const namedIds = page.filter(r => !r.isAnonymous).map(r => r.userId);
    const names = new Map(
      (namedIds.length
        ? await prisma.user.findMany({
            where: { id: { in: namedIds } },
            select: { id: true, firstName: true, lastName: true },
          })
        : []
      ).map(u => [u.id, `${u.firstName ?? ''} ${(u.lastName ?? '').slice(0, 1)}`.trim() || 'Client'])
    );

    const profile = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: { averageRating: true, totalReviews: true },
    });

    return successResponse(
      {
        items: page.map(r => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          author: r.isAnonymous ? 'Anonymous' : names.get(r.userId) ?? 'Client',
        })),
        nextCursor: hasMore ? page[page.length - 1].id : null,
        averageRating: profile?.averageRating ?? 0,
        totalReviews: profile?.totalReviews ?? 0,
      },
      `${profile?.totalReviews ?? 0} review(s)`
    );
  } catch (error: any) {
    console.error('Reviews fetch error:', error);
    return errorResponse('Failed to load reviews: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const limit = await rateLimit(`review:${user.id}`, 20, 60 * 60 * 1000);
    if (!limit.allowed) {
      return errorResponse('Too many reviews submitted. Please try again later.', 429);
    }

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const bookingId = typeof body.bookingId === 'string' ? body.bookingId : '';
    if (!bookingId) return errorResponse('bookingId is required', 400);

    const rating = Number(body.rating);
    // Whole and half stars only. An arbitrary float is not something any UI
    // here can produce, so it is either a mistake or an attempt to skew a mean.
    if (!Number.isFinite(rating) || rating < 1 || rating > 5 || (rating * 2) % 1 !== 0) {
      return errorResponse('rating must be between 1 and 5, in steps of 0.5', 400);
    }

    const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, MAX_COMMENT) : null;
    const isAnonymous = body.isAnonymous === true;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, professionalId: true, status: true },
    });
    // Not-found rather than forbidden for somebody else's booking: a 403 would
    // confirm the id exists.
    if (!booking || booking.userId !== user.id) return errorResponse('Session not found', 404);
    if (booking.status !== 'COMPLETED') {
      return errorResponse('You can only review a session once it has been completed', 409);
    }

    let review;
    try {
      review = await prisma.$transaction(async tx => {
        const created = await tx.review.create({
          data: {
            bookingId,
            professionalId: booking.professionalId,
            userId: user.id,
            rating,
            comment: comment || null,
            isAnonymous,
          },
        });
        // Inside the transaction, so the headline figure can never disagree
        // with the rows it is computed from.
        await refreshRating(tx, booking.professionalId);
        return created;
      });
    } catch (err: any) {
      // The unique bookingId doing its job — two tabs, or a double submit.
      if (err?.code === 'P2002') {
        return errorResponse('You have already reviewed this session', 409);
      }
      throw err;
    }

    const professional = await prisma.professional.findUnique({
      where: { id: booking.professionalId },
      select: { userId: true, averageRating: true, totalReviews: true },
    });

    if (professional) {
      await prisma.notification.create({
        data: {
          userId: professional.userId,
          type: 'SYSTEM_ALERT',
          title: 'New review',
          message: `A client rated a session ${rating} out of 5.`,
          link: '/dashboard/professional',
        },
      }).catch(err => console.error('[reviews] notification failed:', err));
    }

    return successResponse(
      {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.isAnonymous,
        createdAt: review.createdAt,
        professionalAverage: professional?.averageRating ?? 0,
        professionalTotal: professional?.totalReviews ?? 0,
      },
      'Thanks for the review',
      201
    );
  } catch (error: any) {
    console.error('Review create error:', error);
    return errorResponse('Failed to submit review: ' + (error?.message ?? 'Unknown'), 500);
  }
}
