'use client'

import { TPost } from '@/data/posts'
import clsx from 'clsx'
import { FC, useState } from 'react'
import CategoryBadgeList from '../CategoryBadgeList'
import PostCardMeta2 from '../PostCardMeta/PostCardMeta2'
import PostCardSaveBtn from '../PostCardSaveBtn'
import PostFeaturedMedia from '../PostFeaturedMedia/PostFeaturedMedia'

interface Props {
  className?: string
  post: TPost
  ratio?: string
}

const Card10: FC<Props> = ({ className, post, ratio = 'aspect-square sm:aspect-11/12' }) => {
  const [isHover, setIsHover] = useState(false)

  // Check if post exists before destructuring
  if (!post) {
    return null;
  }

  const { categories, bookmarked } = post

  return (
    <div
      className={clsx('group post-card-10 relative flex flex-col', className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={clsx('relative z-0 w-full shrink-0 overflow-hidden rounded-3xl', ratio)}>
        <PostFeaturedMedia post={post} isHover={isHover} />
      </div>
      <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-x-4">
        <CategoryBadgeList categories={categories} />
        <PostCardSaveBtn bookmarked={bookmarked} />
      </div>

      <PostCardMeta2 meta={post} className="mt-4" />

      {post.aiSummary && (
        <div className="mt-2 px-1">
          <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="me-1 inline-block rounded bg-primary-50 px-1 py-0.5 text-[9px] uppercase font-bold text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
              AI
            </span>
            {post.aiSummary}
          </p>
        </div>
      )}
    </div>
  )
}

export default Card10