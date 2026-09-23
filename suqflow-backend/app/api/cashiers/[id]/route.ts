import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
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
    
    // Check if cashier exists
    const cashier = await prisma.user.findUnique({ where: { id } })
    if (!cashier || cashier.role !== 'CASHIER') {
      return NextResponse.json({ error: 'Cashier not found.' }, { status: 404 })
    }

    // Delete the cashier
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Delete cashier error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error while revoking cashier access.' }, { status: 500 })
  }
}
