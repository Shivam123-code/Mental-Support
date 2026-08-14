// POST /api/professionals/match
// Protected route — requires a valid auth token.
// Accepts quiz answers, scores professionals, returns ranked matches with match%.

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { STATIC_PROFESSIONALS } from '@/lib/professionals-data';
import { automatchRequiresPayment, automatchPrice, CURRENCY, formatMinor } from '@/lib/server/payments/provider';

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

    // ── Paywall ─────────────────────────────────────────────────────────────
    // Off unless AUTOMATCH_REQUIRES_PAYMENT is explicitly "true", so a missing
    // or misspelt variable leaves matching working rather than locking everyone
    // out of a feature that used to be free.
    //
    // The entitlement is only *checked* here, never spent. Someone who has paid
    // can re-run the quiz as many times as they like — the payment buys being
    // connected to a person, which happens in POST /api/care, and charging for
    // a list they might not like anything in would be charging for nothing.
    if (automatchRequiresPayment()) {
      const entitlement = await prisma.paymentIntent.findFirst({
        where: { userId: user.id, purpose: 'AUTOMATCH', status: 'PAID', consumedAt: null },
        select: { id: true },
      });
      if (!entitlement) {
        return NextResponse.json(
          {
            success: false,
            error: 'Auto-match requires payment',
            data: {
              paymentRequired: true,
              amount: automatchPrice(),
              currency: CURRENCY,
              amountLabel: formatMinor(automatchPrice()),
            },
          },
          { status: 402 }
        );
      }
    }

    // ── Fetch candidates ───────────────────────────────────────────────────
    let candidates: Professional[] = [];

    const dbProfs = await prisma.professional.findMany({
      where: { verificationStatus: 'VERIFIED', isAcceptingClients: true },
      take: 100,
    });

    {
      // Only real accounts are matchable. The static fallback that used to sit
      // here returned entries with no user behind them, so a matched caller
      // could not book or message the person they were matched to — and once
      // matching sits behind a payment, that would be taking money for a match
      // that cannot function. Better to return nothing and say so.
      candidates = dbProfs.map((p) => ({
        id: p.id,
        // The account behind the profile. Booking keys on Professional.id but
        // messaging keys on User.id, and without this the caller has no way to
        // reach the person they matched with.
        userId: p.userId,
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
