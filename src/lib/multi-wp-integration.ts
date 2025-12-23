// Multi-WordPress Site Integration
import { wpAuth, WordPressSite } from './wordpress-auth'
import { TPost } from '@/data/posts'

export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: { rendered: string }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: { rendered: string }
  content: { rendered: string; protected: boolean }
  excerpt: { rendered: string; protected: boolean }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any[]
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      url: string
      description: string
      link: string
      slug: string
      avatar_urls: Record<string, string>
    }>
    'wp:featuredmedia'?: Array<{
      id: number
      date: string
      slug: string
      type: string
      link: string
      title: { rendered: string }
      author: number
      caption: { rendered: string }
      alt_text: string
      media_type: string
      mime_type: string
      media_details: {
        width: number
        height: number
        file: string
        sizes: Record<string, {
          file: string
          width: number
          height: number
          mime_type: string
          source_url: string
        }>
      }
      source_url: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      link: string
      name: string
      slug: string
      taxonomy: string
    }>>
  }
  _site?: {
    id: string
    name: string
    url: string
  }
}

export class MultiWordPressIntegration {
  private sites: WordPressSite[]

  constructor() {
    this.sites = wpAuth.getActiveSites()
  }

  // Add a new WordPress site
  addSite(site: WordPressSite) {
    wpAuth.addSite(site)
    this.sites = wpAuth.getActiveSites()
  }

  async fetchPostsBySiteId(siteId: string, options: {
    page?: number
    perPage?: number
    search?: string
    categories?: string[]
    tags?: string[]
  } = {}): Promise<WordPressPost[]> { // Changed return type to Promise<WordPressPost[]>
    const site = wpAuth.getSite(siteId)
    if (!site) {
      console.error(`Site with ID ${siteId} not found`)
      return []
    }

    try {
      const { page = 1, perPage = 10, search, categories, tags } = options
      const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
        _embed: '1',
        orderby: 'date',
        order: 'desc'
      })

      if (search) params.append('search', search)
      if (categories && categories.length > 0) params.append('categories', categories.join(','))
      if (tags && tags.length > 0) params.append('tags', tags.join(','))

      const response = await fetch(`${site.apiBase}/posts?${params}`, {
        headers: { 'User-Agent': 'NextJS-Blog-Integration/1.0' }
      })

