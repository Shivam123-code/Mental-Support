/**
 * End-to-end check that SOS is genuinely open to everyone.
 *
 * Runs against a LIVE socket server and a live database, same as dispatch.e2e.ts.
 *
 *   1. terminal A:  npm run dev
 *   2. terminal B:  npx tsx src/guest-sos.e2e.ts
 *
 * Asserts both halves of "SOS is for all":
 *   - a caller with NO token connects, raises a real alert, and gets live status
 *   - opening that door did not open any other: a guest still cannot touch
 *     another caller's alert, and still cannot act as admin or vendor
 */
require('dotenv').config();

import { io as ioClient, Socket } from 'socket.io-client';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';

const URL = process.env.SOCKET_URL || 'http://localhost:3001';
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

const ORIGIN = { lat: 19.1136, lon: 72.8697 };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let failures = 0;
function check(ok: boolean, label: string, detail = '') {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

/** Connect with no token at all — the guest handshake. */
function connectGuest(): Promise<{ socket: Socket; res: any }> {
  return new Promise((resolve, reject) => {
    const s = ioClient(URL, { transports: ['websocket'], forceNew: true });
    const timer = setTimeout(() => reject(new Error('guest auth timeout')), 10_000);
    s.on('connect', () => s.emit('authenticate', {}));
    s.on('authenticated', (res: any) => {
      clearTimeout(timer);
      res?.success ? resolve({ socket: s, res }) : reject(new Error(`guest rejected: ${res?.error}`));
    });
    s.on('connect_error', e => { clearTimeout(timer); reject(e); });
  });
}

function raiseSOS(s: Socket): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('SOS timeout')), 10_000);
    s.once('emergency:confirmed', (r: any) => { clearTimeout(timer); resolve(r); });
    s.once('emergency:error', (e: any) => { clearTimeout(timer); reject(new Error(e?.error)); });
    s.emit('emergency:sos', {
      latitude: ORIGIN.lat, longitude: ORIGIN.lon,
      message: 'guest e2e', severity: 'CRITICAL',
    });
  });
}

async function main() {
  const created: string[] = [];
  let a: Socket | undefined, b: Socket | undefined;

  try {
    // ── 1. A guest can connect and raise an alert ──────────────────────────
    const guestA = await connectGuest();
    a = guestA.socket;
    check(guestA.res.guest === true, 'guest session granted without a token');

    // Attach BEFORE raising: with no vendors in range dispatch escalates
    // immediately, so the first status update can beat a listener added after.
    const statusUpdates: any[] = [];
    a.on('sos:status_update', (u: any) => statusUpdates.push(u));

    const confirmed = await raiseSOS(a);
    check(!!confirmed?.alertId, 'guest SOS confirmed', confirmed?.alertId);
    check(confirmed?.emergencyNumber === '112', 'emergency number always surfaced');
    const alertId: string = confirmed.alertId;
    created.push(alertId);

    const row = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
    check(row?.userId === null, 'alert stored with userId null (true guest)');
    check(row?.status === 'ACTIVE', 'alert is ACTIVE');

    // ── 2. The guest receives live dispatch status ─────────────────────────
    // notifyCaller routes to alert-<id>; without that a guest gets nothing.
    for (let i = 0; i < 24 && statusUpdates.length === 0; i++) await sleep(500);
    check(statusUpdates.length > 0, 'guest receives sos:status_update via alert room',
      statusUpdates[0]?.dispatchStatus ?? 'none');

    // ── 3. Panic taps merge instead of starting a second dispatch ──────────
    const second = await raiseSOS(a);
    check(second?.alertId === alertId, 'repeat press merged into the same alert');

    // ── 4. A different guest cannot touch that alert ───────────────────────
    const guestB = await connectGuest();
    b = guestB.socket;
    b.emit('emergency:cancel', { alertId });
    b.emit('sos:location_update', { alertId, latitude: 1.0, longitude: 1.0 });
    await sleep(1500);
    const afterB = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
    check(afterB?.status === 'ACTIVE', 'another guest cannot cancel your alert');
    check(afterB?.latitude !== 1.0, 'another guest cannot move your alert');

    // ── 5. Guest is not silently an admin or vendor ────────────────────────
    a.emit('emergency:resolve', { alertId });
    a.emit('emergency:acknowledge', { alertId });
    a.emit('vendor:accept', { alertId });
    await sleep(1500);
    const afterPriv = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
    check(afterPriv?.status === 'ACTIVE', 'guest cannot resolve/acknowledge/accept');
    check(!afterPriv?.assignedVendorId, 'guest cannot assign themselves as vendor');

    // ── 6. A guest CAN manage their own alert ──────────────────────────────
    a.emit('sos:location_update', { alertId, latitude: ORIGIN.lat + 0.01, longitude: ORIGIN.lon });
    await sleep(1500);
    const moved = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
    check(Math.abs(moved.latitude - (ORIGIN.lat + 0.01)) < 1e-6, 'guest can stream their own location');

    const cancelled = await new Promise<boolean>(resolve => {
      const timer = setTimeout(() => resolve(false), 5000);
      a!.once('emergency:cancel_confirmed', () => { clearTimeout(timer); resolve(true); });
      a!.emit('emergency:cancel', { alertId });
    });
    check(cancelled, 'guest can cancel their own alert');
  } finally {
    a?.disconnect();
    b?.disconnect();
    for (const id of created) {
      await (prisma as any).sosDispatchLog.deleteMany({ where: { alertId: id } }).catch(() => {});
      await (prisma as any).emergencyAlert.delete({ where: { id } }).catch(() => {});
    }
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(err => { console.error('harness error:', err); process.exit(1); });
