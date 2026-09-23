import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'csv'
    
    // Optional date range
    const startDateStr = searchParams.get('start')
    const endDateStr = searchParams.get('end')
    
    let dateFilter = {}
    if (startDateStr && endDateStr) {
      dateFilter = {
        created_at: {
          gte: new Date(startDateStr),
          lte: new Date(endDateStr)
        }
      }
    }

    // Fetch data for the report
    const transactions = await prisma.transaction.findMany({
      where: dateFilter,
      orderBy: { created_at: 'asc' },
      include: {
        user: { select: { full_name: true } }
      }
    })

    const expenses = await prisma.expense.findMany({
      where: dateFilter,
      orderBy: { created_at: 'asc' }
    })

    // Calculate totals
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total_amount, 0)
    const totalOpEx = expenses.reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalRevenue - totalOpEx

    if (format === 'csv') {
      // Generate CSV Structure
      let csvData = 'Date,Type,Description,Amount,Cashier\n'
      
      // Append Transactions (Credits)
      transactions.forEach(t => {
        csvData += `${t.created_at.toISOString()},SALE,Payment: ${t.payment_method},${t.total_amount},${t.user.full_name}\n`
      })
      
      // Append Expenses (Debits)
      expenses.forEach(e => {
        csvData += `${e.created_at.toISOString()},EXPENSE,${e.category} - ${e.title},-${e.amount},\n`
      })

      // Append Summary Footer
      csvData += `\nSUMMARY,,,\n`
      csvData += `Gross Revenue,,,${totalRevenue}\n`
      csvData += `Total Expenses,,,${totalOpEx}\n`
      csvData += `Net Profit,,,${netProfit}\n`

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="suqflow-report.csv"'
        }
      })
    } else if (format === 'pdf') {
      // Without installing heavier external libraries like pdfkit or puppeteer in this Next.js environment, 
      // generating a true binary PDF natively is unsupported out of the box. 
      // We will throw an explicit 400 instructing the client to use CSV or build a dedicated PDF microservice.
      return NextResponse.json({
        error: 'Native PDF export requires external dependencies (e.g., pdfkit, jspdf). Please request format=csv or implement a PDF generation microservice.'
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Unsupported format requested' }, { status: 400 })

  } catch (error) {
    console.error('Export generation error:', error)
    return NextResponse.json({ error: 'Internal server error while generating report' }, { status: 500 })
  }
}
