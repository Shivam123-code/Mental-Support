// GET /api/journal - Get User's Journal Entries
// POST /api/journal - Create Journal Entry
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { validate, journalEntrySchema } from '@/lib/validation';
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.journalEntry.count({
      where: { userId: user.id },
    });

    return successResponse({ entries, total, limit, offset });
  } catch (error) {
    console.error('Get journal entries error:', error);
    return errorResponse('Failed to fetch journal entries', 500);
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
    const validation = validate(journalEntrySchema, body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        ...validation.data,
      },
    });

    return successResponse(entry, 'Journal entry created', 201);
  } catch (error) {
    console.error('Create journal entry error:', error);
    return errorResponse('Failed to create journal entry', 500);
  }
}
