// Database Connection Singleton
// Prevents multiple Prisma Client instances in development
// Prisma v7 requires a Driver Adapter for PostgreSQL connections

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// V-03 FIX: Removed hardcoded database credentials.
// IIFE ensures TypeScript infers the type as `string` (not `string | undefined`).
const DATABASE_URL: string = (() => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'FATAL: DATABASE_URL environment variable is not set. ' +
      'Add it to .env.local before starting the server.'
    );
  }
  return url;
})();

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
