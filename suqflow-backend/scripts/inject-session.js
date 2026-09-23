const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const session = await prisma.workSession.create({
      data: {
        cashier_id: process.env.OWNER_ID || "YOUR_OWNER_ID",
        opening_balance: 1000,
        current_balance: 1000
      }
    });
    console.log("Injected WorkSession:", session.id);
  } catch (error) {
    console.error("Failed to inject WorkSession:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
