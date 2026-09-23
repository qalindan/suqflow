import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    const userId = req.headers.get('x-user-id')
    
    if (role !== 'OWNER' || !userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { productId, quantityRestocked, unitCost, paymentMethod, supplierName } = body

    if (!productId || !quantityRestocked || !unitCost || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch existing product
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // TC-SUQ-WEB-001 (Unit validation during restock)
    if (['Piece', 'Pack'].includes(product.uom) && !Number.isInteger(quantityRestocked)) {
      return NextResponse.json({ error: 'Restock quantity must be a whole number for Pieces/Packs' }, { status: 400 })
    }

    const totalCost = quantityRestocked * unitCost
    
    // Check for Margin Variance
    const marginWarning = unitCost > product.wholesale_cost

    // Execute Atomic Transaction for TC-SUQ-WEB-003
    await prisma.$transaction(async (tx) => {
      // 1. Update Product Stock and Cost
      await tx.product.update({
        where: { id: productId },
        data: {
          current_stock: { increment: quantityRestocked },
          wholesale_cost: unitCost, // Update to the latest cost
        }
      })

      // 2. Conditionally Route Financial Log
      if (paymentMethod === 'SUPPLIER_CREDIT') {
        await tx.supplierDebt.create({
          data: {
            supplier: supplierName || 'General Supplier',
            amount: totalCost,
            user_id: userId
          }
        })
      } else {
        // Cash or Bank Transfer
        await tx.expense.create({
          data: {
            title: `Restock: ${product.name}`,
            category: 'Restocking Expense',
            amount: totalCost,
            user_id: userId
          }
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Procurement processed successfully',
      marginWarning 
    }, { status: 200 })

  } catch (error) {
    console.error('Procurement POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
