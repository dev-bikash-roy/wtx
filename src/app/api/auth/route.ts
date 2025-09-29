import { NextResponse } from 'next/server'

// Mock user data for demonstration
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
    
    // Find user in mock data
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // In a real app, you would generate a secure JWT token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`
      
      // Return user data and token with cookie
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      })
      
      // Set cookie
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  // Check if user is authenticated based on token
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // In a real app, you would verify the JWT token
  // For this demo, we'll just check if it starts with our mock prefix
  if (token.startsWith('mock-jwt-token-')) {
    // Extract user ID from token (in a real app, you'd decode the JWT)
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