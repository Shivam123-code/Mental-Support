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

    // A job stays active right through to ARRIVED. NEARBY and ARRIVED were
    // missing here, so a vendor who had progressed past EN_ROUTE and then
    // reloaded had their live job sorted into history — the whole status panel
    // vanished mid-callout, with no way to mark themselves resolved.
    // Terminal alert states are excluded so a cancelled or resolved alert does
    // not linger as active just because dispatchStatus was never advanced.
    const LIVE_DISPATCH = ['VENDOR_ALERTED', 'VENDOR_ACCEPTED', 'EN_ROUTE', 'NEARBY', 'ARRIVED'];
    const isActive = (a: { dispatchStatus: string; status: string }) =>
      LIVE_DISPATCH.includes(a.dispatchStatus) && ['ACTIVE', 'ACKNOWLEDGED'].includes(a.status);

    const active = assignments.filter(isActive);
    const history = assignments.filter(a => !isActive(a));

    return successResponse({ active, history, total: assignments.length });
  } catch (error: any) {
    console.error('Vendor assignments error:', error);
    return errorResponse('Failed to fetch assignments: ' + (error?.message || 'Unknown'), 500);
  }
}
