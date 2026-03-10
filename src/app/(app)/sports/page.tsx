
import { getAllPostsWithWordPress, getWordPressPostsByCategory, getWordPressPostsByTag } from '@/data/wordpress-posts'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Dynamically import components that might cause circular dependency issues or undefined errors at runtime
const SectionLargeSlider = dynamic(() => import('@/components/SectionLargeSlider'), { ssr: true })
const SectionMagazine1 = dynamic(() => import('@/components/SectionMagazine1'), { ssr: true })
const SectionTrending = dynamic(() => import('@/components/SectionTrending'), { ssr: true })
const SectionSliderPosts = dynamic(() => import('@/components/SectionSliderPosts'), { ssr: true })
const SectionSubscribe2 = dynamic(() => import('@/components/SectionSubscribe2'), { ssr: true })
const SectionMagazine8 = dynamic(() => import('@/components/SectionMagazine8'), { ssr: true })
const GeminiSmartSearch = dynamic(() => import('@/components/GeminiSmartSearch'), { ssr: true })

export const metadata: Metadata = {
  title: 'Sports News | WTX News',
  description: 'Latest Sports News, Football, Premier League, Rugby & More from WTX News',
}

export const revalidate = 180

const Page = async () => {
  // --- 1. Fetch Sports Posts ---
  const allSportsPosts = await getWordPressPostsByCategory('sport', 60)

  // Fallback if not enough posts
  const defaultPosts = await getAllPostsWithWordPress({ perPage: 20 })

  const getPostsOrFallback = (posts: any[], count: number) => {
    if (posts && posts.length >= count) return posts.slice(0, count);
    if (posts && posts.length > 0) return posts;
    return defaultPosts.slice(0, count);
  }

  // --- Distribute Posts ---
  const topSportsStories = allSportsPosts.slice(0, 5);
  const featuredSports = await getAllPostsWithWordPress({ tags: ['featured-sports-news'], perPage: 5 });
  const trendingSports = allSportsPosts.slice(5, 11);

  const premierLeaguePosts = await getWordPressPostsByTag('premier-league', 6);
  const europeanFootballPosts = await getWordPressPostsByTag('european-football', 6);
  const championshipPosts = await getWordPressPostsByTag('championship', 6);
  const footballPosts = [...premierLeaguePosts, ...europeanFootballPosts, ...championshipPosts];

  const f1Posts = await getWordPressPostsByCategory('f1', 4)
  const tennisPosts = await getWordPressPostsByCategory('tennis', 6)
  const cricketPosts = await getWordPressPostsByCategory('cricket', 4)
  const snookerPosts = await getWordPressPostsByCategory('snooker', 4)
  const boxingPosts = await getWordPressPostsByCategory('boxing', 4)

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
      {/* Hero Banner */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 mb-12 relative overflow-hidden">
        {topSportsStories[0]?.featuredImage?.src && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${topSportsStories[0].featuredImage.src})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#1e3a5f]/85 to-[#0ea5e9]/50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-10 bg-[#0ea5e9] rounded-full" />
              <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">WTX News</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
              Sports News
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed mb-8">
              Live scores, match reports, transfers and all the latest from the world of sport.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Football', 'F1', 'Cricket', 'Tennis', 'Rugby', 'Boxing'].map(topic => (
                <span
                  key={topic}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-full backdrop-blur-sm cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      <SectionLargeSlider
        heading="Today's top sports stories"
        subHeading="Updates from the world of sport"
        className="pt-10 lg:pt-16 mb-16"
        posts={getPostsOrFallback(topSportsStories, 5)}
      />

      <GeminiSmartSearch posts={allSportsPosts} />

      <SectionMagazine1
        heading="Featured sports news"
        subHeading="Must read sports stories"
        posts={getPostsOrFallback(featuredSports, 5)}
      />

      <SectionTrending
        heading="Trending sports stories"
        subHeading="Most popular sports news right now"
        posts={getPostsOrFallback(trendingSports, 6)}
      />

      <SectionMagazine8
        heading="Football news"
        subHeading="Premier League | European Football | Championship"
        posts={getPostsOrFallback(footballPosts, 6)}
      />

      <SectionSliderPosts
        heading="F1"
        subHeading="Formula 1 news"
        posts={getPostsOrFallback(f1Posts, 4)}
        postCardName="card10"
      />

      <SectionMagazine1
        heading="Tennis"
        subHeading="Court action"
        posts={getPostsOrFallback(tennisPosts, 5)}
      />

      <SectionSliderPosts
        heading="Cricket"
        subHeading="Cricket news"
        posts={getPostsOrFallback(cricketPosts, 4)}
        postCardName="card10"
      />

      <SectionSliderPosts
        heading="Boxing"
        subHeading="Boxing news"
        posts={getPostsOrFallback(boxingPosts, 4)}
        postCardName="card10"
      />

      <SectionSubscribe2 category="Sports News" item1="Latest sports news and updates" item2="Get access to premium content" />

    </div>
  )
}

export default Page
