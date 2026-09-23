import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    // strict RBAC: only owners get system notifications
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized. Owner access required.' }, { status: 403 })
    }

    const notifications: any[] = []

    // 1. Inventory Threshold Breaches
    const LOW_STOCK_LIMIT = 10
    const lowStockItems = await prisma.product.findMany({
      where: { current_stock: { lte: LOW_STOCK_LIMIT }, is_active: true }
    })
    
    lowStockItems.forEach(item => {
      notifications.push({
        id: `inv-${item.id}`,
        type: 'WARNING',
        title: 'Low Stock Alert',
        message: `${item.name} has dropped to ${item.current_stock} ${item.uom}.`,
        timestamp: new Date().toISOString()
      })
    })

    // 2. Unusually Large Cash Expenses
    const LARGE_EXPENSE_LIMIT = 1000 // Flag anything over 1000 Birr
    
    // Look back 24 hours
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    
    const largeExpenses = await prisma.expense.findMany({
      where: { 
        amount: { gte: LARGE_EXPENSE_LIMIT },
        created_at: { gte: yesterday }
      },
      include: { user: { select: { full_name: true } } }
    })

    largeExpenses.forEach(exp => {
      notifications.push({
        id: `exp-${exp.id}`,
        type: 'CRITICAL',
        title: 'Large Expense Flagged',
        message: `${exp.user.full_name} logged an expense of ${exp.amount} Birr for ${exp.category}.`,
        timestamp: exp.created_at.toISOString()
      })
    })
    
    // Sort all notifications so the newest appear at the top of the feed
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ notifications }, { status: 200 })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Internal server error while building notifications' }, { status: 500 })
  }
}
