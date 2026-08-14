// GET /api/professionals — returns all VERIFIED professionals from DB.
// Falls back to curated static list if DB has none (early stage).

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const language = searchParams.get('language');
    const gender = searchParams.get('gender');
    const type = searchParams.get('type');

    // Try DB first
    const whereClause: Record<string, any> = {
      verificationStatus: 'VERIFIED',
      isAcceptingClients: true,
    };
    if (region) whereClause.region = region;
    if (language) whereClause.languages = { has: language };
    if (gender) whereClause.gender = gender;
    if (type) whereClause.type = type;

    const dbProfessionals = await prisma.professional.findMany({
      where: whereClause,
      orderBy: [{ averageRating: 'desc' }, { totalSessions: 'desc' }],
      take: 50,
    });

    // No static fallback. Those entries have no user account behind them, so a
    // caller who picks one cannot book, message or be matched to anybody — the
    // directory looked populated while every entry was a dead end. An empty
    // result is the truth when no professional matches the filters.
    {
      const formatted = dbProfessionals.map((p) => ({
        id: p.id,
        // The account behind the profile. Booking keys on Professional.id, but
        // messaging and "is this me?" checks key on User.id, and without it a
        // directory entry cannot be tied back to a person.
        userId: p.userId,
        displayName: p.displayName || `Professional #${p.id.slice(-4)}`,
        type: p.type,
        specializations: p.specializations,
        languages: p.languages,
        yearsOfExperience: p.yearsOfExperience,
        averageRating: p.averageRating,
        totalReviews: p.totalReviews,
        profileImage: p.profileImage,
        isAcceptingClients: p.isAcceptingClients,
        city: p.city,
        state: p.state,
        region: p.region,
        country: p.country,
        gender: p.gender,
        sessionModes: p.sessionModes,
        hourlyRate: p.hourlyRate,
        currency: p.currency,
        bio: p.bio,
      }));
      return successResponse(
        formatted,
        formatted.length ? 'Professionals fetched' : 'No professionals match those filters yet'
      );
    }
  } catch (error) {
    console.error('Professionals fetch error:', error);
    return errorResponse('Failed to fetch professionals', 500);
  }
}
