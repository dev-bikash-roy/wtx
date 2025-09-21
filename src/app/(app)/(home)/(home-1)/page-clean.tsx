import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import { getCategories } from '@/data/categories'
import { getPostsDefault as getAllPosts } from '@/data/posts'
import { getAuthors } from '@/data/authors'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page showcasing the latest articles and categories.',
}

const CleanHomePage = async () => {
  const posts = await getAllPosts()
  const authors = await getAuthors()
  const categories = await getCategories()

  return (
    <div className="relative container space-y-20 pb-20 lg:space-y-24 lg:pb-24">
      {/* Hero Section with Featured Posts */}
      <SectionLargeSlider
        heading="Featured Articles"
        subHeading="The most outstanding articles"
        className="pt-10 lg:pt-16"
        posts={posts.slice(0, 5)}
      />

      {/* Categories Section */}
      <SectionSliderNewCategories
        heading="Explore Categories"
        subHeading="Browse articles by topic"
        categories={categories.slice(0, 8)}
        categoryCardType="card4"
      />

      {/* Latest Articles Grid */}
      <SectionGridPosts
        headingIsCenter
        postCardName="card11"
        heading="Latest Articles"
        subHeading="Stay up to date with our newest content"
        posts={posts.slice(0, 8)}
        gridClass="md:grid-cols-2 lg:grid-cols-4"
      />
    </div>
  )
}

export default CleanHomePage