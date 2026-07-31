// POST /api/auth/reset-password
// Validates reset token, hashes new password, updates user, invalidates all sessions.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, hashToken } from '@/lib/auth';
import { PASSWORD_POLICY, PASSWORD_POLICY_MESSAGE } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return errorResponse('Invalid or missing reset token.', 400);
    }

    // Same policy as change-password and register — resetting must not be a way
    // to set a weaker password than changing it allows.
    if (!password || typeof password !== 'string' || !PASSWORD_POLICY.test(password)) {
      return errorResponse(PASSWORD_POLICY_MESSAGE, 400);
    }

    // Look up by hash — only the digest is stored, so a leaked DB backup or a
    // read-only injection yields nothing directly replayable.
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashToken(token) },
      include: { user: true },
    });

    if (!resetToken) {
      return errorResponse('Invalid or expired reset link. Please request a new one.', 400);
    }

    if (resetToken.used) {
      return errorResponse('This reset link has already been used. Please request a new one.', 400);
    }

    if (new Date() > new Date(resetToken.expiresAt)) {
      return errorResponse('This reset link has expired. Please request a new one.', 400);
    }

    const userId = resetToken.userId;

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password + mark token as used — in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
      // Invalidate all existing sessions (force re-login)
      prisma.session.deleteMany({
        where: { userId },
      }),
    ]);

    console.log(`✅ Password reset successful for user ${userId}`);

    return successResponse(null, 'Password reset successful. You can now sign in with your new password.');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse('Something went wrong. Please try again.', 500);
  }
}
