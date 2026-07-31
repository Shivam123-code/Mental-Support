// POST /api/auth/change-password
// For logged-in users to change their password from dashboard Settings.
// Requires: Authorization header + current password + new password.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken, verifyPassword, hashPassword, revokeAllSessions } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const token = authHeader.substring(7);

    const user = await getUserFromToken(token);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse('Both current password and new password are required.', 400);
    }

    // V-08 FIX: Enforce strong password policy
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return errorResponse(
        'New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.',
        400
      );
    }

    if (currentPassword === newPassword) {
      return errorResponse('New password must be different from your current password.', 400);
    }

    // Fetch the hash explicitly. getUserFromToken deliberately no longer returns
    // passwordHash, so it cannot be leaked by a careless successResponse(user).
    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (!account) {
      return unauthorizedResponse();
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, account.passwordHash);
    if (!isValid) {
      return errorResponse('Current password is incorrect.', 400);
    }

    // Hash and update
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Changing a password must log out every existing session, including any
    // held by an attacker. This is the whole point of changing it.
    await revokeAllSessions(user.id);

    console.log(`✅ Password changed for user ${user.id}`);

    return successResponse(null, 'Password changed successfully. Please sign in again.');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse('Something went wrong. Please try again.', 500);
  }
}
