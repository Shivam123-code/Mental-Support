// POST /api/auth/reset-password
// Validates reset token, hashes new password, updates user, invalidates all sessions.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return errorResponse('Invalid or missing reset token.', 400);
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return errorResponse('Password must be at least 8 characters.', 400);
    }

    // Find the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
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
