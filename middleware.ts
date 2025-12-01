import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block debug routes in production
  if (process.env.NODE_ENV === 'production') {
    const debugRoutes = [
      '/api/debug',
      '/api/test',
      '/debug',
      '/admin-debug',
      '/debug-data',
      '/debug-players',
      '/debug-production',
      '/test-complete-system',
    ]

    const isDebugRoute = debugRoutes.some(route => pathname.startsWith(route))

    if (isDebugRoute) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/debug:path*',
    '/admin-debug:path*',
    '/test-complete-system:path*',
  ],
}
