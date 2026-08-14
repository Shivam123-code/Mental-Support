// POST /api/bookings/[id]/meeting — create (or return) the video room
//
// Uses Jitsi Meet's hosted service: a room exists as soon as someone opens its
// URL, so there is no media infrastructure to run. Native WebRTC would mean
// operating TURN servers and being on call for them, which is not worth it
// until the volume justifies it.
//
// The room name is derived server-side from the booking id and a secret, never
// supplied by the client. A guessable room ("session-1", the raw booking id)
// would let anyone who tried the right string walk into a therapy session.

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

const JITSI_HOST = process.env.JITSI_HOST || 'meet.jit.si';

/**
 * An unguessable, stable room name for one booking. Stable so both parties
 * derive the same room and a reload does not strand somebody in an empty call.
 */
function roomFor(bookingId: string): string {
  // Falls back to JWT_SECRET so a deployment without a dedicated meeting secret
  // still gets an unguessable room rather than a predictable one.
  const secret = process.env.MEETING_ROOM_SECRET || process.env.JWT_SECRET || '';
  const digest = crypto.createHmac('sha256', secret).update(bookingId).digest('base64url');
  return `kleverklues-${digest.slice(0, 24)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = request.headers.get('authorization');
    if (!h?.startsWith('Bearer ')) return unauthorizedResponse();
    const caller = await getUserFromToken(h.substring(7));
    if (!caller) return unauthorizedResponse();

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { professional: { select: { userId: true } } },
    });
    if (!booking) return errorResponse('Session not found', 404);

    const isClient = booking.userId === caller.id;
    const isProfessional = booking.professional?.userId === caller.id;
    // Not a party to it — say not found, so this cannot be used to discover
    // which booking ids exist.
    if (!isClient && !isProfessional) return errorResponse('Session not found', 404);

    if (booking.sessionType === 'chat') {
      return errorResponse('This is a chat session, not a call', 409);
    }
    if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(booking.status)) {
      return errorResponse(`This session is ${booking.status.toLowerCase()}`, 409);
    }

    const room = roomFor(booking.id);
    const url = `https://${JITSI_HOST}/${room}`;

    // Store it once so both sides, and any reminder email, point at the same
    // room. Derivation is deterministic, so this is a convenience, not the
    // source of truth.
    if (booking.meetingLink !== url) {
      await prisma.booking.update({ where: { id }, data: { meetingLink: url } });
    }

    return successResponse(
      {
        url,
        room,
        host: JITSI_HOST,
        // Only the professional should open the room to begin with; a client
        // arriving early otherwise sits alone in a call that has "started".
        isHost: isProfessional,
        scheduledAt: booking.scheduledAt,
        durationMinutes: booking.duration,
      },
      'Meeting room ready'
    );
  } catch (error: any) {
    console.error('Meeting room error:', error);
    return errorResponse('Failed to prepare the meeting: ' + (error?.message ?? 'Unknown'), 500);
  }
}
