// GET  /api/resources  — published library, or a professional's own shelf
// POST /api/resources  — a professional publishes a resource
//
// The professional dashboard kept these in useState, so nothing uploaded
// existed and no client could ever receive one.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

const MAX_TITLE = 200;
const MAX_DESC = 2000;

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

/** The Professional row for a professional account, or null for anyone else. */
async function ownProfile(userId: string) {
  return prisma.professional.findUnique({ where: { userId }, select: { id: true } });
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine') === 'true';
    const category = searchParams.get('category');
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 100);
    const cursor = searchParams.get('cursor');

    let where: any = {};
    if (mine) {
      const profile = await ownProfile(user.id);
      if (!profile) return successResponse({ items: [], nextCursor: null, total: 0 }, 'No professional profile');
      // Authors see their drafts; everyone else sees only what is published.
      where = { professionalId: profile.id };
    } else {
      where = { isPublished: true };
    }
    if (category) where.category = category;

    const [rows, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      prisma.resource.count({ where }),
    ]);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    // Author names in one lookup rather than one per row. Professional has no
    // Prisma relation to User, so this is two steps.
    const profIds = [...new Set(page.map(r => r.professionalId))];
    const profs = profIds.length
      ? await prisma.professional.findMany({
          where: { id: { in: profIds } },
          select: { id: true, userId: true, displayName: true },
        })
      : [];
    const users = profs.length
      ? await prisma.user.findMany({
          where: { id: { in: profs.map(p => p.userId) } },
          select: { id: true, firstName: true, lastName: true },
        })
      : [];
    const userById = new Map(users.map(u => [u.id, u]));
    const authorByProf = new Map(
      profs.map(p => {
        const u = userById.get(p.userId);
        return [p.id, p.displayName || `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim() || 'Professional'];
      })
    );

    return successResponse(
      {
        items: page.map(r => ({ ...r, author: authorByProf.get(r.professionalId) ?? 'Professional' })),
        nextCursor: hasMore ? page[page.length - 1].id : null,
        total,
      },
      `${total} resource(s)`
    );
  } catch (error: any) {
    console.error('Resources fetch error:', error);
    return errorResponse('Failed to fetch resources: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const profile = await ownProfile(user.id);
    if (!profile) return errorResponse('Only professionals can publish resources', 403);

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const type = typeof body.type === 'string' ? body.type.trim() : '';
    if (!title || !category || !type) return errorResponse('title, category and type are required', 400);
    if (title.length > MAX_TITLE) return errorResponse(`title must be under ${MAX_TITLE} characters`, 400);

    // Reject anything that is not a plain https link. A resource URL is rendered
    // as an anchor, so javascript: and data: here would be stored XSS.
    let url: string | null = null;
    if (body.url) {
      if (typeof body.url !== 'string' || !/^https:\/\//i.test(body.url)) {
        return errorResponse('url must be an https link', 400);
      }
      url = body.url.slice(0, 500);
    }

    const resource = await prisma.resource.create({
      data: {
        professionalId: profile.id,
        title,
        category,
        type,
        description: typeof body.description === 'string' ? body.description.slice(0, MAX_DESC) : null,
        url,
        isPublished: body.isPublished !== false,
      },
    });

    return successResponse(resource, 'Resource published', 201);
  } catch (error: any) {
    console.error('Resource create error:', error);
    return errorResponse('Failed to publish resource: ' + (error?.message ?? 'Unknown'), 500);
  }
}
