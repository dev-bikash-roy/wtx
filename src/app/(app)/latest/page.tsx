
import { Metadata } from 'next'
import Card11 from '@/components/PostCards/Card11'
import { getAllPostsWithWordPress } from '@/data/wordpress-posts'
import PaginationWrapper from '@/components/PaginationWrapper'
import SectionSubscribe2 from '@/components/SectionSubscribe2'

export const metadata: Metadata = {
  title: 'Latest News | WTX News',
  description: 'Latest news from across the UK. Fresh updates and breaking stories.',
}

export const revalidate = 180 // 3 minutes

const Page = async () => {
  const posts = await getAllPostsWithWordPress({ perPage: 24 })

  return (
    <div className="container pt-10 lg:pt-16 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-4xl">
        Latest News
      </h1>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Most recent stories from across the UK
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <Card11 key={post.id} post={post} />
        ))}
      </div>

      <PaginationWrapper className="mt-12" />

      <SectionSubscribe2 category="UK News" className="mt-20 lg:mt-32" />
    </div>
  )
}

export default Page
