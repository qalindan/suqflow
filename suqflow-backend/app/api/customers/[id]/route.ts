import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const customer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Constraint: Prevent deletion if there is an active balance
    if (customer.debt_balance > 0) {
      return NextResponse.json({ error: 'Cannot delete a customer with an active unpaid balance' }, { status: 400 })
    }

    await prisma.customer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json({ error: 'Internal server error while deleting customer' }, { status: 500 })
  }
}
