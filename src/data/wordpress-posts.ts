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
  console.log('[getPostByHandleWithWordPress] Received handle:', handle)

  // Try WordPress posts FIRST (not local mock data)
  try {
    // Extract actual slug from handle (remove site ID prefix if present)
    // Handle format: "siteId-actual-slug" or just "actual-slug"
    let actualSlug = handle
    const handleParts = handle.split('-')

    // Check if first part is a valid site ID
    if (handleParts.length >= 2) {
      const potentialSiteId = handleParts[0]
      // Known site IDs: wtxnews, wtxblog
      if (potentialSiteId === 'wtxnews' || potentialSiteId === 'wtxblog') {
        actualSlug = handleParts.slice(1).join('-')
        console.log('[getPostByHandleWithWordPress] Extracted slug:', actualSlug, 'from handle:', handle)
      }
    }

    // 1. Check local cache (Firestore) for existing post with summary
    const { getDocs, query, collection, where, addDoc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase/config')

    // We treat Firestore "posts" collection as the cache if it has aiSummary
    // Query using the actual slug (without site ID)
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('slug', '==', actualSlug), where('status', '==', 'published'))
    const snap = await getDocs(q)

    let cachedDoc = null
    if (!snap.empty) {
      cachedDoc = snap.docs[0]
      const data = cachedDoc.data()
      console.log('[getPostByHandleWithWordPress] Found cached post:', data.title)
      if (data.aiSummary) {
        // Fetch fresh data from WordPress but use cached AI summary
        const wpPost = await multiWP.getPostBySlug(handle)
        if (wpPost) {
          wpPost.aiSummary = data.aiSummary
          console.log('[getPostByHandleWithWordPress] Returning WordPress post with cached summary')
          return wpPost
        }
      }
    }

    // 2. Fetch from WordPress
    console.log('[getPostByHandleWithWordPress] Fetching from WordPress with handle:', handle)
    const wpPost = await multiWP.getPostBySlug(handle)

    if (wpPost) {
      console.log('[getPostByHandleWithWordPress] Got WordPress post:', wpPost.title)
      console.log('[getPostByHandleWithWordPress] Content length:', wpPost.content?.length || 0)
      console.log('[getPostByHandleWithWordPress] Content preview:', wpPost.content?.substring(0, 200))


      // DISABLED: AI summary generation (OpenAI API key not configured)
      // Uncomment this block when you have a valid OpenAI API key
      /*
      // 3. Generate Summary if missing (but don't block if it fails)
      try {
        const { generateSummary } = await import('@/lib/ai-summary')
        const plainText = wpPost.content?.replace(/<[^>]*>/g, '') || ''
        const summary = await generateSummary(plainText)

        if (summary) {
          // 4. Save to Firestore using actual slug (without site ID)
          if (cachedDoc) {
            await updateDoc(cachedDoc.ref, { aiSummary: summary, updatedAt: serverTimestamp() })
          } else {
            await addDoc(postsRef, {
              slug: actualSlug,
              title: wpPost.title,
              content: wpPost.content || '',
              author: wpPost.author.id,
              status: 'published',
              aiSummary: summary,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              source: 'wordpress_cache'
            })
          }

          wpPost.aiSummary = summary
        }
      } catch (summaryError) {
        console.error('Error generating AI summary:', summaryError)
        // Continue without AI summary - don't block the post from displaying
      }
      */


      return wpPost
    }

    console.log('[getPostByHandleWithWordPress] No WordPress post found, trying local posts')
  } catch (error) {
    console.error('Error fetching WordPress post:', error)
  }

  // Fallback to local posts ONLY if WordPress fails
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