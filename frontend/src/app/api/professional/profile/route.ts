// GET   /api/professional/profile — the caller's own professional profile
// PATCH /api/professional/profile — edit it
//
// The dashboard's Settings tab kept languages, specialties and the hourly rate
// in useState, so every professional saw the same defaults and nothing they
// changed reached the directory clients actually search.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

const MAX_ITEMS = 20;
const MAX_ITEM_LENGTH = 60;
const SESSION_MODES = ['Online', 'In-person', 'Both'];

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

/** Trim, drop blanks, de-duplicate and cap. Free-text lists arrive messy. */
function cleanList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const cleaned = [...new Set(
    value
      .filter((v): v is string => typeof v === 'string')
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => v.slice(0, MAX_ITEM_LENGTH))
  )];
  return cleaned.slice(0, MAX_ITEMS);
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const profile = await prisma.professional.findUnique({ where: { userId: user.id } });
    if (!profile) return errorResponse('No professional profile on this account', 404);

    return successResponse(profile, 'Profile loaded');
  } catch (error: any) {
    console.error('Professional profile fetch error:', error);
    return errorResponse('Failed to load profile: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const profile = await prisma.professional.findUnique({
      where: { userId: user.id }, select: { id: true },
    });
    if (!profile) return errorResponse('No professional profile on this account', 404);

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const data: any = {};

    const languages = cleanList(body.languages);
    if (languages) {
      if (languages.length === 0) return errorResponse('At least one language is required', 400);
      data.languages = languages;
    }

    const specializations = cleanList(body.specializations);
    if (specializations) data.specializations = specializations;

    const qualifications = cleanList(body.qualifications);
    if (qualifications) data.qualifications = qualifications;

    if (body.sessionModes !== undefined) {
      const modes = cleanList(body.sessionModes) ?? [];
      if (modes.some(m => !SESSION_MODES.includes(m))) {
        return errorResponse(`sessionModes must be from: ${SESSION_MODES.join(', ')}`, 400);
      }
      data.sessionModes = modes;
    }

    if (body.hourlyRate !== undefined) {
      const rate = Number(body.hourlyRate);
      // The rate is what a client is charged, so a negative or absurd value is
      // worth refusing rather than storing and discovering at checkout.
      if (!Number.isFinite(rate) || rate < 0 || rate > 1_000_000) {
        return errorResponse('hourlyRate must be between 0 and 1,000,000', 400);
      }
      data.hourlyRate = rate;
    }

    if (body.isAcceptingClients !== undefined) {
      data.isAcceptingClients = Boolean(body.isAcceptingClients);
    }

    for (const [field, max] of [['bio', 2000], ['approach', 2000], ['displayName', 120]] as const) {
      if (typeof body[field] === 'string') data[field] = body[field].trim().slice(0, max) || null;
    }

    for (const field of ['city', 'state', 'region', 'gender', 'currency'] as const) {
      if (typeof body[field] === 'string') data[field] = body[field].trim().slice(0, 80) || null;
    }

    if (body.yearsOfExperience !== undefined) {
      const yrs = Number(body.yearsOfExperience);
      if (!Number.isInteger(yrs) || yrs < 0 || yrs > 80) {
        return errorResponse('yearsOfExperience must be between 0 and 80', 400);
      }
      data.yearsOfExperience = yrs;
    }

    // Deliberately not editable here: verificationStatus, averageRating,
    // totalReviews, totalSessions. Those are earned or granted, not self-set —
    // a professional marking themselves VERIFIED would defeat the whole check.
    if (Object.keys(data).length === 0) return errorResponse('Nothing to update', 400);

    const updated = await prisma.professional.update({ where: { id: profile.id }, data });
    return successResponse(updated, 'Profile updated');
  } catch (error: any) {
    console.error('Professional profile update error:', error);
    return errorResponse('Failed to update profile: ' + (error?.message ?? 'Unknown'), 500);
  }
}
