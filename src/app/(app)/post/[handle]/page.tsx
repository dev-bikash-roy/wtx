import WidgetAbout from '@/components/WidgetAbout'
import WidgetArchive from '@/components/WidgetArchive'
import WidgetAuthors from '@/components/WidgetAuthors'
import WidgetCategories from '@/components/WidgetCategories'
import WidgetNewsletter from '@/components/WidgetNewsletter'
import WidgetPopularPosts from '@/components/WidgetPopularPosts'
import WidgetRecentPosts from '@/components/WidgetRecentPosts'
import WidgetRelatedByCategory from '@/components/WidgetRelatedByCategory'
import WidgetSocialFollow from '@/components/WidgetSocialFollow'
import WidgetTags from '@/components/WidgetTags'
import { getAuthors } from '@/data/authors'
import { getCategories, getTags } from '@/data/categories'
import { getAllPosts, getCommentsByPostId, getPostByHandle } from '@/data/posts'
import { Metadata } from 'next'
import SingleContentContainer from '../SingleContentContainer'
import SingleHeaderContainer from '../SingleHeaderContainer'
import SingleRelatedPosts from '../SingleRelatedPosts'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const post = await getPostByHandle(handle)
  if (!post) {
    return {
      title: 'Post not found',
      description: 'Post not found',
    }
  }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const post = await getPostByHandle(handle)
  const comments = await getCommentsByPostId(post.id)
  const relatedPosts = (await getAllPosts()).slice(0, 6)
  const moreFromAuthorPosts = (await getAllPosts()).slice(1, 7)

  const allPosts = await getAllPosts()
  const widgetRecentPosts = allPosts.slice(0, 5)
  const widgetPopularPosts = allPosts.slice(0, 5)
  const widgetCategories = (await getCategories()).slice(0, 6)
  const widgetTags = (await getTags()).slice(0, 8)
  const widgetAuthors = (await getAuthors()).slice(0, 4)
  
  // Get related posts from the same category
  const postCategory = post?.categories?.[0]
  const relatedByCategory = postCategory 
    ? allPosts.filter(p => 
        p.id !== post.id && 
        p.categories.some(cat => cat.name === postCategory.name)
      ).slice(0, 4)
    : []

  return (
    <>
      <div className="single-post-page">
        <SingleHeaderContainer post={post} />

        <div className="container mt-12 flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 xl:w-2/3 xl:pe-20">
            <SingleContentContainer post={post} comments={comments} />
          </div>
          <div className="mt-12 w-full lg:mt-0 lg:w-2/5 lg:ps-10 xl:w-1/3 xl:ps-0">
            <div className="space-y-7 lg:sticky lg:top-7">
              {/* Most engaging widgets first */}
              <WidgetNewsletter />
              
              {/* Content discovery widgets */}
              {relatedByCategory.length > 0 && (
                <WidgetRelatedByCategory 
                  posts={relatedByCategory} 
                  categoryName={postCategory?.name} 
                />
              )}
              <WidgetPopularPosts posts={widgetPopularPosts} />
              
              {/* Show fewer widgets on mobile */}
              <div className="block lg:hidden">
                <WidgetTags tags={widgetTags} />
                <div className="mt-7">
                  <WidgetSocialFollow />
                </div>
              </div>
              
              {/* Desktop-only widgets */}
              <div className="hidden lg:block space-y-7">
                <WidgetRecentPosts posts={widgetRecentPosts} />
                <WidgetCategories categories={widgetCategories} />
                <WidgetTags tags={widgetTags} />
                <WidgetSocialFollow />
                <WidgetAuthors authors={widgetAuthors} />
                <WidgetArchive />
                <WidgetAbout />
              </div>
            </div>
          </div>
        </div>

        <SingleRelatedPosts relatedPosts={relatedPosts} moreFromAuthorPosts={moreFromAuthorPosts} />
      </div>
    </>
  )
}

export default Page
