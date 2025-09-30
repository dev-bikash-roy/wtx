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
  
  // Define protected routes
  const protectedPaths = [
    '/dashboard',
    '/dashboard/',
    '/dashboard/posts',
    '/dashboard/submit-post',
    '/dashboard/edit-profile',
    '/dashboard/billing-address',
    '/dashboard/subscription',
    '/admin',
    '/admin/',
    '/admin/posts',
    '/admin/categories',
    '/admin/users',
    '/admin/settings'
  ]
  
  // Check if the current path is protected
  const isProtectedRoute = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
  
  console.log('Is protected route:', isProtectedRoute)
  
  // For protected routes, check if user is authenticated
  if (isProtectedRoute) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth-token')?.value
    console.log('Auth token from cookie:', authToken)
    
    if (!authToken) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log('Redirecting to login')
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // For all other routes, continue with normal processing
  console.log('Continuing with request')
  return NextResponse.next()
}