      if (response.ok) {
        const posts: WordPressPost[] = await response.json()
        return posts.map(post => ({
          ...post,
          _site: { id: site.id, name: site.name, url: site.url }
        }))
      }
    } catch (error) {
      console.error(`Error fetching posts from ${site.name}:`, error)
    }
    return []
  }

  // Fetch posts from all WordPress sites
  async fetchAllPosts(options: {
    page?: number
    perPage?: number
    search?: string
    categories?: string[]
    tags?: string[]
  } = {}): Promise<{
    posts: WordPressPost[]
    totalPosts: number
    sites: Array<{
      siteId: string
      siteName: string
      postCount: number
      success: boolean
      error?: string
    }>
  }> {
    const { page = 1, perPage = 10, search, categories, tags } = options

    const allPosts: WordPressPost[] = []
    const siteResults: Array<{
      siteId: string
      siteName: string
      postCount: number
      success: boolean
      error?: string
    }> = []

    for (const site of this.sites) {
      try {
        let categoryIds: number[] = []
        let tagIds: number[] = []

        // Resolve category slugs to IDs if provided
        if (categories && categories.length > 0) {
          try {
            // WordPress allows comma-separated slugs
            const catResponse = await fetch(`${site.apiBase}/categories?slug=${categories.join(',')}`, {
              headers: { 'User-Agent': 'NextJS-Blog-Integration/1.0' }
            })

            if (catResponse.ok) {
              const cats: any[] = await catResponse.json()
              categoryIds = cats.map(c => c.id)
            }

            // If we asked for specific categories but found none on this site, skip this site
            // (unless we want to show all posts, but usually filtering means filtering)
            if (categoryIds.length === 0) {
              // No matching categories on this site, skip fetching posts
              siteResults.push({
                siteId: site.id,
                siteName: site.name,
                postCount: 0,
                success: true,
                error: 'No matching categories found'
              })
              continue
            }
          } catch (e) {
            console.error(`Error resolving categories for site ${site.name}`, e)
            // Continue without category filter or skip? 
            // Safest to probably skip if we can't verify category, or log error.
          }
        }

        // Resolve tag slugs to IDs if provided (similar logic)
        if (tags && tags.length > 0) {
          try {
            const tagResponse = await fetch(`${site.apiBase}/tags?slug=${tags.join(',')}`, {
              headers: { 'User-Agent': 'NextJS-Blog-Integration/1.0' }
            })

            if (tagResponse.ok) {
              const t: any[] = await tagResponse.json()
              tagIds = t.map(tag => tag.id)
            }

            if (tagIds.length === 0) {
              siteResults.push({
                siteId: site.id,
                siteName: site.name,
                postCount: 0,
                success: true,
                error: 'No matching tags found'
              })
              continue
            }
          } catch (e) {
            console.error(`Error resolving tags for site ${site.name}`, e)
          }
        }

        const params = new URLSearchParams({
          per_page: perPage.toString(),
          page: page.toString(),
          _embed: '1',
          orderby: 'date',
          order: 'desc'
        })

        if (search) {
          params.append('search', search)
        }

        if (categoryIds.length > 0) {
          params.append('categories', categoryIds.join(','))
        }

        if (tagIds.length > 0) {
          params.append('tags', tagIds.join(','))
        }

        const response = await fetch(`${site.apiBase}/posts?${params}`, {
          headers: {
            'User-Agent': 'NextJS-Blog-Integration/1.0'
          }
        })

        if (response.ok) {
          const posts: WordPressPost[] = await response.json()

          // Add site information to each post
          const postsWithSite = posts.map(post => ({
            ...post,
            _site: {
              id: site.id,
              name: site.name,
              url: site.url
            }
          }))

          allPosts.push(...postsWithSite)
          siteResults.push({
            siteId: site.id,
            siteName: site.name,
            postCount: posts.length,
            success: true
          })
        } else {
          siteResults.push({
            siteId: site.id,
            siteName: site.name,
            postCount: 0,
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`
          })
        }
      } catch (error) {
        siteResults.push({
          siteId: site.id,
          siteName: site.name,
          postCount: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Sort all posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      posts: allPosts,
      totalPosts: allPosts.length,
      sites: siteResults
    }
  }

  // Convert WordPress post to your local TPost format
  convertWordPressPostToTPost(wpPost: WordPressPost): TPost {
    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]
    const author = wpPost._embedded?.author?.[0]
    const categories = wpPost._embedded?.['wp:term']?.[0] || []
    const tags = wpPost._embedded?.['wp:term']?.[1] || []

    return {
      id: `wp-${wpPost._site?.id}-${wpPost.id}`,
      title: wpPost.title.rendered,
      handle: wpPost.slug,
      excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
      content: wpPost.content.rendered,
      date: wpPost.date,
      categories: categories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        handle: cat.slug,
        href: `/category/${cat.slug}`,
        thumbnail: '',
        count: 0,
        color: 'blue'
      })),
      author: {
        id: author?.id.toString() || '1',
        name: author?.name || 'Unknown Author',
        handle: author?.slug || 'unknown',
        description: author?.description || '',
        avatar: {
          src: author?.avatar_urls?.['96'] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          alt: author?.name || 'Author',
          width: 96,
          height: 96
        }
      },
      featuredImage: featuredImage ? {
        src: featuredImage.source_url,
        alt: featuredImage.alt_text || wpPost.title.rendered,
        width: featuredImage.media_details?.width || 800,
        height: featuredImage.media_details?.height || 600
      } : (() => {
        // Fallback: Try to extract first image from content
        const imgMatch = wpPost.content.rendered.match(/<img[^>]+src="([^">]+)"/)
        if (imgMatch && imgMatch[1]) {
          return {
            alt: wpPost.title.rendered,
            src: imgMatch[1],
            width: 800,
            height: 600
          }
        }
        // Final fallback
        return {
          alt: wpPost.title.rendered,
          src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          width: 800,
          height: 600
        }
      })(),
      likeCount: 0,
      liked: false,
      bookmarkCount: 0,
      bookmarked: false,
      commentCount: 0,
      viewCount: 0,
      readingTime: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200),
      postType: 'standard',
      status: wpPost.status,
      videoUrl: '',
      audioUrl: '',
      galleryImgs: [],
      tags: tags.map(tag => ({
        id: tag.id.toString(),
        name: tag.name,
        handle: tag.slug,
        color: 'blue'
      }))
    }
  }

  // Fetch and convert posts to TPost format
  async fetchPostsAsTPost(options: {
    page?: number
    perPage?: number
    search?: string
    categories?: string[]
    tags?: string[]
  } = {}): Promise<TPost[]> {
    const result = await this.fetchAllPosts(options)
    return result.posts.map(post => this.convertWordPressPostToTPost(post))
  }

  // Fetch posts from specific site as TPost
  async getPostsBySiteAsTPost(siteId: string, options: {
    page?: number
    perPage?: number
    search?: string
    categories?: string[]
    tags?: string[]
  } = {}): Promise<TPost[]> {
    const posts = await this.fetchPostsBySiteId(siteId, options)
    return posts.map(post => this.convertWordPressPostToTPost(post))
  }

  // Get a specific post by slug from any WordPress site
  async getPostBySlug(slug: string): Promise<TPost | null> {
    for (const site of this.sites) {
      try {
        const response = await fetch(`${site.apiBase}/posts?slug=${slug}&_embed=1`, {
          headers: {
            'User-Agent': 'NextJS-Blog-Integration/1.0'
          }
        })

        if (response.ok) {
          const posts: WordPressPost[] = await response.json()
          if (posts.length > 0) {
            const post = posts[0]
            post._site = {
              id: site.id,
              name: site.name,
              url: site.url
            }
            return this.convertWordPressPostToTPost(post)
          }
        }
      } catch (error) {
        console.error(`Error fetching post from ${site.name}:`, error)
      }
    }

    return null
  }

  // Publish post to multiple WordPress sites
  async publishPost(
    postData: {
      title: string
      content: string
      excerpt?: string
      status: 'publish' | 'draft' | 'pending'
      categories?: number[]
      tags?: number[]
      featured_media?: number
    },
    siteIds: string[] = [],
    token?: string
  ): Promise<Array<{
    siteId: string
    siteName: string
    success: boolean
    postId?: number
    postUrl?: string
    error?: string
  }>> {
    const targetSites = siteIds.length > 0
      ? siteIds.map(id => wpAuth.getSite(id)).filter(Boolean)
      : this.sites

    const results = []

    for (const site of targetSites) {
      try {
        if (!token) {
          results.push({
            siteId: site!.id,
            siteName: site!.name,
            success: false,
            error: 'Authentication token required'
          })
          continue
        }

        const createdPost = await wpAuth.createPost(site!.id, token, postData)

        results.push({
          siteId: site!.id,
          siteName: site!.name,
          success: true,
          postId: createdPost.id,
          postUrl: createdPost.link
        })
      } catch (error) {
        results.push({
          siteId: site!.id,
          siteName: site!.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }
}

// Global instance
export const multiWP = new MultiWordPressIntegration()