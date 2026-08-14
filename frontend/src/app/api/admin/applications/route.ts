// GET /api/admin/applications
// Returns all professional + organization applications for admin review

import { NextRequest } from 'next/server';
import { requireAdmin as checkAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const type = searchParams.get('type'); // 'professional' | 'organization' | null (all)
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '200'), 1), 500);

    const [professionalApps, orgApps] = await Promise.all([
      // Both were unbounded. An application queue only grows, and the default
      // view is every status, so this returned the entire history in one
      // response once the platform had any age to it.
      type === 'organization' ? [] : prisma.professionalApplication.findMany({
        where: status === 'ALL' ? {} : { status: status as any },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      type === 'professional' ? [] : prisma.organizationApplication.findMany({
        where: status === 'ALL' ? {} : { status: status as any },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ]);

    return successResponse({
      professional: professionalApps,
      organization: orgApps,
      total: professionalApps.length + orgApps.length,
    });
  } catch (error: any) {
    console.error('❌ Fetch applications error:', error?.message ?? error);
    console.error('Stack:', error?.stack);
    return errorResponse('Failed to fetch applications: ' + (error?.message ?? 'Unknown error'), 500);
  }
}
