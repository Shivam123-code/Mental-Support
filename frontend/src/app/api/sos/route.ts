// POST /api/sos  — PUBLIC endpoint, no authentication required
// Allows anyone (guest or logged-in user) to submit an emergency SOS alert.
// Saves to the database and the admin dashboard will pick it up.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request: NextRequest) {
  // V-06 FIX: Rate limit SOS — max 3 alerts per 10 minutes per IP
  // Prevents fake-alert flooding while allowing genuine emergencies (need only 1).
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`sos:${ip}`, 3, 10 * 60 * 1000);
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

    const { latitude, longitude, message, severity, userId, guestName, guestPhone } = body;

    // Basic validation
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return errorResponse('latitude and longitude are required numbers', 400);
    }

    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM'];
    const finalSeverity = validSeverities.includes(severity) ? severity : 'CRITICAL';

    // Create the alert — userId is optional (null for guests)
    const alert = await prisma.emergencyAlert.create({
      data: {
        userId:    userId   || null,
        guestName: guestName || null,
        guestPhone: guestPhone || null,
        latitude,
        longitude,
        severity:  finalSeverity,
        message:   message  || 'Emergency SOS activated (Guest)',
        status:    'ACTIVE',
      },
    });

    // Get IP for basic logging
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    console.log(`🚨 Guest SOS alert created: ${alert.id} from IP ${ip}`);

    return successResponse(
      {
        alertId:   alert.id,
        status:    alert.status,
        severity:  alert.severity,
        timestamp: alert.createdAt.toISOString(),
      },
      'Emergency alert received. Help is on the way.'
    );
  } catch (error) {
    console.error('Public SOS error:', error);
    return errorResponse('Failed to submit emergency alert. Please call 112 directly.', 500);
  }
}
