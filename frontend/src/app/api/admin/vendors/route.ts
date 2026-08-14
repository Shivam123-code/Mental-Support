// GET /api/admin/vendors
// Returns all vendor profiles with online/available status for the admin Vendors tab.

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return unauthorizedResponse();

    // Was an unbounded findMany joining a user row each. At a thousand vendors
    // that is one enormous response, and the dashboard then fires a reverse
    // geocode per vendor on top of it.
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '100'), 1), 200);
    const cursor = searchParams.get('cursor');

    const [rows, total] = await Promise.all([
      (prisma as any).vendorProfile.findMany({
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      (prisma as any).vendorProfile.count(),
    ]);

    const hasMore = rows.length > limit;
    const vendors = hasMore ? rows.slice(0, limit) : rows;

    const formatted = vendors.map((v: any) => ({
      id:                v.id,
      userId:            v.userId,
      businessName:      v.businessName,
      serviceType:       v.serviceType,
      phone:             v.phone,
      isOnline:          v.isOnline,
      isAvailable:       v.isAvailable,
      latitude:          v.latitude,
      longitude:         v.longitude,
      locationUpdatedAt: v.locationUpdatedAt,
      user: {
        name:  `${v.user.firstName} ${v.user.lastName}`.trim(),
        email: v.user.email,
        status: v.user.status,
      },
    }));

    return successResponse(
      {
        items: formatted,
        nextCursor: hasMore ? formatted[formatted.length - 1]?.id ?? null : null,
        total,
      },
      `Showing ${formatted.length} of ${total} vendor(s)`
    );
  } catch (error: any) {
    console.error('Admin vendors fetch error:', error);
    return errorResponse('Failed to fetch vendors: ' + (error?.message || 'Unknown'), 500);
  }
}
