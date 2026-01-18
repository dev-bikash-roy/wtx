import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine3 from '@/components/SectionMagazine3'
import SectionTrending from '@/components/SectionTrending'
import SectionTrendingTags from '@/components/SectionTrendingTags'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionMagazine6 from '@/components/SectionMagazine6'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory } from '@/data/wordpress-posts'
import { getAuthors } from '@/data/authors'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'WTX News - Global News, Politics, Sports & Lifestyle',
}

const Page = async () => {
  // --- 1. Fetch Posts for specific sections ---

  // 1. Latest news today (Tag: uk-featured-news)
  const latestNewsPosts = await getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 5 })
  const latestNewsDefault = await getAllPostsWithWordPress({ perPage: 5 }) // Fallback

  // 2. Trending news (5 most popular tags - visually represented by generic trending for now or latest)
  const trendingPosts = await getAllPostsWithWordPress({ perPage: 6 })

  // 3. Editors picks (Tag: editors-picks)
  const editorsPicksPosts = await getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 5 })

  // 4. What's happening near you (Regions: England, Scotland, Wales, Ireland)
  const englandPosts = await getWordPressPostsByCategory('england-news', 3)
  const scotlandPosts = await getWordPressPostsByCategory('scotland-uk-news', 3)
  const walesPosts = await getWordPressPostsByCategory('wales-uk-news', 3)
  const irelandPosts = await getWordPressPostsByCategory('ireland-news', 3)

  // 5. Celebs & Showbiz (Tag: uk-entertainment)
  const celebPosts = await getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 8 })

  // 6. Latest Sports News (Category: sport)
  const latestSportsPosts = await getWordPressPostsByCategory('sport', 6)

  // 7. Money Saving Expert (Category: money-expert)
  const moneyExpertPosts = await getWordPressPostsByCategory('money-expert', 5)

  // 8. Explore the UK (Category: travel + Tags: uk-holidays, etc.)
  const exploreUKPosts = await getAllPostsWithWordPress({
    categories: ['travel'],
    tags: ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways'],
    perPage: 5
  })

  // Reuse posts if specific ones are empty (Fallback logic)
  const defaultPosts = await getAllPostsWithWordPress({ perPage: 20 })

  const getPostsOrFallback = (posts: any[], count: number) => {
    if (posts && posts.length >= count) return posts.slice(0, count);
    if (posts && posts.length > 0) return posts; // Return whatever we have
    return defaultPosts.slice(0, count); // Complete fallback
  }

  // Fetch other data
  const categoriesWithPosts = await getCategoriesWithPosts()

  // Filter categories for "Editors picks" filters (Just picking some random popular ones for UI)
  const editorCategories = categoriesWithPosts.slice(0, 4)

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">

      {/* 0. Jump to a section - Sub Menu */}
      <div className="pt-10 lg:pt-16">
        <SectionSliderNewCategories
          heading="Jump to a section"
          subHeading="Sub Menu for the page"
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

      {/* 9. Explore the UK */}
      <SectionMagazine6
        heading="Explore the UK"
        subHeading="Recent updates from across the UK"
        tabs={["Today's Main News", "UK News", "UK Politics"]}
        categories={['todays-main-news-story-uk', 'uk-news', 'uk-politics']}
        posts={getPostsOrFallback(exploreUKPosts, 5)}
      />

      {/* 10. Subscribe */}
      <SectionSubscribe2 />
    </div>
  )
}

export default Page