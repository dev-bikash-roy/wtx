import { Metadata } from 'next'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Birmingham News | England | WTX News',
  description: 'Latest news from Birmingham. Breaking stories, local updates, and more.',
}

export const revalidate = 180

const Page = async () => {
  const posts = await getWordPressPostsByTag('birmingham', 24)

  return (
    <div className="container pt-10 lg:pt-16 pb-16">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-primary-600 hover:text-primary-700">Home</Link>
        <span className="mx-2 text-neutral-400">/</span>
        <Link href="/england-news" className="text-primary-600 hover:text-primary-700">England</Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="text-neutral-600">Birmingham</span>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 lg:text-4xl">
        Birmingham News
      </h1>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Latest news and updates from Birmingham
      </p>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-500">No Birmingham news available at the moment.</p>
          <Link href="/england-news" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to England News
          </Link>
        </div>
      )}
    </div>
  )
}

export default Page
