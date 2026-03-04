
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
import { TPost } from '@/data/posts'
import GeminiSmartSearch from '@/components/GeminiSmartSearch'

export const metadata: Metadata = {
    title: 'England News | WTX News',
    description: 'Latest England News, Politics, Sports & Lifestyle from WTX News',
}

const Page = async () => {
    // --- 1. Fetch England Posts ---
    // We fetch a large batch of England posts to distribute them into sections
    // This helps us simulate "England Sports", "England Politics" etc. by filtering closely
    const allEnglandPosts = await getWordPressPostsByCategory('england-news', 60)

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
    const latestEngland = allEnglandPosts.slice(0, 5);

    // 2. Politics (keywords: 'politics', 'uk-politics', 'government')
    const politicsPosts = filterByCatOrTag(allEnglandPosts, ['politics', 'uk-politics', 'government', 'labour', 'conservative', 'tory', 'westminster']);

    // 3. Sport (keywords: 'sport', 'football', 'cricket', etc)
    const sportPosts = filterByCatOrTag(allEnglandPosts, ['sport', 'football', 'premier-league', 'cricket', 'rugby', 'tennis', 'f1']);

    // 4. Entertainment (keywords: 'entertainment', 'tv', 'showbiz')
    const entertainmentPosts = filterByCatOrTag(allEnglandPosts, ['entertainment', 'showbiz', 'celebrity', 'tv', 'film']);

    // 5. Travel / Lifestyle
    const lifestylePosts = filterByCatOrTag(allEnglandPosts, ['travel', 'lifestyle', 'holidays', 'food', 'drink']);

    // 6. Remaining / Trending (just subsequent posts not in top 5)
    const trendingEngland = allEnglandPosts.slice(5, 11);

    // Fetch other data for widgets
    const categoriesWithPosts = await getCategoriesWithPosts()

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Leo Hero Slider: Latest England News */}
            <SectionLargeSlider
                heading="Latest England News"
                subHeading="Top stories from across the region"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(latestEngland, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allEnglandPosts} />

            {/* 2. Trending in England */}
            <SectionTrending
                heading="Trending in England"
                subHeading="Most popular stories"
                posts={getPostsOrFallback(trendingEngland, 6)}
            />

            {/* 3. England Politics */}
            {politicsPosts.length > 0 && (
                <SectionMagazine1
                    heading="England Politics"
                    subHeading="Latest updates from Westminster and beyond"
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

            {/* 5. England Sport */}
            <SectionSliderPosts
                heading="England Sport"
                subHeading="Football, Cricket, Rugby and more"
                posts={getPostsOrFallback(sportPosts, 6)}
                postCardName="card10"
            />

            {/* 6. Entertainment & Lifestyle */}
            <SectionMagazine5
                heading="Entertainment & Lifestyle"
                subHeading="Showbiz, TV, and Travel"
                posts={getPostsOrFallback([...entertainmentPosts, ...lifestylePosts], 5)}
            />

            {/* 7. More England News (Grid) */}
            <SectionGridPosts
                headingIsCenter
                postCardName="card11"
                heading="More England News"
                subHeading="Explore more stories"
                posts={getPostsOrFallback(allEnglandPosts.slice(11, 23), 12)}
                gridClass="md:grid-cols-2 lg:grid-cols-4"
            />

            {/* 8. Subscribe */}
            <SectionSubscribe2 />

            <SectionSubscribe2 />
        </div>
    )
}

export default Page
