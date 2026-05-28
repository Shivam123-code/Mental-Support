// GET /api/admin/applications
// Returns all professional + organization applications for admin review

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
    const status = searchParams.get('status') || 'PENDING';
    const type = searchParams.get('type'); // 'professional' | 'organization' | null (all)

    const [professionalApps, orgApps] = await Promise.all([
      type === 'organization' ? [] : prisma.professionalApplication.findMany({
        where: status === 'ALL' ? {} : { status: status as any },
        orderBy: { createdAt: 'desc' },
      }),
      type === 'professional' ? [] : prisma.organizationApplication.findMany({
        where: status === 'ALL' ? {} : { status: status as any },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return successResponse({
      professional: professionalApps,
      organization: orgApps,
      total: professionalApps.length + orgApps.length,
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return errorResponse('Failed to fetch applications', 500);
  }
}
