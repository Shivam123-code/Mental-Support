import path from 'node:path';
import { defineConfig } from 'prisma/config';

// No hardcoded fallback — a missing DATABASE_URL must fail loudly rather than
// silently connect using a credential committed to the repo.
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to frontend/.env.local.');
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: DATABASE_URL,
  },
});
