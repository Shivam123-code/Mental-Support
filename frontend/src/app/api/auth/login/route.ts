// POST /api/auth/login - User Login
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';
import { validate, loginSchema } from '@/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validate(loginSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
      return errorResponse('Account is suspended or inactive', 403);
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
