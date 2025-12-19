import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine7 from '@/components/SectionMagazine7'
import SectionGridPosts from '@/components/SectionGridPosts'
import { multiWP } from '@/lib/multi-wp-integration'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Read the latest updates, insights, and stories from our team at WTX News.',
}

const BlogPage = async () => {
    // Fetch posts specifically from the blog site (wtxblog)
    const posts = await multiWP.getPostsBySiteAsTPost('wtxblog', { perPage: 20 })

    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            <div className="pt-10 lg:pt-16">
                <h1 className="text-3xl font-bold md:text-5xl">WTX Blog</h1>
                <p className="mt-4 text-neutral-500 text-lg dark:text-neutral-400">
                    Latest updates, insights and stories from our team.
                </p>
            </div>

            {posts.length > 0 ? (
                <>
                    {/* Featured Section */}
                    <SectionMagazine1
                        heading="Featured Stories"
                        subHeading="Highlights from our blog"
                        posts={posts.slice(0, 5)}
                    />

                    {/* More Posts */}
                    <SectionMagazine7
                        heading="Recent Updates"
                        subHeading="What's happening now"
                        posts={posts.slice(5, 11)}
                    />

                    {/* Grid for the rest */}
                    {posts.length > 11 && (
                        <SectionGridPosts
                            headingIsCenter
                            postCardName="card11"
                            heading="More Stories"
                            subHeading="Explore our archive"
                            posts={posts.slice(11)}
                            gridClass="md:grid-cols-2 lg:grid-cols-3"
                        />
                    )}
                </>
            ) : (
                <div className="flex min-h-[40vh] items-center justify-center text-center">
                    <div>
                        <h2 className="text-2xl font-semibold">No posts found</h2>
                        <p className="mt-2 text-neutral-500">
                            Check back later for updates from our blog.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogPage
