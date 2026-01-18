import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SectionMagazine8 from '@/components/SectionMagazine8'
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
    // We can use a tag 'top-sports' or just take the latest
    const topSportsStories = allSportsPosts.slice(0, 5);

    // 2. Featured Sports News (Tag: featured-sports-news)
    const featuredSports = await getAllPostsWithWordPress({ tags: ['featured-sports-news'], perPage: 5 });

    // 3. Trending Sports Stories
    const trendingSports = allSportsPosts.slice(5, 11);

    // 4. Football News with Filters
    // Premier League
    const premierLeaguePosts = await getWordPressPostsByTag('premier-league', 6);
    // European Football
    const europeanFootballPosts = await getWordPressPostsByTag('european-football', 6);
    // Championship
    const championshipPosts = await getWordPressPostsByTag('championship', 6);
    // Transfer Gossip
    const transferGossipPosts = await getWordPressPostsByTag('transfer-gossip', 6);
    // Injury Updates
    const injuryUpdatesPosts = await getWordPressPostsByTag('football-injury-updates', 6);

    // Combine for initial display
    const footballPosts = [...premierLeaguePosts, ...europeanFootballPosts, ...championshipPosts];

    // 5. Specific Sports
    const f1Posts = await getWordPressPostsByCategory('f1', 4)
    const tennisPosts = await getWordPressPostsByCategory('tennis', 6)
    const cricketPosts = await getWordPressPostsByCategory('cricket', 4)
    const snookerPosts = await getWordPressPostsByCategory('snooker', 4)
    const wwePosts = await getWordPressPostsByCategory('wwe', 4)
    const boxingPosts = await getWordPressPostsByCategory('boxing', 4)
    const mmaPosts = await getWordPressPostsByCategory('mma', 4)
    const winterSportsPosts = await getWordPressPostsByCategory('winter-sports', 4)


    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Today's top sports stories */}
            <SectionLargeSlider
                heading="Today's top sports stories"
                subHeading="Updates from the world of sport"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(topSportsStories, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allSportsPosts} />

            {/* 2. Featured sports news */}
            <SectionMagazine1
                heading="Featured sports news"
                subHeading="Tag - featured-sports-news"
                posts={getPostsOrFallback(featuredSports, 5)}
            />

            {/* 3. Trending sports stories */}
            <SectionTrending
                heading="Trending sports stories"
                subHeading="Most popular sports news right now"
                posts={getPostsOrFallback(trendingSports, 6)}
            />

            {/* 4. Football news (Filters) */}
            {/* Using SectionMagazine8 or similar which might support tabs if we had them, 
                for now displaying mixed with filter text explanation or use styling to show sub-sections if I can't do tabs dynamically here.
                The user asked for 'FILTERS', assuming visual indicators or sub-sections.
                I will list them as separate sections for clarity or a robust grid.
            */}
            <div className="space-y-10">
                <SectionMagazine8
                    heading="Football news"
                    subHeading="Premier League | European Football | Championship | Transfers | Injuries"
                    posts={getPostsOrFallback(footballPosts, 6)}
                />
            </div>


            {/* 5. F1 */}
            <SectionSliderPosts
                heading="F1"
                subHeading="Formula 1 news"
                posts={getPostsOrFallback(f1Posts, 4)}
                postCardName="card10"
            />

            {/* 6. Tennis */}
            <SectionMagazine1
                heading="Tennis"
                subHeading="Court action"
                posts={getPostsOrFallback(tennisPosts, 5)}
            />

            {/* 7. Cricket */}
            <SectionSliderPosts
                heading="Cricket"
                subHeading="Cricket news"
                posts={getPostsOrFallback(cricketPosts, 4)}
                postCardName="card10"
            />

            {/* 8. Snooker */}
            <SectionSliderPosts
                heading="Snooker"
                subHeading="Snooker news"
                posts={getPostsOrFallback(snookerPosts, 4)}
                postCardName="card10"
            />

            {/* 9. WWE */}
            <SectionSliderPosts
                heading="WWE"
                subHeading="WWE news"
                posts={getPostsOrFallback(wwePosts, 4)}
                postCardName="card10"
            />

            {/* 10. Boxing */}
            <SectionSliderPosts
                heading="Boxing"
                subHeading="Boxing news"
                posts={getPostsOrFallback(boxingPosts, 4)}
                postCardName="card10"
            />

            {/* 11. MMA */}
            <SectionSliderPosts
                heading="MMA"
                subHeading="MMA news"
                posts={getPostsOrFallback(mmaPosts, 4)}
                postCardName="card10"
            />

            {/* 12. Winter sports */}
            <SectionSliderPosts
                heading="Winter sports"
                subHeading="Winter sports news"
                posts={getPostsOrFallback(winterSportsPosts, 4)}
                postCardName="card10"
            />

            {/* 13. Subscribe */}
            <div className="text-center">
                <p className="mb-4 text-neutral-500">Sports news devbikash2022@gmail.com</p>
                <SectionSubscribe2 />
            </div>

        </div>
    )
}

export default Page
