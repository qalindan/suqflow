const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.product.deleteMany({
      where: {
        name: 'Coca Cola 300ml Valid'
      }
    });
    console.log('Deleted product');
  } catch (e) {
    console.error('Prisma Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
