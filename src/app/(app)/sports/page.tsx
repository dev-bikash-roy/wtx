import { Metadata } from 'next'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByCategory } from '@/data/wordpress-posts'
import PaginationWrapper from '@/components/PaginationWrapper'

export const metadata: Metadata = {
  title: 'Sports News | WTX News',
  description: 'Latest sports news from the UK. Football, rugby, cricket, and more.',
}

export const revalidate = 180

const Page = async () => {
  const posts = await getWordPressPostsByCategory('sport', 24)

  return (
    <div className="container pt-10 lg:pt-16 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-4xl">
        Sports News
      </h1>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Latest sports news and updates from across the UK
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <Card11 key={post.id} post={post} />
        ))}
      </div>

      <PaginationWrapper className="mt-12" />
    </div>
  )
}

export default Page
