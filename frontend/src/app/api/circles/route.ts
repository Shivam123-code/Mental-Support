// GET  /api/circles  — open circles, or a professional's own
// POST /api/circles  — a professional opens a circle, group or workshop
//
// These were useState fixtures on the professional dashboard, so a circle
// created there existed only until the page reloaded and no client could join.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

const VALID_TYPES = ['Support Circle', 'Healing Group', 'Workshop'];
const MAX_CAPACITY = 500;

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine') === 'true';

    let where: any = { isActive: true };
    if (mine) {
      const profile = await prisma.professional.findUnique({
        where: { userId: user.id }, select: { id: true },
      });
      if (!profile) return successResponse({ items: [], total: 0 }, 'No professional profile');
      where = { professionalId: profile.id };
    }

    const circles = await prisma.supportCircle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        // Counting through the relation keeps "joined" honest; the fixture
        // carried a hardcoded number that no join could ever change.
        _count: { select: { members: true } },
        members: { where: { userId: user.id }, select: { id: true } },
      },
    });

    return successResponse(
      {
        items: circles.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          type: c.type,
          scheduleLabel: c.scheduleLabel,
          scheduledAt: c.scheduledAt,
          capacity: c.capacity,
          joined: c._count.members,
          isFull: c._count.members >= c.capacity,
          hasJoined: c.members.length > 0,
          isActive: c.isActive,
        })),
        total: circles.length,
      },
      `${circles.length} circle(s)`
    );
  } catch (error: any) {
    console.error('Circles fetch error:', error);
    return errorResponse('Failed to fetch circles: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const profile = await prisma.professional.findUnique({
      where: { userId: user.id }, select: { id: true },
    });
    if (!profile) return errorResponse('Only professionals can open circles', 403);

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!title || !description) return errorResponse('title and description are required', 400);

    const type = VALID_TYPES.includes(body.type) ? body.type : 'Support Circle';
    const capacity = Number(body.capacity ?? 15);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > MAX_CAPACITY) {
      return errorResponse(`capacity must be between 1 and ${MAX_CAPACITY}`, 400);
    }

    let scheduledAt: Date | null = null;
    if (body.scheduledAt) {
      const d = new Date(body.scheduledAt);
      if (Number.isNaN(d.getTime())) return errorResponse('scheduledAt must be a valid date', 400);
      scheduledAt = d;
    }

    const circle = await prisma.supportCircle.create({
      data: {
        professionalId: profile.id,
        title: title.slice(0, 200),
        description: description.slice(0, 2000),
        type,
        scheduleLabel: typeof body.scheduleLabel === 'string' ? body.scheduleLabel.slice(0, 120) : null,
        scheduledAt,
        capacity,
      },
    });

    return successResponse({ ...circle, joined: 0, isFull: false, hasJoined: false }, 'Circle opened', 201);
  } catch (error: any) {
    console.error('Circle create error:', error);
    return errorResponse('Failed to open circle: ' + (error?.message ?? 'Unknown'), 500);
  }
}
