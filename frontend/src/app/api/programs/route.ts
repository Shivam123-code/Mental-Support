// GET /api/programs - Get User's Program Enrollments
// POST /api/programs - Enroll in Program
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { validate, programEnrollmentSchema } from '@/lib/validation';
import { successResponse, errorResponse, unauthorizedResponse, validationErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse();
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return unauthorizedResponse();
    }

    const enrollments = await prisma.programEnrollment.findMany({
      where: { userId: user.id },
      include: {
        activities: {
          orderBy: { week: 'asc' },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return successResponse(enrollments);
  } catch (error) {
    console.error('Get programs error:', error);
    return errorResponse('Failed to fetch programs', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse();
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validation = validate(programEnrollmentSchema, body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { programType } = validation.data;

    // Check if already enrolled in active program
    const existingEnrollment = await prisma.programEnrollment.findFirst({
      where: {
        userId: user.id,
        programType,
        status: 'ACTIVE',
      },
    });

    if (existingEnrollment) {
      return errorResponse('Already enrolled in this program', 409);
    }

    const enrollment = await prisma.programEnrollment.create({
      data: {
        userId: user.id,
        programType,
      },
    });

    return successResponse(enrollment, 'Enrolled successfully', 201);
  } catch (error) {
    console.error('Enroll program error:', error);
    return errorResponse('Failed to enroll in program', 500);
  }
}
