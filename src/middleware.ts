import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Skip middleware for static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request: NextRequest) {
  // For all other routes, continue with normal processing
  return NextResponse.next()
}