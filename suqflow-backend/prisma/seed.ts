import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting DB Seed...')

  // 1. Create Owner and Cashier
  const owner = await prisma.user.create({
    data: {
      full_name: 'Kalkidan Binyam',
      pin_code: '1234', // In a real app, ensure this is hashed securely
      role: Role.OWNER,
    },
  })

  const cashier = await prisma.user.create({
    data: {
      full_name: 'Test Cashier',
      pin_code: '0000',
      role: Role.CASHIER,
    },
  })

  console.log(`Created Users: ${owner.full_name} and ${cashier.full_name}`)

  // 2. Create Sample Products
  const teff = await prisma.product.create({
    data: {
      name: 'Teff (Magna)',
      category: 'Grains',
      uom: 'Kg',
      wholesale_cost: 110.0,
      retail_price: 130.0,
      current_stock: 50.5, // Fractional stock
    },
  })

  const oil = await prisma.product.create({
    data: {
      name: 'Cooking Oil (Hatice)',
      category: 'Oils',
      uom: 'Liters',
      wholesale_cost: 850.0,
      retail_price: 950.0,
      current_stock: 12.0,
    },
  })

  const coffee = await prisma.product.create({
    data: {
      name: 'Coffee (Yirgacheffe)',
      category: 'Beverages',
      uom: 'Pack',
      wholesale_cost: 350.0,
      retail_price: 450.0,
      current_stock: 24.0,
    },
  })

  console.log('Created Sample Products (Teff, Cooking Oil, Coffee)')

  // 3. Create Sample Customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Abebe Kebede',
      phone: '0911234567',
      debt_balance: 0.0, // Initial zero debt balance
    },
  })

  console.log(`Created Customer: ${customer.name}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
