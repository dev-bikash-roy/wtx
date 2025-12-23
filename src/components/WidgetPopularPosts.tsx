'use client'

import { TPost } from '@/data/posts'
import clsx from 'clsx'
import { FC } from 'react'
import Card3Small from './PostCards/Card3Small'
import WidgetHeading from './WidgetHeading'

interface Props {
  className?: string
  posts: TPost[]
}

const WidgetPopularPosts: FC<Props> = ({ className = 'bg-neutral-100 dark:bg-neutral-800', posts }) => {
  // Sort posts by view count or engagement (mock implementation)
  const popularPosts = [...(posts || [])].sort((a, b) => {
    return (b.viewCount || 0) - (a.viewCount || 0)
  })

  return (
    <div className={clsx('widget-popular-posts overflow-hidden rounded-3xl', className)}>
      <WidgetHeading title="Popular Posts" viewAll={{ label: 'View all', href: '/posts?sort=popular' }} />
      <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
        {popularPosts?.slice(0, 5).map((post, index) => (
          <div key={post.id} className="relative">
            <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
              {index + 1}
            </div>
            <Card3Small
              className="p-4 pl-10 hover:bg-neutral-200 xl:px-5 xl:py-6 xl:pl-12 dark:hover:bg-neutral-700"
              post={post}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WidgetPopularPosts