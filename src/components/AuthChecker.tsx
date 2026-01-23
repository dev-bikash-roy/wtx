'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Spinner from '@/shared/spin-loading'

export default function AuthChecker({ 
  children,
  requiredRole = 'admin'
}: { 
  children: React.ReactNode,
  requiredRole?: string
}) {
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  
  // Handle auth context safely
  let user: any = null
  let isLoading = true
  
  try {
    const auth = useAuth()
    user = auth.user
    isLoading = auth.loading
  } catch (error) {
    // Auth context not available during build
    console.log('Auth context not available in AuthChecker')
    isLoading = false
  }

  useEffect(() => {
    if (isLoading) return
    
    console.log('AuthChecker check:', { user, isLoading, requiredRole })
    
    if (!user) {
      // Redirect to login if not authenticated
      console.log('Redirecting to login')
      router.push('/admin/login')
    }
    // Check if user has required role (if specified)
    else if (requiredRole && user.role !== requiredRole && requiredRole !== 'user') {
      // Redirect to home or unauthorized page
      console.log('Redirecting to home due to role mismatch')
      router.push('/')
    } else {
      // User is authorized
      setAuthorized(true)
      setChecked(true)
    }
  }, [user, isLoading, router, requiredRole])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}