// POST /api/professionals/match
// Protected route — requires a valid auth token.
// Accepts quiz answers, scores professionals, returns ranked matches with match%.

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { STATIC_PROFESSIONALS } from '@/lib/professionals-data';

// Region → states mapping for regional filtering
const REGION_STATES: Record<string, string[]> = {
  'North India': ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Jammu & Kashmir', 'Uttarakhand', 'Rajasthan'],
  'South India': ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'],
  'East India': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'],
  'West India': ['Maharashtra', 'Gujarat', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'],
  'International': [],
};

// Scoring weights
const WEIGHTS = {
  sameCity:     40,
  sameState:    25,
  sameRegion:   15,
  language:     30,  // per matched language
  gender:       20,
  specialty:    15,  // per matched specialty
  sessionMode:  10,
  available:    10,
};

interface QuizAnswers {
  concerns: string[];           // e.g. ["Anxiety", "Depression"]
  city?: string;
  state?: string;
  region?: string;              // e.g. "South India"
  privacyMode?: boolean;        // if true, ignore location
  preferredLanguages: string[];
  userAgeRange?: string;        // e.g. "18-25"
  preferredGender?: string;     // "Male" | "Female" | "No preference"
  sessionMode?: string;         // "Online" | "In-person" | "Either"
}

type Professional = typeof STATIC_PROFESSIONALS[0];

function scoreProfessional(prof: Professional, quiz: QuizAnswers): number {
  let score = 0;

  // ── Location ──────────────────────────────────────────────────────────────
  if (!quiz.privacyMode) {
    if (quiz.city && prof.city?.toLowerCase() === quiz.city.toLowerCase()) {
      score += WEIGHTS.sameCity;
    } else if (quiz.state && prof.state?.toLowerCase() === quiz.state.toLowerCase()) {
      score += WEIGHTS.sameState;
    } else if (quiz.region && prof.region === quiz.region) {
      score += WEIGHTS.sameRegion;
    }
  }

  // ── Language ──────────────────────────────────────────────────────────────
  for (const lang of quiz.preferredLanguages) {
    if (prof.languages.some((l) => l.toLowerCase() === lang.toLowerCase())) {
      score += WEIGHTS.language;
      break; // Count language match once
    }
  }

  // ── Gender preference ─────────────────────────────────────────────────────
  if (quiz.preferredGender && quiz.preferredGender !== 'No preference') {
    if (prof.gender === quiz.preferredGender) score += WEIGHTS.gender;
  }

  // ── Specializations ───────────────────────────────────────────────────────
  for (const concern of quiz.concerns) {
    if (
      prof.specializations.some((s) =>
        s.toLowerCase().includes(concern.toLowerCase()) ||
        concern.toLowerCase().includes(s.toLowerCase())
      )
    ) {
      score += WEIGHTS.specialty;
    }
  }

  // ── Session mode ──────────────────────────────────────────────────────────
  if (quiz.sessionMode && quiz.sessionMode !== 'Either') {
    if (prof.sessionModes.includes(quiz.sessionMode)) score += WEIGHTS.sessionMode;
  }

  // ── Availability bonus ────────────────────────────────────────────────────
  if (prof.isAcceptingClients) score += WEIGHTS.available;

  return score;
}

function toMatchPercent(score: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  return Math.min(100, Math.round((score / maxPossible) * 100));
}

export async function POST(request: NextRequest) {
  try {
    // Auth check — must be logged in
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user) return unauthorizedResponse();

    const quiz: QuizAnswers = await request.json();

    if (!quiz.concerns?.length || !quiz.preferredLanguages?.length) {
      return errorResponse('concerns and preferredLanguages are required', 400);
    }

    // ── Fetch candidates ───────────────────────────────────────────────────
    let candidates: Professional[] = [];

    const dbProfs = await prisma.professional.findMany({
      where: { verificationStatus: 'VERIFIED', isAcceptingClients: true },
      take: 100,
    });

    if (dbProfs.length > 0) {
      // Format DB professionals to match static shape
      candidates = dbProfs.map((p) => ({
        id: p.id,
        displayName: p.displayName || `Professional #${p.id.slice(-4)}`,
        type: p.type as string,
        specializations: p.specializations,
        languages: p.languages,
        yearsOfExperience: p.yearsOfExperience ?? undefined,
        averageRating: p.averageRating,
        totalReviews: p.totalReviews,
        profileImage: p.profileImage ?? undefined,
        isAcceptingClients: p.isAcceptingClients,
        city: p.city ?? undefined,
        state: p.state ?? undefined,
        region: p.region ?? undefined,
        country: p.country,
        gender: p.gender ?? undefined,
        sessionModes: p.sessionModes,
        hourlyRate: p.hourlyRate ?? undefined,
        currency: p.currency,
        bio: p.bio ?? undefined,
      })) as Professional[];
    } else {
      candidates = [...STATIC_PROFESSIONALS];
    }

    // ── Apply regional filter override ─────────────────────────────────────
    if (quiz.region === 'International') {
      candidates = candidates.filter((p) => p.country !== 'India');
    } else if (quiz.region && quiz.privacyMode) {
      // Privacy mode: only filter by region (not city/state)
      candidates = candidates.filter((p) => p.region === quiz.region);
    }

    // ── Score and rank ─────────────────────────────────────────────────────
    const maxPossible =
      WEIGHTS.sameCity +
      WEIGHTS.language +
      WEIGHTS.gender +
      WEIGHTS.specialty * quiz.concerns.length +
      WEIGHTS.sessionMode +
      WEIGHTS.available;

    const scored = candidates
      .map((prof) => {
        const score = scoreProfessional(prof, quiz);
        return {
          ...prof,
          matchScore: score,
          matchPercent: toMatchPercent(score, maxPossible),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore || b.averageRating - a.averageRating);

    // Return top 10 matches
    const results = scored.slice(0, 10);

    console.log(`🔍 Auto-match for user ${user.id}: ${results.length} results (top: ${results[0]?.displayName} @ ${results[0]?.matchPercent}%)`);

    return successResponse(results, `Found ${results.length} professionals matching your criteria`);
  } catch (error) {
    console.error('Auto-match error:', error);
    return errorResponse('Matching failed. Please try again.', 500);
  }
}
