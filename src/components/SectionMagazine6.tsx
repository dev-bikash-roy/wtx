'use client'

import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import { TPost } from '@/data/posts'
import { HeadingWithSubProps } from '@/shared/Heading'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useState } from 'react'
import PostCardMeta3 from './PostCardMeta/PostCardMeta3'
import SectionTabHeader from './SectionTabHeader'
import { fetchPostsByTagAction } from '@/app/actions'

type Props = Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> & {
  posts: TPost[]
  className?: string
  heading?: string
  tabs?: string[]
  tags?: string[]
}

const SectionMagazine6: FC<Props> = ({
  posts: initialPosts,
  heading,
  className,
  subHeading,
  dimHeading,
  tabs = ['Travel holidays in the UK', 'Nature holidays', 'Cabin holidays', 'Hiking holidays', 'Weekend Spa getaways'],
  tags = ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways']
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [currentPosts, setCurrentPosts] = useState<TPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab)
    const index = tabs.indexOf(tab)
    if (index === -1) return

    const tagSlug = tags[index]
    if (!tagSlug) return

    setIsLoading(true)
    try {
      const newPosts = await fetchPostsByTagAction(tagSlug) as TPost[]
      setCurrentPosts(newPosts)
    } catch (error) {
      console.error('Failed to fetch posts for tab:', tab, error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderMain = () => {
    const { featuredImage, author, title, date, excerpt, handle, readingTime } = currentPosts[0]
    const subPosts = currentPosts.slice(1)
    return (
      <main className="relative">
        {/* Image */}
        <div className="aspect-w-9 overflow-hidden rounded-3xl aspect-h-9 md:aspect-h-5 lg:rounded-[40px]">
          <Image
            fill
            alt={title}
            sizes="(max-width: 1024px) 100vw, 1280px"
            src={featuredImage}
            className="object-cover"
          />
          <div>
            <span className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black"></span>
          </div>

          {/* CONTENT */}
          <div className="group dark absolute flex max-w-2xl flex-col justify-end p-5 md:w-1/2 lg:w-2/3 lg:p-14">
            <div className="">
              <h2 className="text-base font-semibold text-white hover:text-neutral-300 md:text-xl lg:text-2xl xl:text-3xl">
                <Link href={`/news/${handle}`} className="line-clamp-3">
                  {title}
                </Link>
              </h2>
              <span className="mt-5 hidden text-base/relaxed text-neutral-200 lg:block">{excerpt}</span>
            </div>

            <div className="mt-7">
              <PostCardMeta3 readingTime={readingTime} date={date} author={author} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="mt-5 h-96 overflow-hidden rounded-3xl bg-neutral-100 p-5 md:absolute md:end-3 md:top-3 md:bottom-3 md:mt-0 md:h-auto md:w-1/2 md:bg-white lg:w-1/3 lg:rounded-[34px] lg:p-8 xl:backdrop-blur-xl xl:backdrop-filter dark:bg-neutral-800 md:dark:bg-neutral-900">
          <div className="hidden-scrollbar flow-root h-full w-full overflow-y-auto">
            <div className="-my-5 divide-y divide-neutral-200 md:-my-7 dark:divide-neutral-700">
              {subPosts.map((post, i) => (
                <div key={i} className="block py-5 lg:py-7">
                  <h2 className="nc-card-title text-sm font-semibold lg:text-base">
                    <Link href={`/news/${post.handle}`} className="line-clamp-2">
                      {post.title}
                    </Link>
                  </h2>
                  <PostCardMeta className="mt-4 text-xs sm:text-sm" meta={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className={clsx('section-magazine-6 relative', className)}>
      <SectionTabHeader
        heading={heading}
        subHeading={subHeading}
        dimHeading={dimHeading}
        tabActive={activeTab}
        tabs={tabs}
        onChangeTab={handleTabChange}
      />

      {isLoading ? (
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        currentPosts[0] && renderMain()
      )}
    </div>
  )
}

export default SectionMagazine6
