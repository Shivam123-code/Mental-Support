/**
 * End-to-end test for the emergency dispatch flow.
 *
 * Runs against a LIVE socket server and a live database. It creates its own
 * throwaway users (e2e-*@dispatch.test), drives a real SOS through real sockets,
 * and deletes everything afterwards.
 *
 *   1. terminal A:  npm run build && npm start
 *   2. terminal B:  npx tsx src/dispatch.e2e.ts
 *
 * Asserts the behaviours the rewrite was for:
 *   - vendors are pinged IN PARALLEL, not one at a time
 *   - vendors outside the severity radius are never pinged
 *   - exactly one vendor can win a contested accept
 *   - a decline does not stall the round
 *   - running out of vendors ESCALATES instead of dead-ending
 *   - the audit trail records who was pinged
 */
require('dotenv').config();

import { io as ioClient, Socket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';

const URL = process.env.SOCKET_URL || 'http://localhost:3001';
const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error('JWT_SECRET missing');

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

// Andheri, Mumbai — arbitrary but fixed so distances are predictable.
const ORIGIN = { lat: 19.1136, lon: 72.8697 };

let failures = 0;
function check(ok: boolean, label: string, detail = '') {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function token(userId: string, role: string) {
  return jwt.sign({ userId, email: `${userId}@dispatch.test`, role }, SECRET, { expiresIn: '1h' });
}

/** Connect and authenticate one socket, resolving once the server confirms. */
function connect(userId: string, role: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = ioClient(URL, { transports: ['websocket'], forceNew: true });
    const timer = setTimeout(() => reject(new Error(`auth timeout for ${role}`)), 10_000);
    s.on('connect', () => s.emit('authenticate', { token: token(userId, role) }));
    s.on('authenticated', (res: any) => {
      clearTimeout(timer);
      res?.success ? resolve(s) : reject(new Error(`auth failed for ${role}: ${res?.error}`));
    });
    s.on('connect_error', e => { clearTimeout(timer); reject(e); });
  });
}

async function seed() {
  await cleanup();

  const mk = async (tag: string, role: string) =>
    prisma.user.create({
      data: {
        email: `e2e-${tag}@dispatch.test`,
        passwordHash: 'x',
        firstName: tag,
        lastName: 'Test',
        role: role as any,
        status: 'ACTIVE',
      },
    });

  const caller = await mk('caller', 'USER');
  const admin = await mk('admin', 'ADMIN');

  // Three vendors inside the 25km CRITICAL radius, one far outside it.
  const specs = [
    { tag: 'near1', dLat: 0.01, dLon: 0 },   // ~1.1 km
    { tag: 'near2', dLat: 0.02, dLon: 0 },   // ~2.2 km
    { tag: 'near3', dLat: 0.03, dLon: 0 },   // ~3.3 km
    { tag: 'far',   dLat: 1.00, dLon: 0 },   // ~111 km — must never be pinged
  ];

  const vendors: { tag: string; id: string }[] = [];
  for (const s of specs) {
    const u = await mk(s.tag, 'VENDOR');
    await prisma.vendorProfile.create({
      data: {
        userId: u.id,
        businessName: `Vendor ${s.tag}`,
        serviceType: 'First Responder',
        phone: '+910000000000',
        latitude: ORIGIN.lat + s.dLat,
        longitude: ORIGIN.lon + s.dLon,
        locationUpdatedAt: new Date(), // fresh, so not filtered as stale
        isOnline: true,
        isAvailable: true,
      },
    });
    vendors.push({ tag: s.tag, id: u.id });
  }

  return { caller, admin, vendors };
}

async function cleanup() {
  const users = await prisma.user.findMany({
    where: { email: { endsWith: '@dispatch.test' } },
    select: { id: true },
  });
  const ids = users.map(u => u.id);
  if (ids.length === 0) return;
  // Alerts cascade from the caller; assigned-vendor rows must be cleared first.
  await prisma.emergencyAlert.deleteMany({ where: { assignedVendorId: { in: ids } } });
  await prisma.emergencyAlert.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
}

