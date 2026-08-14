// Self-check for resources and circles.
//   npx tsx --env-file=.env.local src/app/api/circles/route.check.ts
//
// Both were useState fixtures: a circle "created" on the professional dashboard
// vanished on reload, its joined count was a hardcoded number no join could
// change, and no client could ever join one. The interesting case is capacity
// under concurrent joins — a count-then-insert would let two simultaneous
// requests both take the last free place.

import assert from 'node:assert';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

async function login(who: { email: string; password: string }) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(who),
  });
  const j = await r.json();
  assert.ok(j.success, `login failed for ${who.email}: ${j.error}`);
  return j.data.token as string;
}
const auth = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

async function main() {
  const [userToken, proToken] = await Promise.all([login(USER), login(PRO)]);
  const created: { circles: string[] } = { circles: [] };

  try {
    // ── Only professionals may publish ──────────────────────────────────────
    const asUser = await (await fetch(`${BASE}/api/resources`, {
      method: 'POST', headers: auth(userToken),
      body: JSON.stringify({ title: 'x', category: 'y', type: 'z' }),
    })).json();
    check(asUser.success === false, 'a client cannot publish a resource', asUser.error);

    // ── A resource survives the request that made it ────────────────────────
    const title = `Check resource ${Date.now()}`;
    const res = await (await fetch(`${BASE}/api/resources`, {
      method: 'POST', headers: auth(proToken),
      body: JSON.stringify({ title, category: 'Boundaries', type: 'PDF Guide', url: 'https://example.com/a.pdf' }),
    })).json();
    check(res.success, 'a professional can publish a resource', res.error);

    const lib = await (await fetch(`${BASE}/api/resources`, { headers: auth(userToken) })).json();
    check(lib.data.items.some((r: any) => r.title === title), 'the client sees it in the library');
    check(lib.data.items.every((r: any) => r.author), 'each resource names its author');

    // A resource URL is rendered as a link, so a javascript: URL here would be
    // stored XSS.
    const bad = await (await fetch(`${BASE}/api/resources`, {
      method: 'POST', headers: auth(proToken),
      body: JSON.stringify({ title: 'bad', category: 'c', type: 't', url: 'javascript:alert(1)' }),
    })).json();
    check(bad.success === false, 'a non-https resource url is refused', bad.error);

    // ── Circles ─────────────────────────────────────────────────────────────
    const circle = await (await fetch(`${BASE}/api/circles`, {
      method: 'POST', headers: auth(proToken),
      body: JSON.stringify({
        title: `Check circle ${Date.now()}`, description: 'A real circle.',
        type: 'Workshop', capacity: 1, scheduleLabel: 'Wednesdays at 7:00 PM',
      }),
    })).json();
    check(circle.success, 'a professional can open a circle', circle.error);
    const circleId = circle.data.id;
    created.circles.push(circleId);

    const listed = await (await fetch(`${BASE}/api/circles`, { headers: auth(userToken) })).json();
    const seen = listed.data.items.find((c: any) => c.id === circleId);
    check(!!seen, 'the client sees the circle');
    check(seen?.joined === 0 && seen?.hasJoined === false, 'starts with a real count of zero');

    // ── Concurrency: capacity is 1, fire several joins at once ──────────────
    const attempts = await Promise.all(
      Array.from({ length: 4 }, () =>
        fetch(`${BASE}/api/circles/${circleId}/join`, { method: 'POST', headers: auth(userToken) })
          .then(r => r.json())
      )
    );
    const succeeded = attempts.filter(a => a.success).length;
    check(succeeded === 1, 'exactly one of four simultaneous joins wins', `${succeeded} succeeded`);

    const afterJoin = await (await fetch(`${BASE}/api/circles`, { headers: auth(userToken) })).json();
    const j = afterJoin.data.items.find((c: any) => c.id === circleId);
    check(j?.joined === 1, 'count never exceeds capacity', `joined=${j?.joined} capacity=${j?.capacity}`);
    check(j?.hasJoined === true, 'the member sees that they are in');
    check(j?.isFull === true, 'a full circle says so');

    // ── Leaving ─────────────────────────────────────────────────────────────
    const left = await (await fetch(`${BASE}/api/circles/${circleId}/join`, {
      method: 'DELETE', headers: auth(userToken),
    })).json();
    check(left.success && left.data.joined === 0, 'a member can leave and the place is freed');

    const leaveAgain = await (await fetch(`${BASE}/api/circles/${circleId}/join`, {
      method: 'DELETE', headers: auth(userToken),
    })).json();
    check(leaveAgain.success === false, 'leaving twice is refused');

    // ── Validation ──────────────────────────────────────────────────────────
    const noCap = await (await fetch(`${BASE}/api/circles`, {
      method: 'POST', headers: auth(proToken),
      body: JSON.stringify({ title: 't', description: 'd', capacity: 99999 }),
    })).json();
    check(noCap.success === false, 'an absurd capacity is refused');

    check((await fetch(`${BASE}/api/circles`)).status === 401, 'unauthenticated callers are rejected');
  } finally {
    // Nothing left behind in the real database.
    const { PrismaClient } = await import('@prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
    for (const id of created.circles) {
      await prisma.supportCircle.delete({ where: { id } }).catch(() => {});
    }
    await prisma.resource.deleteMany({ where: { title: { startsWith: 'Check resource ' } } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
