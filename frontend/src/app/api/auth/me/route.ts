// GET /api/auth/me     — returns the current authenticated user's data
// DELETE /api/auth/me  — deletes the authenticated user's account permanently

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

async function getAuthedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return getUserFromToken(token);
}

// ── GET: return current user ──────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthedUser(request);
    if (!user) return unauthorizedResponse();

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });

    if (!fullUser) return unauthorizedResponse();

    const { passwordHash, ...safeUser } = fullUser;
    return successResponse(safeUser);
  } catch (error: any) {
    console.error('Get user error:', error);
    return errorResponse('Failed to get user', 500);
  }
}

// ── DELETE: permanently delete user account ───────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthedUser(request);
    if (!user) return unauthorizedResponse();

    // Revoke sessions first, then delete user (cascade handles the rest)
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    console.log(`🗑️ Account deleted: ${user.id} (${user.email})`);
    return successResponse({ deleted: true }, 'Account deleted. We are sorry to see you go.');
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return errorResponse('Failed to delete account: ' + (error?.message || 'Unknown error'), 500);
  }
}
