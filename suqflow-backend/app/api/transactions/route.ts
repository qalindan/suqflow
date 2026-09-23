import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    // Multi-variant Filters
    const filterType = searchParams.get('type') // 'SALE', 'EXPENSE', 'SETTLEMENT'
    const filterCashier = searchParams.get('cashier_id')
    const filterStartDate = searchParams.get('start_date')
    const filterEndDate = searchParams.get('end_date')

    const userId = req.headers.get('x-user-id')
    const role = req.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // RBAC: Cashiers can only view their own activity, Owners can view globally or filter
    const cashierFilter = role === 'CASHIER' ? userId : (filterCashier || undefined)

    let dateFilter = {}
    if (filterStartDate && filterEndDate) {
      dateFilter = {
        created_at: {
          gte: new Date(filterStartDate),
          lte: new Date(filterEndDate)
        }
      }
    }

    let allLedgerItems: any[] = []

    // 1. Fetch Transactions (Sales & Settlements)
    if (!filterType || filterType === 'SALE' || filterType === 'SETTLEMENT') {
      const transactions = await prisma.transaction.findMany({
        where: {
          user_id: cashierFilter,
          ...dateFilter,
          // Sales have a work_session_id, Settlements typically do not (based on our schema isolation rule)
          ...(filterType === 'SALE' ? { work_session_id: { not: null } } : {}),
          ...(filterType === 'SETTLEMENT' ? { work_session_id: null } : {})
        },
        include: {
          user: { select: { full_name: true } },
          customer: { select: { name: true } },
          items: true
        }
      })

      // Map Transactions to generic Ledger Item
      const txItems = transactions.map(t => ({
        id: t.id,
        date: t.created_at,
        type: t.work_session_id ? 'SALE' : 'SETTLEMENT',
        amount: t.total_amount,
        payment_method: t.payment_method,
        cashier: t.user.full_name,
        details: t.customer ? `Customer: ${t.customer.name}` : `Retail Sale`,
        work_session_id: t.work_session_id
      }))

      allLedgerItems = allLedgerItems.concat(txItems)
    }

    // 2. Fetch Expenses
    if (!filterType || filterType === 'EXPENSE') {
      const expenses = await prisma.expense.findMany({
        where: {
          user_id: cashierFilter,
          ...dateFilter
        },
        include: {
          user: { select: { full_name: true } }
        }
      })

      // Map Expenses to generic Ledger Item
      const exItems = expenses.map(e => ({
        id: e.id,
        date: e.created_at,
        type: 'EXPENSE',
        amount: -e.amount, // Negated for logical ledger flow
        payment_method: 'CASH', // Expenses are typically deducted from cash till
        cashier: e.user.full_name,
        details: `Category: ${e.category} | ${e.title}`,
        work_session_id: e.work_session_id
      }))

      allLedgerItems = allLedgerItems.concat(exItems)
    }

    // 3. Sort Chronologically & Apply Pagination in Memory
    allLedgerItems.sort((a, b) => b.date.getTime() - a.date.getTime())

    const totalCount = allLedgerItems.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = allLedgerItems.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedItems,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Ledger fetch error:', error)
    return NextResponse.json({ error: 'Internal server error while fetching ledger' }, { status: 500 })
  }
}
