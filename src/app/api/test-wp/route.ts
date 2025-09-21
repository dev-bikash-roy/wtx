import { fetchPosts } from '@/data/wp-api'

export async function GET() {
  try {
    const posts = await fetchPosts(1, 1)
    return new Response(JSON.stringify({ 
      success: true, 
      posts: posts,
      postCount: posts.length,
      hasContent: posts.length > 0 ? !!posts[0].content : false,
      contentLength: posts.length > 0 ? posts[0].content?.length : 0
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}