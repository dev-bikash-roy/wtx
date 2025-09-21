import { getAllPosts, getCommentsByPostId, getPostByHandle } from '@/data/posts'
import { Metadata } from 'next'
import SingleContentContainer from '../../SingleContentContainer'
import SingleHeaderContainer from '../../SingleHeaderContainer'
import SingleRelatedPosts from '../../SingleRelatedPosts'

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

  return (
    <>
      <div className="single-post-page page-style-2">
        <SingleHeaderContainer post={post} headerStyle="style2" />

        <div className="container mt-12">
          <SingleContentContainer post={post} comments={comments} />
        </div>

        <SingleRelatedPosts relatedPosts={relatedPosts} moreFromAuthorPosts={moreFromAuthorPosts} />
      </div>
    </>
  )
}

export default Page
