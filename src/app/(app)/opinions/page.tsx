import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import WidgetTags from '@/components/WidgetTags'
import { fetchPostsByTag, fetchCategories, fetchTags } from '@/data/wp-api'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Opinions & Essentials | WTX News',
    description: 'Opinion pieces and essential reading from WTX News',
}

const BLOG_API_BASE = 'https://blog.wtxnews.co.uk/wp-json/wp/v2'

export default async function OpinionsPage() {
    // Fetching by tag 'opinions' since it was set as a tag in the menu previously
    const posts = await fetchPostsByTag('opinions', 20, 1, BLOG_API_BASE)
    const categories = await fetchCategories(20, BLOG_API_BASE)
    const tags = await fetchTags(20, BLOG_API_BASE)

    return (
        <div className="container pb-20 pt-10 lg:pb-24 lg:pt-16">
            <div className="mb-10 text-center lg:mb-16">
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Opinions</h1>
                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                    Perspectives that matter
                </p>
            </div>

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
                <div className="w-full lg:w-3/4 lg:pr-10">
                    <SectionGridPosts
                        posts={posts}
                        heading="Latest Opinions"
                        subHeading="Thought-provoking reads"
                        gridClass="sm:grid-cols-2"
                    />
                </div>
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
