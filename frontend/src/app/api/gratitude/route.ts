// GET  /api/gratitude          — the public wall (approved posts only)
// GET  /api/gratitude?mine=1   — the caller's own, including ones still pending
// POST /api/gratitude          — add one
//
// The Gratitude Wall was nine invented posts under the heading "Real stories of
// gratitude from our community", attributed to named people making claims about
// therapy outcomes, and the "Share Your Gratitude" button led to a sign-in page
// that went nowhere. This is the real thing.
//
// Built on CommunityPost with type GRATITUDE, which already existed with no
// user-facing route. isModerated is already the admin queue's approve flag
// (APPROVE_POST sets it true), so a new post waits for review before it appears
// publicly — an unmoderated open wall on a mental health platform is not
// something to ship.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

const MAX_LENGTH = 500;
const MIN_LENGTH = 4;

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

/** "Priya S." — a first name and an initial, never the full name or the email. */
function displayName(u: { firstName: string | null; lastName: string | null } | undefined) {
  if (!u) return 'Someone';
  return `${u.firstName ?? ''} ${(u.lastName ?? '').slice(0, 1)}`.trim() || 'Someone';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine') === '1';
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '24'), 1), 50);
    const cursor = searchParams.get('cursor');

    let user = null;
    if (mine) {
      user = await caller(request);
      if (!user) return unauthorizedResponse();
    }

    const rows = await prisma.communityPost.findMany({
      where: mine
        ? { type: 'GRATITUDE', userId: user!.id }
        : { type: 'GRATITUDE', isModerated: true },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    return successResponse(
      {
        items: page.map(p => ({
          id: p.id,
          content: p.content,
          // On the caller's own list the name is theirs to see; on the public
          // wall an anonymous post never carries one.
          author: p.isAnonymous && !mine ? 'Anonymous' : displayName(p.user),
          isAnonymous: p.isAnonymous,
          createdAt: p.createdAt,
          ...(mine ? { pending: !p.isModerated } : {}),
        })),
        nextCursor: hasMore ? page[page.length - 1].id : null,
      },
      `${page.length} gratitude post(s)`
    );
  } catch (error: any) {
    console.error('Gratitude fetch error:', error);
    return errorResponse('Failed to load the gratitude wall: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    // A public wall is a spam target even behind a login.
    const limit = rateLimit(`gratitude:${user.id || getClientIp(request)}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return errorResponse(
        `You have posted a few already. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
        429
      );
    }

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (content.length < MIN_LENGTH) return errorResponse('Please write a little more', 400);
    if (content.length > MAX_LENGTH) return errorResponse(`Please keep it under ${MAX_LENGTH} characters`, 400);

    const post = await prisma.communityPost.create({
      data: {
        userId: user.id,
        type: 'GRATITUDE',
        // CommunityPost requires a title; the wall shows only the body, so the
        // first few words stand in rather than asking for one twice.
        title: content.slice(0, 60),
        content,
        isAnonymous: body.isAnonymous === true,
        // Waits for the admin moderation queue that already exists.
        isModerated: false,
      },
    });

    return successResponse(
      { id: post.id, content: post.content, isAnonymous: post.isAnonymous, pending: true, createdAt: post.createdAt },
      'Thank you. Your note will appear on the wall once it has been reviewed.',
      201
    );
  } catch (error: any) {
    console.error('Gratitude create error:', error);
    return errorResponse('Failed to post: ' + (error?.message ?? 'Unknown'), 500);
  }
}
