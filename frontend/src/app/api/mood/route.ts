// GET /api/mood - Get User's Mood Logs
// POST /api/mood - Log Mood
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { validate, moodLogSchema } from '@/lib/validation';
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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        loggedAt: {
          gte: startDate,
        },
      },
      orderBy: { loggedAt: 'desc' },
    });

    return successResponse(logs);
  } catch (error) {
    console.error('Get mood logs error:', error);
    return errorResponse('Failed to fetch mood logs', 500);
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
    const validation = validate(moodLogSchema, body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const log = await prisma.moodLog.create({
      data: {
        userId: user.id,
        ...validation.data,
      },
    });

    return successResponse(log, 'Mood logged successfully', 201);
  } catch (error) {
    console.error('Log mood error:', error);
    return errorResponse('Failed to log mood', 500);
  }
}
