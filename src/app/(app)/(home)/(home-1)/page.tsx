import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory, getWordPressPostsByTag } from '@/data/wordpress-posts'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

// Pre-load essential components
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionLargeSlider from '@/components/SectionLargeSlider'
import CardLarge1 from '@/components/PostCards/CardLarge1'
import Card11 from '@/components/PostCards/Card11'
import Card2 from '@/components/PostCards/Card2'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import GptAdSlot from '@/components/GptAdSlot'

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'UK Local News & Headlines | WTX News',
  description: 'Latest UK local news and headlines from England, Scotland, Wales, and Ireland. Breaking news, sports, fashion, travel, and more. Fresh updates daily.',
  keywords: ['UK local news', 'UK headlines', 'England news', 'Scotland news', 'Wales news', 'Ireland news', 'UK breaking news', 'British news', 'UK sports', 'UK fashion', 'UK travel'],

  // Open Graph for social media sharing
  openGraph: {
    title: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
    description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle.',
    url: 'https://wtxnews.co.uk',
    siteName: 'WTX News',
    locale: 'en_GB',
    type: 'website',
    images: [{
      url: 'https://wtxnews.co.uk/og-image-home.jpg',
      width: 1200,
      height: 630,
      alt: 'WTX News - UK Breaking News',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
    description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle.',
    images: ['https://wtxnews.co.uk/og-image-home.jpg'],
    site: '@wtxnews',
    creator: '@wtxnews',
  },
  alternates: {
    canonical: 'https://wtxnews.co.uk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const Page = async () => {
  // Fetch data
  const [
    topStoriesRaw,
    englandFeaturedRaw,
    scotlandFeaturedRaw,
    walesFeaturedRaw,
    irelandFeaturedRaw,
    footballRaw,
    otherSportsRaw,
    fashionRaw,
    travelDestinationsRaw,
    travelTipsRaw,
    latestNewsRaw,
    categoriesWithPosts
  ] = await Promise.all([
    getAllPostsWithWordPress({ perPage: 8 }),
    getWordPressPostsByTag('england-news', 6),
    getWordPressPostsByTag('scotland', 4),
    getWordPressPostsByTag('wales', 4),
    getWordPressPostsByTag('northern-ireland', 4),
    getWordPressPostsByCategory('football', 4),
    getWordPressPostsByTag('sport', 6),
    getWordPressPostsByCategory('fashion', 4),
    getWordPressPostsByTag('travel', 4),
    getWordPressPostsByTag('travel-tips', 4),
    getAllPostsWithWordPress({ perPage: 30 }),
    getCategoriesWithPosts().catch(() => [])
  ])

  const usedFallbackIds = new Set<number | string>()

  // Fallback function ensures we always display some feed without repeating fallbacks across sections
  const getPostsOrFallback = (posts: any[], count: number) => {
    if (posts && posts.length >= count) return posts.slice(0, count)

    if (posts && posts.length > 0) {
      // mix with fallback if short
      const needed = count - posts.length
      const fallback = latestNewsRaw
        .filter(p => !posts.find(ep => ep.id === p.id) && !usedFallbackIds.has(p.id))
        .slice(0, needed)
      fallback.forEach(f => usedFallbackIds.add(f.id))
      return [...posts, ...fallback]
    }

    const fallback = latestNewsRaw
      .filter(p => !usedFallbackIds.has(p.id))
      .slice(0, count)
    fallback.forEach(f => usedFallbackIds.add(f.id))
    return fallback
  }

  const topStories = getPostsOrFallback(topStoriesRaw, 6)
  const leadStory = topStories[0]
  const moreTopStories = topStories.slice(1, 6)

  const englandFeatured = getPostsOrFallback(englandFeaturedRaw, 4)
  // simulate trending simply by shifting array for now
  const englandTrending = getPostsOrFallback(latestNewsRaw, 4)

  const scotlandFeatured = getPostsOrFallback(scotlandFeaturedRaw, 4)
  const walesFeatured = getPostsOrFallback(walesFeaturedRaw, 4)
  const irelandFeatured = getPostsOrFallback(irelandFeaturedRaw, 4)

  const football = getPostsOrFallback(footballRaw, 4)
  const otherSports = getPostsOrFallback(otherSportsRaw, 4)

  const fashion = getPostsOrFallback(fashionRaw, 4)

  const travelDest = getPostsOrFallback(travelDestinationsRaw, 4)
  const travelTips = getPostsOrFallback(travelTipsRaw, 4)

  const latestNews = latestNewsRaw.slice(0, 12)

  // Reorder categories for Quick Access
  const desiredOrder = ['uk news', 'news briefing', 'uk politics', 'world news', 'sport'];
  const orderedCategories = [...categoriesWithPosts].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const indexA = desiredOrder.findIndex(d => nameA.includes(d));
    const indexB = desiredOrder.findIndex(d => nameB.includes(d));
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0; // maintain original order for the rest
  });

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24 pt-10 lg:pt-16">

      {/* Required H1 hierarchy at top */}
      <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-neutral-900 dark:text-neutral-100 sr-only">
        UK Local News & Headlines
      </h1>

      {/* Section 1 - Hero */}
      <section className="mt-2 lg:mt-6" aria-labelledby="section1-heading">
        <h2 id="section1-heading" className="sr-only">
          Top Stories (UK)
        </h2>

        {/* Lead Story Hero Slider */}
        <div className="mb-16">
          <h3 className="sr-only">Lead Story</h3>
          {topStories.length > 0 && (
            <SectionLargeSlider
              posts={topStories.slice(0, 3)}
            />
          )}
        </div>

        {/* Hero Category Navigation Header (Quick Access) */}
        {orderedCategories && orderedCategories.length > 0 && (
          <div className="mb-16">
            <SectionSliderNewCategories
              subHeading="Quick access to key sections"
              categories={orderedCategories.slice(0, 10)}
              categoryCardType="card4"
            />
          </div>
        )}

        <div>
          <h3 className="text-2xl font-semibold mb-8 text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-4">
            <a href="https://wtxnews.com/tag/main-headlines/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Today&apos;s Main Headlines</a>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStories.slice(3, 7).map(post => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot 2 - after hero */}
      <GptAdSlot slotId="div-gpt-ad-2784081-2" className="w-full" />

      {/* Section 2 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/category/england-news/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">England News</a>
        </h2>
        <p className="mt-2 mb-8 text-neutral-500 dark:text-neutral-400">The latest News from England</p>

        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Featured in England</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {englandFeatured.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Trending in England</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {englandTrending.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/england-news"
            className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white font-medium rounded-full transition-colors"
          >
            More England News
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/tag/scotland/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Scotland</a>
        </h2>
        <p className="mt-2 mb-8 text-neutral-500 dark:text-neutral-400">The latest News from Scotland</p>
        <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Featured in Scotland</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scotlandFeatured.map(post => <Card11 key={post.id} post={post} />)}
        </div>
      </section>

      {/* Section 4 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/tag/wales-news/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Wales</a>
        </h2>
        <p className="mt-2 mb-8 text-neutral-500 dark:text-neutral-400">The latest News from Wales</p>
        <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Featured in Wales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {walesFeatured.map(post => <Card11 key={post.id} post={post} />)}
        </div>
      </section>

      {/* Section 5 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/tag/northern-ireland/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Northern Ireland</a>
        </h2>
        <p className="mt-2 mb-8 text-neutral-500 dark:text-neutral-400">The latest News from Ireland</p>
        <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Featured in Ireland</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {irelandFeatured.map(post => <Card11 key={post.id} post={post} />)}
        </div>
      </section>

      {/* Section 6 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-8 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/category/sport/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Sports News</a>
        </h2>
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm"><a href="https://wtxnews.com/tag/football/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Football</a></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {football.map(post => <Card2 key={post.id} post={post} />)}
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm"><a href="https://wtxnews.com/tag/sports-news/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Other Sports</a></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherSports.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      {/* Ad Slot 3 - mid page after sports */}
      <GptAdSlot slotId="div-gpt-ad-2784081-3" className="w-full" />

      {/* Section 7 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-8 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/tag/fashion/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Fashion</a>
        </h2>
        <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Latest Fashion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fashion.map(post => <Card11 key={post.id} post={post} />)}
        </div>
      </section>

      {/* Section 8 */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-8 text-neutral-900 dark:text-neutral-100">
          <a href="https://wtxnews.com/tag/travel/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Travel Around the UK</a>
        </h2>
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">UK Destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelDest.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-sm">Travel Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map(post => <Card11 key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mt-20 border-t border-neutral-200 dark:border-neutral-700 pt-16">
        <SectionSubscribe2 
          category="General" 
          item1="Get the latest news and analysis to your email"
          item2="Get access to premium content"
        />
      </section>

    </div>
  )
}

export default Page