// POST /api/sos  — PUBLIC endpoint, no authentication required
// Allows anyone (guest or logged-in user) to submit an emergency SOS alert.
// Saves to the database and the admin dashboard will pick it up.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';
import { getUserFromToken } from '@/lib/auth';

/**
 * Ask the socket server to run its dispatch chain for this alert.
 *
 * Returns false rather than throwing: if dispatch is unreachable the alert is
 * still saved and the caller is told the truth and pointed at 112, which is far
 * better than a 500 that loses the alert entirely.
 */
async function triggerDispatch(alertId: string): Promise<boolean> {
  const url = process.env.SOCKET_SERVER_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!url || !secret) {
    console.error('❌ SOCKET_SERVER_URL / INTERNAL_API_SECRET not set — SOS cannot be dispatched.');
    return false;
  }

  try {
    const res = await fetch(`${url}/internal/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-secret': secret },
      body: JSON.stringify({ alertId }),
      // An emergency must not hang on a slow socket server.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`❌ Dispatch trigger failed (${res.status}) for alert ${alertId}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`❌ Dispatch trigger error for alert ${alertId}:`, err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // V-06 FIX: Rate limit SOS — max 3 alerts per 10 minutes per IP
  // Prevents fake-alert flooding while allowing genuine emergencies (need only 1).
  const ip = getClientIp(request);
  const { allowed } = await rateLimit(`sos:${ip}`, 3, 10 * 60 * 1000);
  if (!allowed) {
    // Still log the attempt for admin awareness
    console.warn(`SOS rate limit exceeded from IP: ${ip}`);
    return errorResponse(
      'Too many SOS requests. If this is a real emergency, please call 112 directly.',
      429
    );
  }

  try {
    const body = await request.json();

    const { latitude, longitude, message, severity, guestName, guestPhone } = body;

    // Basic validation
    if (
      typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180
    ) {
      return errorResponse('latitude and longitude must be valid coordinates', 400);
    }

    // The alert is attributed to the bearer token if one is supplied, and to
    // nobody otherwise. A userId in the body is ignored: accepting it let anyone
    // who knew a user's id file emergencies in that person's name, which routes
    // real responders to a fabricated location under someone else's identity.
    const authHeader = request.headers.get('authorization');
    const user = authHeader?.startsWith('Bearer ')
      ? await getUserFromToken(authHeader.substring(7))
      : null;

    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM'];
    const finalSeverity = validSeverities.includes(severity) ? severity : 'CRITICAL';

    // Cap free-text so an unauthenticated caller cannot stuff the DB.
    const str = (v: unknown, max: number) =>
      typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

    // A signed-in caller pressing repeatedly must not spawn competing dispatch
    // chains that fight over the same vendors.
    if (user) {
      const open = await prisma.emergencyAlert.findFirst({
        where: { userId: user.id, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
        orderBy: { createdAt: 'desc' },
      });
      if (open) {
        await prisma.emergencyAlert.update({
          where: { id: open.id },
          data: { latitude, longitude, locationUpdatedAt: new Date() },
        });
        return successResponse(
          { alertId: open.id, status: open.status, severity: open.severity, emergencyNumber: '112' },
          'Your emergency is already active and help is being coordinated.'
        );
      }
    }

    // Create the alert — userId is null for genuine guests
    const alert = await prisma.emergencyAlert.create({
      data: {
        userId:    user?.id ?? null,
        guestName: user ? null : str(guestName, 100),
        guestPhone: user ? null : str(guestPhone, 30),
        latitude,
        longitude,
        locationUpdatedAt: new Date(),
        severity:  finalSeverity,
        message:   str(message, 500) ?? (user ? 'Emergency SOS activated' : 'Emergency SOS activated (Guest)'),
        status:    'ACTIVE',
      },
    });

    // Get IP for basic logging
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    console.log(`🚨 SOS alert created: ${alert.id} from IP ${ip}`);

    // Hand the alert to the socket server's dispatch engine. Without this the
    // route saved a row and replied "Help is on the way" while notifying nobody
    // — the dispatch chain only ever ran on the WebSocket path.
    const dispatched = await triggerDispatch(alert.id);

    return successResponse(
      {
        alertId:   alert.id,
        status:    alert.status,
        severity:  alert.severity,
        timestamp: alert.createdAt.toISOString(),
        dispatched,
        emergencyNumber: '112',
      },
      dispatched
        ? 'Emergency alert received. Finding help near you now.'
        : // Never claim help is coming when we could not reach dispatch.
          'Emergency alert recorded, but we could not reach our dispatch system. Please call 112 now.'
    );
  } catch (error) {
    console.error('Public SOS error:', error);
    return errorResponse('Failed to submit emergency alert. Please call 112 directly.', 500);
  }
}
