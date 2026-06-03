// GET /api/vendor/assignments
// Returns active and recent assignments for the authenticated vendor.

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user || user.role !== 'VENDOR') return unauthorizedResponse();

    const assignments = await prisma.emergencyAlert.findMany({
      where: { assignedVendorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    const active = assignments.filter(a =>
      ['VENDOR_ALERTED', 'VENDOR_ACCEPTED', 'EN_ROUTE'].includes(a.dispatchStatus)
    );
    const history = assignments.filter(a =>
      !['VENDOR_ALERTED', 'VENDOR_ACCEPTED', 'EN_ROUTE'].includes(a.dispatchStatus)
    );

    return successResponse({ active, history, total: assignments.length });
  } catch (error: any) {
    console.error('Vendor assignments error:', error);
    return errorResponse('Failed to fetch assignments: ' + (error?.message || 'Unknown'), 500);
  }
}
