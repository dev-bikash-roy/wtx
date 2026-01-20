import { fetchPosts, fetchCategories } from '@/data/wp-api'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionHero3 from '@/components/SectionHero3'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Latest News - WTX News',
    description: 'Latest news and updates from WTX News',
}

const BLOG_API_BASE = 'https://blog.wtxnews.co.uk/wp-json/wp/v2'

export default async function LatestNewsPage() {
    // Fetch posts and categories from the blog API
    const posts = await fetchPosts(20, 1, BLOG_API_BASE)
    const categories = await fetchCategories(20, BLOG_API_BASE)

    const renderContent = () => {
        if (posts.length < 4) {
            return (
                <SectionGridPosts
                    posts={posts}
                    postCardName="card11"
                    heading="Latest Articles"
                    subHeading="Fresh content from our team"
                    gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                />
            )
        }

        return (
            <>
                <div className="mb-16">
                    <SectionHero3 posts={posts.slice(0, 4)} />
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

                <SectionGridPosts
                    posts={posts.slice(4)}
                    postCardName="card11"
                    heading="Latest Articles"
                    subHeading="Fresh content from our team"
                    gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                />
            </>
        )
    }

    return (
        <div className="container mx-auto pb-20 pt-10 lg:pb-24 lg:pt-16">
            <div className="mb-10 text-center lg:mb-16">
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Latest News</h1>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                    Stay up to date with our newest content from the blog
                </p>
            </div>

            {renderContent()}
        </div>
    )
}

