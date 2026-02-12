'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load the actual auth buttons
const AuthButtonsClient = dynamic(() => import('./AuthButtonsClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Sign up
      </Link>
    </div>
  )
})

export default function AuthButtonsWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Sign up
        </Link>
      </div>
    }>
      <AuthButtonsClient />
    </Suspense>
  )
}
