
import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory, getWordPressPostsByTag } from '@/data/wordpress-posts'
import { Metadata } from 'next'
import { TPost } from '@/data/posts'
import GeminiSmartSearch from '@/components/GeminiSmartSearch'

export const metadata: Metadata = {
    title: 'Sports News | WTX News',
    description: 'Latest Sports News, Football, Premier League, Rugby & More from WTX News',
}

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

    // Filter helper
    const filterByCatOrTag = (posts: TPost[], keywords: string[]) => {
        return posts.filter(post => {
            // Check categories
            if (post.categories?.some(c => keywords.includes(c.handle || c.id))) return true;
            // Check tags
            if (post.tags?.some(t => keywords.includes(t.handle || t.id))) return true;
            return false;
        });
    }

    // --- Distribute Posts ---

    // 1. Today's Top Sports Stories (Top 5)
    const topSportsStories = allSportsPosts.slice(0, 5);

    // 2. Featured Sports News (tagged posts)
    const featuredSports = filterByCatOrTag(allSportsPosts, ['featured', 'breaking', 'exclusive']);

    // 3. Trending Sports Stories
    const trendingSports = allSportsPosts.slice(5, 11);

    // 4. Football News with Filters
    // Premier League
    const premierLeaguePosts = filterByCatOrTag(allSportsPosts, ['premier-league', 'epl', 'english-football']);

    // European Football
    const europeanFootballPosts = filterByCatOrTag(allSportsPosts, ['champions-league', 'europa-league', 'european-football', 'uefa']);

    // Championship
    const championshipPosts = filterByCatOrTag(allSportsPosts, ['championship', 'efl-championship']);

    // 5. Other Sports
    const rugbyPosts = filterByCatOrTag(allSportsPosts, ['rugby', 'six-nations', 'rugby-union', 'rugby-league']);
    const cricketPosts = filterByCatOrTag(allSportsPosts, ['cricket', 'test-cricket', 'odi', 't20']);
    const tennisPosts = filterByCatOrTag(allSportsPosts, ['tennis', 'wimbledon', 'grand-slam']);

    // Fetch other data for widgets
    const categoriesWithPosts = await getCategoriesWithPosts()

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Hero Slider: Today's Top Sports Stories */}
            <SectionLargeSlider
                heading="Today's Top Sports Stories"
                subHeading="Breaking news and highlights from the world of sport"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(topSportsStories, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allSportsPosts} />

            {/* 2. Featured Sports News */}
            {featuredSports.length > 0 && (
                <SectionMagazine1
                    heading="Featured Sports News"
                    subHeading="Top stories making headlines"
                    posts={getPostsOrFallback(featuredSports, 5)}
                />
            )}

            {/* 3. Trending Sports Stories */}
            <SectionTrending
                heading="Trending Sports Stories"
                subHeading="Most popular sports news right now"
                posts={getPostsOrFallback(trendingSports, 6)}
            />

            {/* 4. Football News Section */}
            <div className="space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Football News</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">Latest updates from across the football world</p>
                </div>

                {/* Premier League */}
                <SectionSliderPosts
                    heading="Premier League"
                    subHeading="Latest from England's top flight"
                    posts={getPostsOrFallback(premierLeaguePosts, 6)}
                    postCardName="card10"
                />

                {/* European Football */}
                <SectionMagazine5
                    heading="European Football"
                    subHeading="Champions League, Europa League and more"
                    posts={getPostsOrFallback(europeanFootballPosts, 5)}
                />

                {/* Championship */}
                {championshipPosts.length > 0 && (
                    <SectionSliderPosts
                        heading="Championship"
                        subHeading="EFL Championship news and updates"
                        posts={getPostsOrFallback(championshipPosts, 6)}
                        postCardName="card10"
                    />
                )}
            </div>

            {/* 5. Other Sports */}
            <div className="space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">More Sports</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">Coverage from Rugby, Cricket, Tennis and beyond</p>
                </div>

                {/* Rugby */}
                {rugbyPosts.length > 0 && (
                    <SectionMagazine1
                        heading="Rugby"
                        subHeading="Union and League news"
                        posts={getPostsOrFallback(rugbyPosts, 5)}
                    />
                )}

                {/* Cricket */}
                {cricketPosts.length > 0 && (
                    <SectionSliderPosts
                        heading="Cricket"
                        subHeading="Test, ODI and T20 coverage"
                        posts={getPostsOrFallback(cricketPosts, 6)}
                        postCardName="card10"
                    />
                )}

                {/* Tennis */}
                {tennisPosts.length > 0 && (
                    <SectionMagazine5
                        heading="Tennis"
                        subHeading="Grand Slam and ATP/WTA news"
                        posts={getPostsOrFallback(tennisPosts, 5)}
                    />
                )}
            </div>

            {/* 6. More Sports News (Grid) */}
            <SectionGridPosts
                headingIsCenter
                postCardName="card11"
                heading="More Sports News"
                subHeading="Explore more stories from the world of sport"
                posts={getPostsOrFallback(allSportsPosts.slice(11, 23), 12)}
                gridClass="md:grid-cols-2 lg:grid-cols-4"
            />

            {/* 7. Subscribe */}
            <SectionSubscribe2 />
        </div>
    )
}

export default Page
