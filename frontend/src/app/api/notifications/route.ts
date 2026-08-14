// GET   /api/notifications        — the caller's own notifications
// PATCH /api/notifications        — mark read (one id, or all)
//
// Bookings and status changes have been writing Notification rows since the
// bookings API landed, but nothing read them, so every dashboard still showed
// a hardcoded list of invented alerts.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

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
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '30'), 1), 100);
    const cursor = searchParams.get('cursor');

    // Always scoped to the caller. A notification names who did what to whom,
    // so reading someone else's would leak both.
    const where: any = { userId: user.id };
    if (unreadOnly) where.isRead = false;

    const [rows, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    return successResponse(
      {
        items: page.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link,
          isRead: n.isRead,
          readAt: n.readAt,
          createdAt: n.createdAt,
        })),
        nextCursor: hasMore ? page[page.length - 1].id : null,
        unreadCount,
      },
      `${unreadCount} unread`
    );
  } catch (error: any) {
    console.error('Notifications fetch error:', error);
    return errorResponse('Failed to fetch notifications: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    // Scoped by userId in the WHERE clause, not by trusting the id alone, so a
    // guessed notification id belonging to somebody else matches nothing.
    if (body.all === true) {
      const { count } = await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
      return successResponse({ updated: count }, `${count} marked read`);
    }

    if (typeof body.id !== 'string' || !body.id) {
      return errorResponse('id, or all: true, is required', 400);
    }

    const { count } = await prisma.notification.updateMany({
      where: { id: body.id, userId: user.id },
      data: { isRead: true, readAt: new Date() },
    });
    if (count === 0) return errorResponse('Notification not found', 404);

    return successResponse({ updated: count }, 'Marked read');
  } catch (error: any) {
    console.error('Notification update error:', error);
    return errorResponse('Failed to update: ' + (error?.message ?? 'Unknown'), 500);
  }
}
