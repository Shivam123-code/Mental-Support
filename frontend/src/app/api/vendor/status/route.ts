// PUT /api/vendor/status
// Toggles vendor isOnline flag. Called when vendor flips the Online/Offline switch.

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user || user.role !== 'VENDOR') return unauthorizedResponse();

    const body = await request.json();
    const { isOnline } = body;

    if (typeof isOnline !== 'boolean') {
      return errorResponse('isOnline must be a boolean', 400);
    }

    const profile = await prisma.vendorProfile.update({
      where: { userId: user.id },
      data: { isOnline },
    });

    console.log(`🟢 Vendor ${user.id} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

    return successResponse(
      { isOnline: profile.isOnline },
      `You are now ${isOnline ? 'online and available for dispatch' : 'offline'}`
    );
  } catch (error: any) {
    console.error('Vendor status update error:', error);
    return errorResponse('Failed to update status: ' + (error?.message || 'Unknown'), 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user || user.role !== 'VENDOR') return unauthorizedResponse();

    const profile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) return errorResponse('Vendor profile not found', 404);

    return successResponse(profile);
  } catch (error: any) {
    return errorResponse('Failed to fetch vendor status', 500);
  }
}
