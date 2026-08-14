/**
 * Proves notifications are scoped per account, not broadcast.
 *
 *   1. terminal A:  npm run dev        (socket server)
 *   2. terminal B:  npx tsx src/notification-scope.e2e.ts
 *
 * The concern this guards: with thousands of callers and vendors connected at
 * once, one caller's emergency must never surface on another caller's screen,
 * and the admin dispatch feed must never leak to non-admins. Room membership is
 * assigned server-side from a DB-verified role, so a tampered client cannot
 * subscribe its way into someone else's stream — that is what this asserts.
 */
require('dotenv').config();

import { io as ioClient, Socket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';

const URL = process.env.SOCKET_URL || 'http://localhost:3001';
const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error('JWT_SECRET missing');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const ORIGIN = { lat: 19.1136, lon: 72.8697 };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let failures = 0;
function check(ok: boolean, label: string, detail = '') {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

/** Authenticate with a real account, exactly as the browser does. */
function connectAs(userId: string, email: string, role: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = ioClient(URL, { transports: ['websocket'], forceNew: true });
    const t = setTimeout(() => reject(new Error(`auth timeout ${role}`)), 10_000);
    const token = jwt.sign({ userId, email, role }, SECRET, { expiresIn: '1h' });
    s.on('connect', () => s.emit('authenticate', { token }));
    s.on('authenticated', (r: any) => { clearTimeout(t); r?.success ? resolve(s) : reject(new Error(r?.error)); });
    s.on('connect_error', e => { clearTimeout(t); reject(e); });
  });
}

function raiseSOS(s: Socket): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('SOS timeout')), 10_000);
    s.once('emergency:confirmed', (r: any) => { clearTimeout(t); resolve(r); });
    s.once('emergency:error', (e: any) => { clearTimeout(t); reject(new Error(e?.error)); });
    s.emit('emergency:sos', { latitude: ORIGIN.lat, longitude: ORIGIN.lon, message: 'scope test', severity: 'CRITICAL' });
  });
}

async function main() {
  const created: string[] = [];
  const sockets: Socket[] = [];

  try {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN', status: 'ACTIVE' } });
    const users = await prisma.user.findMany({ where: { role: 'USER', status: 'ACTIVE' }, take: 3 });
    if (!admin || users.length < 3) throw new Error('need one ACTIVE admin and three ACTIVE users');
    const [userA, userB, plainUser] = users;

    // Two independent callers + one admin + one uninvolved signed-in user.
    // Callers are distinct accounts rather than guests on purpose: guest flood
    // control keys on remote address, so two local guests share one bucket and
    // the harness would fail on its own rate limit after a few runs. Separate
    // accounts also test the property that actually matters here — that scoping
    // follows identity.
    const a = await connectAs(userA.id, userA.email, 'USER');
    const b = await connectAs(userB.id, userB.email, 'USER');
    const adminSock = await connectAs(admin.id, admin.email, 'ADMIN');
    const bystander = await connectAs(plainUser.id, plainUser.email, 'USER');
    sockets.push(a, b, adminSock, bystander);

    const aUpdates: any[] = [], bUpdates: any[] = [];
    const bystanderHeard: any[] = [], adminHeard: any[] = [];
    a.on('sos:status_update', u => aUpdates.push(u));
    b.on('sos:status_update', u => bUpdates.push(u));
    // A bystander must hear NOTHING — not caller streams, not the admin feed.
    bystander.on('sos:status_update', u => bystanderHeard.push(u));
    bystander.on('emergency:alert', u => bystanderHeard.push(u));
    bystander.on('sos:vendor_status_update', u => bystanderHeard.push(u));
    adminSock.on('emergency:alert', u => adminHeard.push(u));

    const alertA = await raiseSOS(a);
    created.push(alertA.alertId);
    await sleep(300);
    const alertB = await raiseSOS(b);
    created.push(alertB.alertId);

    check(alertA.alertId !== alertB.alertId, 'two callers got distinct alerts');

    // Let both dispatch chains run and emit their status updates.
    for (let i = 0; i < 24 && (!aUpdates.length || !bUpdates.length); i++) await sleep(500);

    check(aUpdates.length > 0, 'caller A received their own status updates');
    check(bUpdates.length > 0, 'caller B received their own status updates');
    check(
      aUpdates.every(u => u.alertId === alertA.alertId),
      'caller A received ONLY their own alert',
      `${aUpdates.length} updates, ids: ${[...new Set(aUpdates.map(u => u.alertId))].length}`
    );
    check(
      bUpdates.every(u => u.alertId === alertB.alertId),
      'caller B received ONLY their own alert',
      `${bUpdates.length} updates, ids: ${[...new Set(bUpdates.map(u => u.alertId))].length}`
    );
    check(!aUpdates.some(u => u.alertId === alertB.alertId), "caller A never saw B's emergency");
    check(!bUpdates.some(u => u.alertId === alertA.alertId), "caller B never saw A's emergency");

    check(adminHeard.length >= 2, 'admin received the full dispatch feed', `${adminHeard.length} alerts`);
    check(bystanderHeard.length === 0, 'uninvolved signed-in user received nothing',
      `${bystanderHeard.length} events`);

    // A non-admin cannot subscribe its way into the admin feed: the client may
    // register any listener it likes, but the server never put it in admin-room.
    const sneaky: any[] = [];
    bystander.on('emergency:escalated', e => sneaky.push(e));
    bystander.on('sos:vendor_assigned', e => sneaky.push(e));
    await sleep(2000);
    check(sneaky.length === 0, 'non-admin cannot subscribe into the admin room');
  } finally {
    sockets.forEach(s => s.disconnect());
    for (const id of created) {
      await (prisma as any).sosDispatchLog.deleteMany({ where: { alertId: id } }).catch(() => {});
      await (prisma as any).emergencyAlert.delete({ where: { id } }).catch(() => {});
    }
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error('harness error:', e); process.exit(1); });
