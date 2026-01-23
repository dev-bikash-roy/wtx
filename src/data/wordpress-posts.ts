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
    // 1. Check local cache (Firestore) for existing post with summary
    const { getDocs, query, collection, where, addDoc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase/config')

    // We treat Firestore "posts" collection as the cache if it has aiSummary
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('slug', '==', handle), where('status', '==', 'published'))
    const snap = await getDocs(q)

    let cachedDoc = null
    if (!snap.empty) {
      cachedDoc = snap.docs[0]
      const data = cachedDoc.data()
      if (data.aiSummary) {
        const wpPost = await multiWP.getPostBySlug(handle)
        if (wpPost) {
          wpPost.aiSummary = data.aiSummary
          return wpPost
        }
      }
    }

    // 2. Fetch from WordPress
    const wpPost = await multiWP.getPostBySlug(handle)

    if (wpPost) {
      // 3. Generate Summary if missing
      const { generateSummary } = await import('@/lib/ai-summary')
      const plainText = wpPost.content?.replace(/<[^>]*>/g, '') || ''
      const summary = await generateSummary(plainText)

      if (summary) {
        // 4. Save to Firestore
        if (cachedDoc) {
          await updateDoc(cachedDoc.ref, { aiSummary: summary, updatedAt: serverTimestamp() })
        } else {
          // Create new doc in Firestore as a "shadow" post for caching summary? 
          // Or fully import it? Let's just store metadata for now to avoid duplication conflict logic complexity
          // Actually, the original code did 'upsert' into PostModel. 
          // We can insert a new document into 'posts' collection with proper fields.
          await addDoc(postsRef, {
            slug: handle,
            title: wpPost.title,
            content: wpPost.content || '',
            author: wpPost.author.id, // This might need mapping if not matching our auth user IDs
            status: 'published',
            aiSummary: summary,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            source: 'wordpress_cache' // Tag it so we know it's cache
          })
        }

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