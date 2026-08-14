// Self-check for alert claiming.
//   npx tsx --env-file=.env.local "src/app/api/admin/sos-alerts/[id]/claim/route.check.ts"
//
// Every admin used to receive every alert forever, so at volume two could work
// the same emergency while a third went unattended. The property that matters
// is that a contested claim has exactly one winner — a read followed by a write
// would let both admins believe they had it.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const ADMIN = { email: 'admin@kleverklues.com', password: 'Admin@123' };
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };

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
const H = (t: string) => ({ Authorization: `Bearer ${t}` });

async function main() {
  const [admin, user] = await Promise.all([login(ADMIN), login(USER)]);
  const alertIds: string[] = [];
  let secondAdminId = '';

  try {
    const mk = async (message: string) => {
      const a = await prisma.emergencyAlert.create({
        data: {
          latitude: 19.1136, longitude: 72.8697, severity: 'CRITICAL',
          message, status: 'ACTIVE', dispatchStatus: 'PENDING',
        },
      });
      alertIds.push(a.id);
      return a.id;
    };

    // ── Only admins ─────────────────────────────────────────────────────────
    const id1 = await mk('claim check 1');
    const asUser = await fetch(`${BASE}/api/admin/sos-alerts/${id1}/claim`, {
      method: 'POST', headers: H(user.token),
    });
    check(asUser.status === 401, 'a non-admin cannot claim');
    check((await fetch(`${BASE}/api/admin/sos-alerts/${id1}/claim`, { method: 'POST' })).status === 401,
      'unauthenticated callers are rejected');

    // ── A claim sticks ──────────────────────────────────────────────────────
    const claimed = await (await fetch(`${BASE}/api/admin/sos-alerts/${id1}/claim`, {
      method: 'POST', headers: H(admin.token),
    })).json();
    check(claimed.success, 'an admin can claim an alert', claimed.error);

    const row = await prisma.emergencyAlert.findUnique({ where: { id: id1 } });
    check(row?.acknowledgedBy === admin.id, 'ownership is recorded on the alert');
    check(row?.status === 'ACKNOWLEDGED', 'the alert leaves the unclaimed queue');
    check(!!row?.acknowledgedAt, 'when it was taken is recorded');

    // ── Contested claim: exactly one winner ─────────────────────────────────
    // A second admin account, because a race needs two real contenders.
    const created = await (await fetch(`${BASE}/api/admin/create-user`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...H(admin.token) },
      body: JSON.stringify({
        role: 'USER', firstName: 'Second', lastName: 'Admin',
        email: `second-admin-${Date.now()}@kleverklues.test`, password: 'Panel@1234',
      }),
    })).json();
    assert.ok(created.success, `probe admin failed: ${created.error}`);
    secondAdminId = created.data.user.id;
    await prisma.user.update({ where: { id: secondAdminId }, data: { role: 'ADMIN' } });
    const second = await login({ email: created.data.user.email, password: 'Panel@1234' });

    const id2 = await mk('claim check race');
    const results = await Promise.all([
      fetch(`${BASE}/api/admin/sos-alerts/${id2}/claim`, { method: 'POST', headers: H(admin.token) }).then(r => r.json()),
      fetch(`${BASE}/api/admin/sos-alerts/${id2}/claim`, { method: 'POST', headers: H(second.token) }).then(r => r.json()),
      fetch(`${BASE}/api/admin/sos-alerts/${id2}/claim`, { method: 'POST', headers: H(admin.token) }).then(r => r.json()),
    ]);
    const winners = results.filter(r => r.success && !r.data?.alreadyMine).length;
    check(winners === 1, 'exactly one of three simultaneous claims wins', `${winners} won`);

    const raced = await prisma.emergencyAlert.findUnique({ where: { id: id2 } });
    check(!!raced?.acknowledgedBy, 'the alert has exactly one owner');
    const loser = results.find(r => !r.success);
    check(!!loser?.error?.includes('Already claimed'), 'the loser is told who has it', loser?.error);

    // ── Only the holder may release ─────────────────────────────────────────
    const wrongHand = raced!.acknowledgedBy === admin.id ? second.token : admin.token;
    const rightHand = raced!.acknowledgedBy === admin.id ? admin.token : second.token;

    const stolen = await (await fetch(`${BASE}/api/admin/sos-alerts/${id2}/claim`, {
      method: 'DELETE', headers: H(wrongHand),
    })).json();
    check(stolen.success === false, 'another admin cannot release someone else\'s alert', stolen.error);

    const released = await (await fetch(`${BASE}/api/admin/sos-alerts/${id2}/claim`, {
      method: 'DELETE', headers: H(rightHand),
    })).json();
    check(released.success, 'the holder can hand it back');
    const back = await prisma.emergencyAlert.findUnique({ where: { id: id2 } });
    check(back?.acknowledgedBy === null && back?.status === 'ACTIVE', 'it returns to the queue');

    // ── Closed alerts ───────────────────────────────────────────────────────
    const id3 = await mk('claim check resolved');
    await prisma.emergencyAlert.update({ where: { id: id3 }, data: { status: 'RESOLVED' } });
    const closed = await (await fetch(`${BASE}/api/admin/sos-alerts/${id3}/claim`, {
      method: 'POST', headers: H(admin.token),
    })).json();
    check(closed.success === false, 'a resolved alert cannot be claimed', closed.error);

    // ── The claim is audited ────────────────────────────────────────────────
    const audit = await (await fetch(`${BASE}/api/admin/audit-logs?action=sos.claim`, { headers: H(admin.token) })).json();
    check(audit.data.items.some((e: any) => e.resourceId === id1), 'claiming is written to the audit trail');
  } finally {
    for (const id of alertIds) {
      await prisma.sosDispatchLog.deleteMany({ where: { alertId: id } }).catch(() => {});
      await prisma.emergencyAlert.delete({ where: { id } }).catch(() => {});
    }
    if (secondAdminId) await prisma.user.delete({ where: { id: secondAdminId } }).catch(() => {});
    await prisma.activityLog.deleteMany({
      where: { action: { in: ['admin.sos.claim', 'admin.sos.release'] }, resourceId: { in: alertIds } },
    }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
