// POST /api/sos  — PUBLIC endpoint, no authentication required
// Allows anyone (guest or logged-in user) to submit an emergency SOS alert.
// Saves to the database and the admin dashboard will pick it up.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
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
