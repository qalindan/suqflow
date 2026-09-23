import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        debt_balance: true
      }
    })
    return NextResponse.json(customers, { status: 200 })
  } catch (error) {
    console.error('Fetch customers error:', error)
    return NextResponse.json({ error: 'Internal server error while fetching customers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        debt_balance: 0.0
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ error: 'Internal server error while creating customer' }, { status: 500 })
  }
}
