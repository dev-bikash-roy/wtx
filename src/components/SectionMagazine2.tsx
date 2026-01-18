'use client'

import { TPost } from '@/data/posts'
import { HeadingWithSubProps } from '@/shared/Heading'
import clsx from 'clsx'
import { FC, useState } from 'react'
import Card11 from './PostCards/Card11'
import Card2 from './PostCards/Card2'
import SectionTabHeader from './SectionTabHeader'
import { fetchPostsByCategoryAction } from '@/app/actions'

interface Props extends Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> {
  posts: TPost[]
  heading?: string
  className?: string
  tabs?: string[]
  categories?: string[]
}

const SectionMagazine2: FC<Props> = ({
  posts: initialPosts,
  heading,
  className,
  subHeading,
  dimHeading,
  tabs = ['England', 'Scotland', 'Wales', 'Ireland'],
  categories = ['england-news', 'scotland-uk-news', 'wales-uk-news', 'ireland-news']
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
      const newPosts = await fetchPostsByCategoryAction(categorySlug) as TPost[]
      setCurrentPosts(newPosts)
    } catch (error) {
      console.error('Failed to fetch posts for tab:', tab, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={clsx('section-magazine-2 relative', className)}>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="grid gap-6">
            {currentPosts.slice(1, 3).map((post) => {
              return <Card11 ratio="aspect-5/3" key={post.id} post={post} />
            })}
          </div>
          <div className="lg:col-span-2">{currentPosts[0] && <Card2 className="h-full" size="large" post={currentPosts[0]} />}</div>
          <div className="grid grid-cols-1 gap-6 md:col-span-3 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
            {currentPosts.slice(3, 5).map((post) => {
              return <Card11 className="bg-neutral-50" ratio="aspect-5/3" key={post.id} post={post} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionMagazine2
