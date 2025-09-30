import { NextResponse } from 'next/server'
import { wpAuth } from '@/lib/wordpress-auth'

export async function POST(request: Request) {
  try {
    const { email, password, siteId = 'wtxnews' } = await request.json()
    
    console.log('WordPress authentication attempt:', { email, siteId })
    
    // Try to authenticate with WordPress
    const authResult = await wpAuth.authenticateWithJWT(siteId, email, password)
    
    if (authResult.success && authResult.user && authResult.token) {
      const user = {
        id: `wp-${siteId}-${authResult.user.id}`,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.roles.includes('administrator') ? 'admin' : 'user',
        avatar: authResult.user.avatar_urls?.['96'] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        wpSiteId: siteId,
        wpUserId: authResult.user.id,
        wpToken: authResult.token
      }
      
      // Generate our session token
      const sessionToken = `wp-session-${siteId}-${authResult.user.id}-${Date.now()}`
      
      console.log('WordPress authentication successful:', { userId: user.id, role: user.role })
      
      // Return user data and token
      const response = NextResponse.json({
        user,
        token: sessionToken
      })
      
      // Set cookie
      response.cookies.set('auth-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      })
      
      return response
    } else {
      console.log('WordPress authentication failed:', authResult.error)
      return NextResponse.json(
        { error: authResult.error || 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('WordPress authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}