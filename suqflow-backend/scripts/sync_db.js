const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    console.log('Creating WorkSession table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WorkSession" (
          "id" TEXT NOT NULL,
          "cashier_id" TEXT NOT NULL,
          "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "logout_time" TIMESTAMP(3),
          "opening_balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "current_balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          CONSTRAINT "WorkSession_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log('Adding work_session_id to Transaction...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "work_session_id" TEXT;
    `);
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_work_session_id_fkey" FOREIGN KEY ("work_session_id") REFERENCES "WorkSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `);
    } catch(e) { console.log('Constraint might exist on Transaction'); }

    console.log('Adding work_session_id to Expense...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Expense" ADD COLUMN IF NOT EXISTS "work_session_id" TEXT;
    `);
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Expense" ADD CONSTRAINT "Expense_work_session_id_fkey" FOREIGN KEY ("work_session_id") REFERENCES "WorkSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `);
    } catch(e) { console.log('Constraint might exist on Expense'); }

    console.log('Done syncing schema manually!');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
