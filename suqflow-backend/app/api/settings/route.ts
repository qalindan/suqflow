import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized. Administrative access required.' }, { status: 403 })
    }

    // Since we don't have a rigid 'Settings' table in this MVP schema, 
    // we return static global metadata along with active dynamic IAM data.
    const cashiers = await prisma.user.findMany({
      where: { role: 'CASHIER' },
      select: { id: true, full_name: true, email: true, pin_code: true }
    })

    const settings = {
      business_name: "SuqFlow (ባለሱቅ) Retail",
      currency: "ETB (Birr)",
      low_stock_threshold: 10,
      large_expense_flag: 1000,
      iam_cashiers: cashiers
    }

    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized. Administrative access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { action, payload } = body

    // Route specific administrative actions based on the action payload
    if (action === 'CREATE_CASHIER') {
      const { full_name, pin_code, email } = payload
      
      if (!full_name || !pin_code) {
        return NextResponse.json({ error: 'Missing fields for cashier creation' }, { status: 400 })
      }

      const newCashier = await prisma.user.create({
        data: {
          full_name,
          pin_code: pin_code, // Store in plaintext per owner request
          email: email || null,
          role: 'CASHIER'
        },
        select: { id: true, full_name: true, email: true, role: true }
      })

      return NextResponse.json({ success: true, user: newCashier }, { status: 201 })
    }

    return NextResponse.json({ error: 'Unsupported administrative action' }, { status: 400 })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error while updating settings' }, { status: 500 })
  }
}
