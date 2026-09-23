import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Helper for integer checking
function isInteger(value: number) {
  return Number.isInteger(value)
}

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Inventory GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, category, uom, wholesale_cost, retail_price, current_stock } = body

    if (!name || !category || !uom || wholesale_cost === undefined || retail_price === undefined || current_stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TC-SUQ-WEB-001 (Unit Validation)
    if (['Piece', 'Pack'].includes(uom) && !isInteger(current_stock)) {
      return NextResponse.json({ error: 'Piece or Pack units must be whole numbers' }, { status: 400 })
    }

    // TC-SUQ-WEB-006 (Negative Margin)
    if (retail_price < wholesale_cost) {
      return NextResponse.json({ error: 'Retail price cannot be lower than wholesale cost' }, { status: 400 })
    }

    // TC-SUQ-WEB-005 (Duplicate Product)
    const existing = await prisma.product.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: 'Product with this exact name already exists' }, { status: 409 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        uom,
        wholesale_cost,
        retail_price,
        current_stock,
        is_active: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Inventory POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { id, name, category, uom, wholesale_cost, retail_price, current_stock } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    if (uom && current_stock !== undefined) {
      if (['Piece', 'Pack'].includes(uom) && !isInteger(current_stock)) {
        return NextResponse.json({ error: 'Piece or Pack units must be whole numbers' }, { status: 400 })
      }
    }

    if (retail_price !== undefined && wholesale_cost !== undefined) {
      if (retail_price < wholesale_cost) {
        return NextResponse.json({ error: 'Retail price cannot be lower than wholesale cost' }, { status: 400 })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        uom,
        wholesale_cost,
        retail_price,
        current_stock
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Inventory PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Soft delete to avoid referential integrity trap with TransactionItem
    const product = await prisma.product.update({
      where: { id },
      data: { is_active: false }
    })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Inventory DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
