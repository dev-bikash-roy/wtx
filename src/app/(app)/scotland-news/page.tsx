
import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getCategoriesWithPosts } from '@/data/categories'
import { getPostsDefault as getAllPosts } from '@/data/posts'
import { getAllPostsWithWordPress, getWordPressPostsByCategory } from '@/data/wordpress-posts'
import { Metadata } from 'next'
import { TPost } from '@/data/posts'
import GeminiSmartSearch from '@/components/GeminiSmartSearch'

export const metadata: Metadata = {
    title: 'Scotland News | WTX News',
    description: 'Latest Scotland News, Politics, Sports & Lifestyle from WTX News',
}

const Page = async () => {
    // --- 1. Fetch Scotland Posts ---
    const allScotlandPosts = await getWordPressPostsByCategory('scotland-uk-news', 60)

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

    // 1. Latest / Featured (Top 5)
    const latestScotland = allScotlandPosts.slice(0, 5);

    // 2. Politics (keywords: 'scotland-politics', 'snp', 'holyrood', 'first-minister')
    const politicsPosts = filterByCatOrTag(allScotlandPosts, ['politics', 'scotland-politics', 'snp', 'holyrood', 'first-minister', 'parliament']);

    // 3. Sport (keywords: 'sport', 'football', 'rugby', 'premiership', 'scottish-cup')
    const sportPosts = filterByCatOrTag(allScotlandPosts, ['sport', 'football', 'scottish-premiership', 'rugby', 'celtic', 'rangers', 'hibernian', 'hearts']);

    // 4. Entertainment & Lifestyle
    const entertainmentPosts = filterByCatOrTag(allScotlandPosts, ['entertainment', 'showbiz', 'celebrity', 'tv', 'film', 'lifestyle', 'travel', 'food', 'drink']);

    // 5. Remaining / Trending (just subsequent posts not in top 5)
    const trendingScotland = allScotlandPosts.slice(5, 11);

    // Fetch other data for widgets
    const categoriesWithPosts = await getCategoriesWithPosts()

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Leo Hero Slider: Latest Scotland News */}
            <SectionLargeSlider
                heading="Latest Scotland News"
                subHeading="Top stories from across the nation"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(latestScotland, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allScotlandPosts} />

            {/* 2. Trending in Scotland */}
            <SectionTrending
                heading="Trending in Scotland"
                subHeading="Most popular stories"
                posts={getPostsOrFallback(trendingScotland, 6)}
            />

            {/* 3. Scotland Politics */}
            {politicsPosts.length > 0 && (
                <SectionMagazine1
                    heading="Scotland Politics"
                    subHeading="Latest updates from Holyrood and beyond"
                    posts={getPostsOrFallback(politicsPosts, 5)}
                />
            )}

            {/* 4. Jump to categories (Generic) */}
            <SectionSliderNewCategories
                heading="Jump to categories"
                subHeading="Browse by category"
                categories={categoriesWithPosts.slice(0, 8)}
                categoryCardType="card4"
            />

            {/* 5. Scotland Sport */}
            <SectionSliderPosts
                heading="Scotland Sport"
                subHeading="Football, Rugby and more"
                posts={getPostsOrFallback(sportPosts, 6)}
                postCardName="card10"
            />

            {/* 6. Entertainment & Lifestyle */}
            <SectionMagazine5
                heading="Entertainment & Lifestyle"
                subHeading="Showbiz, TV, and Travel"
                posts={getPostsOrFallback(entertainmentPosts, 5)}
            />

            {/* 7. More Scotland News (Grid) */}
            <SectionGridPosts
                headingIsCenter
                postCardName="card11"
                heading="More Scotland News"
                subHeading="Explore more stories"
                posts={getPostsOrFallback(allScotlandPosts.slice(11, 23), 12)}
                gridClass="md:grid-cols-2 lg:grid-cols-4"
            />

            {/* 8. Subscribe */}
            <SectionSubscribe2 />

            <SectionSubscribe2 />
        </div>
    )
}

export default Page
