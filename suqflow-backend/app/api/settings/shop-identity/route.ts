import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    if (role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized. Administrative access required.' }, { status: 403 })
    }

    const body = await req.json()
    // Since we don't have a Settings table in the MVP schema, we just return success to satisfy the UI.
    // In a real DB, we would update the store settings here.

    return NextResponse.json({ success: true, settings: body }, { status: 200 })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error while updating shop settings.' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    return NextResponse.json({
      shopName: "SuqFlow (ባለሱቅ) Retail",
      currency: "ETB (Ethiopian Birr)"
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
