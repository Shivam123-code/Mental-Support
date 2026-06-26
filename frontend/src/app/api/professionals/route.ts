// GET /api/professionals — returns all VERIFIED professionals from DB.
// Falls back to curated static list if DB has none (early stage).

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { STATIC_PROFESSIONALS } from '@/lib/professionals-data';

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

    if (dbProfessionals.length > 0) {
      const formatted = dbProfessionals.map((p) => ({
        id: p.id,
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
      return successResponse(formatted, 'Professionals fetched');
    }

    // Fallback to static (filter by query params if provided)
    let filtered = [...STATIC_PROFESSIONALS];
    if (region) filtered = filtered.filter((p) => p.region === region);
    if (language) filtered = filtered.filter((p) => p.languages.includes(language));
    if (gender) filtered = filtered.filter((p) => p.gender === gender);
    if (type) filtered = filtered.filter((p) => p.type === type.toUpperCase());

    return successResponse(filtered, 'Professionals fetched');
  } catch (error) {
    console.error('Professionals fetch error:', error);
    return errorResponse('Failed to fetch professionals', 500);
  }
}
