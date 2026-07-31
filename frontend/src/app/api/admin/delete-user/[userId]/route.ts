import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Was the loosest of the copies: `replace('Bearer ', '')` is a no-op when the
  // prefix is absent, so it forwarded a raw header value as the token.
  const admin = await requireAdmin(req);
  if (!admin) return unauthorizedResponse();

  const { userId } = await params;
  if (!userId) return errorResponse('User ID is required', 400);

  try {
    await prisma.user.delete({ where: { id: userId } });
    return successResponse({ deleted: true }, 'User deleted successfully');
  } catch (err: any) {
    if (err?.code === 'P2025') return errorResponse('User not found', 404);
    console.error('Delete user error:', err);
    return errorResponse('Failed to delete user', 500);
  }
}
