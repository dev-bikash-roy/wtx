import { NextResponse } from 'next/server'
import { wpAuth } from '@/lib/wordpress-auth'

// Mock user data for demonstration (fallback)
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin'
  }
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('Auth attempt:', { email })
    
    // First try WordPress authentication
    try {
      const wpResponse = await fetch(`${request.url.replace('/api/auth', '/api/wordpress-auth')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      if (wpResponse.ok) {
        const wpData = await wpResponse.json()
        console.log('WordPress auth successful, forwarding response')
        return NextResponse.json(wpData)
      }
    } catch (wpError) {
      console.log('WordPress auth failed, trying local auth')
    }
    
    // Fallback to local mock authentication
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      const token = `mock-jwt-token-${user.id}-${Date.now()}`
      
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      })
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  // Check if user is authenticated based on token
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')
  let cookieToken = null
  
  // Parse cookie manually since request.cookies doesn't exist
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const authCookie = cookies.find(c => c.startsWith('auth-token='))
    if (authCookie) {
      cookieToken = authCookie.split('=')[1]
    }
  }
  
  const token = authHeader?.split(' ')[1] || cookieToken
  
  console.log('Auth check:', { hasToken: !!token, tokenPrefix: token?.substring(0, 20) })
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Handle WordPress session tokens
  if (token.startsWith('wp-session-')) {
    const parts = token.split('-')
    if (parts.length >= 4) {
      const siteId = parts[2]
      const userId = parts[3]
      
      // In a real implementation, you'd verify the token with WordPress
      // For now, we'll create a mock user based on the token
      const user = {
        id: `wp-${siteId}-${userId}`,
        email: `user${userId}@${siteId}.com`,
        name: `WordPress User ${userId}`,
        role: 'admin', // Assume admin for now
        wpSiteId: siteId,
        wpUserId: parseInt(userId)
      }
      
      return NextResponse.json({ user })
    }
  }
  
  // Handle mock tokens
  if (token.startsWith('mock-jwt-token-')) {
    const userId = token.split('-')[3]
    const user = mockUsers.find(u => u.id === userId)
    
    if (user) {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })
    }
  }
  
  return NextResponse.json(
    { error: 'Invalid token' },
    { status: 401 }
  )
}