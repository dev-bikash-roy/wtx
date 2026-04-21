import { getAllPostsWithWordPress } from '@/data/wordpress-posts'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Latest News - WTX News',
  description: 'Stay up to date with the latest news and breaking stories from WTX News.',
}

export default async function LatestNewsPage() {
  const posts = await getAllPostsWithWordPress({ perPage: 30 })

  return (
    <div className="container mx-auto pb-20 pt-10 lg:pb-24 lg:pt-16">
      <div className="mb-10 text-center lg:mb-16">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Latest News</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          Stay up to date with the latest breaking stories
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <SectionMagazine1
            heading="Top Stories"
            subHeading="The biggest stories right now"
            posts={posts.slice(0, 5)}
          />

          <div className="mt-16">
            <SectionGridPosts
              posts={posts.slice(5)}
              postCardName="card11"
              heading="More Latest News"
              subHeading="Fresh stories from our team"
              gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          </div>
        </>
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-semibold">No posts found</h2>
            <p className="mt-2 text-neutral-500">Check back soon for the latest updates.</p>
          </div>
        </div>
      )}

      <SectionSubscribe2
        category="UK News"
        className="mt-20 lg:mt-32"
        item1="Get the latest news and analysis to your email"
        item2="Get access to premium content"
      />
    </div>
  )
}
