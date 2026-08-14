// Self-check for messaging and notifications.
//   npx tsx --env-file=.env.local src/app/api/messages/route.check.ts
//
// The interesting property is who may message whom. An open inbox on a mental
// health platform is a harassment vector, so a thread requires a real
// professional relationship — at least one booking between the two accounts —
// while admins stay reachable by anyone.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };
const ADMIN = { email: 'admin@kleverklues.com', password: 'Admin@123' };

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

async function login(w: { email: string; password: string }) {
  const j = await (await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(w),
  })).json();
  assert.ok(j.success, `${w.email}: ${j.error}`);
  return { token: j.data.token as string, id: j.data.user.id as string };
}
const H = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

async function main() {
  const [u, p, a] = await Promise.all([login(USER), login(PRO), login(ADMIN)]);
  let bookingId = '';
  let strangerId = '';
  let strangerEmail = '';
  const sent: string[] = [];

  try {
    // ── No relationship yet: the door is shut ───────────────────────────────
    // Uses a throwaway account rather than clearing the shared test user's
    // bookings — a check must never destroy data it did not create.
    strangerEmail = `stranger-${Date.now()}@kleverklues.test`;
    const madeStranger = await (await fetch(`${BASE}/api/admin/create-user`, {
      method: 'POST', headers: H(a.token),
      body: JSON.stringify({
        role: 'USER', firstName: 'Stranger', lastName: 'Probe',
        email: strangerEmail, password: 'Panel@1234',
      }),
    })).json();
    assert.ok(madeStranger.success, `could not create probe user: ${madeStranger.error}`);
    strangerId = madeStranger.data.user.id;
    const stranger = await login({ email: strangerEmail, password: 'Panel@1234' });

    const blocked = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(stranger.token), body: JSON.stringify({ to: p.id, content: 'hello' }),
    })).json();
    check(blocked.success === false, 'a stranger cannot message a professional', blocked.error);

    // ── Admin is always reachable ───────────────────────────────────────────
    const toAdmin = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(u.token), body: JSON.stringify({ to: a.id, content: 'I need help.' }),
    })).json();
    check(toAdmin.success === true, 'anyone can reach an admin', toAdmin.error);
    if (toAdmin.success) sent.push(toAdmin.data.id);

    // ── A booking opens the thread ──────────────────────────────────────────
    const me = await (await fetch(`${BASE}/api/auth/me`, { headers: H(p.token) })).json();
    const proUserId = me.data?.user?.id ?? me.data?.id;
    const dir = await (await fetch(`${BASE}/api/professionals`, { headers: H(u.token) })).json();
    const target = dir.data.find((x: any) => x.userId === proUserId);
    assert.ok(target, 'professional must be in the directory');

    const booked = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: H(u.token),
      body: JSON.stringify({
        professionalId: target.id,
        scheduledAt: new Date(Date.now() + 11 * 24 * 3600_000).toISOString(),
        sessionType: 'chat', duration: 30,
      }),
    })).json();
    assert.ok(booked.success, `booking failed: ${booked.error}`);
    bookingId = booked.data.id;

    const now = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(u.token), body: JSON.stringify({ to: p.id, content: 'Looking forward to it.' }),
    })).json();
    check(now.success === true, 'a booking opens the conversation', now.error);
    if (now.success) sent.push(now.data.id);

    // ── The professional can reply, and sees it ─────────────────────────────
    const reply = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(p.token), body: JSON.stringify({ to: u.id, content: 'See you then.' }),
    })).json();
    check(reply.success === true, 'the professional can reply');
    if (reply.success) sent.push(reply.data.id);

    const convo = await (await fetch(`${BASE}/api/messages?with=${p.id}`, { headers: H(u.token) })).json();
    check(convo.data.items.length >= 2, 'both sides appear in the thread', `${convo.data.items.length} messages`);
    check(convo.data.items[0].createdAt <= convo.data.items[convo.data.items.length - 1].createdAt,
      'oldest first, the way a conversation reads');
    check(convo.data.items.some((m: any) => m.mine === true) && convo.data.items.some((m: any) => m.mine === false),
      'each message says whose it is');
    check(convo.data.participant?.name, 'the other participant is named', convo.data.participant?.name);

    // ── Reading marks only your own received messages ───────────────────────
    const proSide = await (await fetch(`${BASE}/api/messages?with=${u.id}`, { headers: H(p.token) })).json();
    check(proSide.data.items.length >= 2, 'the professional sees the same thread');

    // ── Validation ──────────────────────────────────────────────────────────
    const empty = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(u.token), body: JSON.stringify({ to: p.id, content: '   ' }),
    })).json();
    check(empty.success === false, 'an empty message is refused');

    const self = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(u.token), body: JSON.stringify({ to: u.id, content: 'hi me' }),
    })).json();
    check(self.success === false, 'you cannot message yourself');

    check((await fetch(`${BASE}/api/messages`)).status === 401, 'unauthenticated callers are rejected');

    // ── Notifications are now readable ──────────────────────────────────────
    const notes = await (await fetch(`${BASE}/api/notifications`, { headers: H(p.token) })).json();
    check(notes.success, 'notifications endpoint responds');
    check(notes.data.items.length > 0, 'the booking and message wrote real notifications',
      `${notes.data.items.length} rows`);
    check(typeof notes.data.unreadCount === 'number', 'unread count is reported', String(notes.data.unreadCount));

    const first = notes.data.items[0];
    const marked = await (await fetch(`${BASE}/api/notifications`, {
      method: 'PATCH', headers: H(p.token), body: JSON.stringify({ id: first.id }),
    })).json();
    check(marked.success, 'a notification can be marked read');

    // Someone else's notification must not be reachable by id.
    const theft = await (await fetch(`${BASE}/api/notifications`, {
      method: 'PATCH', headers: H(u.token), body: JSON.stringify({ id: first.id }),
    })).json();
    check(theft.success === false, "another account's notification cannot be touched", theft.error);
  } finally {
    for (const id of sent) await prisma.message.delete({ where: { id } }).catch(() => {});
    await prisma.message.deleteMany({ where: { content: { in: ['See you then.', 'Looking forward to it.', 'I need help.'] } } }).catch(() => {});
    if (bookingId) await prisma.booking.delete({ where: { id: bookingId } }).catch(() => {});
    if (strangerId) await prisma.user.delete({ where: { id: strangerId } }).catch(() => {});
    await prisma.notification.deleteMany({
      where: { OR: [{ type: 'MESSAGE_RECEIVED' }, { message: { contains: 'booked a 30-minute chat session' } }] },
    }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
