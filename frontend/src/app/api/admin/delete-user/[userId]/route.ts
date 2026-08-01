import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { logAdminAction } from '@/lib/server/audit';

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
    // Read identity before the row is gone — afterwards there is nothing left
    // to say *who* was deleted, which is the whole point of the record.
    const victim = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true, status: true },
    });

    await prisma.user.delete({ where: { id: userId } });

    await logAdminAction(req, admin.id, 'user.delete', {
      resource: 'User',
      resourceId: userId,
      metadata: { email: victim?.email, role: victim?.role, statusAtDeletion: victim?.status },
    });

    return successResponse({ deleted: true }, 'User deleted successfully');
  } catch (err: any) {
    if (err?.code === 'P2025') return errorResponse('User not found', 404);
    console.error('Delete user error:', err);
    return errorResponse('Failed to delete user', 500);
  }
}
