// GET /api/admin/audit-logs?limit=50&cursor=<id>&action=user.delete
// The persisted admin trail. Cursor-paginated because this table only ever
// grows — a take-N with no cursor would silently hide everything older.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { ADMIN_ACTION_PREFIX } from '@/lib/server/audit';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 200);
    const cursor = searchParams.get('cursor');
    const action = searchParams.get('action');

    const where = {
      action: action
        ? `${ADMIN_ACTION_PREFIX}${action}`
        : { startsWith: ADMIN_ACTION_PREFIX },
    } as any;

    // Fetch one extra to tell "there is more" from "that was the last page"
    // without a second count query.
    const rows = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    // Resolve actor names in one query rather than N joins per row.
    const actorIds = [...new Set(page.map(r => r.userId).filter(Boolean))] as string[];
    const actors = actorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, firstName: true, lastName: true, email: true },
        })
      : [];
    const actorById = new Map(actors.map(a => [a.id, a]));

    return successResponse({
      items: page.map(r => {
        const a = r.userId ? actorById.get(r.userId) : null;
        return {
          id: r.id,
          action: r.action.replace(ADMIN_ACTION_PREFIX, ''),
          resource: r.resource,
          resourceId: r.resourceId,
          metadata: r.metadata,
          ipAddress: r.ipAddress,
          createdAt: r.createdAt,
          // A deleted admin leaves their actions behind — say so rather than
          // rendering a blank actor.
          actor: a
            ? { id: a.id, name: `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.email, email: a.email }
            : { id: r.userId, name: 'deleted admin', email: null },
        };
      }),
      nextCursor: hasMore ? page[page.length - 1].id : null,
    }, 'Audit logs loaded');
  } catch (error: any) {
    console.error('Audit logs error:', error);
    return errorResponse('Failed to fetch audit logs: ' + (error?.message ?? 'Unknown'), 500);
  }
}
