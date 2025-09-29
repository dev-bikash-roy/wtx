'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/shared/spin-loading'

export default function ProtectedRoute({ 
  children,
  requiredRole = 'admin'
}: { 
  children: React.ReactNode,
  requiredRole?: string
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('ProtectedRoute check:', { user, isLoading, requiredRole })
    
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      console.log('Redirecting to login')
      router.push('/login')
    }
    // Check if user has required role (if specified)
    else if (user && requiredRole && user.role !== requiredRole && requiredRole !== 'user') {
      // Redirect to home or unauthorized page
      console.log('Redirecting to home due to role mismatch')
      router.push('/')
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading) {
    console.log('Showing loading spinner')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  // If user is authenticated and has the required role, render children
  if (user && (!requiredRole || user.role === requiredRole || requiredRole === 'user')) {
    console.log('Rendering protected content')
    return <>{children}</>
  }

  // Don't render anything while redirecting
  console.log('Not rendering content')
  return null
}