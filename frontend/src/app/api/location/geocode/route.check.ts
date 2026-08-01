// Self-check for the geocode proxy. Run against a live dev server:
//   npx tsx src/app/api/location/geocode/route.check.ts
//
// Guards the two things that actually break silently: the CSP fix only works
// if this route stays reachable WITHOUT a bearer token (it is in proxy.ts's
// public allowlist), and coordinate validation must reject a missing param
// rather than resolving it to Null Island.

import assert from 'node:assert';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const get = (qs: string) => fetch(`${BASE}/api/location/geocode${qs}`);

const checks: [string, () => Promise<void>][] = [
  ['reachable without a bearer token (proxy.ts allowlist)', async () => {
    const res = await get('?lat=24.7881&lon=85.0197');
    assert.notStrictEqual(res.status, 401, 'route fell out of PUBLIC_API_ROUTES in src/proxy.ts');
    assert.strictEqual(res.status, 200);
  }],

  ['reverse geocode returns a human label', async () => {
    const data = await (await get('?lat=24.7881&lon=85.0197')).json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.label === 'string' && data.label.length > 0);
  }],

  ['forward geocode returns coordinates', async () => {
    const data = await (await get('?q=Gaya%20Bihar')).json();
    assert.strictEqual(data.success, true);
    assert.ok(Number.isFinite(data.latitude) && Number.isFinite(data.longitude));
  }],

  ['missing params are rejected, not read as 0,0', async () => {
    const res = await get('');
    assert.strictEqual(res.status, 400, 'Number(null) === 0 leaked through as Null Island');
    const lonOnly = await get('?lon=85.0197');
    assert.strictEqual(lonOnly.status, 400);
  }],

  ['out-of-range coordinates are rejected', async () => {
    assert.strictEqual((await get('?lat=999&lon=0')).status, 400);
    assert.strictEqual((await get('?lat=0&lon=999')).status, 400);
  }],

  ['unresolvable address 404s', async () => {
    assert.strictEqual((await get('?q=zzzzqqqxxnotaplace12345')).status, 404);
  }],
];

async function main() {
  let failed = 0;
  for (const [name, fn] of checks) {
    try {
      await fn();
      console.log(`  ok  ${name}`);
    } catch (err) {
      failed++;
      console.error(`FAIL  ${name}\n      ${(err as Error).message}`);
    }
  }
  console.log(failed ? `\n${failed} check(s) failed` : `\nall ${checks.length} checks passed`);
  process.exit(failed ? 1 : 0);
}

main();
