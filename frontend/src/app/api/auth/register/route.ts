// POST /api/auth/register - User Registration
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { validate, registerSchema } from '@/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validate(registerSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password, firstName, lastName, role } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        status: role === 'USER' ? 'ACTIVE' : 'PENDING_VERIFICATION',
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Create session
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const { token } = await createSession(user.id, user.email, user.role, ipAddress, userAgent);

    return successResponse(
      {
        user,
        token,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse('Registration failed', 500);
  }
}
