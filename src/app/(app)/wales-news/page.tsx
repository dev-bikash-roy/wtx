
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
    title: 'Wales News | WTX News',
    description: 'Latest Wales News, Politics, Sports & Lifestyle from WTX News',
}

const Page = async () => {
    // --- 1. Fetch Wales Posts ---
    const allWalesPosts = await getWordPressPostsByCategory('wales-uk-news', 60)

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
    const latestWales = allWalesPosts.slice(0, 5);

    // 2. Politics (keywords: 'wales-politics', 'plaid-cymru', 'senedd', 'welsh-government', 'first-minister')
    const politicsPosts = filterByCatOrTag(allWalesPosts, ['politics', 'wales-politics', 'plaid-cymru', 'senedd', 'welsh-government', 'first-minister', 'cardiff-bay']);

    // 3. Sport (keywords: 'sport', 'rugby', 'welsh-rugby', 'football', 'cardiff-city', 'swansea-city')
    const sportPosts = filterByCatOrTag(allWalesPosts, ['sport', 'rugby', 'welsh-rugby', 'six-nations', 'football', 'cardiff-city', 'swansea-city', 'wrexham']);

    // 4. Entertainment & Lifestyle
    const entertainmentPosts = filterByCatOrTag(allWalesPosts, ['entertainment', 'showbiz', 'celebrity', 'tv', 'film', 'lifestyle', 'travel', 'food', 'drink']);

    // 5. Remaining / Trending (just subsequent posts not in top 5)
    const trendingWales = allWalesPosts.slice(5, 11);

    // Fetch other data for widgets
    const categoriesWithPosts = await getCategoriesWithPosts()

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Leo Hero Slider: Latest Wales News */}
            <SectionLargeSlider
                heading="Latest Wales News"
                subHeading="Top stories from across the nation"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(latestWales, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allWalesPosts} />

            {/* 2. Trending in Wales */}
            <SectionTrending
                heading="Trending in Wales"
                subHeading="Most popular stories"
                posts={getPostsOrFallback(trendingWales, 6)}
            />

            {/* 3. Wales Politics */}
            {politicsPosts.length > 0 && (
                <SectionMagazine1
                    heading="Wales Politics"
                    subHeading="Latest updates from the Senedd and beyond"
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

            {/* 5. Wales Sport */}
            <SectionSliderPosts
                heading="Wales Sport"
                subHeading="Rugby, Football and more"
                posts={getPostsOrFallback(sportPosts, 6)}
                postCardName="card10"
            />

            {/* 6. Entertainment & Lifestyle */}
            <SectionMagazine5
                heading="Entertainment & Lifestyle"
                subHeading="Showbiz, TV, and Travel"
                posts={getPostsOrFallback(entertainmentPosts, 5)}
            />

            {/* 7. More Wales News (Grid) */}
            <SectionGridPosts
                headingIsCenter
                postCardName="card11"
                heading="More Wales News"
                subHeading="Explore more stories"
                posts={getPostsOrFallback(allWalesPosts.slice(11, 23), 12)}
                gridClass="md:grid-cols-2 lg:grid-cols-4"
            />

            {/* 8. Subscribe */}
            <SectionSubscribe2 />

            <SectionSubscribe2 />
        </div>
    )
}

export default Page
