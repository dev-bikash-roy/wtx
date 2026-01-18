import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getCategoriesWithPosts } from '@/data/categories'
import { getAllPostsWithWordPress, getWordPressPostsByCategory, getWordPressPostsByTag } from '@/data/wordpress-posts'
import { Metadata } from 'next'
import GeminiSmartSearch from '@/components/GeminiSmartSearch'

export const metadata: Metadata = {
    title: 'UK Politics News | WTX News',
    description: 'Latest UK Politics, Westminster, Downing Street & Party News from WTX News',
}

const Page = async () => {
    // --- Fetch Politics Posts ---
    const allPoliticsPosts = await getWordPressPostsByCategory('uk-politics', 60)

    // Fallback
    const defaultPosts = await getAllPostsWithWordPress({ perPage: 20 })

    const getPostsOrFallback = (posts: any[], count: number) => {
        if (posts && posts.length >= count) return posts.slice(0, count);
        if (posts && posts.length > 0) return posts;
        return defaultPosts.slice(0, count);
    }

    // 1. Today’s political headlines
    // Just the latest posts from uk-politics
    const headlines = allPoliticsPosts.slice(0, 5)

    // 2. Politics tag
    const politicsTagPosts = await getWordPressPostsByTag('politics', 6)

    // 3. Live from Westminster
    const westminsterPosts = await getWordPressPostsByTag('live-westminster', 6)

    // 4. Downing Street News
    const downingStreetPosts = await getWordPressPostsByTag('downing-street', 6)

    // 5. Keir Starmer watch (Filters: UK US relations, UK EU relations)
    const starmerPosts = await getWordPressPostsByTag('keir-starmer', 6)
    const ukUsRelations = await getWordPressPostsByTag('uk-us-relations', 4)
    const ukEuRelations = await getWordPressPostsByTag('uk-eu-relations', 4)

    // 6. Parties
    const toryPosts = await getWordPressPostsByTag('tory-party', 4) // or conservative
    const greenPosts = await getWordPressPostsByTag('green-party', 4)
    const labourPosts = await getWordPressPostsByTag('labour-party', 4)
    const reformPosts = await getWordPressPostsByTag('reform-uk', 4)
    // "Your Party" - Assuming this might be 'independent' or similar, or just a placeholder. 
    // I will look for 'independent' or leave blank/generic.
    const independentPosts = await getWordPressPostsByTag('independent', 4)


    return (
        <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
            {/* 1. Today’s political headlines */}
            <SectionLargeSlider
                heading="Today’s political headlines"
                subHeading="Breaking news from the UK political landscape"
                className="pt-10 lg:pt-16 mb-16"
                posts={getPostsOrFallback(headlines, 5)}
            />

            {/* AI Smart Search Section for Politics */}
            <GeminiSmartSearch posts={allPoliticsPosts} />

            {/* 2. Politics tag */}
            <SectionMagazine1
                heading="Politics"
                subHeading="Tag - Politics"
                posts={getPostsOrFallback(politicsTagPosts, 5)}
            />

            {/* 3. Live from Westminster */}
            <SectionMagazine5
                heading="Live from Westminster"
                subHeading="Updates from the House of Commons and Lords"
                posts={getPostsOrFallback(westminsterPosts, 5)}
            />

            {/* 4. Downing Street News */}
            <SectionSliderPosts
                heading="Downing Street News"
                subHeading="Latest from Number 10"
                posts={getPostsOrFallback(downingStreetPosts, 6)}
                postCardName="card10"
            />

            {/* 5. Keir Starmer watch (Filters) */}
            <div className="space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Keir Starmer Watch</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">Tracking the Prime Minister's moves</p>
                </div>

                <SectionGridPosts
                    heading="Analysis & Updates"
                    posts={getPostsOrFallback(starmerPosts, 4)}
                    gridClass="sm:grid-cols-2 lg:grid-cols-4"
                />

                <SectionMagazine2
                    heading="International Relations"
                    subHeading="UK-US Relations | UK-EU Relations"
                    posts={getPostsOrFallback([...ukUsRelations, ...ukEuRelations], 5)}
                />
            </div>

            {/* 6. Parties */}
            <div className="space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Political Parties</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">Latest from across the aisle</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <SectionMagazine1
                        heading="Labour Party"
                        posts={getPostsOrFallback(labourPosts, 3)}
                    />
                    <SectionMagazine1
                        heading="Conservative Party"
                        posts={getPostsOrFallback(toryPosts, 3)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <SectionMagazine1
                        heading="Green Party"
                        posts={getPostsOrFallback(greenPosts, 2)}
                    />
                    <SectionMagazine1
                        heading="Reform UK"
                        posts={getPostsOrFallback(reformPosts, 2)}
                    />
                    <SectionMagazine1
                        heading="Other / Independent"
                        posts={getPostsOrFallback(independentPosts, 2)}
                    />
                </div>
            </div>

            {/* Subscribe */}
            <SectionSubscribe2 />

        </div>
    )
}

export default Page
