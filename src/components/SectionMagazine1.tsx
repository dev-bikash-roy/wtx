'use client'

import { TPost } from '@/data/posts'
import { HeadingWithSubProps } from '@/shared/Heading'
import clsx from 'clsx'
import { FC, useState, useEffect } from 'react'
import Card2 from './PostCards/Card2'
import Card6 from './PostCards/Card6'
import SectionTabHeader from './SectionTabHeader'
import { fetchPostsByCategoryAction } from '@/app/actions'

interface Props extends Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> {
  posts: TPost[]
  heading?: string
  className?: string
  subHeading?: string
  tabs?: string[]
  categories?: string[]
}

const SectionMagazine1: FC<Props> = ({
  posts: initialPosts,
  heading,
  className,
  subHeading,
  dimHeading,
  tabs = ['News', 'Sport', 'Entertainment', 'Travel'],
  categories = ['news', 'sport', 'entertainment', 'travel']
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [currentPosts, setCurrentPosts] = useState<TPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab)
    const index = tabs.indexOf(tab)
    if (index === -1) return

    const categorySlug = categories[index]
    if (!categorySlug) return

    setIsLoading(true)
    try {
      // Fetch posts for the selected category
      // Note: We need to map the raw WP posts to TPost if the action returns raw WP posts, 
      // but our action uses fetchPostsByCategory which returns TemplatePost (TPost compatible).
      const newPosts = await fetchPostsByCategoryAction(categorySlug) as TPost[]
      setCurrentPosts(newPosts)
    } catch (error) {
      console.error('Failed to fetch posts for tab:', tab, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={clsx('section-magazine-1', className)}>
      <SectionTabHeader
        subHeading={subHeading}
        dimHeading={dimHeading}
        heading={heading}
        tabActive={activeTab}
        tabs={tabs}
        onChangeTab={handleTabChange}
      />
      {!currentPosts.length && !isLoading && <span>Nothing we found!</span>}
      {isLoading ? (
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {currentPosts[0] && <Card2 size="large" post={currentPosts[0]} />}
          <div className="grid gap-6 md:gap-8">
            {currentPosts
              .filter((_, i) => i < 4 && i > 0)
              .map((item, index) => (
                <Card6 key={index} post={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionMagazine1
