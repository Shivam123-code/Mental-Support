// DELETE /api/admin/applications/[id]
// Permanently deletes a professional or organization application from the database.
// Requires admin token + type query param: ?type=professional OR ?type=organization

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'professional';

    if (type === 'professional') {
      const app = await prisma.professionalApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      await prisma.professionalApplication.delete({ where: { id } });
    } else {
      const app = await prisma.organizationApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      await prisma.organizationApplication.delete({ where: { id } });
    }

    console.log(`🗑️ Admin ${admin.id} deleted ${type} application: ${id}`);
    return successResponse({ deleted: true, id }, 'Application deleted successfully.');
  } catch (error: any) {
    console.error('Application deletion error:', error);
    return errorResponse('Failed to delete application: ' + (error?.message || 'Unknown error'), 500);
  }
}
