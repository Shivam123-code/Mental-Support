// Self-check for reviews.
//   npx tsx --env-file=.env.local src/app/api/reviews/route.check.ts
//
// A rating is only worth showing if it cannot be manufactured. The properties
// that matter are that a review needs a completed session the reviewer was
// actually on, that one session yields exactly one review even under a double
// submit, and that the headline average never disagrees with the rows it is
// computed from.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
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
const JH = (t: string) => ({ 'Content-Type': 'application/json', ...{ Authorization: `Bearer ${t}` } });

const post = (token: string, body: any) =>
  fetch(`${BASE}/api/reviews`, { method: 'POST', headers: JH(token), body: JSON.stringify(body) });

async function main() {
  const [user, pro] = await Promise.all([login(USER), login(PRO)]);
  const bookingIds: string[] = [];
  let proProfileId = '';
  let originalAvg = 0;
  let originalTotal = 0;

  try {
    const proProfile = await prisma.professional.findUnique({ where: { userId: pro.id } });
    assert.ok(proProfile, 'the professional test account needs a profile');
    proProfileId = proProfile.id;
    originalAvg = proProfile.averageRating;
    originalTotal = proProfile.totalReviews;

    // Start clean, so a leftover review from an earlier run cannot make the
    // arithmetic checks below pass or fail for the wrong reason.
    await prisma.review.deleteMany({ where: { professionalId: proProfileId } });

    /** A booking in whatever state the test needs. */
    const mkBooking = async (status: any, daysAgo: number) => {
      const b = await prisma.booking.create({
        data: {
          userId: user.id, professionalId: proProfileId,
          sessionType: 'video', duration: 50, status,
          scheduledAt: new Date(Date.now() - daysAgo * 86_400_000),
        },
      });
      bookingIds.push(b.id);
      return b.id;
    };

    // ── You can only review what happened ───────────────────────────────────
    const pending = await mkBooking('CONFIRMED', -3); // still in the future
    const notDone = await post(user.token, { bookingId: pending, rating: 5 });
    check(notDone.status === 409, 'an unfinished session cannot be reviewed', `got ${notDone.status}`);

    const done = await mkBooking('COMPLETED', 3);

    const anon = await post(pro.token, { bookingId: done, rating: 5 });
    check(anon.status === 404, 'somebody else cannot review this session', `got ${anon.status}`);
    check((await fetch(`${BASE}/api/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: done, rating: 5 }),
    })).status === 401, 'unauthenticated callers are rejected');

    const ghost = await post(user.token, { bookingId: 'does-not-exist', rating: 5 });
    check(ghost.status === 404, 'a made-up session id is refused', `got ${ghost.status}`);

    // ── Ratings have to be ratings ──────────────────────────────────────────
    for (const [rating, label] of [
      [0, 'a zero rating'], [6, 'a rating above five'],
      [-2, 'a negative rating'], [3.7, 'a third of a star'],
    ] as const) {
      const bad = await post(user.token, { bookingId: done, rating });
      check(bad.status === 400, `${label} is refused`, `got ${bad.status}`);
    }
    const half = await post(user.token, { bookingId: done, rating: 4.5 });
    check(half.status === 201, 'half stars are allowed', `got ${half.status}`);

    // ── One session, one review ─────────────────────────────────────────────
    const second = await post(user.token, { bookingId: done, rating: 1 });
    check(second.status === 409, 'the same session cannot be reviewed twice', `got ${second.status}`);

    const doubleSubmitBooking = await mkBooking('COMPLETED', 4);
    const both = await Promise.all([
      post(user.token, { bookingId: doubleSubmitBooking, rating: 5 }),
      post(user.token, { bookingId: doubleSubmitBooking, rating: 2 }),
    ]);
    const accepted = both.filter(r => r.status === 201).length;
    check(accepted === 1, 'a double submit creates exactly one review', `${accepted} accepted`);

    // ── The headline figure matches the rows ────────────────────────────────
    const rows = await prisma.review.findMany({ where: { professionalId: proProfileId } });
    const expectedAvg = Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10;
    const refreshed = await prisma.professional.findUnique({ where: { id: proProfileId } });
    check(refreshed?.totalReviews === rows.length,
      'the review count matches the rows', `${refreshed?.totalReviews} vs ${rows.length}`);
    check(refreshed?.averageRating === expectedAvg,
      'the average matches the rows', `${refreshed?.averageRating} vs ${expectedAvg}`);

    // ── Reading them back ───────────────────────────────────────────────────
    // No token: a public professional profile has to show its reviews.
    const publicRead = await (await fetch(`${BASE}/api/reviews?professionalId=${proProfileId}`)).json();
    check(publicRead.success, 'reviews are readable without logging in', publicRead.error);
    check(publicRead.data.items.length === rows.length, 'every review comes back');
    check(publicRead.data.averageRating === expectedAvg, 'the summary comes back with them');

    // ── Anonymity ───────────────────────────────────────────────────────────
    const anonBooking = await mkBooking('COMPLETED', 5);
    await post(user.token, { bookingId: anonBooking, rating: 5, comment: 'Anonymous note', isAnonymous: true });
    const withAnon = await (await fetch(`${BASE}/api/reviews?professionalId=${proProfileId}`)).json();
    const anonRow = withAnon.data.items.find((i: any) => i.comment === 'Anonymous note');
    check(anonRow?.author === 'Anonymous', 'an anonymous review shows no name', anonRow?.author);
    check(!JSON.stringify(withAnon.data.items).includes(user.id),
      'no reviewer user id is exposed in the payload');

    const named = withAnon.data.items.find((i: any) => i.author !== 'Anonymous');
    check(!!named, 'a non-anonymous review does show a name', named?.author);

    // ── The prompt list ─────────────────────────────────────────────────────
    const unreviewed = await mkBooking('COMPLETED', 6);
    const pendingList = await (await fetch(`${BASE}/api/reviews?pending=1`, { headers: JH(user.token) })).json();
    const ids = pendingList.data.items.map((i: any) => i.bookingId);
    check(ids.includes(unreviewed), 'an unreviewed completed session is offered');
    check(!ids.includes(done), 'an already-reviewed session is not offered again');
    check(!ids.includes(pending), 'an unfinished session is not offered');

    const mine = await (await fetch(`${BASE}/api/reviews?mine=1`, { headers: JH(user.token) })).json();
    check(mine.data.items.length === rows.length + 1, 'the caller can list what they have written',
      `${mine.data.items.length}`);

    // ── The average is derived, not accumulated ─────────────────────────────
    // refreshRating recomputes from the rows every time rather than nudging a
    // running total, so a row removed behind its back still leaves the figure
    // correct after the next write. An incremented counter would not.
    await prisma.review.deleteMany({ where: { bookingId: anonBooking } });
    const restored = await mkBooking('COMPLETED', 7);
    await post(user.token, { bookingId: restored, rating: 3 });

    const finalRows = await prisma.review.findMany({ where: { professionalId: proProfileId } });
    const finalAvg = Math.round((finalRows.reduce((s, r) => s + r.rating, 0) / finalRows.length) * 10) / 10;
    const finalProfile = await prisma.professional.findUnique({ where: { id: proProfileId } });
    check(finalProfile?.totalReviews === finalRows.length,
      'a row removed behind its back does not leave the count wrong',
      `${finalProfile?.totalReviews} vs ${finalRows.length}`);
    check(finalProfile?.averageRating === finalAvg,
      'nor the average', `${finalProfile?.averageRating} vs ${finalAvg}`);
  } finally {
    await prisma.review.deleteMany({ where: { professionalId: proProfileId } }).catch(() => {});
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } }).catch(() => {});
    // Put the professional's headline figures back exactly as they were.
    if (proProfileId) {
      await prisma.professional.update({
        where: { id: proProfileId },
        data: { averageRating: originalAvg, totalReviews: originalTotal },
      }).catch(() => {});
    }
    await prisma.notification.deleteMany({ where: { title: 'New review' } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
