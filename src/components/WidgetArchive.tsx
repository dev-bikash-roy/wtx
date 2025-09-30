'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import WidgetHeading from './WidgetHeading'

interface Props {
  className?: string
}

// Mock archive data - in a real app, this would come from your CMS/database
const archiveData = [
  { month: 'December 2024', count: 12, href: '/archive/2024/12' },
  { month: 'November 2024', count: 8, href: '/archive/2024/11' },
  { month: 'October 2024', count: 15, href: '/archive/2024/10' },
  { month: 'September 2024', count: 10, href: '/archive/2024/09' },
  { month: 'August 2024', count: 7, href: '/archive/2024/08' },
  { month: 'July 2024', count: 13, href: '/archive/2024/07' },
]

const WidgetArchive: FC<Props> = ({ className = 'bg-neutral-100 dark:bg-neutral-800' }) => {
  return (
    <div className={clsx('widget-archive overflow-hidden rounded-3xl', className)}>
      <WidgetHeading title="Archive" viewAll={{ label: 'View all', href: '/archive' }} />
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {archiveData.map((item) => (
          <Link
            key={item.month}
            href={item.href}
            className="flex items-center justify-between p-4 transition-colors hover:bg-neutral-200 xl:px-5 dark:hover:bg-neutral-700"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                {item.count}
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {item.month}
              </span>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default WidgetArchive