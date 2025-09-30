'use client'

import Avatar from '@/shared/Avatar'
import { Button } from '@/shared/Button'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
}

const WidgetAbout: FC<Props> = ({ className = 'bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900' }) => {
  return (
    <div className={clsx('widget-about overflow-hidden rounded-3xl p-6', className)}>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="About us"
          className="mx-auto mb-4"
          width={80}
          height={80}
          sizes="80px"
        />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Our Blog</h3>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          We&apos;re passionate about sharing insights, stories, and knowledge that matter. 
          Join our community of readers and stay informed about the latest trends and ideas.
        </p>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">250+</div>
            <div>Articles</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">15K+</div>
            <div>Readers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">5+</div>
            <div>Years</div>
          </div>
        </div>
        <Button
          href="/about"
          className="mt-4"
          outline
        >
          Learn More
        </Button>
      </div>
    </div>
  )
}

export default WidgetAbout