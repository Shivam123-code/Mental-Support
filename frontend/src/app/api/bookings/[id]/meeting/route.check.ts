// Self-check for video rooms and live message relay.
//   npx tsx --env-file=.env.local "src/app/api/bookings/[id]/meeting/route.check.ts"
//
// The room name must be unguessable and derived server-side. A predictable
// room — the raw booking id, "session-1" — would let anyone who tried the right
// string walk into a therapy session.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { io as ioClient } from 'socket.io-client';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const WS = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };

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
  const [u, p] = await Promise.all([login(USER), login(PRO)]);
  let bookingId = '';
  const sentIds: string[] = [];
  let sock: any;

  try {
    const me = await (await fetch(`${BASE}/api/auth/me`, { headers: H(p.token) })).json();
    const proUserId = me.data?.user?.id ?? me.data?.id;
    const dir = await (await fetch(`${BASE}/api/professionals`, { headers: H(u.token) })).json();
    const target = dir.data.find((x: any) => x.userId === proUserId);
    assert.ok(target, 'panelpro must be in the directory');

    const booked = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: H(u.token),
      body: JSON.stringify({
        professionalId: target.id,
        scheduledAt: new Date(Date.now() + 13 * 24 * 3600_000).toISOString(),
        sessionType: 'video', duration: 50,
      }),
    })).json();
    assert.ok(booked.success, `booking failed: ${booked.error}`);
    bookingId = booked.data.id;

    // ── Both parties get the same room ──────────────────────────────────────
    const asUser = await (await fetch(`${BASE}/api/bookings/${bookingId}/meeting`, {
      method: 'POST', headers: H(u.token),
    })).json();
    check(asUser.success, 'the client can open the room', asUser.error);

    const asPro = await (await fetch(`${BASE}/api/bookings/${bookingId}/meeting`, {
      method: 'POST', headers: H(p.token),
    })).json();
    check(asPro.success, 'the professional can open the room');
    check(asUser.data.url === asPro.data.url, 'both land in the same room');
    check(asPro.data.isHost === true && asUser.data.isHost === false, 'the professional is the host');

    // ── The room must not be derivable from the booking id ──────────────────
    check(!asUser.data.room.includes(bookingId), 'the room name is not the booking id');
    check(asUser.data.room.length > 20, 'the room name is long enough to resist guessing',
      `${asUser.data.room.length} chars`);
    check(asUser.data.url.startsWith('https://'), 'the room url is https');

    // Stability matters: a reload must not strand someone in an empty call.
    const again = await (await fetch(`${BASE}/api/bookings/${bookingId}/meeting`, {
      method: 'POST', headers: H(u.token),
    })).json();
    check(again.data.url === asUser.data.url, 'the room is stable across calls');

    // ── Outsiders ───────────────────────────────────────────────────────────
    const noAuth = await fetch(`${BASE}/api/bookings/${bookingId}/meeting`, { method: 'POST' });
    check(noAuth.status === 401, 'unauthenticated callers are rejected');

    // ── A finished session has no room ──────────────────────────────────────
    await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: H(p.token), body: JSON.stringify({ status: 'CANCELLED' }),
    });
    const afterCancel = await (await fetch(`${BASE}/api/bookings/${bookingId}/meeting`, {
      method: 'POST', headers: H(u.token),
    })).json();
    check(afterCancel.success === false, 'a cancelled session cannot open a call', afterCancel.error);

    // ── Live message relay ──────────────────────────────────────────────────
    // The professional holds a socket; a message sent over REST should arrive
    // on it without a reload.
    sock = ioClient(WS, { transports: ['websocket'], forceNew: true });
    const authed = await new Promise<boolean>((resolve) => {
      const t = setTimeout(() => resolve(false), 10_000);
      sock.on('connect', () => sock.emit('authenticate', { token: p.token }));
      sock.on('authenticated', (r: any) => { clearTimeout(t); resolve(!!r?.success); });
      sock.on('connect_error', () => { clearTimeout(t); resolve(false); });
    });
    check(authed, 'the professional connects a socket');

    const arrived = new Promise<any>((resolve) => {
      const t = setTimeout(() => resolve(null), 8000);
      sock.on('message:new', (m: any) => { clearTimeout(t); resolve(m); });
    });

    const sent = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: H(u.token), body: JSON.stringify({ to: p.id, content: 'Relay probe' }),
    })).json();
    check(sent.success, 'the client sends a message', sent.error);
    if (sent.success) sentIds.push(sent.data.id);

    const live = await arrived;
    check(!!live, 'it arrives on the socket without a reload');
    check(live?.content === 'Relay probe', 'with the right content', live?.content);
    check(live?.from === u.id, 'and names the sender');
  } finally {
    sock?.disconnect();
    for (const id of sentIds) await prisma.message.delete({ where: { id } }).catch(() => {});
    await prisma.message.deleteMany({ where: { content: 'Relay probe' } }).catch(() => {});
    if (bookingId) await prisma.booking.delete({ where: { id: bookingId } }).catch(() => {});
    await prisma.notification.deleteMany({
      where: { OR: [{ type: 'MESSAGE_RECEIVED' }, { message: { contains: 'booked a 50-minute video session' } }] },
    }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
