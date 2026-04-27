import { Metadata } from 'next'
import Link from 'next/link'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { dedupSections } from '@/utils/dedup-posts'

export const metadata: Metadata = {
  title: 'Wales News | WTX News',
  description: 'Latest news from Wales — politics, sport, and stories from across the nation.',
  alternates: { canonical: 'https://wtxnews.co.uk/wales-news' },
}

export const revalidate = 180

const Page = async () => {
  const [walesNewsRaw, walesRaw, welshFeaturedRaw, walesFeaturedRaw] = await Promise.all([
    getWordPressPostsByTag('wales-news', 40),
    getWordPressPostsByTag('wales', 30),
    getWordPressPostsByTag('welsh-featured', 20),
    getWordPressPostsByTag('wales-featured', 15),
  ])

  const [walesNewsPosts, walesPosts, welshFeaturedPosts, walesFeaturedPosts] = dedupSections(
    walesNewsRaw, walesRaw, welshFeaturedRaw, walesFeaturedRaw
  )

  const allPosts = [...walesNewsPosts, ...walesPosts, ...welshFeaturedPosts, ...walesFeaturedPosts]
  const topStories = allPosts.slice(0, 10)
  const morePosts = allPosts.slice(10, 22)
  const featuredSection = welshFeaturedPosts.slice(0, 8)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {topStories[0]?.featuredImage?.src && (
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${topStories[0].featuredImage.src})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/95 via-red-700/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Wales News
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              The latest news from Wales — politics, sport, culture and stories from across the nation.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Wales News', slug: 'wales-news' },
                { label: 'Wales', slug: 'wales' },
                { label: 'Cardiff', slug: 'cardiff' },
                { label: 'Swansea', slug: 'swansea' },
              ].map(t => (
                <Link key={t.slug} href={`/tag/${t.slug}`}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-medium rounded-full backdrop-blur-sm transition-colors">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* H2: Top Stories */}
      {topStories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            Top Stories
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {topStories[0] && <Card2 size="large" post={topStories[0]} />}
            <div className="flex flex-col gap-6 md:gap-8">
              {topStories.slice(1, 5).map(post => (
                <Card6 key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H2: Featured in Wales */}
      {featuredSection.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            Featured in Wales
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Handpicked stories from across Wales</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSection.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: More Wales News */}
      {morePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            More Wales News
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {morePosts.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {allPosts.length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No stories found yet. Check back soon.</p>
        </div>
      )}

      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2 category="Wales News" item1="Local and national news from Wales to your inbox" item2="Get access to premium content" />
      </section>
    </div>
  )
}

export default Page
