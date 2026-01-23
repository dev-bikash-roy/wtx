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
  
  console.log('Middleware checking path:', pathname)
  
  // Skip middleware for auth pages to prevent redirect loops
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/signup') || 
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/make-admin') ||
      pathname.startsWith('/test-auth')) {
    console.log('Skipping middleware for auth page')
    return NextResponse.next()
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
  
  console.log('Is admin route:', isAdminRoute)
  console.log('Is user protected route:', isUserProtectedRoute)
  
  // For now, let's disable middleware protection and let the components handle it
  // This prevents redirect loops while Firebase auth loads
  console.log('Continuing with request - auth handled by components')
  return NextResponse.next()
}