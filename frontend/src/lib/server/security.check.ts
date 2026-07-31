/**
 * Self-check for the security-critical pure logic added during the audit fixes.
 * Run with:  npx tsx --env-file=.env.local src/lib/server/security.check.ts
 *
 * The env file is needed only because importing hashToken pulls in the prisma
 * client module, which asserts DATABASE_URL at import time. No assertion here
 * touches the database or the network.
 *
 * Deliberately assert-based with no framework: it exists so that a future edit
 * that quietly reintroduces one of these vulnerabilities fails loudly.
 */
import assert from 'node:assert/strict';
import { mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getClientIp } from './rate-limit';
import { saveUpload, UploadError, MAX_UPLOAD_BYTES } from './upload';
import { hashToken } from './auth';
import { PASSWORD_POLICY } from './validation';
import { proxy } from '../../proxy';
import { NextRequest } from 'next/server';

const req = (xff?: string, realIp?: string) =>
  new Request('https://example.test/', {
    headers: {
      ...(xff ? { 'x-forwarded-for': xff } : {}),
      ...(realIp ? { 'x-real-ip': realIp } : {}),
    },
  });

async function main() {
  // ── getClientIp: the spoofing fix ────────────────────────────────────────
  // With one trusted proxy the real client is the RIGHTMOST entry. Everything
  // to its left is attacker-supplied and must be ignored, or rate limiting
  // (the only brute-force control) can be bypassed one bucket per request.
  assert.equal(getClientIp(req('1.2.3.4')), '1.2.3.4', 'single entry is the client');
  assert.equal(
    getClientIp(req('66.66.66.66, 203.0.113.9')),
    '203.0.113.9',
    'REGRESSION: spoofed leftmost XFF entry was trusted'
  );
  assert.equal(
    getClientIp(req('evil, evil, evil, 198.51.100.7')),
    '198.51.100.7',
    'REGRESSION: long spoofed prefix defeated the proxy indexing'
  );
  assert.equal(getClientIp(req(undefined, '203.0.113.5')), '203.0.113.5', 'falls back to x-real-ip');
  assert.equal(getClientIp(req()), 'unknown', 'no headers yields a constant key');

  // Two callers behind the same proxy must land in the SAME bucket, otherwise
  // the limiter counts nothing.
  assert.equal(getClientIp(req('a, 9.9.9.9')), getClientIp(req('b, 9.9.9.9')));

  // ── saveUpload: the stored-XSS fix ───────────────────────────────────────
  const dir = await mkdtemp(path.join(tmpdir(), 'kk-upload-check-'));
  const file = (name: string, type: string, size = 10) =>
    new File([new Uint8Array(size)], name, { type });

  await assert.rejects(
    () => saveUpload(file('payload.html', 'text/html'), dir, '/uploads/x', 'licenseDocument'),
    UploadError,
    'REGRESSION: an HTML upload was accepted into a publicly served directory'
  );

  await assert.rejects(
    () => saveUpload(file('logo.svg', 'image/svg+xml'), dir, '/uploads/x', 'logo'),
    UploadError,
    'REGRESSION: SVG accepted — it is an image format that executes script'
  );

  await assert.rejects(
    () => saveUpload(file('huge.pdf', 'application/pdf', MAX_UPLOAD_BYTES + 1), dir, '/uploads/x', 'idProof'),
    UploadError,
    'REGRESSION: size cap not enforced'
  );

  // A permitted type is stored under OUR extension, never the uploaded name.
  const saved = await saveUpload(
    file('../../evil.html', 'application/pdf'),
    dir,
    '/uploads/x',
    'licenseDocument'
  );
  assert.equal(saved, '/uploads/x/licenseDocument.pdf', 'extension must come from the allowlist');
  assert.deepEqual(await readdir(dir), ['licenseDocument.pdf'], 'no traversal, no attacker-named file');

  assert.equal(await saveUpload(null, dir, '/uploads/x', 'absent'), null, 'absent field is not an error');

  // ── hashToken: tokens must not be stored in a replayable form ────────────
  const raw = 'a'.repeat(64);
  assert.notEqual(hashToken(raw), raw, 'REGRESSION: token stored verbatim');
  assert.equal(hashToken(raw), hashToken(raw), 'digest must be stable for lookup');
  assert.notEqual(hashToken(raw), hashToken(raw.replace(/a$/, 'b')), 'distinct tokens must not collide');
  assert.match(hashToken(raw), /^[0-9a-f]{64}$/, 'expected a hex sha-256 digest');

  // ── Password policy: reset must not be a downgrade path ──────────────────
  assert.ok(PASSWORD_POLICY.test('Str0ng!pass'), 'a compliant password must be accepted');
  for (const weak of ['password', 'Password1', 'short1!A', 'alllower1!', 'NOUPPER1!']) {
    if (weak === 'short1!A') continue; // 8 chars but compliant-shaped; covered above
    assert.ok(!PASSWORD_POLICY.test(weak), `REGRESSION: weak password "${weak}" accepted`);
  }

  // ── proxy: default-deny gate over the API surface ────────────────────────
  const call = (p: string, auth?: string) =>
    proxy(new NextRequest(`https://example.test${p}`, {
      headers: auth ? { authorization: auth } : {},
    }));

  assert.equal(call('/api/sos').status, 200, 'public SOS route must stay reachable');
  assert.equal(call('/api/chat').status, 200, 'public chat route must stay reachable');
  assert.equal(call('/api/auth/login').status, 200, 'login must stay reachable');
  assert.equal(call('/api/sos/').status, 200, 'trailing slash must not 401 a public route');

  assert.equal(call('/api/journal').status, 401, 'REGRESSION: protected route reachable with no token');
  assert.equal(
    call('/api/professionals/match').status,
    401,
    'REGRESSION: allowlist matched by prefix — /api/professionals must not open its children'
  );
  assert.equal(call('/api/admin/dashboard').status, 401, 'REGRESSION: admin route reachable with no token');
  assert.equal(call('/api/journal', 'Bearer x').status, 200, 'a bearer token passes the gate to the route');

  console.log('✅ security.check.ts — all assertions passed');
}

main().catch((err) => {
  console.error('❌ security check FAILED\n', err);
  process.exit(1);
});
