// GET /api/assessments - Get User's Assessment History
// POST /api/assessments - Submit Assessment
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { validate, assessmentSubmissionSchema } from '@/lib/validation';
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

    const assessments = await prisma.assessmentResult.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: 'desc' },
    });

    return successResponse(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    return errorResponse('Failed to fetch assessments', 500);
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
    const validation = validate(assessmentSubmissionSchema, body);
    
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { assessmentType, answers } = validation.data;

    // Calculate score (simplified - you can implement complex scoring logic)
    const totalQuestions = Object.keys(answers).length;
    const totalScore = Object.values(answers).reduce((sum: number, val: any) => sum + (val.score || 0), 0);
    const maxScore = totalQuestions * 4; // Assuming max score per question is 4
    const percentage = (totalScore / maxScore) * 100;

    // Determine level
    let level = 'Low';
    if (percentage >= 75) level = 'Severe';
    else if (percentage >= 50) level = 'High';
    else if (percentage >= 25) level = 'Moderate';

    // Generate insights (simplified)
    const insights = {
      level,
      recommendations: [
        'Consider booking a session with a professional',
        'Join a support circle',
        'Start a guided program',
      ],
      nextSteps: ['Take daily mood logs', 'Practice mindfulness exercises'],
    };

    const assessment = await prisma.assessmentResult.create({
      data: {
        userId: user.id,
        assessmentType,
        score: totalScore,
        maxScore,
        percentage,
        level,
        insights,
        answers,
      },
    });

    return successResponse(assessment, 'Assessment submitted successfully', 201);
  } catch (error) {
    console.error('Submit assessment error:', error);
    return errorResponse('Failed to submit assessment', 500);
  }
}
