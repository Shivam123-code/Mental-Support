// POST /api/auth/forgot-password
// Accepts an email, creates a 1-hour reset token, and sends a reset link.
// Always returns 200 even if email not found (prevents user enumeration).

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { successResponse, errorResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request: NextRequest) {
  // V-04 FIX: Rate limit — 3 reset requests per 15 minutes per IP
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = rateLimit(`forgot-pw:${ip}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    // Still return 200 to not reveal anything, but don't process
    return successResponse(
      null,
      'If this email is registered, a password reset link has been sent. Check your inbox (and spam folder).'
    );
  }

  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Please provide a valid email address.', 400);
    }

    // Find user (silently succeed even if not found)
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Invalidate any existing unused tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Persist only the digest — the raw token exists solely in the emailed link.
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token: hashToken(token), expiresAt },
      });

      // Send email (fire and forget — don't block response on email failure)
      const name = user.firstName || undefined;
      sendPasswordResetEmail(email, token, name).catch((err) => {
        console.error('Password reset email failed:', err);
      });
    }

    // Always return success to prevent email enumeration
    return successResponse(
      null,
      'If this email is registered, a password reset link has been sent. Check your inbox (and spam folder).'
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Something went wrong. Please try again.', 500);
  }
}
