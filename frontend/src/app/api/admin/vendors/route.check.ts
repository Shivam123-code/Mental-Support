// Self-check for the admin vendor list and professional creation.
//   npx tsx --env-file=.env.local src/app/api/admin/vendors/route.check.ts
//
// Guards two things that were silently wrong: the vendor list was an unbounded
// findMany (one row per vendor, each joining a user, then one reverse-geocode
// per row in the dashboard), and admin professional creation threw on any
// realistic `specialization` because free text was written into an enum column.

import assert from 'node:assert';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const ADMIN = { email: 'admin@kleverklues.com', password: 'Admin@123' };

async function login() {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN),
  });
  const j = await r.json();
  assert.ok(j.success, `admin login failed: ${j.error}`);
  return j.data.token as string;
}

async function main() {
  const token = await login();
  const auth = { Authorization: `Bearer ${token}` };
  const created: string[] = [];
  let failures = 0;
  const check = (ok: boolean, label: string, detail = '') => {
    console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
    if (!ok) failures++;
  };

  try {
    // ── Vendor list is bounded and reports the true total ───────────────────
    const page = await (await fetch(`${BASE}/api/admin/vendors?limit=1`, { headers: auth })).json();
    check(page.success, 'vendor list responds');
    check(Array.isArray(page.data.items), 'returns items[]');
    check(page.data.items.length <= 1, 'limit is honoured', `${page.data.items.length}`);
    check(typeof page.data.total === 'number' && page.data.total >= page.data.items.length,
      'reports the real total, so truncation is visible', `total=${page.data.total}`);

    if (page.data.nextCursor) {
      const next = await (await fetch(
        `${BASE}/api/admin/vendors?limit=1&cursor=${page.data.nextCursor}`, { headers: auth })).json();
      check(next.data.items[0]?.id !== page.data.items[0]?.id,
        'cursor advances instead of replaying page one');
    }

    const capped = await (await fetch(`${BASE}/api/admin/vendors?limit=99999`, { headers: auth })).json();
    check(capped.data.items.length <= 200, 'an absurd limit is clamped, not obeyed',
      `${capped.data.items.length}`);

    // ── Professional creation with real-world specialization text ───────────
    for (const spec of ['Anxiety', 'CBT', 'Trauma & PTSD']) {
      const email = `pro-${spec.replace(/\W+/g, '')}-${Date.now()}@kleverklues.test`;
      const res = await (await fetch(`${BASE}/api/admin/create-user`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({
          role: 'PROFESSIONAL', firstName: 'Spec', lastName: 'Probe',
          email, password: 'Panel@1234', specialization: spec, licenseNumber: 'PSY-1',
        }),
      })).json();
      check(res.success === true, `specialization "${spec}" no longer throws`, res.error?.slice(0, 60));
      if (res.success) created.push(res.data.user.id);
    }

    // A real enum member must still land in `type`.
    const emailT = `pro-therapist-${Date.now()}@kleverklues.test`;
    const t = await (await fetch(`${BASE}/api/admin/create-user`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({
        role: 'PROFESSIONAL', firstName: 'Type', lastName: 'Probe',
        email: emailT, password: 'Panel@1234', specialization: 'THERAPIST',
      }),
    })).json();
    check(t.success === true, 'an actual ProfessionalType still works');
    if (t.success) created.push(t.data.user.id);
  } finally {
    for (const id of created) {
      await fetch(`${BASE}/api/admin/delete-user/${id}`, { method: 'DELETE', headers: auth }).catch(() => {});
    }
  }

  console.log(failures ? `\n${failures} check(s) failed` : `\nall checks passed`);
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
