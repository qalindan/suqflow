const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;');
    console.log('Added column');
  } catch (e) {
    console.log('Already exists or error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
