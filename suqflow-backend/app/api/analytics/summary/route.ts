import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'today'

    // Determine date range based on period
    const now = new Date()
    let startDate = new Date()
    
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0)
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else {
      // Default to today if unknown period
      startDate.setHours(0, 0, 0, 0)
    }

    const dateFilter = {
      created_at: {
        gte: startDate,
        lte: now
      }
    }

    // Run all database queries concurrently to drastically reduce network latency
    const LOW_STOCK_THRESHOLD = 10;
    
    const [revenueAgg, expenseAgg, lowStockProducts, recentTransactions] = await Promise.all([
      // 1. Total Gross Revenue
      prisma.transaction.aggregate({
        where: dateFilter,
        _sum: { total_amount: true }
      }),
      
      // 2. Total Expenses (OpEx)
      prisma.expense.aggregate({
        where: dateFilter,
        _sum: { amount: true }
      }),
      
      // 3. Low-Stock Alerts
      prisma.product.findMany({
        where: {
          current_stock: { lte: LOW_STOCK_THRESHOLD },
          is_active: true
        },
        select: {
          id: true,
          name: true,
          current_stock: true,
          uom: true
        }
      }),
      
      // 4. Recent Transactions
      prisma.transaction.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
        include: {
          user: { select: { full_name: true } },
          customer: { select: { name: true } }
        }
      })
    ]);

    const grossRevenue = revenueAgg._sum.total_amount || 0.0;
    const totalOpEx = expenseAgg._sum.amount || 0.0;
    const netProfit = grossRevenue - totalOpEx;

    return NextResponse.json({
      period,
      metrics: {
        gross_revenue: grossRevenue,
        total_opex: totalOpEx,
        net_profit: netProfit
      },
      low_stock_alerts: lowStockProducts,
      recent_transactions: recentTransactions
    }, { status: 200 })
    
  } catch (error) {
    console.error('Analytics summary error:', error)
    return NextResponse.json({ error: 'Internal server error while fetching analytics' }, { status: 500 })
  }
}
