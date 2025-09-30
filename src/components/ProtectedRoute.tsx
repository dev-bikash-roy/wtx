'use client'

import AuthChecker from '@/components/AuthChecker'
import { useRouter } from 'next/navigation'
import Spinner from '@/shared/spin-loading'

export default function ProtectedRoute({ 
  children,
  requiredRole = 'admin'
}: { 
  children: React.ReactNode,
  requiredRole?: string
}) {
  const router = useRouter()

  return (
    <AuthChecker requiredRole={requiredRole}>
      {children}
    </AuthChecker>
  )
}
