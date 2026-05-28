require('dotenv').config({ path: '../frontend/.env.local' });
const { PrismaClient } = require('../frontend/node_modules/@prisma/client');
const { PrismaPg } = require('../frontend/node_modules/@prisma/adapter-pg');
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findFirst({ 
    select: { id: true, email: true, role: true },
    where: { role: 'USER' }
  });
  const admin = await prisma.user.findFirst({ 
    select: { id: true, email: true, role: true },
    where: { role: 'ADMIN' }
  });
  console.log('USER:', JSON.stringify(user));
  console.log('ADMIN:', JSON.stringify(admin));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
