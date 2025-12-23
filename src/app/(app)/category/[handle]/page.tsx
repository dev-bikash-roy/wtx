import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import { getCategories, getCategoryByHandle, getTags } from '@/data/categories'
import { getAllPosts } from '@/data/posts'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '../page-header'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)

  if (!category) {
    return {
      title: 'Category not found',
      description: 'Category not found',
    }
  }

  return {
    title: category?.name,
    description: category?.description,
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)
  const posts = category.posts || []
  const categories = await getCategories()
  const tags = await getTags()

  // Get featured posts for this category
  const featuredPosts = posts.slice(0, 5)
  const recentPosts = posts.slice(5, 11)

  if (!category) {
    return notFound()
  }

  const filterOptions = [
    { name: 'Most recent', value: 'most-recent' },
    { name: 'Curated by admin', value: 'curated-by-admin' },
    { name: 'Most appreciated', value: 'most-appreciated' },
    { name: 'Most discussed', value: 'most-discussed' },
    { name: 'Most viewed', value: 'most-viewed' },
  ]

  return (
    <div className={`page-category-${handle}`}>
      <PageHeader category={category} />

      <div className="container pt-10 lg:pt-20">
        {/* FEATURED POSTS SLIDER */}
        <SectionSliderPosts
          heading="Featured in this category"
          subHeading="Handpicked stories you might like"
          posts={featuredPosts}
          postCardName="card11"
        />

        <div className="flex flex-wrap gap-x-2 gap-y-4 mt-12">
          <ModalCategories categories={categories} />
          <ModalTags tags={tags} />
          <div className="ms-auto">
            <ArchiveSortByListBox filterOptions={filterOptions} />
          </div>
        </div>

        {/* LOOP ITEMS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-7 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {recentPosts.map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>

        {/* PAGINATIONS */}
        <PaginationWrapper className="mt-20" />
      </div>
    </div>
  )
}

export default Page