async function main() {
  console.log(`\n🔌 Target: ${URL}\n`);

  const { caller, admin, vendors } = await seed();
  const byTag = Object.fromEntries(vendors.map(v => [v.tag, v.id]));

  const adminSock = await connect(admin.id, 'ADMIN');
  const callerSock = await connect(caller.id, 'USER');
  const vSock: Record<string, Socket> = {};
  for (const v of vendors) vSock[v.tag] = await connect(v.id, 'VENDOR');
  console.log('   all sockets authenticated\n');

  // ── Recorders ──────────────────────────────────────────────────────────────
  const pings: { tag: string; at: number }[] = [];
  for (const v of vendors) {
    vSock[v.tag].on('vendor:dispatch', () => pings.push({ tag: v.tag, at: Date.now() }));
  }
  let adminAlert: any = null;
  adminSock.on('emergency:alert', (a: any) => { adminAlert = a; });
  const callerUpdates: any[] = [];
  callerSock.on('sos:status_update', (u: any) => callerUpdates.push(u));
  let escalation: any = null;
  adminSock.on('emergency:escalated', (e: any) => { escalation = e; });

  // ── SCENARIO 1: normal dispatch ────────────────────────────────────────────
  console.log('SCENARIO 1 — SOS with 3 nearby vendors, 1 far away');

  const confirmed: any = await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('no emergency:confirmed')), 10_000);
    callerSock.once('emergency:confirmed', (r: any) => { clearTimeout(t); resolve(r); });
    callerSock.emit('emergency:sos', {
      latitude: ORIGIN.lat, longitude: ORIGIN.lon, accuracy: 12,
      severity: 'CRITICAL', message: 'e2e test alert',
    });
  });

  check(Boolean(confirmed.alertId), 'caller got an alert id');
  check(confirmed.emergencyNumber === '112', 'emergency number returned immediately with confirmation');

  await sleep(3000); // let round 1 fan out

  check(adminAlert?.id === confirmed.alertId, 'admin room received the alert in real time');

  const pingedTags = [...new Set(pings.map(p => p.tag))];
  check(pingedTags.length === 3, 'all 3 in-radius vendors pinged in one round', `pinged: ${pingedTags.join(', ')}`);
  check(!pingedTags.includes('far'), 'vendor outside the radius was NOT pinged');

  const spread = pings.length ? Math.max(...pings.map(p => p.at)) - Math.min(...pings.map(p => p.at)) : 0;
  check(spread < 3000, 'pings were parallel, not serial', `${spread}ms spread (serial would be ~20000ms)`);

  // near1 declines — must not stall anything
  vSock.near1.emit('vendor:decline', { alertId: confirmed.alertId });
  await sleep(300);

  // near2 and near3 race to accept; exactly one must win
  const results: string[] = [];
  const raceDone = new Promise<void>(resolve => {
    let n = 0;
    const tally = (tag: string) => () => {
      results.push(tag);
      if (++n === 2) resolve();
    };
    vSock.near2.once('vendor:accept_confirmed', tally('near2-win'));
    vSock.near2.once('vendor:accept_rejected', tally('near2-lose'));
    vSock.near3.once('vendor:accept_confirmed', tally('near3-win'));
    vSock.near3.once('vendor:accept_rejected', tally('near3-lose'));
  });
  vSock.near2.emit('vendor:accept', { alertId: confirmed.alertId });
  vSock.near3.emit('vendor:accept', { alertId: confirmed.alertId });
  await Promise.race([raceDone, sleep(6000)]);

  const wins = results.filter(r => r.includes('win')).length;
  check(wins === 1, 'exactly one vendor won the contested accept', `results: ${results.join(' | ')}`);

  await sleep(1000);
  const accepted = callerUpdates.find(u => u.dispatchStatus === 'VENDOR_ACCEPTED');
  check(Boolean(accepted), 'caller was told a responder accepted', accepted?.vendorName ?? '');

  const dbAlert = await prisma.emergencyAlert.findUnique({ where: { id: confirmed.alertId } });
  check(dbAlert?.dispatchStatus === 'VENDOR_ACCEPTED', 'DB shows VENDOR_ACCEPTED');
  check(Boolean(dbAlert?.assignedVendorId), 'DB recorded the assigned vendor');

  const logs = await prisma.sosDispatchLog.findMany({ where: { alertId: confirmed.alertId } });
  const events = logs.map(l => l.event);
  check(events.filter(e => e === 'PINGED').length === 3, 'audit trail recorded all 3 pings');
  check(events.includes('ACCEPTED'), 'audit trail recorded the acceptance');
  check(events.includes('DECLINED'), 'audit trail recorded the decline');

  // ── SCENARIO 2: arrival must be verified by location ───────────────────────
  console.log('\nSCENARIO 2 — vendor claims arrival from the wrong place');
  const winner = dbAlert!.assignedVendorId!;
  const winnerTag = Object.keys(byTag).find(t => byTag[t] === winner)!;

  const farAway: any = await new Promise(resolve => {
    vSock[winnerTag].once('vendor:status_ack', resolve);
    vSock[winnerTag].emit('vendor:status_update', {
      alertId: confirmed.alertId, status: 'ARRIVED',
      latitude: ORIGIN.lat + 0.5, longitude: ORIGIN.lon, // ~55km from the scene
    });
  });
  check(farAway?.success === false, 'ARRIVED rejected when vendor is far from the scene');

  const atScene: any = await new Promise(resolve => {
    vSock[winnerTag].once('vendor:status_ack', resolve);
    vSock[winnerTag].emit('vendor:status_update', {
      alertId: confirmed.alertId, status: 'ARRIVED',
      latitude: ORIGIN.lat + 0.001, longitude: ORIGIN.lon, // ~110m
    });
  });
  check(atScene?.success === true, 'ARRIVED accepted when vendor is actually at the scene');

  // ── SCENARIO 3: no vendors available must escalate, not dead-end ───────────
  console.log('\nSCENARIO 3 — SOS with every vendor offline');

  await prisma.emergencyAlert.updateMany({
    where: { id: confirmed.alertId },
    data: { status: 'RESOLVED', resolvedAt: new Date() }, // close alert 1 so dedupe allows a new one
  });
  await prisma.vendorProfile.updateMany({
    where: { userId: { in: vendors.map(v => v.id) } },
    data: { isOnline: false },
  });

  callerUpdates.length = 0;
  const second: any = await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('no confirmation for 2nd alert')), 10_000);
    callerSock.once('emergency:confirmed', (r: any) => { clearTimeout(t); resolve(r); });
    callerSock.emit('emergency:sos', {
      latitude: ORIGIN.lat, longitude: ORIGIN.lon, severity: 'CRITICAL', message: 'e2e no-vendor test',
    });
  });

  await sleep(3000);

  check(Boolean(escalation), 'admin received an escalation alert');
  const escalated = callerUpdates.find(u => u.dispatchStatus === 'ESCALATED');
  check(Boolean(escalated), 'caller was told honestly that no responder confirmed');
  check(escalated?.showEmergencyNumber === true, 'caller was pointed at emergency services');

  const db2 = await prisma.emergencyAlert.findUnique({ where: { id: second.alertId } });
  check(db2?.dispatchStatus === 'ESCALATED', 'DB shows ESCALATED, not a silent dead end');
  check(Boolean(db2?.escalatedAt), 'escalation timestamp recorded');

  const logs2 = await prisma.sosDispatchLog.findMany({ where: { alertId: second.alertId } });
  check(logs2.some(l => l.event === 'NO_VENDORS'), 'audit trail explains why it escalated');

  // ── SCENARIO 4: panic taps must not create competing alerts ────────────────
  console.log('\nSCENARIO 4 — caller taps SOS repeatedly');
  const before = await prisma.emergencyAlert.count({ where: { userId: caller.id } });
  for (let i = 0; i < 3; i++) {
    callerSock.emit('emergency:sos', {
      latitude: ORIGIN.lat, longitude: ORIGIN.lon, severity: 'CRITICAL', message: 'panic tap',
    });
    await sleep(200);
  }
  await sleep(1500);
  const after = await prisma.emergencyAlert.count({ where: { userId: caller.id } });
  check(after === before, 'repeat presses merged into the existing alert', `${before} -> ${after}`);

  // ── Done ───────────────────────────────────────────────────────────────────
  [adminSock, callerSock, ...Object.values(vSock)].forEach(s => s.close());
  await sleep(500);
  await cleanup();
  await prisma.$disconnect();

  console.log(`\n${failures === 0 ? '✅ ALL DISPATCH E2E CHECKS PASSED' : `❌ ${failures} CHECK(S) FAILED`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async err => {
  console.error('\n❌ E2E run failed:', err);
  await cleanup().catch(() => {});
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
