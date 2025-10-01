'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to set cookie
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// Helper function to get cookie
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return undefined
}

// Helper function to erase cookie
function eraseCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    // Check if user is logged in on initial load
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = getCookie('auth-token')
      console.log('Checking auth status, token:', token)
      
      if (token) {
        // Verify token with API
        const response = await fetch('/api/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Auth check successful, user:', data.user)
          setUser(data.user)
        } else {
          console.log('Auth check failed, clearing token')
          // Token is invalid, clear it
          eraseCookie('auth-token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log('Attempting login with:', email)
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      console.log('Login response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Login successful, data:', data)
        
        // Store user data
        setUser(data.user)
        setCookie('auth-token', data.token, 1) // Set cookie for 1 day
        
        // Also store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }
        
        return data.user
      } else {
        const errorData = await response.json()
        console.log('Login failed:', errorData.error)
        return null
      }
    } catch (error) {
      console.error('Login failed:', error)
      return null
    }
  }

  const logout = () => {
    console.log('Logging out')
    setUser(null)
    eraseCookie('auth-token')
    router.push('/login')
  }

  // Prevent rendering on server to avoid hydration mismatch
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}