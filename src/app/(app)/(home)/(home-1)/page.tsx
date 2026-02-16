import dynamic from 'next/dynamic'

// Above-the-fold components - load immediately
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionTrending from '@/components/SectionTrending'

// Below-the-fold components - lazy load for better initial performance
const SectionTrendingTags = dynamic(() => import('@/components/SectionTrendingTags'), {
  loading: () => <div className="h-32 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionMagazine1 = dynamic(() => import('@/components/SectionMagazine1'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionMagazine2 = dynamic(() => import('@/components/SectionMagazine2'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionMagazine6 = dynamic(() => import('@/components/SectionMagazine6'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionSubscribe2 = dynamic(() => import('@/components/SectionSubscribe2'), {
  loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionGridPosts = dynamic(() => import('@/components/SectionGridPosts'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionSliderPosts = dynamic(() => import('@/components/SectionSliderPosts'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
const SectionMagazine3 = dynamic(() => import('@/components/SectionMagazine3'), {
  loading: () => <div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
})
import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory } from '@/data/wordpress-posts'
import { getAuthors } from '@/data/authors'
import { Metadata } from 'next'

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
  description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle. Unbiased reporting and in-depth analysis from across the United Kingdom.',
  keywords: ['UK news', 'breaking news UK', 'British news', 'UK politics', 'UK sports', 'UK entertainment', 'UK lifestyle', 'WTX News', 'latest news UK', 'UK current affairs'],

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

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
    description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle.',
    images: ['https://wtxnews.co.uk/og-image-home.jpg'],
    site: '@wtxnews',
    creator: '@wtxnews',
  },

  // Canonical URL
  alternates: {
    canonical: 'https://wtxnews.co.uk',
  },

  // Robots directives
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
  // Detect if request is from mobile (server-side)
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  // MOBILE: Fetch minimal data for faster load
  if (isMobile) {
    const [
      latestNewsPosts,
      trendingPosts,
      categoriesWithPosts
    ] = await Promise.all([
      // Only 3 latest posts
      getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 3 }),
      // Only 4 trending posts
      getAllPostsWithWordPress({ perPage: 4 }),
      // Categories
      getCategoriesWithPosts()
    ])

    return (
      <div className="relative container space-y-16 pb-16 lg:space-y-20 lg:pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
              description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle.',
              url: 'https://wtxnews.co.uk',
              publisher: {
                '@type': 'NewsMediaOrganization',
                name: 'WTX News',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://wtxnews.co.uk/wtx-logo.png',
                }
              }
            })
          }}
        />

        <h1 className="sr-only">Latest UK News & Breaking Stories</h1>

        {/* Mobile: Only show essential sections */}
        <div className="pt-10">
          <SectionSliderNewCategories
            heading="Today's headlines"
            subHeading="Quick access"
            categories={categoriesWithPosts.slice(0, 6)}
            categoryCardType="card4"
          />
        </div>

        <SectionLargeSlider
          heading="Latest news"
          subHeading="Top stories"
          posts={latestNewsPosts.slice(0, 3)}
        />

        <SectionTrending
          heading="Trending"
          subHeading="Popular now"
          posts={trendingPosts.slice(0, 4)}
        />

        {/* Load more content on scroll - client component */}
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500">Scroll for more stories</p>
        </div>
      </div>
    )
  }

  // DESKTOP: Full content load
  const [
    latestNewsPosts,
    latestNewsDefault,
    trendingPosts,
    editorsPicksPosts,
    englandPosts,
    scotlandPosts,
    walesPosts,
    irelandPosts,
    celebPosts,
    latestSportsPosts,
    moneyExpertPosts,
    exploreUKPosts,
    defaultPosts,
    categoriesWithPosts
  ] = await Promise.all([
    // 1. Latest news today (Tag: uk-featured-news) - reduced from 5 to 3
    getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 3 }),
    getAllPostsWithWordPress({ perPage: 3 }), // Fallback

    // 2. Trending news - reduced from 6 to 4
    getAllPostsWithWordPress({ perPage: 4 }),

    // 3. Editors picks (Tag: editors-picks) - reduced from 5 to 3
    getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 3 }),

    // 4. What's happening near you (Regions) - reduced from 3 to 2 each
    getWordPressPostsByCategory('england-news', 2),
    getWordPressPostsByCategory('scotland-uk-news', 2),
    getWordPressPostsByCategory('wales-uk-news', 2),
    getWordPressPostsByCategory('ireland-news', 2),

    // 5. Celebs & Showbiz (Tag: uk-entertainment) - reduced from 8 to 6
    getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 6 }),

    // 6. Latest Sports News (Category: sport) - reduced from 6 to 4
    getWordPressPostsByCategory('sport', 4),

    // 7. Money Saving Expert (Category: money-expert) - reduced from 5 to 3
    getWordPressPostsByCategory('money-expert', 3),

    // 8. Explore the UK - reduced from 5 to 3
    getAllPostsWithWordPress({
      categories: ['travel'],
      tags: ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways'],
      perPage: 3
    }),

    // Fallback and categories - reduced from 20 to 12
    getAllPostsWithWordPress({ perPage: 12 }),
    getCategoriesWithPosts()
  ])

  const getPostsOrFallback = (posts: any[], count: number) => {
    if (posts && posts.length >= count) return posts.slice(0, count);
    if (posts && posts.length > 0) return posts; // Return whatever we have
    return defaultPosts.slice(0, count); // Complete fallback
  }

  // Filter categories for "Editors picks" filters (Just picking some random popular ones for UI)
  const editorCategories = categoriesWithPosts.slice(0, 4)

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'WTX News - UK Breaking News, Politics, Sports & Lifestyle',
            description: 'Stay informed with WTX News. Latest UK breaking news, politics, sports, entertainment, and lifestyle.',
            url: 'https://wtxnews.co.uk',
            publisher: {
              '@type': 'NewsMediaOrganization',
              name: 'WTX News',
              logo: {
                '@type': 'ImageObject',
                url: 'https://wtxnews.co.uk/wtx-logo.png',
              }
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [{
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://wtxnews.co.uk'
              }]
            }
          })
        }}
      />

      {/* H1 for SEO - visually hidden but accessible */}
      <h1 className="sr-only">Latest UK News & Breaking Stories</h1>

      {/* 0. Today's main headlines - Sub Menu */}
      <div className="pt-10 lg:pt-16">
        <SectionSliderNewCategories
          heading="Today's main headlines"
          subHeading="Quick access to key sections"
          categories={categoriesWithPosts}
          categoryCardType="card4"
        />
      </div>

      {/* 1. Latest news today */}
      <SectionLargeSlider
        heading="Latest news today"
        subHeading="Tags - UK Featured News"
        posts={getPostsOrFallback(latestNewsPosts.length > 0 ? latestNewsPosts : latestNewsDefault, 5)}
      />

      {/* 2. Trending news */}
      <SectionTrending
        heading="Trending news"
        subHeading="Most popular stories"
        posts={getPostsOrFallback(trendingPosts, 6)}
      />

      {/* 3. Trending Tags */}
      <SectionTrendingTags
        heading="Trending Tags"
        subHeading="List the 5 most popular tags that have been used today"
      />

      {/* 4. Editors picks */}
      <SectionMagazine1
        heading="Editors picks"
        subHeading="Curated by our editors"
        tabs={['News', 'Sport', 'Entertainment', 'Travel']}
        categories={['news', 'sport', 'entertainment', 'travel']}
        posts={getPostsOrFallback(editorsPicksPosts, 5)}
      />

      {/* 5. What's happening near you */}
      <SectionMagazine2
        heading="What's happening near you"
        subHeading="Recent news from across the UK regions"
        tabs={['England', 'Scotland', 'Wales', 'Ireland']}
        categories={['england-news', 'scotland-uk-news', 'wales-uk-news', 'ireland-news']}
        posts={getPostsOrFallback(englandPosts, 5)}
      />

      {/* 6. Celebs & Showbiz */}
      <SectionGridPosts
        headingIsCenter
        postCardName="card11"
        heading="Celebs & Showbiz"
        subHeading="Tags UK entertainment"
        posts={getPostsOrFallback(celebPosts, 8)}
        gridClass="md:grid-cols-2 lg:grid-cols-4"
      />

      {/* 7. Latest Sports News */}
      <SectionSliderPosts
        heading="Latest Sports News"
        subHeading="From Sports Category"
        posts={getPostsOrFallback(latestSportsPosts, 6)}
        postCardName="card10"
      />

      {/* 8. Money Saving Expert */}
      <SectionMagazine3
        heading="Money Saving Expert"
        subHeading="Money saving expert Category"
        posts={getPostsOrFallback(moneyExpertPosts, 5)}
      />

      <SectionMagazine6
        heading="Explore the UK"
        subHeading="Recent updates from across the UK"
        tabs={["Today's Main News", "UK News", "UK Politics"]}
        tags={['todays-main-news-story-uk', 'uk-news', 'uk-politics']}
        posts={getPostsOrFallback(exploreUKPosts, 5)}
      />

      {/* 10. Subscribe */}
      <SectionSubscribe2 />
    </div>
  )
}

export default Page