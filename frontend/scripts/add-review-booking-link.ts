/**
 * One-off: give Review a bookingId and a unique index on it.
 *
 * Done in SQL rather than `prisma db push --accept-data-loss` because that flag
 * asks for blanket permission to destroy data, and these two statements destroy
 * nothing: adding a nullable column cannot lose rows, and adding a unique index
 * either succeeds or fails without touching anything. IF NOT EXISTS on both
 * makes a second run a no-op.
 *
 *   npx tsx --env-file=.env.local scripts/add-review-booking-link.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const before = await prisma.review.count();
  console.log(`Review rows before: ${before}`);

  await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "bookingId" TEXT`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Review_bookingId_key" ON "Review"("bookingId")`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId")`
  );

  const after = await prisma.review.count();
  console.log(`Review rows after:  ${after}`);
  if (before !== after) throw new Error('row count changed — this script must not lose data');
  console.log('done');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
