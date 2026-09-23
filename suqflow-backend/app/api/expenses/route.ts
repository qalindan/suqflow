import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, category, description, title } = body 

    // Allow description or title (mapping to the title field on the model)
    const expenseTitle = title || description

    if (!amount || amount <= 0 || !category || !expenseTitle) {
      return NextResponse.json({ error: 'Invalid payload: amount, category, and description are required' }, { status: 400 })
    }

    // 1. Get active WorkSession for this cashier
    const activeSession = await prisma.workSession.findFirst({
      where: { cashier_id: userId, logout_time: null },
      orderBy: { login_time: 'desc' }
    })

    if (!activeSession) {
      return NextResponse.json({ error: 'No active work session found to deduct expenses from' }, { status: 400 })
    }

    // 2. Start transaction to deduct till and create expense atomically
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from active till
      await tx.workSession.update({
        where: { id: activeSession.id },
        data: { current_balance: activeSession.current_balance - amount }
      })

      // Create Expense record
      const expense = await tx.expense.create({
        data: {
          title: expenseTitle,
          amount,
          category,
          user_id: userId,
          work_session_id: activeSession.id
        }
      })

      return expense
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Expense logging error:', error)
    return NextResponse.json({ error: 'Internal server error while logging expense' }, { status: 500 })
  }
}
