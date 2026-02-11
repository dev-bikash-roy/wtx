import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine3 from '@/components/SectionMagazine3'
import SectionTrending from '@/components/SectionTrending'
import SectionTrendingTags from '@/components/SectionTrendingTags'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import dynamic from 'next/dynamic'
const SectionMagazine6 = dynamic(() => import('@/components/SectionMagazine6'))
const SectionSubscribe2 = dynamic(() => import('@/components/SectionSubscribe2'))
import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory } from '@/data/wordpress-posts'
import { getAuthors } from '@/data/authors'
import { Metadata } from 'next'

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
  // --- 1. Fetch Posts for specific sections ---
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
    // 1. Latest news today (Tag: uk-featured-news)
    getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 5 }),
    getAllPostsWithWordPress({ perPage: 5 }), // Fallback

    // 2. Trending news
    getAllPostsWithWordPress({ perPage: 6 }),

    // 3. Editors picks (Tag: editors-picks)
    getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 5 }),

    // 4. What's happening near you (Regions)
    getWordPressPostsByCategory('england-news', 3),
    getWordPressPostsByCategory('scotland-uk-news', 3),
    getWordPressPostsByCategory('wales-uk-news', 3),
    getWordPressPostsByCategory('ireland-news', 3),

    // 5. Celebs & Showbiz (Tag: uk-entertainment)
    getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 8 }),

    // 6. Latest Sports News (Category: sport)
    getWordPressPostsByCategory('sport', 6),

    // 7. Money Saving Expert (Category: money-expert)
    getWordPressPostsByCategory('money-expert', 5),

    // 8. Explore the UK
    getAllPostsWithWordPress({
      categories: ['travel'],
      tags: ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways'],
      perPage: 5
    }),

    // Fallback and categories
    getAllPostsWithWordPress({ perPage: 20 }),
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