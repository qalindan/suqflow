import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, pin_code, user_id } = body

    // 1. OWNER LOGIN (Email & Password)
    if (email && password) {
      const user = await prisma.user.findUnique({ where: { email } })
      
      if (!user || user.role !== 'OWNER' || !user.password_hash) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = await encrypt({ userId: user.id, role: user.role, fullName: user.full_name })
      const cookieStore = await cookies()
      
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      })

      return NextResponse.json({ success: true, role: user.role })
    } 
    
    // 2. CASHIER POS LOGIN (User ID & PIN)
    if (user_id && pin_code) {
      // The mobile app sends the cashier's name as user_id. We need to find by full_name.
      const user = await prisma.user.findFirst({ 
        where: { 
          full_name: { equals: user_id, mode: 'insensitive' },
          role: 'CASHIER'
        } 
      })
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check lockout status
      const recentAttempts = await prisma.loginAttempt.findMany({
        where: {
          user_id: user.id,
          created_at: {
            gte: new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000)
          }
        },
        orderBy: { created_at: 'desc' }
      })

      let consecutiveFails = 0
      for (const attempt of recentAttempts) {
        if (attempt.success) break
        consecutiveFails++
      }
      
      if (consecutiveFails >= MAX_ATTEMPTS) {
        return NextResponse.json({ error: 'Account locked due to too many failed attempts' }, { status: 429 })
      }

      // Verify PIN strictly with plaintext match per owner requirements
      if (pin_code !== user.pin_code) {
        await prisma.loginAttempt.create({
          data: { user_id: user.id, success: false }
        })
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
      }

      // Log success attempt
      await prisma.loginAttempt.create({
        data: { user_id: user.id, success: true }
      })

      const token = await encrypt({ userId: user.id, role: user.role, fullName: user.full_name })
      const cookieStore = await cookies()
      
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      })

      // Ensure the cashier has an active work session
      const activeSession = await prisma.workSession.findFirst({
        where: { cashier_id: user.id, logout_time: null }
      })

      if (!activeSession) {
        await prisma.workSession.create({
          data: {
            cashier_id: user.id,
            opening_balance: 0,
            current_balance: 0
          }
        })
      }
      
      return NextResponse.json({ success: true, role: user.role, token })
    }

    return NextResponse.json({ error: 'Invalid login payload' }, { status: 400 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}