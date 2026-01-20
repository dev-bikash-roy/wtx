
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
    title: 'Entertainment News | WTX News',
    description: 'Latest celebrity gossip, TV news and entertainment updates from WTX News',
}

const Page = async () => {
    // --- 1. Fetch Entertainment Posts ---
    const allEntertainmentPosts = await getWordPressPostsByCategory('entertainment', 60)

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
    const latestEntertainment = allEntertainmentPosts.slice(0, 5);

    // 2. Celebrity & Showbiz
    const celebrityPosts = filterByCatOrTag(allEntertainmentPosts, ['celebrity', 'showbiz', 'gossip', 'red-carpet', 'awards']);

    // 3. TV & Film
    const tvFilmPosts = filterByCatOrTag(allEntertainmentPosts, ['tv', 'television', 'film', 'movies', 'streaming', 'netflix', 'bbc']);

    // 4. Music
    const musicPosts = filterByCatOrTag(allEntertainmentPosts, ['music', 'concerts', 'albums', 'charts', 'festivals']);

    // 5. Trending Entertainment
    const trendingEntertainment = allEntertainmentPosts.slice(5, 11);

    // Fetch other data for widgets
    const categoriesWithPosts = await getCategoriesWithPosts()

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Hero Slider: Latest Entertainment News */}
            <SectionLargeSlider
                heading="Latest Entertainment News"
                subHeading="Celebrity gossip, TV news and entertainment updates"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(latestEntertainment, 5)}
            />

            {/* AI Smart Search Section */}
            <GeminiSmartSearch posts={allEntertainmentPosts} />

            {/* 2. Trending in Entertainment */}
            <SectionTrending
                heading="Trending in Entertainment"
                subHeading="Most popular stories"
                posts={getPostsOrFallback(trendingEntertainment, 6)}
            />

            {/* 3. Celebrity & Showbiz */}
            {celebrityPosts.length > 0 && (
                <SectionMagazine1
                    heading="Celebrity & Showbiz"
                    subHeading="Latest celebrity news and gossip"
                    posts={getPostsOrFallback(celebrityPosts, 5)}
                />
            )}

            {/* 4. Jump to categories (Generic) */}
            <SectionSliderNewCategories
                heading="Jump to categories"
                subHeading="Browse by category"
                categories={categoriesWithPosts.slice(0, 8)}
                categoryCardType="card4"
            />

            {/* 5. TV & Film */}
            <SectionSliderPosts
                heading="TV & Film"
                subHeading="Latest from the screen"
                posts={getPostsOrFallback(tvFilmPosts, 6)}
                postCardName="card10"
            />

            {/* 6. Music */}
            <SectionMagazine5
                heading="Music"
                subHeading="Charts, concerts and albums"
                posts={getPostsOrFallback(musicPosts, 5)}
            />

            {/* 7. More Entertainment News (Grid) */}
            <SectionGridPosts
                headingIsCenter
                postCardName="card11"
                heading="More Entertainment News"
                subHeading="Explore more stories"
                posts={getPostsOrFallback(allEntertainmentPosts.slice(11, 23), 12)}
                gridClass="md:grid-cols-2 lg:grid-cols-4"
            />

            {/* 8. Subscribe */}
            <SectionSubscribe2 />
        </div>
    )
}

export default Page
