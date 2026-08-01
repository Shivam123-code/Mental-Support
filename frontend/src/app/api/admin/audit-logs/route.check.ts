// Self-check for the admin audit trail. Needs a live dev server:
//   npx tsx --env-file=.env.local src/app/api/admin/audit-logs/route.check.ts
//
// The property under test is survival. The old trail was a React array, so it
// looked correct for the whole of a session and was gone after F5 — a test that
// only asserts "the action returned 200" would have passed against it. These
// checks re-read the record over a fresh HTTP request, the way a reload does.

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

const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

async function main() {
  const token = await login();
  let failures = 0;
  const check = (ok: boolean, label: string, detail = '') => {
    console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
    if (!ok) failures++;
  };

  // ── Requires admin ────────────────────────────────────────────────────────
  check((await fetch(`${BASE}/api/admin/audit-logs`)).status === 401,
    'audit log rejects an unauthenticated caller');

  // ── A real mutating action must leave a durable record ────────────────────
  const email = `audit-check-${Date.now()}@kleverklues.test`;
  const created = await (await fetch(`${BASE}/api/admin/create-user`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...auth(token) },
    body: JSON.stringify({ role: 'USER', firstName: 'Audit', lastName: 'Check', email, password: 'Panel@1234' }),
  })).json();
  assert.ok(created.success, `create-user failed: ${created.error}`);
  const newUserId = created.data.user.id;

  // Fresh request — nothing carried over from the call that made the change.
  const afterCreate = await (await fetch(`${BASE}/api/admin/audit-logs?limit=50`, { headers: auth(token) })).json();
  const createEntry = afterCreate.data.items.find(
    (e: any) => e.action === 'user.create' && e.resourceId === newUserId
  );
  check(!!createEntry, 'user.create survived as a durable record');
  check(createEntry?.actor?.email === ADMIN.email, 'record names the acting admin', createEntry?.actor?.name);
  check(createEntry?.metadata?.email === email, 'record carries the affected account');
  check(!!createEntry?.createdAt && new Date(createEntry.createdAt).getFullYear() > 2000,
    'record has its own timestamp, not render time');
  check(
    !JSON.stringify(createEntry?.metadata ?? {}).includes('Panel@1234'),
    'password never written into the audit record'
  );

  // ── Deletion is the action most needing a trail ───────────────────────────
  const del = await (await fetch(`${BASE}/api/admin/delete-user/${newUserId}`, {
    method: 'DELETE', headers: auth(token),
  })).json();
  assert.ok(del.success, `delete failed: ${del.error}`);

  const afterDelete = await (await fetch(`${BASE}/api/admin/audit-logs?limit=50`, { headers: auth(token) })).json();
  const delEntry = afterDelete.data.items.find(
    (e: any) => e.action === 'user.delete' && e.resourceId === newUserId
  );
  check(!!delEntry, 'user.delete survived as a durable record');
  check(delEntry?.metadata?.email === email,
    'deleted account identity captured before the row vanished', delEntry?.metadata?.email);

  // ── Pagination ────────────────────────────────────────────────────────────
  const firstPage = await (await fetch(`${BASE}/api/admin/audit-logs?limit=1`, { headers: auth(token) })).json();
  check(firstPage.data.items.length === 1, 'limit is honoured');
  if (firstPage.data.nextCursor) {
    const second = await (await fetch(
      `${BASE}/api/admin/audit-logs?limit=1&cursor=${firstPage.data.nextCursor}`, { headers: auth(token) })).json();
    check(second.data.items[0]?.id !== firstPage.data.items[0]?.id,
      'cursor advances instead of repeating the first page');
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = await (await fetch(`${BASE}/api/admin/audit-logs?action=user.delete`, { headers: auth(token) })).json();
  check(filtered.data.items.every((e: any) => e.action === 'user.delete'),
    'action filter returns only that action');

  console.log(failures ? `\n${failures} check(s) failed` : `\nall checks passed`);
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
