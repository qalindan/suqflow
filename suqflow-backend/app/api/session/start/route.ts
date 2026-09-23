import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingSession = await prisma.workSession.findFirst({
      where: { cashier_id: userId, logout_time: null }
    })

    if (existingSession) {
      return NextResponse.json({ error: 'An active work session already exists for this user', session: existingSession }, { status: 400 })
    }

    const body = await req.json()
    const { opening_balance } = body
    const balance = opening_balance ? parseFloat(opening_balance) : 0.0

    const session = await prisma.workSession.create({
      data: {
        cashier_id: userId,
        opening_balance: balance,
        current_balance: balance
      }
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Session start error:', error)
    return NextResponse.json({ error: 'Internal server error while opening session' }, { status: 500 })
  }
}
