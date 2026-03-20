'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'

// Always provide auth context so components like SidebarNavigation
// can safely call useAuth() on any page
export function LazyAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
