/**
 * What happens when a caller's token is no longer good.
 *
 *   1. terminal A:  npm run dev
 *   2. terminal B:  npx tsx src/auth-failure.e2e.ts
 *
 * The old behaviour was to console.error and carry on: socket.io reconnected
 * forever, replaying the dead token, each attempt costing a JWT verify and a
 * user lookup. One stale tab did that every few seconds indefinitely — a
 * thousand of them is a self-inflicted load test. Two properties are asserted
 * here: a rejected credential is never replayed, and the caller degrades to a
 * guest session rather than losing SOS entirely.
 */
require('dotenv').config();

import { io as ioClient, Socket } from 'socket.io-client';
import jwt from 'jsonwebtoken';

const URL = process.env.SOCKET_URL || 'http://localhost:3001';
const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error('JWT_SECRET missing');

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let failures = 0;
function check(ok: boolean, label: string, detail = '') {
  console.log(`${ok ? '  ✅' : '  ❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

const EXPIRED = jwt.sign({ userId: 'nobody', email: 'x@y.z', role: 'USER' }, SECRET, { expiresIn: -60 });
const FORGED = jwt.sign({ userId: 'nobody', email: 'x@y.z', role: 'USER' }, 'not-the-real-secret');

/** Mirrors the client: present a token, fall back to guest once if refused. */
function connectWithFallback(token: string): Promise<{ results: any[]; socket: Socket }> {
  return new Promise((resolve, reject) => {
    const s = ioClient(URL, { transports: ['websocket'], forceNew: true });
    const results: any[] = [];
    let credential: string | undefined = token;
    let downgraded = false;
    const done = setTimeout(() => resolve({ results, socket: s }), 6000);

    s.on('connect', () => s.emit('authenticate', credential ? { token: credential } : {}));
    s.on('authenticated', (res: any) => {
      results.push(res);
      if (res.success) { clearTimeout(done); resolve({ results, socket: s }); return; }
      if (credential && !downgraded) {
        downgraded = true;
        credential = undefined;
        s.emit('authenticate', {});
      }
    });
    s.on('connect_error', e => { clearTimeout(done); reject(e); });
  });
}

async function main() {
  const sockets: Socket[] = [];
  try {
    for (const [label, token] of [['expired', EXPIRED], ['forged', FORGED]] as const) {
      const { results, socket } = await connectWithFallback(token);
      sockets.push(socket);
      check(results[0]?.success === false, `${label} token is refused`, results[0]?.error);
      check(results[1]?.success === true && results[1]?.guest === true,
        `${label} token degrades to a guest session, not a dead connection`);
    }

    // Attempt cap: a client that keeps trying is cut off rather than allowed to
    // drive an unbounded number of verifies and DB lookups.
    const spam = ioClient(URL, { transports: ['websocket'], forceNew: true, reconnection: false });
    sockets.push(spam);
    const replies: any[] = [];
    let disconnected = false;
    spam.on('authenticated', (r: any) => replies.push(r));
    spam.on('disconnect', () => { disconnected = true; });
    await new Promise<void>(r => spam.on('connect', () => r()));
    for (let i = 0; i < 6; i++) { spam.emit('authenticate', { token: FORGED }); await sleep(120); }
    await sleep(1500);

    check(disconnected, 'a socket spamming authenticate is disconnected');
    check(
      replies.some(r => r.error === 'Too many authentication attempts'),
      'server names the reason before cutting it off',
      `${replies.length} replies`
    );
    check(replies.length <= 5, 'server stopped answering rather than verifying forever',
      `${replies.length} replies for 6 attempts`);
  } finally {
    sockets.forEach(s => s.disconnect());
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error('harness error:', e); process.exit(1); });
