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
  const { pathname } = request.nextUrl

  // Create response with charset header
  const response = NextResponse.next()
  
  // Add charset to Content-Type header for all HTML responses
  // This is critical for passing the charset validation
  if (!pathname.startsWith('/api') && 
      !pathname.startsWith('/_next') && 
      !pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Content-Type', 'text/html; charset=utf-8')
  }

  // Skip middleware for auth pages to prevent redirect loops
  if (pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/make-admin') ||
    pathname.startsWith('/test-auth')) {
    return response
  }

  // Define admin-only routes
  const adminPaths = [
    '/admin',
    '/admin/',
    '/admin/posts',
    '/admin/categories',
    '/admin/users',
    '/admin/settings',
    '/admin/dashboard'
  ]

  // Define user protected routes (require login but not admin)
  const userProtectedPaths = [
    '/profile',
    '/dashboard'
  ]

  // Check if the current path requires admin access
  const isAdminRoute = adminPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  )

  // Check if the current path requires user login
  const isUserProtectedRoute = userProtectedPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  )

  return response
}