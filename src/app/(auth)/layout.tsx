import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s | Ncmaz Auth',
    default: 'Login | Ncmaz',
  },
  description: 'Authentication for Ncmaz admin panel',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {children}
    </div>
  )
}