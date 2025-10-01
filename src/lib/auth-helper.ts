// Authentication helper functions
export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  wpSiteId?: string
  wpUserId?: number
  wpToken?: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  error?: string
}

// Client-side authentication helper
export class AuthHelper {
  private static instance: AuthHelper
  private user: AuthUser | null = null
  private token: string | null = null

  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token')
      const storedUser = localStorage.getItem('auth-user')
      
      if (storedToken && storedUser) {
        try {
          this.token = storedToken
          this.user = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          this.clearAuth()
        }
      }
    }
  }

  static getInstance(): AuthHelper {
    if (!AuthHelper.instance) {
      AuthHelper.instance = new AuthHelper()
    }
    return AuthHelper.instance
  }

  // Login with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email })
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.user && data.token) {
        this.user = data.user
        this.token = data.token
        
        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }

        console.log('Login successful:', { userId: data.user.id, role: data.user.role })
        
        return {
          success: true,
          user: data.user,
          token: data.token
        }
      } else {
        console.log('Login failed:', data.error)
        return {
          success: false,
          error: data.error || 'Login failed'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  // Logout
  logout(): void {
    this.user = null
    this.token = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
    
    // Clear cookie by making a request to logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
      // Ignore errors for logout
    })
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.user && this.token)
  }

  // Get current user
  getUser(): AuthUser | null {
    return this.user
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.user?.role === role
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin')
  }

  // Verify token with server
  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      return false
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          this.user = data.user
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-user', JSON.stringify(data.user))
          }
          return true
        }
      }
      
      // Token is invalid, clear auth
      this.clearAuth()
      return false
    } catch (error) {
      console.error('Token verification error:', error)
      this.clearAuth()
      return false
    }
  }

  // Clear authentication data
  private clearAuth(): void {
    this.user = null
    this.token = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
  }

  // Get authorization headers for API requests
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  // Make authenticated API request
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    }

    return fetch(url, {
      ...options,
      headers
    })
  }
}

// Export singleton instance
export const authHelper = AuthHelper.getInstance()