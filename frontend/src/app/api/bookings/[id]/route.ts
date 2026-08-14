// PATCH /api/bookings/[id] — move a session along, or add notes
//
// Who may do what is decided by which side of the booking the caller is on,
// read from their account. Both dashboards used to mutate local state only, so
// a professional "confirming" a session changed nothing the client could see.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

/**
 * Allowed transitions. A booking must not jump straight from PENDING to
 * COMPLETED, and nothing may move once it is finished.
 */
const TRANSITIONS: Record<string, string[]> = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED', 'NO_SHOW'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW:   [],
};

/** Only the professional runs the session, so only they can settle its outcome. */
const PROFESSIONAL_ONLY = ['CONFIRMED', 'COMPLETED', 'NO_SHOW'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const caller = await getUserFromToken(authHeader.substring(7));
    if (!caller) return unauthorizedResponse();

    const { id } = await params;
    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { professional: { select: { id: true, userId: true } } },
    });
    if (!booking) return errorResponse('Session not found', 404);

    const isClient = booking.userId === caller.id;
    const isProfessional = booking.professional?.userId === caller.id;
    // Not a party to this booking — say not found rather than forbidden, so the
    // endpoint cannot be used to probe which booking ids exist.
    if (!isClient && !isProfessional) return errorResponse('Session not found', 404);

    const data: any = {};

    // ── Notes ───────────────────────────────────────────────────────────────
    // Each side owns its own notes field. Clinical notes are not the client's
    // to write, and the client's brief is not the professional's to edit.
    if (typeof body.userNotes === 'string') {
      if (!isClient) return errorResponse('Only the client can edit client notes', 403);
      data.userNotes = body.userNotes.slice(0, 1000);
    }
    if (typeof body.professionalNotes === 'string') {
      if (!isProfessional) return errorResponse('Only the professional can edit session notes', 403);
      data.professionalNotes = body.professionalNotes.slice(0, 5000);
    }
    if (typeof body.meetingLink === 'string') {
      if (!isProfessional) return errorResponse('Only the professional can set the meeting link', 403);
      if (body.meetingLink && !/^https:\/\//.test(body.meetingLink)) {
        return errorResponse('meetingLink must be an https URL', 400);
      }
      data.meetingLink = body.meetingLink.slice(0, 500) || null;
    }

    // ── Status ──────────────────────────────────────────────────────────────
    if (body.status) {
      const next = String(body.status);
      const allowed = TRANSITIONS[booking.status] ?? [];
      if (!allowed.includes(next)) {
        return errorResponse(`Cannot move a ${booking.status} session to ${next}`, 409);
      }
      if (PROFESSIONAL_ONLY.includes(next) && !isProfessional) {
        return errorResponse(`Only the professional can mark a session ${next}`, 403);
      }
      data.status = next;
      if (next === 'COMPLETED') data.completedAt = new Date();
      if (next === 'CANCELLED') data.cancelledAt = new Date();
    }

    if (Object.keys(data).length === 0) return errorResponse('Nothing to update', 400);

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        professional: { select: { id: true, userId: true, displayName: true, type: true } },
      },
    });

    // Tell the other side. Whoever did not make the change is the one who needs
    // to hear about it.
    if (data.status) {
      const recipient = isProfessional ? booking.userId : booking.professional!.userId;
      const actor = isProfessional ? 'Your professional' : 'Your client';
      await prisma.notification.create({
        data: {
          userId: recipient,
          type: data.status === 'CANCELLED' ? 'SYSTEM_ALERT' : 'BOOKING_CONFIRMED',
          title: `Session ${data.status.toLowerCase()}`,
          message: `${actor} marked the session on ${updated.scheduledAt.toLocaleString()} as ${data.status.toLowerCase()}.`,
          link: isProfessional ? '/dashboard/user' : '/dashboard/professional',
        },
      }).catch(err => console.error('[bookings] notification failed:', err));
    }

    return successResponse(
      {
        id: updated.id,
        status: updated.status,
        scheduledAt: updated.scheduledAt,
        duration: updated.duration,
        sessionType: updated.sessionType,
        meetingLink: updated.meetingLink,
        userNotes: updated.userNotes,
        professionalNotes: updated.professionalNotes,
        completedAt: updated.completedAt,
        cancelledAt: updated.cancelledAt,
      },
      'Session updated'
    );
  } catch (error: any) {
    console.error('Booking update error:', error);
    return errorResponse('Failed to update session: ' + (error?.message ?? 'Unknown'), 500);
  }
}
