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
    const allPosts = [...localPosts, ...wpPosts]
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return allPosts
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
    const wpPost = await multiWP.getPostBySlug(handle)
    return wpPost
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