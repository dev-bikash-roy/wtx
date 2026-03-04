'use client'

import { TPost } from '@/data/posts'
import { FC } from 'react'
import Card11 from './PostCards/Card11'
import Card2 from './PostCards/Card2'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface Props {
  featuredPosts: TPost[]
  trendingPosts: TPost[]
  className?: string
}

const SectionEnglandNews: FC<Props> = ({
  featuredPosts,
  trendingPosts,
  className = ''
}) => {
  return (
    <div className={`section-england-news relative ${className}`}>
      {/* H3: Featured in England */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 lg:text-2xl">
          Featured in England
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.slice(0, 3).map((post) => (
            <Card11 key={post.id} post={post} ratio="aspect-5/3" />
          ))}
        </div>
      </div>

      {/* H3: Trending in England */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 lg:text-2xl">
          Trending in England
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingPosts.slice(0, 3).map((post) => (
            <Card11 key={post.id} post={post} ratio="aspect-5/3" />
          ))}
        </div>
      </div>

      {/* CTA Link: More England News */}
      <div className="flex justify-center mt-8">
        <Link
          href="/england-news"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          More England News
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default SectionEnglandNews
