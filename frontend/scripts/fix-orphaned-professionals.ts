/**
 * One-off: remove Professional rows whose account no longer exists, then make
 * the column a real foreign key so it cannot happen again.
 *
 * Professional.userId was a plain String with no relation, so deleting a user
 * left their profile behind — still VERIFIED, still isAcceptingClients, still
 * served by GET /api/professionals. 45 of 46 rows in this database were such
 * ghosts, and a client could book one: the booking succeeded, sat in their
 * dashboard as a real upcoming session, and nobody would ever have arrived.
 *
 * Done in SQL rather than `prisma db push --accept-data-loss` because that flag
 * asks for blanket permission to destroy data. This deletes exactly the rows it
 * reports and nothing else, and is a no-op on a second run.
 *
 *   npx tsx --env-file=.env.local scripts/fix-orphaned-professionals.ts
 *   npx tsx --env-file=.env.local scripts/fix-orphaned-professionals.ts --apply
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const APPLY = process.argv.includes('--apply');

async function main() {
  const all = await prisma.professional.findMany({ select: { id: true, userId: true } });
  const liveUserIds = new Set(
    (await prisma.user.findMany({
      where: { id: { in: all.map(p => p.userId) } },
      select: { id: true },
    })).map(u => u.id)
  );

  const orphanIds = all.filter(p => !liveUserIds.has(p.userId)).map(p => p.id);
  console.log(`Professional rows: ${all.length}`);
  console.log(`orphaned (no account behind them): ${orphanIds.length}`);

  if (orphanIds.length) {
    // Anything hanging off a ghost is itself unusable — a booking nobody will
    // attend, a review of a session that cannot have happened.
    const counts = {
      bookings: await prisma.booking.count({ where: { professionalId: { in: orphanIds } } }),
      reviews: await prisma.review.count({ where: { professionalId: { in: orphanIds } } }),
      availability: await prisma.professionalAvailability.count({ where: { professionalId: { in: orphanIds } } }),
      care: await prisma.careRelationship.count({ where: { professionalId: { in: orphanIds } } }),
    };
    console.log('rows hanging off them:', counts);
  }

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to delete the rows listed above.');
    return;
  }

  if (orphanIds.length) {
    // Order matters: dependents before the row they point at.
    const b = await prisma.booking.deleteMany({ where: { professionalId: { in: orphanIds } } });
    const r = await prisma.review.deleteMany({ where: { professionalId: { in: orphanIds } } });
    const a = await prisma.professionalAvailability.deleteMany({ where: { professionalId: { in: orphanIds } } });
    const c = await prisma.careRelationship.deleteMany({ where: { professionalId: { in: orphanIds } } });
    const p = await prisma.professional.deleteMany({ where: { id: { in: orphanIds } } });
    console.log(`deleted — bookings:${b.count} reviews:${r.count} availability:${a.count} care:${c.count} professionals:${p.count}`);
  }

  // The constraint that stops this recurring. ON DELETE CASCADE means removing
  // an account removes the profile with it, instead of stranding it.
  const [{ exists }] = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
    `SELECT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'Professional_userId_fkey'
     ) AS exists`
  );

  if (exists) {
    console.log('foreign key already present — nothing to add');
  } else {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Professional"
         ADD CONSTRAINT "Professional_userId_fkey"
         FOREIGN KEY ("userId") REFERENCES "User"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`
    );
    console.log('added Professional_userId_fkey with ON DELETE CASCADE');
  }

  const remaining = await prisma.professional.count();
  console.log(`Professional rows now: ${remaining}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
