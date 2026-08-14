// POST /api/auth/login - User Login
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';
import { validate, loginSchema } from '@/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request: NextRequest) {
  // V-04 FIX: Rate limit — 5 attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return errorResponse(
      `Too many login attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
      429
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validate(loginSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password } = validation.data;

    // Second bucket keyed on the account, not the IP. Without it, a botnet
    // spread across many addresses gets 5 attempts each against one account,
    // and there is no lockout anywhere else in the system.
    const perAccount = await rateLimit(`login-acct:${email}`, 10, 15 * 60 * 1000);
    if (!perAccount.allowed) {
      return errorResponse(
        `Too many login attempts for this account. Please try again in ${Math.ceil(perAccount.retryAfterSeconds / 60)} minute(s).`,
        429
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // Compare against a dummy hash when the account does not exist, so the
    // response time does not reveal whether the email is registered.
    const isValidPassword = await verifyPassword(
      password,
      user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv'
    );

    if (!user || !isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is suspended or inactive
    if (user.status === 'SUSPENDED') {
      return errorResponse('Your account has been suspended. Please contact clinical support.', 403);
    }
    if (user.status === 'INACTIVE') {
      return errorResponse('Your account is currently inactive.', 403);
    }

    // Check if user is pending verification (only required for PROFESSIONAL and ENTERPRISE)
    if ((user.role === 'PROFESSIONAL' || user.role === 'ENTERPRISE') && user.status === 'PENDING_VERIFICATION') {
      return errorResponse('Account is pending verification or inactive. Once approved, credentials will be sent to your email.', 403);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const { token } = await createSession(user.id, user.email, user.role, ipAddress, userAgent);

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}
