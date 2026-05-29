// GET /api/admin/assessments
// Returns all assessment submissions from all users for the admin dashboard
// Stats: completions per type, average score, level breakdown, recent submissions

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { ASSESSMENTS } from '@/lib/assessments';

async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = await getUserFromToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || '200'), 500);

    // Fetch all results with user info
    const results = await prisma.assessmentResult.findMany({
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Build per-type stats
    type TypeStat = {
      key: string;
      title: string;
      questions: number;
      completions: number;
      totalScore: number;
      avgScore: number;
      avgPercentage: number;
      levelCounts: Record<string, number>;
    };

    const typeStats: Record<string, TypeStat> = {};

    for (const key of Object.keys(ASSESSMENTS)) {
      const def = ASSESSMENTS[key as keyof typeof ASSESSMENTS];
      typeStats[key] = {
        key,
        title: def.title,
        questions: def.questions.length,
        completions: 0,
        totalScore: 0,
        avgScore: 0,
        avgPercentage: 0,
        levelCounts: {},
      };
    }

    for (const r of results) {
      const stat = typeStats[r.assessmentType];
      if (stat) {
        stat.completions++;
        stat.totalScore += r.score;
        stat.levelCounts[r.level] = (stat.levelCounts[r.level] || 0) + 1;
      }
    }

    // Compute averages
    for (const stat of Object.values(typeStats)) {
      if (stat.completions > 0) {
        stat.avgScore = Math.round(stat.totalScore / stat.completions * 10) / 10;
        const def = ASSESSMENTS[stat.key as keyof typeof ASSESSMENTS];
        stat.avgPercentage = Math.round((stat.avgScore / def.maxScore) * 100);
      }
    }

    // Shape results for table
    const submissions = results.map(r => ({
      id: r.id,
      userId: r.userId,
      userName: r.user ? `${r.user.firstName} ${r.user.lastName}`.trim() : 'Unknown',
      userEmail: r.user?.email || '',
      assessmentType: r.assessmentType,
      assessmentTitle: ASSESSMENTS[r.assessmentType as keyof typeof ASSESSMENTS]?.title || r.assessmentType,
      score: r.score,
      maxScore: r.maxScore,
      percentage: r.percentage,
      level: r.level,
      completedAt: r.completedAt.toISOString(),
    }));

    const totalCompletions = results.length;

    return successResponse({
      totalCompletions,
      typeStats: Object.values(typeStats),
      submissions,
    });
  } catch (error) {
    console.error('Admin assessments error:', error);
    return errorResponse('Failed to fetch assessment data', 500);
  }
}
