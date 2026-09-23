import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized. Administrative access required.' }, { status: 403 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Cashier ID is missing or invalid' }, { status: 400 })
    }
    const body = await req.json()
    const { pin } = body

    if (!pin) {
      return NextResponse.json({ error: 'New PIN is required.' }, { status: 400 })
    }
    
    // Check if cashier exists
    const cashier = await prisma.user.findUnique({ where: { id } })
    if (!cashier || cashier.role !== 'CASHIER') {
      return NextResponse.json({ error: 'Cashier not found.' }, { status: 404 })
    }

    // Update the cashier's PIN in plaintext
    await prisma.user.update({
      where: { id },
      data: { pin_code: pin }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Update pin error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error while updating PIN.' }, { status: 500 })
  }
}
