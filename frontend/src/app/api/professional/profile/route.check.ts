// Self-check for the professional profile.
//   npx tsx --env-file=.env.local src/app/api/professional/profile/route.check.ts
//
// Settings kept languages, specialties and the rate in useState, so every
// professional saw the same defaults and nothing they changed reached the
// directory clients search. The property under test is that an edit here shows
// up there, and that the fields a professional must not set themselves stay
// locked.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };
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
const H = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

async function main() {
  const [p, u] = await Promise.all([login(PRO), login(USER)]);

  // Restore whatever is there now, so the check does not change real settings.
  const before = await prisma.professional.findUnique({ where: { userId: p.id } });
  assert.ok(before, 'panelpro must have a professional profile');

  try {
    const got = await (await fetch(`${BASE}/api/professional/profile`, { headers: H(p.token) })).json();
    check(got.success, 'a professional can read their own profile');

    const denied = await (await fetch(`${BASE}/api/professional/profile`, { headers: H(u.token) })).json();
    check(denied.success === false, 'a client has no professional profile to read', denied.error);

    // ── An edit must reach the directory clients actually search ────────────
    const marker = `CheckSpecialty${Date.now()}`;
    const saved = await (await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token),
      body: JSON.stringify({ specializations: [marker], languages: ['English', 'Hindi'], hourlyRate: 1234 }),
    })).json();
    check(saved.success, 'the profile saves', saved.error);

    const dir = await (await fetch(`${BASE}/api/professionals`, { headers: H(u.token) })).json();
    const mine = dir.data.find((x: any) => x.userId === p.id);
    check(mine?.specializations?.includes(marker), 'the edit appears in the client-facing directory');
    check(mine?.hourlyRate === 1234, 'the rate is what clients see', String(mine?.hourlyRate));
    check(mine?.languages?.includes('Hindi'), 'languages carry through to matching');

    // ── Cleaning ────────────────────────────────────────────────────────────
    const messy = await (await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token),
      body: JSON.stringify({ specializations: ['  Anxiety  ', 'Anxiety', '', '   ', 'Burnout'] }),
    })).json();
    check(
      messy.success && messy.data.specializations.length === 2 &&
      messy.data.specializations.includes('Anxiety') && messy.data.specializations.includes('Burnout'),
      'blanks are dropped and duplicates collapsed',
      JSON.stringify(messy.data?.specializations)
    );

    // ── Validation ──────────────────────────────────────────────────────────
    const negative = await (await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token), body: JSON.stringify({ hourlyRate: -5 }),
    })).json();
    check(negative.success === false, 'a negative rate is refused', negative.error);

    const noLang = await (await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token), body: JSON.stringify({ languages: [] }),
    })).json();
    check(noLang.success === false, 'clearing every language is refused', noLang.error);

    const badMode = await (await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token), body: JSON.stringify({ sessionModes: ['Telepathy'] }),
    })).json();
    check(badMode.success === false, 'an unknown session mode is refused');

    // ── Fields that must not be self-set ────────────────────────────────────
    await fetch(`${BASE}/api/professional/profile`, {
      method: 'PATCH', headers: H(p.token),
      body: JSON.stringify({ verificationStatus: 'VERIFIED', averageRating: 5, totalSessions: 999 }),
    });
    const after = await prisma.professional.findUnique({ where: { userId: p.id } });
    check(after?.averageRating === before.averageRating, 'a professional cannot set their own rating');
    check(after?.totalSessions === before.totalSessions, 'nor their session count');

    check((await fetch(`${BASE}/api/professional/profile`)).status === 401, 'unauthenticated callers are rejected');
  } finally {
    // Put the real settings back exactly as they were.
    await prisma.professional.update({
      where: { id: before.id },
      data: {
        specializations: before.specializations,
        languages: before.languages,
        hourlyRate: before.hourlyRate,
        sessionModes: before.sessionModes,
      },
    }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
