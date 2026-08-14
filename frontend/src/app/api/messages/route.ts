// GET  /api/messages?with=<userId>  — the conversation with one person
// GET  /api/messages                — everyone the caller has a thread with
// POST /api/messages                — send
//
// The Message model existed with no route, so there was no way for a client and
// their professional to talk.
//
// Who may message whom is the whole design here. An open inbox on a mental
// health platform is a harassment vector, so a thread requires an existing
// professional relationship: at least one booking between the two accounts.
// Admins are reachable by anyone, because someone in difficulty must be able to
// raise a problem with a human.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { rateLimit } from '@/lib/server/rate-limit';

const MAX_LENGTH = 4000;

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

/**
 * True when these two accounts share a booking, in either direction. Cancelled
 * sessions still count: someone must be able to ask why it was cancelled.
 */
async function haveRelationship(aId: string, bId: string): Promise<boolean> {
  const [aProfile, bProfile] = await Promise.all([
    prisma.professional.findUnique({ where: { userId: aId }, select: { id: true } }),
    prisma.professional.findUnique({ where: { userId: bId }, select: { id: true } }),
  ]);

  const pairs: any[] = [];
  if (bProfile) pairs.push({ userId: aId, professionalId: bProfile.id });
  if (aProfile) pairs.push({ userId: bId, professionalId: aProfile.id });
  if (pairs.length === 0) return false;

  const booking = await prisma.booking.findFirst({ where: { OR: pairs }, select: { id: true } });
  return !!booking;
}

async function canMessage(fromId: string, toId: string): Promise<boolean> {
  if (fromId === toId) return false;
  const recipient = await prisma.user.findUnique({
    where: { id: toId },
    select: { id: true, role: true, status: true },
  });
  if (!recipient || recipient.status !== 'ACTIVE') return false;

  const sender = await prisma.user.findUnique({ where: { id: fromId }, select: { role: true } });
  // Support must be reachable, and must be able to reply.
  if (recipient.role === 'ADMIN' || sender?.role === 'ADMIN') return true;

  return haveRelationship(fromId, toId);
}

export async function GET(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const withUser = searchParams.get('with');

    // ── One conversation ────────────────────────────────────────────────────
    if (withUser) {
      const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 100);
      const cursor = searchParams.get('cursor');

      const rows = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: withUser },
            { senderId: withUser, receiverId: user.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;

      // Anything the caller has now seen is read. Only their own received
      // messages — a sender cannot mark their message read on the recipient's
      // behalf.
      await prisma.message.updateMany({
        where: { senderId: withUser, receiverId: user.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });

      const other = await prisma.user.findUnique({
        where: { id: withUser },
        select: { id: true, firstName: true, lastName: true, role: true },
      });

      return successResponse(
        {
          // Oldest first is how a conversation reads.
          items: page.reverse().map(m => ({
            id: m.id,
            content: m.content,
            mine: m.senderId === user.id,
            isRead: m.isRead,
            createdAt: m.createdAt,
          })),
          nextCursor: hasMore ? page[0].id : null,
          participant: other
            ? {
                id: other.id,
                name: `${other.firstName ?? ''} ${other.lastName ?? ''}`.trim() || 'User',
                role: other.role,
              }
            : null,
        },
        'Conversation loaded'
      );
    }

    // ── Thread list ─────────────────────────────────────────────────────────
    const recent = await prisma.message.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const threads = new Map<string, any>();
    for (const m of recent) {
      const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
      if (!threads.has(otherId)) {
        threads.set(otherId, {
          userId: otherId,
          lastMessage: m.content.slice(0, 140),
          lastAt: m.createdAt,
          unread: 0,
        });
      }
      if (m.receiverId === user.id && !m.isRead) threads.get(otherId).unread += 1;
    }

    const others = threads.size
      ? await prisma.user.findMany({
          where: { id: { in: [...threads.keys()] } },
          select: { id: true, firstName: true, lastName: true, role: true },
        })
      : [];
    const byId = new Map(others.map(u => [u.id, u]));

    return successResponse(
      {
        items: [...threads.values()].map(t => {
          const u = byId.get(t.userId);
          return {
            ...t,
            name: u ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'User' : 'Unknown',
            role: u?.role ?? null,
          };
        }),
      },
      `${threads.size} conversation(s)`
    );
  } catch (error: any) {
    console.error('Messages fetch error:', error);
    return errorResponse('Failed to fetch messages: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();

    // A messaging endpoint is a spam vector even between legitimate parties.
    const limit = rateLimit(`message:${user.id}`, 60, 60 * 1000);
    if (!limit.allowed) {
      return errorResponse('You are sending messages too quickly. Please wait a moment.', 429);
    }

    let body: any;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON body', 400); }

    const receiverId = typeof body.to === 'string' ? body.to : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!receiverId) return errorResponse('to is required', 400);
    if (!content) return errorResponse('content is required', 400);
    if (content.length > MAX_LENGTH) return errorResponse(`content must be under ${MAX_LENGTH} characters`, 400);

    if (!(await canMessage(user.id, receiverId))) {
      // Deliberately vague: a precise reason would confirm whether an account
      // exists and what relationship it has.
      return errorResponse('You cannot message this person', 403);
    }

    const message = await prisma.message.create({
      data: { senderId: user.id, receiverId, content },
    });

    // Deliver live to whoever is connected. Fire and forget: the message is
    // already saved, so a socket server that is down must not fail the send —
    // the recipient will see it on their next load.
    const socketUrl = process.env.SOCKET_SERVER_URL;
    const internalSecret = process.env.INTERNAL_API_SECRET;
    if (socketUrl && internalSecret) {
      fetch(`${socketUrl}/internal/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-secret': internalSecret },
        body: JSON.stringify({
          receiverId,
          senderId: user.id,
          message: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            isRead: false,
          },
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(err => console.warn('[messages] live relay failed:', err?.message));
    }

    // A message nobody is looking at should still reach them.
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: 'New message',
        message: content.slice(0, 140),
        link: '/dashboard',
      },
    }).catch(err => console.error('[messages] notification failed:', err));

    return successResponse(
      { id: message.id, content: message.content, mine: true, isRead: false, createdAt: message.createdAt },
      'Message sent',
      201
    );
  } catch (error: any) {
    console.error('Message send error:', error);
    return errorResponse('Failed to send message: ' + (error?.message ?? 'Unknown'), 500);
  }
}
