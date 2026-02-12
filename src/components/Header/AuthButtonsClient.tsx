'use client'

import Link from 'next/link'

// Simple auth buttons that don't require auth context
// This prevents Firebase from loading on the homepage
export default function AuthButtonsClient() {
  return (
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
}
