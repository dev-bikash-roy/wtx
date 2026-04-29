import { Metadata } from 'next'
import Link from 'next/link'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { dedupSections } from '@/utils/dedup-posts'

export const metadata: Metadata = {
  title: 'Scotland News | WTX News',
  description: 'Latest news from Scotland — politics, sport, and stories from across the nation.',
  alternates: { canonical: 'https://wtxnews.co.uk/scotland-news' },
}

export const revalidate = 180

const Page = async () => {
  const [
    scotlandRaw,
    scottishNewsRaw,
    featuredRaw,
    scottishFeaturedRaw,
    nicolaSturgeon,
    edinburghRaw,
    glasgowRaw,
    scottishCrimeRaw,
  ] = await Promise.all([
    getWordPressPostsByTag('scotland', 20),
    getWordPressPostsByTag('scottish-news', 20),
    getWordPressPostsByTag('scottish-featured', 10),
    getWordPressPostsByTag('scotland-featured', 10),
    getWordPressPostsByTag('nicola-sturgeon', 4),
    getWordPressPostsByTag('edinburgh', 4),
    getWordPressPostsByTag('glasgow', 4),
    getWordPressPostsByTag('scottish-police-force', 4),
  ])

  const [
    scotlandPosts,
    scottishNewsPosts,
    featuredPosts,
    scottishFeaturedPosts,
    sturgeonPosts,
    edinburghPosts,
    glasgowPosts,
    crimePosts,
  ] = dedupSections(
    scotlandRaw,
    scottishNewsRaw,
    featuredRaw,
    scottishFeaturedRaw,
    nicolaSturgeon,
    edinburghRaw,
    glasgowRaw,
    scottishCrimeRaw,
  )

  const allPosts = [...scotlandPosts, ...scottishNewsPosts, ...featuredPosts, ...scottishFeaturedPosts]
  const topStories = allPosts.slice(0, 10)
  const morePosts = allPosts.slice(10, 14)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {topStories[0]?.featuredImage?.src && (
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${topStories[0].featuredImage.src})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Scotland News
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              The latest news from Scotland — politics, sport, culture and stories from across the nation.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Scotland', slug: 'scotland' },
                { label: 'Scottish News', slug: 'scottish-news' },
                { label: 'Edinburgh', slug: 'edinburgh' },
                { label: 'Glasgow', slug: 'glasgow' },
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
            <a href="https://wtxnews.com/tag/scotland/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Top Stories</a>
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

      {/* H2: Featured in Scotland */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/scottish-featured/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Featured in Scotland</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Handpicked stories from across Scotland</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Edinburgh */}
      {edinburghPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/edinburgh/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Edinburgh</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">News from Scotland's capital</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {edinburghPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Glasgow */}
      {glasgowPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/glasgow/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Glasgow</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">News from Scotland's largest city</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {glasgowPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Scottish Politics */}
      {sturgeonPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/nicola-sturgeon/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Scottish Politics</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Holyrood, the SNP and Scottish government</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sturgeonPosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: Crime */}
      {crimePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            <a href="https://wtxnews.com/tag/scotland/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Crime &amp; Justice</a>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Crime and courts news from Scotland</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {crimePosts.slice(0, 4).map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </section>
      )}

      {/* H2: More Scotland News */}
      {morePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            <a href="https://wtxnews.com/tag/scotland/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">More Scotland News</a>
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
        <SectionSubscribe2 category="Scotland News" item1="Local and national news from Scotland to your inbox" item2="Get access to premium content" />
      </section>
    </div>
  )
}

export default Page
