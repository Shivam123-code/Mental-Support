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

    const vendors = await (prisma as any).vendorProfile.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

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

    return successResponse(formatted, `Found ${formatted.length} vendor(s)`);
  } catch (error: any) {
    console.error('Admin vendors fetch error:', error);
    return errorResponse('Failed to fetch vendors: ' + (error?.message || 'Unknown'), 500);
  }
}
