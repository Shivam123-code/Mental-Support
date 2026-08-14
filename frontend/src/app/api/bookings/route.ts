// GET  /api/bookings   — sessions for the caller, from whichever side they are on
// POST /api/bookings   — a user books a session with a professional
//
// One set of rows, two viewpoints: a USER sees the sessions they booked, a
// PROFESSIONAL sees the sessions booked with them. Both dashboards previously
// rendered hardcoded fixtures, so nothing either side did was visible to the
// other.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

const VALID_SESSION_TYPES = ['video', 'audio', 'chat'] as const;
const VALID_DURATIONS = [30, 45, 50, 60, 90];
/** Live statuses, as opposed to finished ones. */
const OPEN_STATUSES = ['PENDING', 'CONFIRMED'] as const;

async function callerFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return getUserFromToken(authHeader.substring(7));
}

/**
 * Shape a booking for whichever side is looking at it.
 *
 * `proUsers` maps Professional.userId -> that person's User row. Professional
 * has a plain userId column with no Prisma relation, so it cannot be included
 * in the query; the callers resolve the names in one batched lookup rather than
 * one per row.
 */
function present(b: any, proUsers?: Map<string, any>) {
  const proUser = b.professional ? proUsers?.get(b.professional.userId) : null;
  return {
    id: b.id,
    sessionType: b.sessionType,
    scheduledAt: b.scheduledAt,
    duration: b.duration,
    status: b.status,
    meetingLink: b.meetingLink,
    userNotes: b.userNotes,
    professionalNotes: b.professionalNotes,
    amount: b.amount,
    currency: b.currency,
    isPaid: b.isPaid,
    createdAt: b.createdAt,
    completedAt: b.completedAt,
    cancelledAt: b.cancelledAt,
    client: b.user
      ? {
          id: b.user.id,
          name: `${b.user.firstName ?? ''} ${b.user.lastName ?? ''}`.trim() || b.user.email,
          email: b.user.email,
        }
      : null,
    professional: b.professional
      ? {
          id: b.professional.id,
          userId: b.professional.userId,
          name:
            b.professional.displayName ||
            `${proUser?.firstName ?? ''} ${proUser?.lastName ?? ''}`.trim() ||
            'Professional',
          email: proUser?.email ?? null,
          type: b.professional.type,
          hourlyRate: b.professional.hourlyRate,
          currency: b.professional.currency,
        }
      : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const caller = await callerFromRequest(request);
    if (!caller) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') ?? 'upcoming'; // upcoming | past | all
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 100);
    const cursor = searchParams.get('cursor');

    // Which side of the table the caller sits on is derived from their account,
    // never from a query parameter — otherwise anyone could read another
    // professional's calendar by passing their id.
    let where: any;
    if (caller.role === 'PROFESSIONAL') {
      const profile = await prisma.professional.findUnique({ where: { userId: caller.id } });
      if (!profile) {
        return successResponse(
          { items: [], nextCursor: null, total: 0, role: 'PROFESSIONAL' },
          'No professional profile is attached to this account yet'
        );
      }
      where = { professionalId: profile.id };
    } else {
      where = { userId: caller.id };
    }

    if (scope === 'upcoming') {
      where.status = { in: OPEN_STATUSES as any };
      where.scheduledAt = { gte: new Date() };
    } else if (scope === 'past') {
      // Anything finished, plus anything whose time has simply gone by.
      where.OR = [
        { status: { in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] } },
        { scheduledAt: { lt: new Date() } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { scheduledAt: scope === 'past' ? 'desc' : 'asc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          professional: {
            select: {
              id: true, userId: true, displayName: true, type: true,
              hourlyRate: true, currency: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    // One lookup for every professional on the page, not one per booking.
    const proUserIds = [...new Set(page.map(b => b.professional?.userId).filter(Boolean))] as string[];
    const proUsers = new Map(
      (proUserIds.length
        ? await prisma.user.findMany({
            where: { id: { in: proUserIds } },
            select: { id: true, firstName: true, lastName: true, email: true },
          })
        : []
      ).map(u => [u.id, u])
    );

    return successResponse(
      {
        items: page.map(b => present(b, proUsers)),
        nextCursor: hasMore ? page[page.length - 1].id : null,
        total,
        role: caller.role,
      },
      `${total} session(s)`
    );
  } catch (error: any) {
    console.error('Bookings fetch error:', error);
    return errorResponse('Failed to fetch sessions: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const caller = await callerFromRequest(request);
    if (!caller) return unauthorizedResponse();

    // Booking writes a row and will later trigger payment, so it is not a free
    // endpoint to hammer.
    const limit = await rateLimit(`booking:${caller.id || getClientIp(request)}`, 20, 60 * 60 * 1000);
    if (!limit.allowed) {
      return errorResponse(
        `Too many booking attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
        429
      );
    }

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const { professionalId, scheduledAt, sessionType, duration, userNotes } = body;

    if (!professionalId || typeof professionalId !== 'string') {
      return errorResponse('professionalId is required', 400);
    }
    if (!VALID_SESSION_TYPES.includes(sessionType)) {
      return errorResponse(`sessionType must be one of: ${VALID_SESSION_TYPES.join(', ')}`, 400);
    }
    const mins = Number(duration ?? 50);
    if (!VALID_DURATIONS.includes(mins)) {
      return errorResponse(`duration must be one of: ${VALID_DURATIONS.join(', ')}`, 400);
    }

    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime())) return errorResponse('scheduledAt must be a valid date', 400);
    if (when.getTime() < Date.now()) return errorResponse('Cannot book a session in the past', 400);

    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: {
        id: true, userId: true, isAcceptingClients: true, verificationStatus: true,
        hourlyRate: true, currency: true,
      },
    });
    if (!professional) return errorResponse('Professional not found', 404);
    if (professional.verificationStatus !== 'VERIFIED') {
      return errorResponse('This professional is not yet verified', 409);
    }
    if (!professional.isAcceptingClients) {
      return errorResponse('This professional is not accepting new clients', 409);
    }
    if (professional.userId === caller.id) {
      return errorResponse('You cannot book a session with yourself', 400);
    }

    // Double-booking guard. Without it two callers can hold the same slot and
    // only find out when both turn up.
    const end = new Date(when.getTime() + mins * 60_000);
    const clash = await prisma.booking.findFirst({
      where: {
        professionalId,
        status: { in: OPEN_STATUSES as any },
        scheduledAt: { lt: end, gte: new Date(when.getTime() - 90 * 60_000) },
      },
      select: { id: true, scheduledAt: true, duration: true },
    });
    if (clash) {
      const clashEnd = new Date(new Date(clash.scheduledAt).getTime() + clash.duration * 60_000);
      if (clashEnd > when) return errorResponse('That time is already booked', 409);
    }

    const booking = await prisma.booking.create({
      data: {
        userId: caller.id,
        professionalId,
        sessionType,
        scheduledAt: when,
        duration: mins,
        status: 'PENDING',
        userNotes: typeof userNotes === 'string' ? userNotes.slice(0, 1000) : null,
        // Priced from the professional's real rate. isPaid stays false until a
        // payment provider confirms it server-side — never from the client.
        amount: professional.hourlyRate ? (professional.hourlyRate * mins) / 60 : null,
        currency: professional.currency,
        isPaid: false,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        professional: {
          select: {
            id: true, userId: true, displayName: true, type: true,
            hourlyRate: true, currency: true,
          },
        },
      },
    });

    // Tell the professional. The Notification table existed and had never been
    // written to, which is why that panel was a fixture.
    await prisma.notification.create({
      data: {
        userId: professional.userId,
        type: 'BOOKING_CONFIRMED',
        title: 'New session booked',
        message: `${booking.user.firstName ?? 'A client'} booked a ${mins}-minute ${sessionType} session for ${when.toLocaleString()}.`,
        link: '/dashboard/professional',
      },
    }).catch(err => console.error('[bookings] notification failed:', err));

    const proUser = await prisma.user.findUnique({
      where: { id: professional.userId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    return successResponse(
      present(booking, new Map(proUser ? [[proUser.id, proUser]] : [])),
      'Session booked',
      201
    );
  } catch (error: any) {
    console.error('Booking create error:', error);
    return errorResponse('Failed to book session: ' + (error?.message ?? 'Unknown'), 500);
  }
}
