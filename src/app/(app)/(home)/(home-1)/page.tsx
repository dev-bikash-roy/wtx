import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionVideos from '@/components/SectionVideos'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine3 from '@/components/SectionMagazine3'
import SectionMagazine4 from '@/components/SectionMagazine4'
import SectionMagazine5 from '@/components/SectionMagazine5'
import SectionTrending from '@/components/SectionTrending'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import { getCategories } from '@/data/categories'
import { getPostsDefault as getAllPosts, getPostsVideo, getPostsAudio } from '@/data/posts'
import { getAuthors } from '@/data/authors'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page showcasing the latest articles and categories.',
}

const Page = async () => {
  // Fetch different types of posts
  const posts = await getAllPosts()
  const videoPosts = await getPostsVideo()
  const audioPosts = await getPostsAudio()
  
  const authors = await getAuthors()
  const categories = await getCategories()

  // Ensure we have enough posts for each section by duplicating if necessary
  const getPostsForSection = (postArray: any[], count: number) => {
    if (postArray.length >= count) {
      return postArray.slice(0, count)
    }
    // If not enough posts, duplicate the existing ones
    const result = [...postArray]
    while (result.length < count) {
      result.push(...postArray.slice(0, Math.min(postArray.length, count - result.length)))
    }
    return result.slice(0, count)
  }

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
      {/* Hero Section with Featured Posts */}
      <SectionLargeSlider
        heading="Featured Articles"
        subHeading="The most outstanding articles"
        className="pt-10 lg:pt-16"
        posts={getPostsForSection(posts, 5)}
      />

      {/* Categories Section */}
      <SectionSliderNewCategories
        heading="Explore Categories"
        subHeading="Browse articles by topic"
        categories={categories.slice(0, 8)}
        categoryCardType="card4"
      />

      {/* Trending Posts */}
      <SectionTrending 
        heading="Trending This Week"
        subHeading="Most popular articles this week"
        posts={getPostsForSection(posts, 6)}
      />

      {/* Magazine Layout 1 - Mixed Grid */}
      <SectionMagazine1
        heading="Editor's Pick"
        subHeading="Curated articles by our editors"
        posts={getPostsForSection(posts, 5)}
      />

      {/* Video Posts Section */}
      {videoPosts.length > 0 && (
        <SectionVideos
          heading="Video Stories"
          subHeading="Watch the latest video content"
          videos={getPostsForSection(videoPosts, 4).map(post => ({
            id: post.id,
            title: post.title,
            thumbnail: post.featuredImage.src,
            video: post.videoUrl || 'https://www.youtube.com/watch?v=vHBodN0Mirs'
          }))}
        />
      )}

      {/* Magazine Layout 2 - Featured Post */}
      <SectionMagazine2
        heading="In Depth"
        subHeading="Detailed analysis and long-form articles"
        posts={getPostsForSection(posts, 5)}
      />

      {/* Latest Articles Grid */}
      <SectionGridPosts
        headingIsCenter
        postCardName="card11"
        heading="Latest Articles"
        subHeading="Stay up to date with our newest content"
        posts={getPostsForSection(posts, 8)}
        gridClass="md:grid-cols-2 lg:grid-cols-4"
      />

      {/* Audio Posts Slider */}
      {audioPosts.length > 0 && (
        <SectionSliderPosts
          heading="Audio Content"
          subHeading="Listen to podcasts and audio articles"
          posts={getPostsForSection(audioPosts, 6)}
          postCardName="card10"
        />
      )}

      {/* Magazine Layout 3 - Two Columns */}
      <SectionMagazine3
        heading="Popular in Tech"
        subHeading="Technology trends and insights"
        posts={getPostsForSection(posts, 5)}
      />

      {/* Magazine Layout 4 - Card Layout */}
      <SectionMagazine4
        heading="From Our Blog"
        subHeading="Latest updates from our writers"
        posts={getPostsForSection(posts, 6)}
      />

      {/* Magazine Layout 5 - Featured Large */}
      <SectionMagazine5
        heading="Spotlight"
        subHeading="Featured stories you shouldn't miss"
        posts={getPostsForSection(posts, 5)}
      />
    </div>
  )
}

export default Page