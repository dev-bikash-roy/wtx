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
import { getPostsDefault as getAllPosts, getPostsVideo, getPostsAudio, getPostsGallery } from '@/data/posts'
import { getAuthors } from '@/data/authors'
import { getTagsWithPosts } from '@/data/categories'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'WTX News - Global News, Politics, Sports & Lifestyle',
}

const Page = async () => {
  // Fetch different types of posts
  const posts = await getAllPosts()
  const videoPosts = await getPostsVideo()
  const categoryPosts = await getPostsAudio() // Using this for other category posts instead of audio
  const galleryPosts = await getPostsGallery()

  const authors = await getAuthors()
  const categories = await getCategories()
  const categoriesWithPosts = await getCategoriesWithPosts()
  const tagsWithPosts = await getTagsWithPosts()

  // Ensure we have enough posts for each section by duplicating if necessary
  // But now we'll make sure each section gets different posts
  const getPostsForSection = (postArray: any[], count: number, startIndex: number = 0) => {
    if (postArray.length >= count) {
      // Return posts starting from startIndex to ensure variety
      const startIndexAdjusted = startIndex % postArray.length
      const endIndex = Math.min(startIndexAdjusted + count, postArray.length)
      let selectedPosts = postArray.slice(startIndexAdjusted, endIndex)

      // If we don't have enough posts, wrap around to the beginning
      if (selectedPosts.length < count) {
        const remainingCount = count - selectedPosts.length
        selectedPosts = [...selectedPosts, ...postArray.slice(0, remainingCount)]
      }

      return selectedPosts
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
        posts={getPostsForSection(posts, 5, 0)}
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
        posts={getPostsForSection(posts, 6, 5)}
      />

      {/* Magazine Layout 1 - Mixed Grid */}
      <SectionMagazine1
        heading="Editor's Pick"
        subHeading="Curated articles by our editors"
        posts={getPostsForSection(posts, 5, 11)}
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
        posts={getPostsForSection(posts, 5, 16)}
      />

      {/* Latest Articles Grid */}
      <SectionGridPosts
        headingIsCenter
        postCardName="card11"
        heading="Latest Articles"
        subHeading="Stay up to date with our newest content"
        posts={getPostsForSection(posts, 8, 21)}
        gridClass="md:grid-cols-2 lg:grid-cols-4"
      />

      {/* Category Posts Slider (replacing audio posts) */}
      <SectionSliderPosts
        heading="Technology News"
        subHeading="Latest in technology and innovation"
        posts={getPostsForSection(categoryPosts.length > 0 ? categoryPosts : posts, 6, 0)}
        postCardName="card10"
      />

      {/* Magazine Layout 3 - Two Columns */}
      <SectionMagazine3
        heading="Popular in Tech"
        subHeading="Technology trends and insights"
        posts={getPostsForSection(posts, 5, 29)}
      />

      {/* Magazine Layout 6 - Featured with Sidebar */}
      <SectionMagazine6
        heading="Spotlight"
        subHeading="Featured stories you shouldn't miss"
        posts={getPostsForSection(posts, 5, 34)}
      />

      {/* Magazine Layout 7 - Mixed Grid */}
      <SectionMagazine7
        heading="Trending Now"
        subHeading="What's hot in our community"
        posts={getPostsForSection(posts, 6, 39)}
      />

      {/* Magazine Layout 8 - Gallery Section */}
      <SectionMagazine8
        heading="Photo Stories"
        subHeading="Visual storytelling through images"
        posts={getPostsForSection(galleryPosts.length > 0 ? galleryPosts : posts, 6, 0)}
      />

      {/* Magazine Layout 9 - Mixed Content */}
      <SectionMagazine9
        heading="From Our Blog"
        subHeading="Latest updates from our writers"
        posts={getPostsForSection(posts, 7, 45)}
      />

      {/* Magazine Layout 10 - Featured Grid */}
      <SectionMagazine10
        posts={getPostsForSection(posts, 4, 52)}
      />

      {/* Magazine Layout 4 - Card Layout */}
      <SectionMagazine4
        heading="From Our Blog"
        subHeading="Latest updates from our writers"
        posts={getPostsForSection(posts, 6, 56)}
      />

      {/* Magazine Layout 11 - Categories with Posts */}
      <SectionMagazine11
        heading="Browse by Category"
        subHeading="Explore articles in different topics"
        categories={categoriesWithPosts.slice(0, 3)}
      />

      {/* Authors Slider */}
      <SectionSliderNewAuthors
        heading="Popular Authors"
        subHeading="Writers behind our best content"
        authors={authors.slice(0, 8)}
      />

      {/* Authors Grid */}
      <SectionGridAuthorBox
        heading="Our Contributors"
        subHeading="Meet the talented writers of our platform"
        authors={authors.slice(0, 10)}
      />

      {/* Magazine Layout 5 - Featured Large */}
      <SectionMagazine5
        heading="Spotlight"
        subHeading="Featured stories you shouldn't miss"
        posts={getPostsForSection(posts, 5, 62)}
      />

      {/* Posts with Widgets */}
      <SectionPostsWithWidgets
        heading="Latest News"
        subHeading="Stay updated with our latest articles"
        posts={getPostsForSection(posts, 6, 67)}
        widgetCategories={categories.slice(0, 5)}
        widgetAuthors={authors.slice(0, 4)}
        widgetTags={tagsWithPosts.slice(0, 8)}
        widgetPosts={getPostsForSection(posts, 4, 73)}
        postCardName="card9"
      />

      {/* Become an Author Section */}
      <SectionBecomeAnAuthor />

      {/* Subscribe Section */}
      <SectionSubscribe2 />
    </div>
  )
}

export default Page