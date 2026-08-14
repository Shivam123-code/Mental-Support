/**
 * Proves rooms span instances.
 *
 *   1. redis:   docker run -d --rm --name kk-redis -p 6379:6379 redis:7-alpine
 *   2. node A:  REDIS_URL=redis://localhost:6379 PORT=3001 npm run dev
 *   3. node B:  REDIS_URL=redis://localhost:6379 PORT=3002 npm run dev
 *   4. here:    npx tsx src/multi-instance.e2e.ts
 *
 * Without a shared adapter each process owns its own rooms, so an alert raised
 * on A never reaches an admin holding a socket on B and `vendor-<id>` only
 * pages vendors that happen to share a process with the caller. Silent, and
 * only visible once there is more than one box. This asserts the opposite:
 * a caller on A reaches an admin on B, and back again.
 */
require('dotenv').config();

import { io as ioClient, Socket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';

const A = process.env.NODE_A || 'http://localhost:3001';
const B = process.env.NODE_B || 'http://localhost:3002';
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

function connectAs(url: string, userId: string, email: string, role: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = ioClient(url, { transports: ['websocket'], forceNew: true });
    const t = setTimeout(() => reject(new Error(`auth timeout ${role}@${url}`)), 12_000);
    const token = jwt.sign({ userId, email, role }, SECRET, { expiresIn: '1h' });
    s.on('connect', () => s.emit('authenticate', { token }));
    s.on('authenticated', (r: any) => { clearTimeout(t); r?.success ? resolve(s) : reject(new Error(r?.error)); });
    s.on('connect_error', e => { clearTimeout(t); reject(e); });
  });
}

async function main() {
  const created: string[] = [];
  const sockets: Socket[] = [];
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN', status: 'ACTIVE' } });
    const caller = await prisma.user.findFirst({ where: { role: 'USER', status: 'ACTIVE' } });
    if (!admin || !caller) throw new Error('need an ACTIVE admin and user');

    // Deliberately opposite ends of the cluster.
    const adminSock = await connectAs(B, admin.id, admin.email, 'ADMIN');
    const callerSock = await connectAs(A, caller.id, caller.email, 'USER');
    sockets.push(adminSock, callerSock);
    check(true, 'admin authenticated on node B, caller on node A');

    const adminSaw: any[] = [];
    const callerSaw: any[] = [];
    adminSock.on('emergency:alert', a => adminSaw.push(a));
    callerSock.on('sos:status_update', u => callerSaw.push(u));

    const confirmed = await new Promise<any>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('SOS timeout')), 12_000);
      callerSock.once('emergency:confirmed', r => { clearTimeout(t); resolve(r); });
      callerSock.once('emergency:error', e => { clearTimeout(t); reject(new Error(e?.error)); });
      callerSock.emit('emergency:sos', {
        latitude: ORIGIN.lat, longitude: ORIGIN.lon, message: 'multi-instance', severity: 'CRITICAL',
      });
    });
    created.push(confirmed.alertId);

    for (let i = 0; i < 20 && adminSaw.length === 0; i++) await sleep(500);
    check(adminSaw.length > 0,
      'alert raised on node A reached the admin on node B',
      adminSaw.length ? `alert ${String(adminSaw[0].id).slice(-6)}` : 'nothing arrived');
    check(adminSaw[0]?.id === confirmed.alertId, 'it was the same alert, not a stray');

    // Reverse direction: dispatch status originates in the dispatch chain and
    // must reach the caller wherever they are connected.
    for (let i = 0; i < 20 && callerSaw.length === 0; i++) await sleep(500);
    check(callerSaw.length > 0, 'dispatch status crossed back to the caller on node A',
      callerSaw[0]?.dispatchStatus ?? 'nothing arrived');

    // Both instances should now agree on fleet size rather than each counting
    // only its own sockets.
    const token = jwt.sign({ userId: admin.id, email: admin.email, role: 'ADMIN' }, SECRET, { expiresIn: '1h' });
    const [sa, sb] = await Promise.all(
      [A, B].map(u =>
        fetch(`${u}/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json() as Promise<any>)
      )
    );
    check(sa.thisInstanceOnly === false && sb.thisInstanceOnly === false,
      'both instances report cluster-wide stats');
    check(sa.connectedClients === sb.connectedClients,
      'both instances see the same client count',
      `A=${sa.connectedClients} B=${sb.connectedClients}`);
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
