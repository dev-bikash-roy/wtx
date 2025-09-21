'use client'

import { TPost } from '@/data/posts'
import { Link } from '@/shared/link'
import clsx from 'clsx'
import Image from 'next/image'
import { FC } from 'react'
import ButtonPlayMusicPlayer from '../ButtonPlayMusicPlayer'

interface Props {
  className?: string
  post: TPost
}

const Card17Podcast: FC<Props> = ({ className, post }) => {
  // Check if post exists before destructuring
  if (!post) {
    return null;
  }
  
  const { title, handle, featuredImage, postType, date, readingTime } = post
  const IS_AUDIO = postType === 'audio'

  return (
    <div
      className={clsx(
        'post-card-17-podcast relative flex items-center justify-between gap-x-5 rounded-3xl border border-dashed border-neutral-200 bg-white p-2.5 dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-center gap-x-4">
        <div className="relative size-14 shrink-0 rounded-full shadow-lg sm:size-18">
          <Image
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="rounded-full object-cover"
            src={featuredImage}
            fill
            alt={title}
          />
        </div>

        <div className="flex grow flex-col">
          <h2 className="block font-medium sm:text-base/snug sm:font-semibold">
            <Link href={`/post/${handle}`} className="absolute inset-0"></Link>
            <span className="line-clamp-1">{title}</span>
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {IS_AUDIO && (
              <ButtonPlayMusicPlayer
                post={post}
                buttonSize="size-7"
                buttonColor="bg-primary-600 text-white"
                iconClassName="size-4"
              />
            )}

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="mx-1">/</span>
              <span> {readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card17Podcast