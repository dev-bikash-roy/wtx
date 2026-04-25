import { Metadata } from 'next'
import Link from 'next/link'
import Card2 from '@/components/PostCards/Card2'
import Card6 from '@/components/PostCards/Card6'
import Card11 from '@/components/PostCards/Card11'
import { getWordPressPostsByCategory, getWordPressPostsByTag } from '@/data/wordpress-posts'
import { TPost } from '@/data/posts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'

export const metadata: Metadata = {
  title: 'England News | WTX News',
  description: 'Latest England news and local updates from cities, counties, and communities across England—breaking stories, politics, crime, transport and more.',
  keywords: ['England news', 'England local news', 'London news', 'Manchester news', 'Birmingham news', 'England politics', 'England crime', 'England transport'],
  alternates: {
    canonical: 'https://wtxnews.co.uk/england-news',
  },
}

export const revalidate = 180 // 3 minutes

const Page = async () => {
  // Fetch England posts
  const allEnglandPosts = await getWordPressPostsByCategory('england-news', 50)

  // Helper to filter posts by tags
  const filterByTags = (posts: TPost[], tagHandles: string[]) => {
    return posts.filter(post =>
      post.tags?.some(tag => tagHandles.includes(tag.handle))
    )
  }

  // Helper to filter by location tags
  const filterByLocation = (posts: TPost[], locations: string[]) => {
    return posts.filter(post =>
      post.tags?.some(tag => locations.includes(tag.handle))
    )
  }

  // Top Stories
  const topStories = allEnglandPosts.slice(0, 10)

  // Location-based posts
  const londonPosts = filterByLocation(allEnglandPosts, ['london', 'london-news'])
  const manchesterPosts = filterByLocation(allEnglandPosts, ['manchester'])
  const birminghamPosts = filterByLocation(allEnglandPosts, ['birmingham'])
  const liverpoolPosts = filterByLocation(allEnglandPosts, ['liverpool'])
  const leedsPosts = filterByLocation(allEnglandPosts, ['leeds'])
  const bristolPosts = filterByLocation(allEnglandPosts, ['bristol'])

  // Topic-based posts
  const politicsPosts = filterByTags(allEnglandPosts, ['politics', 'uk-politics', 'prime-minister'])
  const crimePosts = filterByTags(allEnglandPosts, ['crime', 'uk-crime', 'courts'])
  const transportPosts = filterByTags(allEnglandPosts, ['transport', 'rail', 'road'])
  const healthPosts = filterByTags(allEnglandPosts, ['health', 'nhs'])
  const educationPosts = filterByTags(allEnglandPosts, ['education', 'schools'])
  const economyPosts = filterByTags(allEnglandPosts, ['economy', 'business', 'cost-of-living'])
  const weatherPosts = filterByTags(allEnglandPosts, ['weather', 'environment'])

  // Trending (most recent after top stories)
  const trendingPosts = allEnglandPosts.slice(10, 20)

  // Latest (chronological)
  const latestPosts = allEnglandPosts.slice(20)

  return (
    <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'England News',
            description: 'Latest England news and local updates from cities, counties, and communities across England.',
            url: 'https://wtxnews.co.uk/england-news',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://wtxnews.co.uk'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'England News',
                  item: 'https://wtxnews.co.uk/england-news'
                }
              ]
            }
          })
        }}
      />

      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {/* Dynamic background: use lead story image if available */}
        {topStories[0]?.featuredImage?.src && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${topStories[0].featuredImage.src})` }}
          />
        )}
        {/* Gradient overlay using England's red/white theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/95 via-[#C8102E]/80 to-black/60" />

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="max-w-3xl">
            {/* England flag stripe accent */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-white rounded-full" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">WTX News</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
              England News
            </h1>
            <p className="text-base text-white/80 max-w-xl leading-relaxed mb-6">
              Latest breaking news and local updates from cities, counties, and communities across England.
            </p>

            {/* Quick topic pills */}
            <div className="flex flex-wrap gap-2">
              {['Politics', 'Crime', 'Transport', 'Health', 'Economy', 'Weather'].map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full backdrop-blur-sm cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* H2: Top Stories in England */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
          Top Stories
        </h2>

        {/* 1 Large Left, 4 Small List Right (Main Section Layout) */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {topStories[0] && <Card2 size="large" post={topStories[0]} />}
          <div className="flex flex-col gap-6 md:gap-8">
            {topStories
              .filter((_, i) => i < 5 && i > 0)
              .map((item, index) => (
                <Card6 key={index} post={item} />
              ))}
          </div>
        </div>
      </section>

      {/* H2: Browse England by Area */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
          Browse England by Area
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* H3: London */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/london" className="hover:text-primary-600">
                London
              </Link>
            </h3>
            {londonPosts.length > 0 ? (
              <div className="space-y-3">
                {londonPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>

          {/* H3: Manchester */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/manchester" className="hover:text-primary-600">
                Manchester
              </Link>
            </h3>
            {manchesterPosts.length > 0 ? (
              <div className="space-y-3">
                {manchesterPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>

          {/* H3: Birmingham */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/birmingham" className="hover:text-primary-600">
                Birmingham
              </Link>
            </h3>
            {birminghamPosts.length > 0 ? (
              <div className="space-y-3">
                {birminghamPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>

          {/* H3: Liverpool */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/liverpool" className="hover:text-primary-600">
                Liverpool
              </Link>
            </h3>
            {liverpoolPosts.length > 0 ? (
              <div className="space-y-3">
                {liverpoolPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>

          {/* H3: Leeds */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/leeds" className="hover:text-primary-600">
                Leeds
              </Link>
            </h3>
            {leedsPosts.length > 0 ? (
              <div className="space-y-3">
                {leedsPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>

          {/* H3: Bristol */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Link href="/england/bristol" className="hover:text-primary-600">
                Bristol
              </Link>
            </h3>
            {bristolPosts.length > 0 ? (
              <div className="space-y-3">
                {bristolPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.handle}`}
                    className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Coming soon</p>
            )}
          </div>
        </div>
      </section>

      {/* H2: Trending in England */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
          Trending in England
        </h2>

        {/* H3: Most read today */}
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Most Read Today
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingPosts.slice(0, 8).map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* H2: England News by Topic */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 lg:text-3xl">
          England News by Topic
        </h2>

        {/* H3: Politics */}
        {politicsPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Politics
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {politicsPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Crime & Courts */}
        {crimePosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Crime & Courts
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {crimePosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Transport */}
        {transportPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Transport
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {transportPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Health (NHS) */}
        {healthPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Health (NHS)
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {healthPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Education */}
        {educationPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Education
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {educationPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Economy & Jobs */}
        {economyPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Economy & Jobs
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {economyPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* H3: Weather & Environment */}
        {weatherPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Weather & Environment
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {weatherPosts.slice(0, 3).map((post) => (
                <Card11 key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2 
          category="England News" 
          item1="Local and National news from England"
          item2="Get access to premium content"
        />
      </section>
    </div>
  )
}

export default Page
