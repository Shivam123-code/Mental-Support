// Self-check for the public directory and who is bookable.
//   npx tsx --env-file=.env.local src/app/api/professionals/route.check.ts
//
// Professional.userId was a plain String with no relation, so deleting an
// account left the profile behind — still VERIFIED, still isAcceptingClients,
// still listed publicly. 45 of the 46 rows in this database were such ghosts,
// and POST /api/bookings would happily book one: the session appeared in the
// client's dashboard looking real and nobody would ever have attended.
//
// The column is a cascading foreign key now, so the database cannot strand a
// profile. These checks cover that, and the case the cascade does not cover —
// an account that still exists but has stopped being ACTIVE.

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
const JH = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

const listed = async () => (await (await fetch(`${BASE}/api/professionals`)).json()).data as any[];

async function main() {
  const [user, pro, admin] = await Promise.all([login(USER), login(PRO), login(ADMIN)]);

  const proProfile = await prisma.professional.findUnique({ where: { userId: pro.id } });
  assert.ok(proProfile, 'the professional test account needs a profile');

  const original = {
    displayName: proProfile.displayName,
    hourlyRate: proProfile.hourlyRate,
    isAcceptingClients: proProfile.isAcceptingClients,
  };
  let ghostUserId = '';
  let ghostProId = '';
  const bookingIds: string[] = [];

  try {
    // ── No orphans survive ──────────────────────────────────────────────────
    const all = await prisma.professional.findMany({ select: { id: true, userId: true } });
    const liveUsers = new Set(
      (await prisma.user.findMany({
        where: { id: { in: all.map(p => p.userId) } }, select: { id: true },
      })).map(u => u.id)
    );
    const orphans = all.filter(p => !liveUsers.has(p.userId));
    check(orphans.length === 0, 'no profile exists without an account behind it', `${orphans.length} orphaned`);

    // ── Deleting an account takes the profile with it ───────────────────────
    // The property the foreign key buys. Without the cascade this row would
    // survive its owner, exactly as 45 others did.
    const created = await (await fetch(`${BASE}/api/admin/create-user`, {
      method: 'POST', headers: JH(admin.token),
      body: JSON.stringify({
        role: 'PROFESSIONAL', firstName: 'Ghost', lastName: 'Probe',
        email: `ghost-probe-${Date.now()}@kleverklues.test`, password: 'Panel@1234',
      }),
    })).json();
    assert.ok(created.success, `probe professional failed: ${created.error}`);
    ghostUserId = created.data.user.id;

    const ghostProfile = await prisma.professional.findUnique({ where: { userId: ghostUserId } });
    check(!!ghostProfile, 'creating a professional creates their profile');
    ghostProId = ghostProfile?.id ?? '';

    await prisma.user.delete({ where: { id: ghostUserId } });
    ghostUserId = '';
    const afterDelete = ghostProId
      ? await prisma.professional.findUnique({ where: { id: ghostProId } })
      : null;
    check(afterDelete === null, 'deleting the account deletes the profile with it');
    ghostProId = '';

    // ── A suspended professional is not on offer ────────────────────────────
    // The cascade cannot help here: the account still exists, it just is not
    // usable. Directory, matching and booking all have to notice.
    await prisma.professional.update({
      where: { id: proProfile.id },
      data: { displayName: 'Directory Check Professional', hourlyRate: 1500, isAcceptingClients: true },
    });

    check((await listed()).some(p => p.id === proProfile.id), 'an active professional is listed');

    await prisma.user.update({ where: { id: pro.id }, data: { status: 'SUSPENDED' } });
    check(!(await listed()).some(p => p.id === proProfile.id), 'a suspended professional is not listed');

    const slot = new Date(Date.now() + 21 * 86_400_000);
    slot.setHours(10, 0, 0, 0);
    const blocked = await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({
        professionalId: proProfile.id, sessionType: 'video',
        scheduledAt: slot.toISOString(), duration: 50,
      }),
    });
    check(blocked.status === 409, 'and cannot be booked', `got ${blocked.status}`);

    const care = await fetch(`${BASE}/api/care`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({ professionalId: proProfile.id }),
    });
    check(care.status === 409, 'nor started care with', `got ${care.status}`);

    await prisma.user.update({ where: { id: pro.id }, data: { status: 'ACTIVE' } });

    // ── Booking a listed professional works ─────────────────────────────────
    const ok = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({
        professionalId: proProfile.id, sessionType: 'video',
        scheduledAt: slot.toISOString(), duration: 50,
      }),
    })).json();
    check(ok.success, 'an active professional can be booked', ok.error);
    if (ok.success) bookingIds.push(ok.data.id);

    // The price the booking page shows has to be the one that gets stored.
    check(ok.data?.amount === 1250, 'the stored price is the rate pro-rated for the session',
      `${ok.data?.amount} (1500/hr x 50min)`);

    // ── Nothing is offered that cannot be reached ───────────────────────────
    const rows = await listed();
    check(rows.every(p => p.userId), 'every listing names the account behind it');
    check(rows.every(p => p.isAcceptingClients), 'only professionals accepting clients are listed');
    check(!rows.some(p => /^Professional #/.test(p.displayName)),
      'no listing falls back to an id fragment for a name',
      rows.find(p => /^Professional #/.test(p.displayName))?.displayName);

    // ── Not-accepting is honoured ───────────────────────────────────────────
    await prisma.professional.update({
      where: { id: proProfile.id }, data: { isAcceptingClients: false },
    });
    check(!(await listed()).some(p => p.id === proProfile.id),
      'closing your books removes you from the directory');
  } finally {
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } }).catch(() => {});
    await prisma.professional.update({ where: { id: proProfile.id }, data: original }).catch(() => {});
    await prisma.user.update({ where: { id: pro.id }, data: { status: 'ACTIVE' } }).catch(() => {});
    if (ghostProId) await prisma.professional.delete({ where: { id: ghostProId } }).catch(() => {});
    if (ghostUserId) await prisma.user.delete({ where: { id: ghostUserId } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
