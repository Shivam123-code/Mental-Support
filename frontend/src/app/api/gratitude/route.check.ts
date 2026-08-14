// Self-check for the gratitude wall.
//   npx tsx --env-file=.env.local src/app/api/gratitude/route.check.ts
//
// The wall is public and anyone signed in can write to it, so the properties
// that matter are that nothing reaches it unreviewed, that an anonymous note
// carries no identity anywhere in the payload, and that the author can still
// see their own note while it waits.

import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };

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
const JH = (t: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${t}` });

const post = (token: string, body: any) =>
  fetch(`${BASE}/api/gratitude`, { method: 'POST', headers: JH(token), body: JSON.stringify(body) });

async function main() {
  const [user, pro] = await Promise.all([login(USER), login(PRO)]);
  const postIds: string[] = [];

  try {
    // ── Writing needs an account ────────────────────────────────────────────
    const anon = await fetch(`${BASE}/api/gratitude`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'should not work' }),
    });
    check(anon.status === 401, 'posting without an account is rejected', `got ${anon.status}`);

    // ── Length bounds ───────────────────────────────────────────────────────
    check((await post(user.token, { content: 'hi' })).status === 400, 'a one-word note is refused');
    check((await post(user.token, { content: 'x'.repeat(501) })).status === 400, 'an over-long note is refused');
    check((await post(user.token, { content: '   ' })).status === 400, 'whitespace alone is refused');

    // ── A real post waits for review ────────────────────────────────────────
    const text = `Grateful for this check ${Date.now()}`;
    const created = await (await post(user.token, { content: text })).json();
    check(created.success, 'a note can be posted', created.error);
    postIds.push(created.data.id);
    check(created.data.pending === true, 'it starts as pending');

    const row = await prisma.communityPost.findUnique({ where: { id: created.data.id } });
    check(row?.isModerated === false, 'it is not published yet');
    check(row?.type === 'GRATITUDE', 'it is filed as a gratitude post');

    const publicWall = await (await fetch(`${BASE}/api/gratitude`)).json();
    check(publicWall.success, 'the wall reads without an account', publicWall.error);
    check(!publicWall.data.items.some((i: any) => i.content === text),
      'an unreviewed note does not appear publicly');

    const own = await (await fetch(`${BASE}/api/gratitude?mine=1`, { headers: JH(user.token) })).json();
    check(own.data.items.some((i: any) => i.id === created.data.id),
      'but the author can see their own while it waits');

    const notMine = await (await fetch(`${BASE}/api/gratitude?mine=1`, { headers: JH(pro.token) })).json();
    check(!notMine.data.items.some((i: any) => i.id === created.data.id),
      'another account does not see it in theirs');

    // ── Once approved ───────────────────────────────────────────────────────
    await prisma.communityPost.update({ where: { id: created.data.id }, data: { isModerated: true } });
    const afterApproval = await (await fetch(`${BASE}/api/gratitude`)).json();
    const shown = afterApproval.data.items.find((i: any) => i.content === text);
    check(!!shown, 'an approved note appears on the wall');
    check(shown?.author !== 'Anonymous' && !!shown?.author, 'it carries a name', shown?.author);
    check(!/@/.test(shown?.author ?? ''), 'the name is not an email address', shown?.author);

    // ── Anonymity ───────────────────────────────────────────────────────────
    const secretText = `Anonymous check ${Date.now()}`;
    const secret = await (await post(user.token, { content: secretText, isAnonymous: true })).json();
    postIds.push(secret.data.id);
    await prisma.communityPost.update({ where: { id: secret.data.id }, data: { isModerated: true } });

    const wall = await (await fetch(`${BASE}/api/gratitude`)).json();
    const hidden = wall.data.items.find((i: any) => i.content === secretText);
    check(hidden?.author === 'Anonymous', 'an anonymous note shows no name', hidden?.author);
    // The whole payload, not just the author field — an id leaking through any
    // other key is the same disclosure.
    check(!JSON.stringify(wall.data.items).includes(user.id),
      'no author id appears anywhere in the public payload');

    // ── Pagination ──────────────────────────────────────────────────────────
    const paged = await (await fetch(`${BASE}/api/gratitude?limit=1`)).json();
    check(paged.data.items.length === 1, 'the limit is respected');
    check(paged.data.nextCursor !== undefined, 'a cursor is returned for the next page');
  } finally {
    await prisma.communityPost.deleteMany({ where: { id: { in: postIds } } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
