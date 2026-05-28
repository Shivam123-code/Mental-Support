import path from 'node:path';
import { defineConfig } from 'prisma/config';

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://postgres:kleverklues2024@localhost:5432/kleverklues?schema=public';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: DATABASE_URL,
  },
});
