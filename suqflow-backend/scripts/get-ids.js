const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const cashier = await prisma.user.findFirst({ where: { role: 'CASHIER' } });
  const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } });
  const product = await prisma.product.findFirst();
  
  console.log('--- DB IDs ---');
  console.log('CASHIER_ID:', cashier?.id);
  console.log('CASHIER PIN:', cashier?.pin_code);
  console.log('OWNER_ID:', owner?.id);
  console.log('PRODUCT_ID:', product?.id);
  
  await prisma.$disconnect();
}

run();
