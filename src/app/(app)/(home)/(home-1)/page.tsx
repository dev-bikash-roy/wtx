import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine3 from '@/components/SectionMagazine3'
import SectionMagazine4 from '@/components/SectionMagazine4'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionTrendingTags from '@/components/SectionTrendingTags'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSmartTags from '@/components/SectionSmartTags'
import SectionMagazine6 from '@/components/SectionMagazine6'
import SectionMagazine7 from '@/components/SectionMagazine7'
import SectionMagazine8 from '@/components/SectionMagazine8'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionMagazine10 from '@/components/SectionMagazine10'
import SectionMagazine11 from '@/components/SectionMagazine11'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAuthors'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionPostsWithWidgets from '@/components/SectionPostsWithWidgets'
import { getCategories, getCategoriesWithPosts } from '@/data/categories'
import { getPostsDefault as getAllPosts } from '@/data/posts'
import { getAllPostsWithWordPress, getWordPressPostsByCategory } from '@/data/wordpress-posts'
import { getAuthors } from '@/data/authors'
import { getTagsWithPosts } from '@/data/categories'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'WTX News - Global News, Politics, Sports & Lifestyle',
}

const Page = async () => {
  // --- 1. Fetch Posts for specific sections ---

  // 1. Latest news today (Tag: uk-featured-news)
  const latestNewsPosts = await getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 5 })
  const latestNewsDefault = await getAllPostsWithWordPress({ perPage: 5 }) // Fallback

  // 2. Trending news (5 most popular tags)
  const trendingPosts = await getAllPostsWithWordPress({ perPage: 6 }) // Using latest as trending for now

  // 3. Editors picks (Tag: editors-picks)
  const editorsPicksPosts = await getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 5 })

  // 4. What's happening near you (Regions: England, Scotland, Wales, Ireland)
  const englandPosts = await getWordPressPostsByCategory('england', 3)
  const scotlandPosts = await getWordPressPostsByCategory('scotland', 3)
  const walesPosts = await getWordPressPostsByCategory('wales', 3)
  const irelandPosts = await getWordPressPostsByCategory('ireland', 3)

  // 5. Celebs & Showbiz (Tag: uk-entertainment)
  const celebPosts = await getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 8 })

  // 6. Latest Sports News (Category: sports)
  const latestSportsPosts = await getWordPressPostsByCategory('sport', 6)

  // 7. Money Saving Expert (Category: money-expert)
  const moneyExpertPosts = await getWordPressPostsByCategory('money-expert', 5)

  // 8. Explore the UK (Category: travel + Tags: uk-holidays, etc.)
  const exploreUKPosts = await getAllPostsWithWordPress({
    categories: ['travel'],
    tags: ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways'],
    perPage: 5
  })

  // 9. Sports News (Featured)
  const featuredSportsPosts = await getAllPostsWithWordPress({ tags: ['featured-sports-news'], perPage: 6 })

  // 10. Football News (Premier League, etc.)
  const footballPosts = await getWordPressPostsByCategory('football', 6)
  const premierLeaguePosts = await getAllPostsWithWordPress({ tags: ['premier-league'], perPage: 4 })
  const europeanFootballPosts = await getAllPostsWithWordPress({ tags: ['european-football'], perPage: 4 })
  const transferGossipPosts = await getAllPostsWithWordPress({ tags: ['transfer-gossip'], perPage: 4 })

  // 11. UK Politics News
  const politicsPosts = await getWordPressPostsByCategory('uk-politics', 5)
  const politicsHeadlines = await getAllPostsWithWordPress({ tags: ['politics'], perPage: 4 })
  const liveWestminsterPosts = await getAllPostsWithWordPress({ tags: ['live-westminster'], perPage: 3 })
  const downingStreetPosts = await getAllPostsWithWordPress({ tags: ['downing-street'], perPage: 3 })

  // 12. Specific Sports
  const f1Posts = await getWordPressPostsByCategory('f1', 4)
  const tennisPosts = await getWordPressPostsByCategory('tennis', 6)
  const cricketPosts = await getWordPressPostsByCategory('cricket', 4)
  const snookerPosts = await getWordPressPostsByCategory('snooker', 4)
  const wwePosts = await getWordPressPostsByCategory('wwe', 4)
  const boxingPosts = await getWordPressPostsByCategory('boxing', 4)
  const mmaPosts = await getWordPressPostsByCategory('mma', 4)
  const winterSportsPosts = await getWordPressPostsByCategory('winter-sports', 4)

  // Reuse posts if specific ones are empty (Fallback logic)
  const defaultPosts = await getAllPostsWithWordPress({ perPage: 20 })

  const getPostsOrFallback = (posts: any[], count: number) => {
    if (posts && posts.length >= count) return posts.slice(0, count);
    if (posts && posts.length > 0) return posts; // Return whatever we have
    return defaultPosts.slice(0, count); // Complete fallback
  }

  // Fetch other data
  const authors = await getAuthors()
  const categories = await getCategories()
  const categoriesWithPosts = await getCategoriesWithPosts()

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
      {/* 1. Latest news today */}
      <SectionLargeSlider
        heading="Latest news today"
        subHeading="Tags - UK Featured News"
        className="pt-10 lg:pt-16"
        posts={getPostsOrFallback(latestNewsPosts.length > 0 ? latestNewsPosts : latestNewsDefault, 5)}
      />

      {/* 2. Trending news Tags - list the 5 most popular tags */}
      <SectionTrending
        heading="Trending news"
        subHeading="Most popular stories"
        posts={getPostsOrFallback(trendingPosts, 6)}
      />

      {/* 3. Trending Tags - 5 most popular tags used today */}
      <SectionTrendingTags
        heading="Trending Tags"
        subHeading="List the 5 most popular tags that have been used today"
      />

      {/* 4. Editors picks */}
      <SectionMagazine1
        heading="Editors picks"
        subHeading="Curated by our editors"
        posts={getPostsOrFallback(editorsPicksPosts, 5)}
      />

      {/* 5. Jump to categories */}
      <SectionSliderNewCategories
        heading="Jump to categories"
        subHeading="Browse by category"
        categories={categoriesWithPosts.slice(0, 8)}
        categoryCardType="card4"
      />

      {/* 6. What's happening near you */}
      <SectionMagazine2
        heading="What's happening near you"
        subHeading="England News - Scotland News - Irish News - Welsh News"
        posts={getPostsOrFallback([...englandPosts, ...scotlandPosts, ...walesPosts, ...irelandPosts], 5)}
      />

      {/* 7. Celebs & Showbiz */}
      <SectionGridPosts
        headingIsCenter
        postCardName="card11"
        heading="Celebs & Showbiz"
        subHeading="Tags UK entertainment"
        posts={getPostsOrFallback(celebPosts, 8)}
        gridClass="md:grid-cols-2 lg:grid-cols-4"
      />

      {/* 8. Latest Sports News */}
      <SectionSliderPosts
        heading="Latest Sports News"
        subHeading="From Sports Category"
        posts={getPostsOrFallback(latestSportsPosts, 6)}
        postCardName="card10"
      />

      {/* 9. Money Saving Expert */}
      <SectionMagazine3
        heading="Money Saving Expert"
        subHeading="Money saving expert Category"
        posts={getPostsOrFallback(moneyExpertPosts, 5)}
      />

      {/* 10. Explore the UK */}
      <SectionMagazine6
        heading="Explore the UK"
        subHeading="Travel holidays in the UK, nature holidays Cabin holidays, Hiking holidays weekend Spa getaways"
        posts={getPostsOrFallback(exploreUKPosts, 5)}
      />

      {/* 11. Subscribe Sports news */}
      <SectionSubscribe2 />

      {/* 12. Sports news - Today's top sports stories */}
      <SectionMagazine7
        heading="Sports news"
        subHeading="Today's top sports stories - Tag featured sports news - Trending sports stories"
        posts={getPostsOrFallback(featuredSportsPosts, 6)}
      />

      {/* 13. Football news (Filters) */}
      <SectionMagazine8
        heading="Football news (Filters)"
        subHeading="Premier League - European Football - Championship and Divisions - Transfer gossip - Football injury updates"
        posts={getPostsOrFallback([...footballPosts, ...premierLeaguePosts, ...europeanFootballPosts, ...transferGossipPosts], 6)}
      />

      {/* 14. F1 */}
      <SectionMagazine10
        posts={getPostsOrFallback(f1Posts, 4)}
      />

      {/* 15. Tennis */}
      <SectionMagazine4
        heading="Tennis"
        subHeading="Latest court action"
        posts={getPostsOrFallback(tennisPosts, 6)}
      />

      {/* 16. Cricket */}
      <SectionMagazine5
        heading="Cricket"
        subHeading="Latest cricket news"
        posts={getPostsOrFallback(cricketPosts, 4)}
      />

      {/* 17. Snooker */}
      <SectionMagazine3
        heading="Snooker"
        subHeading="Latest snooker updates"
        posts={getPostsOrFallback(snookerPosts, 4)}
      />

      {/* 18. WWE */}
      <SectionMagazine6
        heading="WWE"
        subHeading="Wrestling entertainment"
        posts={getPostsOrFallback(wwePosts, 4)}
      />

      {/* 19. Boxing */}
      <SectionMagazine7
        heading="Boxing"
        subHeading="Fight news and updates"
        posts={getPostsOrFallback(boxingPosts, 4)}
      />

      {/* 20. MMA */}
      <SectionMagazine8
        heading="MMA"
        subHeading="Mixed martial arts coverage"
        posts={getPostsOrFallback(mmaPosts, 4)}
      />

      {/* 21. Winter sports */}
      <SectionMagazine9
        heading="Winter sports"
        subHeading="Cold weather athletics"
        posts={getPostsOrFallback(winterSportsPosts, 4)}
      />

      {/* 22. UK Politics News */}
      <SectionMagazine5
        heading="UK Politics News"
        subHeading="Today's political headlines - Politics tag - Live from Westminster - Downing Street News - Keir Starmer watch - UK US relations - UK EU relations - Tory party - Green Party - Labour Party - Your Party - Reform UK"
        posts={getPostsOrFallback([...politicsPosts, ...politicsHeadlines, ...liveWestminsterPosts, ...downingStreetPosts], 5)}
      />

    </div>
  )
}

export default Page