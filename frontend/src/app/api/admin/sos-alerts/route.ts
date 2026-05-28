// GET /api/admin/sos-alerts
// Returns all emergency alerts from the database for the admin dashboard.
// Sorted by newest first, includes all statuses (ACTIVE, ACKNOWLEDGED, RESOLVED).

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const user = await getUserFromToken(token);
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || '100'), 500);

    const alerts = await prisma.emergencyAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Shape to match the WebSocket alert format used in the frontend
    const shaped = alerts.map(a => ({
      id: a.id,
      userId: a.userId,
      userName: a.user ? `${a.user.firstName} ${a.user.lastName}`.trim() : a.userId,
      userEmail: a.user?.email || '',
      latitude: a.latitude,
      longitude: a.longitude,
      severity: a.severity,
      message: a.message || '',
      status: a.status,          // ACTIVE | ACKNOWLEDGED | RESOLVED
      timestamp: a.createdAt.toISOString(),
      acknowledgedBy: a.acknowledgedBy || null,
      acknowledgedAt: a.acknowledgedAt?.toISOString() || null,
      resolvedAt: a.resolvedAt?.toISOString() || null,
      fromDb: true,              // flag so frontend knows it's historical
    }));

    return successResponse({ alerts: shaped, total: shaped.length });
  } catch (error) {
    console.error('SOS alerts fetch error:', error);
    return errorResponse('Failed to fetch SOS alerts', 500);
  }
}
