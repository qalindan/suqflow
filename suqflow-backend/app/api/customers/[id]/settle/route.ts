import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { payment_amount } = body

    if (!payment_amount || payment_amount <= 0) {
      return NextResponse.json({ error: 'Valid payment_amount is required' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id }
      })

      if (!customer) {
        throw new Error('Customer not found')
      }

      if (customer.debt_balance < payment_amount) {
        throw new Error('Payment amount exceeds current debt balance')
      }

      // Decrement the balance
      const updatedCustomer = await tx.customer.update({
        where: { id },
        data: {
          debt_balance: customer.debt_balance - payment_amount
        }
      })

      // Create settlement transaction (isolated from active till by omitting work_session_id)
      await tx.transaction.create({
        data: {
          total_amount: payment_amount,
          payment_method: 'CASH', // Using CASH to represent physical repayment
          user_id: userId,
          customer_id: id
          // Omit work_session_id to keep financial isolation from the active cash drawer!
        }
      })

      return updatedCustomer
    }, { maxWait: 10000, timeout: 20000 })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Customer settlement error:', error)
    
    if (error.message && (error.message.includes('not found') || error.message.includes('exceeds'))) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error during settlement' }, { status: 500 })
  }
}
