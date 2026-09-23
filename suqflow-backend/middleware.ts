import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-role')
    return response
  }

  // Allow public access to auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Retrieve session token
  const sessionCookie = request.cookies.get('session')
  const sessionToken = sessionCookie?.value

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the JWT token using jose
  const payload = await decrypt(sessionToken)

  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // RBAC Protection: Explicitly allow Cashier routes, default-deny the rest
  const cashierAllowedRoutes = [
    '/api/checkout',
    '/api/session',
    '/api/transactions',
    '/api/inventory',
    '/api/categories',
    '/api/customers'
  ]

  const isAuthRoute = pathname.startsWith('/api/auth/')
  
  if (payload.role === 'CASHIER' && !isAuthRoute) {
    const isAllowedForCashier = cashierAllowedRoutes.some(route => pathname.startsWith(route))
    if (!isAllowedForCashier) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 })
    }
  }

  // Add user context to headers for backend API routes to consume
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId as string)
  requestHeaders.set('x-user-role', payload.role as string)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  // Apply middleware to all API routes
  matcher: ['/api/:path*'],
}
