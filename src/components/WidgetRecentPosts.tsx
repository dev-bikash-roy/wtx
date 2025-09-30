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

const WidgetRecentPosts: FC<Props> = ({ className = 'bg-neutral-100 dark:bg-neutral-800', posts }) => {
  return (
    <div className={clsx('widget-recent-posts overflow-hidden rounded-3xl', className)}>
      <WidgetHeading title="Recent Posts" viewAll={{ label: 'View all', href: '/posts' }} />
      <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
        {posts?.slice(0, 5).map((post) => (
          <Card3Small
            className="p-4 hover:bg-neutral-200 xl:px-5 xl:py-6 dark:hover:bg-neutral-700"
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  )
}

export default WidgetRecentPosts