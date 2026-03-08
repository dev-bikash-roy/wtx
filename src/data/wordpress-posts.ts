import { multiWP } from '@/lib/multi-wp-integration'
import { TPost } from './posts'

// Enhanced post fetching that combines local and WordPress posts
export async function getAllPostsWithWordPress(options: {
  page?: number
  perPage?: number
  search?: string
  categories?: string[]
  tags?: string[]
  includeWordPress?: boolean
} = {}): Promise<TPost[]> {
  const { includeWordPress = true } = options

  // Get local posts (your existing posts)
  const { getAllPosts } = await import('./posts')
  const localPosts = await getAllPosts()

  if (!includeWordPress) {
    return localPosts
  }

  try {
    // Get WordPress posts
    const wpPosts = await multiWP.fetchPostsAsTPost(options)

    // Combine and sort by date
    // Combine and sort by date
    const allPosts = [...localPosts, ...wpPosts]

    // Deduplicate based on ID
    const uniquePostsMap = new Map()
    allPosts.forEach(post => {
      uniquePostsMap.set(post.id, post)
    })

    const uniquePosts = Array.from(uniquePostsMap.values())
    uniquePosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // TEMPORARILY DISABLED: Strip content to reduce payload size for list views
    // return uniquePosts.map(post => ({ ...post, content: undefined }))
    return uniquePosts
  } catch (error) {
    console.error('Error fetching WordPress posts:', error)
    // Return local posts if WordPress fails
    return localPosts
  }
}

// Get post by handle/slug from both local and WordPress
export async function getPostByHandleWithWordPress(handle: string): Promise<TPost | null> {
  console.log('[getPostByHandleWithWordPress] Looking for post with handle:', handle)

  try {
    // Fetch directly from WordPress (no Firestore client SDK on server)
    console.log('[getPostByHandleWithWordPress] Fetching from WordPress')
    const wpPost = await multiWP.getPostBySlug(handle)

    if (wpPost) {
      console.log('[getPostByHandleWithWordPress] Found WordPress post:', wpPost.title)
      return wpPost
    }

    console.log('[getPostByHandleWithWordPress] No WordPress post found, trying local posts')
  } catch (error) {
    console.error('Error fetching WordPress post:', error)
  }

  // Fallback to local posts if WordPress fails
  const { getPostByHandle } = await import('./posts')
  const localPost = await getPostByHandle(handle)

  if (localPost) {
    console.log('[getPostByHandleWithWordPress] Found local post as fallback')
    return localPost
  }

  console.log('[getPostByHandleWithWordPress] No post found')
  return null
}

// Get recent posts from WordPress sites
export async function getRecentWordPressPosts(limit: number = 5): Promise<TPost[]> {
  try {
    const wpPosts = await multiWP.fetchPostsAsTPost({ perPage: limit })
    // TEMPORARILY DISABLED: return wpPosts.slice(0, limit).map(post => ({ ...post, content: undefined }))
    return wpPosts.slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent WordPress posts:', error)
    return []
  }
}

// Get posts by category from WordPress
export async function getWordPressPostsByCategory(categorySlug: string, limit: number = 10): Promise<TPost[]> {
  try {
    const wpPosts = await multiWP.fetchPostsAsTPost({
      categories: [categorySlug],
      perPage: limit
    })
    // TEMPORARILY DISABLED: return wpPosts.map(post => ({ ...post, content: undefined }))
    return wpPosts
  } catch (error) {
    console.error('Error fetching WordPress posts by category:', error)
    return []
  }
}

// Get posts by tag from WordPress
export async function getWordPressPostsByTag(tagSlug: string, limit: number = 10): Promise<TPost[]> {
  try {
    const wpPosts = await multiWP.fetchPostsAsTPost({
      tags: [tagSlug],
      perPage: limit
    })
    // TEMPORARILY DISABLED: return wpPosts.map(post => ({ ...post, content: undefined }))
    return wpPosts
  } catch (error) {
    console.error('Error fetching WordPress posts by tag:', error)
    return []
  }
}

// Search posts across all sources
export async function searchAllPosts(query: string, limit: number = 20): Promise<TPost[]> {
  try {
    const allPosts = await getAllPostsWithWordPress({
      search: query,
      perPage: limit
    })
    return allPosts
  } catch (error) {
    console.error('Error searching posts:', error)
    return []
  }
}

// Get WordPress site statistics
export async function getWordPressSiteStats(): Promise<{
  totalSites: number
  activeSites: number
  totalPosts: number
  siteDetails: Array<{
    siteId: string
    siteName: string
    postCount: number
    success: boolean
    error?: string
  }>
}> {
  try {
    const result = await multiWP.fetchAllPosts({ perPage: 100 })

    return {
      totalSites: result.sites.length,
      activeSites: result.sites.filter(s => s.success).length,
      totalPosts: result.totalPosts,
      siteDetails: result.sites
    }
  } catch (error) {
    console.error('Error fetching WordPress site stats:', error)
    return {
      totalSites: 0,
      activeSites: 0,
      totalPosts: 0,
      siteDetails: []
    }
  }
}