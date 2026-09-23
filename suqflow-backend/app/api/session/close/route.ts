import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Find the currently active WorkSession for this user
    const activeSession = await prisma.workSession.findFirst({
      where: { 
        cashier_id: userId, 
        logout_time: null 
      },
      orderBy: { 
        login_time: 'desc' 
      }
    })

    if (!activeSession) {
      return NextResponse.json({ error: 'No active session found' }, { status: 400 })
    }

    // 2. Update the session with a logout time
    const closedSession = await prisma.workSession.update({
      where: { 
        id: activeSession.id 
      },
      data: { 
        logout_time: new Date() 
      }
    })

    // 3. Return the closed session data, exposing current_balance for reconciliation
    return NextResponse.json(closedSession, { status: 200 })
  } catch (error) {
    console.error('Session close error:', error)
    return NextResponse.json({ error: 'Internal server error while closing session' }, { status: 500 })
  }
}
