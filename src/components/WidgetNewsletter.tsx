'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC, useState } from 'react'

interface Props {
  className?: string
}

const WidgetNewsletter: FC<Props> = ({ className = 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20' }) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <div className={clsx('widget-newsletter overflow-hidden rounded-3xl p-6', className)}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thank you!</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            You&apos;ve successfully subscribed to our newsletter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('widget-newsletter overflow-hidden rounded-3xl p-6', className)}>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
          <EnvelopeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Get the latest posts delivered right to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          color="primary"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        No spam, unsubscribe at any time.
      </p>
    </div>
  )
}

export default WidgetNewsletter