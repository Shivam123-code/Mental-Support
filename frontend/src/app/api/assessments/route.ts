// GET /api/assessments  — User's assessment history
// POST /api/assessments — Submit answers, score, save result
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { ASSESSMENTS, scoreAssessment, AssessmentKey } from '@/lib/assessments';

const VALID_TYPES: AssessmentKey[] = [
  'ANXIETY_INDEX', 'BURNOUT_METER', 'RELATIONSHIP_WELLNESS', 'LEADERSHIP_EQ'
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const user = await getUserFromToken(authHeader.substring(7));
    if (!user) return unauthorizedResponse();

    const results = await prisma.assessmentResult.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: 'desc' },
    });

    // Group by type — return latest per type + full history
    const latestByType: Record<string, any> = {};
    for (const r of results) {
      if (!latestByType[r.assessmentType]) {
        latestByType[r.assessmentType] = r;
      }
    }

    return successResponse({ results, latestByType });
  } catch (error) {
    console.error('Get assessments error:', error);
    return errorResponse('Failed to fetch assessments', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const user = await getUserFromToken(authHeader.substring(7));
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { assessmentType, answers } = body;

    if (!assessmentType || !VALID_TYPES.includes(assessmentType)) {
      return errorResponse('Invalid assessment type', 400);
    }
    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return errorResponse('Answers are required', 400);
    }

    const def = ASSESSMENTS[assessmentType as AssessmentKey];
    if (!def) return errorResponse('Unknown assessment', 400);

    // Score using the engine
    const insights = scoreAssessment(assessmentType as AssessmentKey, answers as Record<string, number>);

    const result = await prisma.assessmentResult.create({
      data: {
        userId: user.id,
        assessmentType,
        score: insights.score,
        maxScore: insights.maxScore,
        percentage: insights.percentage,
        level: insights.level,
        insights: insights as any,
        answers: answers as any,
      },
    });

    return successResponse(
      { result, insights },
      'Assessment completed successfully',
      201
    );
  } catch (error) {
    console.error('Submit assessment error:', error);
    return errorResponse('Failed to submit assessment', 500);
  }
}
