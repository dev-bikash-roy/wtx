import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import WidgetTags from '@/components/WidgetTags'
import { fetchPostsByCategory, fetchCategories, fetchTags } from '@/data/wp-api'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Entertainment News | WTX News',
    description: 'Latest entertainment news, celebrity gossip, and TV updates from WTX News',
}

const BLOG_API_BASE = 'https://blog.wtxnews.co.uk/wp-json/wp/v2'

export default async function EntertainmentPage() {
    // Fetch posts for entertainment category
    // Assuming 'entertainment' is the slug. If it fails, we might need to check the actual slug.
    const posts = await fetchPostsByCategory('entertainment', 20, 1, BLOG_API_BASE)
    const categories = await fetchCategories(20, BLOG_API_BASE)
    const tags = await fetchTags(20, BLOG_API_BASE)

    return (
        <div className="container pb-20 pt-10 lg:pb-24 lg:pt-16">
            <div className="mb-10 text-center lg:mb-16">
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Entertainment</h1>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                    Latest celebrity gossip, TV news and entertainment updates
                </p>
            </div>

            {/* Categories Slider */}
            {categories.length > 0 && (
                <div className="mb-16">
                    <SectionSliderNewCategories
                        heading="Browse Categories"
                        subHeading="Explore articles by topic"
                        categories={categories}
                        categoryCardType="card4"
                    />
                </div>
            )}

            <div className="flex flex-col lg:flex-row">
                {/* Main Content */}
                <div className="w-full lg:w-3/4 lg:pr-10">
                    <SectionGridPosts
                        posts={posts}
                        heading="Latest in Entertainment"
                        subHeading="Fresh stories for you"
                        gridClass="sm:grid-cols-2"
                    />
                </div>

                {/* Sidebar */}
                <div className="w-full space-y-8 lg:w-1/4">
                    <div className="rounded-2xl bg-neutral-100 p-6 dark:bg-neutral-800">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Popular Tags
                        </h3>
                        <WidgetTags tags={tags} />
                    </div>
                </div>
            </div>
        </div>
    )
}
