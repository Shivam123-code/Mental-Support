// PUT /api/vendor/location
// Updates the vendor's live GPS coordinates in VendorProfile.
// Called from vendor dashboard when they share browser location.

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
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return errorResponse('latitude and longitude must be numbers', 400);
    }

    const profile = await prisma.vendorProfile.update({
      where: { userId: user.id },
      data: { latitude, longitude, locationUpdatedAt: new Date() },
    });

    console.log(`📍 Vendor ${user.id} location updated: ${latitude}, ${longitude}`);

    return successResponse(
      { latitude: profile.latitude, longitude: profile.longitude, updatedAt: profile.locationUpdatedAt },
      'Location updated'
    );
  } catch (error: any) {
    console.error('Vendor location update error:', error);
    return errorResponse('Failed to update location: ' + (error?.message || 'Unknown'), 500);
  }
}
