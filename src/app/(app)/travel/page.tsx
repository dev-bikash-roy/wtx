import { Metadata } from 'next'
import Link from 'next/link'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByTag } from '@/data/wordpress-posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'

export const metadata: Metadata = {
  title: 'Travel | WTX News',
  description: 'Travel guides, UK destinations, holiday inspiration and tips from WTX News.',
  alternates: { canonical: 'https://wtxnews.co.uk/travel' },
}

export const revalidate = 180

const Page = async () => {
  const [travelPosts, destinationPosts, guidePosts] = await Promise.all([
    getWordPressPostsByTag('travel', 30),
    getWordPressPostsByTag('travel-destinations', 8),
    getWordPressPostsByTag('travel-guides', 6),
  ])

  // Deduplicate across all fetches
  const seen = new Set<string>()
  const allPosts = [...travelPosts, ...destinationPosts, ...guidePosts].filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  const heroPost = allPosts[0]
  const topStories = allPosts.slice(0, 10)
  const destinations = destinationPosts.slice(0, 8)
  const guides = guidePosts.slice(0, 6)
  const morePosts = allPosts.slice(10, 22)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {heroPost?.featuredImage?.src && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPost.featuredImage.src})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-800/95 via-sky-700/80 to-black/60" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              Travel
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Discover the best destinations, travel guides, holiday inspiration and tips from across the UK and beyond.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Travel News', slug: 'travel-news' },
                { label: 'Destinations', slug: 'travel-destinations' },
                { label: 'Travel Guides', slug: 'travel-guides' },
                { label: 'Hiking', slug: 'hiking' },
                { label: 'Staycations', slug: 'staycations' },
                { label: 'Budget Holidays', slug: 'budget-holidays' },
              ].map(topic => (
                <Link
                  key={topic.slug}
                  href={`/tag/${topic.slug}`}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-medium rounded-full backdrop-blur-sm transition-colors"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* H2: Top Travel Stories */}
      {topStories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            Top Travel Stories
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

      {/* H2: Travel Destinations */}
      {destinations.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            Travel Destinations
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Places to explore and discover</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: Travel Guides */}
      {guides.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 lg:text-3xl">
            Travel Guides
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Tips, advice and how-to guides for your next trip</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* H2: More Travel Stories */}
      {morePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
            More Travel Stories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {morePosts.map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {allPosts.length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No travel stories found yet. Check back soon.</p>
        </div>
      )}

      {/* Newsletter */}
      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2
          category="Travel"
          item1="Get the latest travel stories and destination guides to your inbox"
          item2="Get access to premium content"
        />
      </section>

    </div>
  )
}

export default Page
