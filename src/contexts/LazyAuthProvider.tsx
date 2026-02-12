'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AuthProvider } from './AuthContext'

// This wrapper only loads Firebase Auth when actually needed
export function LazyAuthProvider({ children }: { children: ReactNode }) {
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false)

  useEffect(() => {
    // Check if we're on an auth-required route
    const authRoutes = ['/login', '/signup', '/dashboard', '/profile', '/admin', '/make-admin', '/test-auth']
    const isAuthRoute = authRoutes.some(route => window.location.pathname.startsWith(route))
    
    // Check if user has interacted with auth (clicked login/signup button)
    const hasAuthIntent = sessionStorage.getItem('auth-intent') === 'true'
    
    if (isAuthRoute || hasAuthIntent) {
      setShouldLoadAuth(true)
    }
  }, [])

  // Expose a function to trigger auth loading
  useEffect(() => {
    const handleAuthIntent = () => {
      sessionStorage.setItem('auth-intent', 'true')
      setShouldLoadAuth(true)
    }

    window.addEventListener('auth-intent', handleAuthIntent)
    return () => window.removeEventListener('auth-intent', handleAuthIntent)
  }, [])

  if (!shouldLoadAuth) {
    // Return children without auth context for non-auth pages
    return <>{children}</>
  }

  return <AuthProvider>{children}</AuthProvider>
}
