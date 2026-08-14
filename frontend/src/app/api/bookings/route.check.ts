// End-to-end check that a session booked by a user is a real, shared row that
// the professional sees and can act on.
//
//   npx tsx --env-file=.env.local src/app/api/bookings/route.check.ts
//
// Both dashboards previously rendered fixtures, so a professional "confirming"
// a session changed nothing the client could see. The property under test is
// that one row backs both views and that each side may only do its own part.

import assert from 'node:assert';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

async function login(who: { email: string; password: string }) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(who),
  });
  const j = await r.json();
  assert.ok(j.success, `login failed for ${who.email}: ${j.error}`);
  return j.data.token as string;
}
const auth = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

async function main() {
  const [userToken, proToken] = await Promise.all([login(USER), login(PRO)]);

  // The professional the user will book. Directory must return real accounts.
  const me = await (await fetch(`${BASE}/api/auth/me`, { headers: auth(proToken) })).json();
  const proUserId = me.data?.user?.id ?? me.data?.id;

  const dir = await (await fetch(`${BASE}/api/professionals`, { headers: auth(userToken) })).json();
  check(dir.success, 'professional directory responds');
  check(Array.isArray(dir.data), 'directory returns a list');
  check(dir.data.every((p: any) => typeof p.id === 'string' && typeof p.userId === 'string'),
    'every entry carries a real account id');

  // Book with THIS professional, not merely the first in the list — otherwise
  // the professional under test rightly cannot see the booking.
  const target = dir.data.find((p: any) => p.userId === proUserId);
  if (!target) {
    console.log(`\n${PRO.email} is not in the verified directory — cannot continue`);
    process.exit(1);
  }

  let bookingId = '';
  try {
    // ── A user books ────────────────────────────────────────────────────────
    const when = new Date(Date.now() + 3 * 24 * 3600_000).toISOString();
    const created = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: auth(userToken),
      body: JSON.stringify({ professionalId: target.id, scheduledAt: when, sessionType: 'video', duration: 50 }),
    })).json();
    check(created.success, 'user can book a session', created.error);
    if (!created.success) { console.log(`\n${++failures} failed`); process.exit(1); }
    bookingId = created.data.id;
    check(created.data.isPaid === false, 'new booking is unpaid until a provider confirms it');

    // ── The professional sees the same row ──────────────────────────────────
    const proView = await (await fetch(`${BASE}/api/bookings?scope=upcoming`, { headers: auth(proToken) })).json();
    check(proView.data.role === 'PROFESSIONAL', 'side is derived from the account, not a parameter');
    const seen = proView.data.items.find((b: any) => b.id === bookingId);
    check(!!seen, 'the professional sees the session the user booked');
    check(!!seen?.client?.name, 'and sees who booked it', seen?.client?.name);

    // ── The user sees it from their side ────────────────────────────────────
    const userView = await (await fetch(`${BASE}/api/bookings?scope=upcoming`, { headers: auth(userToken) })).json();
    check(userView.data.role === 'USER', 'user side reported correctly');
    check(userView.data.items.some((b: any) => b.id === bookingId), 'user sees their own session');

    // ── Double booking is refused ───────────────────────────────────────────
    const clash = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: auth(userToken),
      body: JSON.stringify({ professionalId: target.id, scheduledAt: when, sessionType: 'video', duration: 50 }),
    })).json();
    check(clash.success === false, 'the same slot cannot be booked twice', clash.error);

    // ── Validation ──────────────────────────────────────────────────────────
    const past = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: auth(userToken),
      body: JSON.stringify({
        professionalId: target.id, scheduledAt: new Date(Date.now() - 3600_000).toISOString(),
        sessionType: 'video', duration: 50,
      }),
    })).json();
    check(past.success === false, 'a session in the past is refused');

    // ── Permissions ─────────────────────────────────────────────────────────
    const selfConfirm = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(userToken), body: JSON.stringify({ status: 'CONFIRMED' }),
    })).json();
    check(selfConfirm.success === false, 'a client cannot confirm their own session', selfConfirm.error);

    const clientWritesClinicalNotes = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(userToken), body: JSON.stringify({ professionalNotes: 'x' }),
    })).json();
    check(clientWritesClinicalNotes.success === false, 'a client cannot write clinical notes');

    // ── The professional runs the session ───────────────────────────────────
    const confirmed = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(proToken), body: JSON.stringify({ status: 'CONFIRMED' }),
    })).json();
    check(confirmed.success && confirmed.data.status === 'CONFIRMED', 'the professional can confirm');

    const skip = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(proToken), body: JSON.stringify({ status: 'PENDING' }),
    })).json();
    check(skip.success === false, 'illegal transitions are refused', skip.error);

    const done = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(proToken),
      body: JSON.stringify({ status: 'COMPLETED', professionalNotes: 'Session went well.' }),
    })).json();
    check(done.success && done.data.status === 'COMPLETED', 'the professional can complete it');
    check(done.data.professionalNotes === 'Session went well.', 'clinical notes persist');
    check(!!done.data.completedAt, 'completedAt is stamped');

    const afterDone = await (await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: auth(proToken), body: JSON.stringify({ status: 'CANCELLED' }),
    })).json();
    check(afterDone.success === false, 'a finished session cannot be reopened');

    // ── A stranger cannot touch it ──────────────────────────────────────────
    const noAuth = await fetch(`${BASE}/api/bookings/${bookingId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    check(noAuth.status === 401, 'unauthenticated callers are rejected');
  } finally {
    // Leave no trace in the real database. There is deliberately no delete
    // endpoint — a completed session is a record, not something an API should
    // erase — so the harness removes its own row directly.
    if (bookingId) {
      const { PrismaClient } = await import('@prisma/client');
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
      await prisma.booking.delete({ where: { id: bookingId } }).catch(() => {});
      await prisma.notification.deleteMany({
        where: { message: { contains: 'booked a 50-minute video session' } },
      }).catch(() => {});
      await prisma.$disconnect();
    }
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
