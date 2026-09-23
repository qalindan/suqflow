const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.product.update({ 
    where: { id: 'b8cb2431-1e29-4ee6-ae3e-22b5acd9c812' }, 
    data: { retail_price: 200 } 
  }); 
  console.log('Product price updated to 200'); 
  await prisma.$disconnect(); 
} 
run();
