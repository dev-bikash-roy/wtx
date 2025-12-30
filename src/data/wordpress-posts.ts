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

    return uniquePosts
  } catch (error) {
    console.error('Error fetching WordPress posts:', error)
    // Return local posts if WordPress fails
    return localPosts
  }
}

// Get post by handle/slug from both local and WordPress
export async function getPostByHandleWithWordPress(handle: string): Promise<TPost | null> {
  // First try local posts
  const { getPostByHandle } = await import('./posts')
  const localPost = await getPostByHandle(handle)

  if (localPost) {
    return localPost
  }

  // Try WordPress posts
  try {
    // 1. Check local cache (MongoDB) for existing post with summary
    const dbConnect = (await import('@/db/connection')).default
    await dbConnect()

    const PostModel = (await import('@/db/models/Post')).default

    if (PostModel) {
      const cachedPost = await PostModel.findOne({ slug: handle })
      if (cachedPost && cachedPost.aiSummary) {
        // Fetch fresh content from WP to ensure it's up to date, but use cached summary
        // Or just return cached post? Let's fetch WP to map to TPost structure correctly,
        // then attach summary.
        const wpPost = await multiWP.getPostBySlug(handle)
        if (wpPost) {
          wpPost.aiSummary = cachedPost.aiSummary
          return wpPost
        }
      }
    }

    // 2. Fetch from WordPress
    const wpPost = await multiWP.getPostBySlug(handle)

    if (wpPost) {
      // 3. Generate Summary if missing
      const { generateSummary } = await import('@/lib/ai-summary')
      // We use the content for summary generation
      // NOTE: wpPost.content might contain HTML. The summarizer should handle it or we strip it.
      // The summarizer prompt says "article content", ideally plain text.
      // Let's strip simple tags for better cost/quality.
      const plainText = wpPost.content?.replace(/<[^>]*>/g, '') || ''

      const summary = await generateSummary(plainText)

      if (summary && PostModel) {
        // 4. Save to DB
        // We verify if it exists again or use upsert
        await PostModel.findOneAndUpdate(
          { slug: handle },
          {
            slug: handle,
            title: wpPost.title,
            // We save minimum required fields to satisfy schema
            content: wpPost.content || '',
            author: wpPost.author.id,
            status: 'published',
            aiSummary: summary
          },
          { upsert: true, new: true }
        )

        wpPost.aiSummary = summary
      }

      return wpPost
    }

    return null
  } catch (error) {
    console.error('Error fetching WordPress post:', error)
    return null
  }
}

// Get recent posts from WordPress sites
export async function getRecentWordPressPosts(limit: number = 5): Promise<TPost[]> {
  try {
    const wpPosts = await multiWP.fetchPostsAsTPost({ perPage: limit })
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