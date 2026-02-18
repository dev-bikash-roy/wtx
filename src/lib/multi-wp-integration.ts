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
        _fields: 'id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded',
        _embed: 'author,wp:featuredmedia,wp:term',
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
          _fields: 'id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded',
          _embed: 'author,wp:featuredmedia,wp:term',
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
    console.log('[convertWordPressPostToTPost] Converting post:', wpPost.title.rendered)
    console.log('[convertWordPressPostToTPost] Content length:', wpPost.content?.rendered?.length || 0)
    
    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]
    const author = wpPost._embedded?.author?.[0]
    const categories = wpPost._embedded?.['wp:term']?.[0] || []
    const tags = wpPost._embedded?.['wp:term']?.[1] || []

    // Function to decode HTML entities
    const decodeHtmlEntities = (text: string): string => {
      const entityMap: { [key: string]: string } = {
        '&#8216;': "'",  // Left single quotation mark
        '&#8217;': "'",  // Right single quotation mark
        '&#8220;': '"',  // Left double quotation mark
        '&#8221;': '"',  // Right double quotation mark
        '&#8211;': '–',  // En dash
        '&#8212;': '—',  // Em dash
        '&#038;': '&',   // Ampersand
        '&amp;': '&',    // Ampersand
        '&lt;': '<',     // Less than
        '&gt;': '>',     // Greater than
        '&quot;': '"',   // Quote
        '&apos;': "'",   // Apostrophe
        '&#039;': "'",   // Apostrophe
        '&nbsp;': ' ',   // Non-breaking space
        '&#8230;': '…',  // Horizontal ellipsis
        '&#8482;': '™',  // Trademark
        '&#169;': '©',   // Copyright
        '&#174;': '®',   // Registered trademark
      }

      let decodedText = text
      Object.entries(entityMap).forEach(([entity, replacement]) => {
        decodedText = decodedText.replace(new RegExp(entity, 'g'), replacement)
      })

      // Handle numeric entities (&#123;)
      decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec)
      })

      // Handle hex entities (&#x1F;)
      decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })

      return decodedText
    }

    // Better image extraction and fallback logic
    const getFeaturedImage = () => {
      console.log('[getFeaturedImage] Processing featured image for post:', wpPost.id)
      console.log('[getFeaturedImage] Has _embedded featuredmedia:', !!featuredImage)
      
      // Helper function to validate URL
      const isValidUrl = (url: string): boolean => {
        if (!url || typeof url !== 'string') return false

        // Check if URL contains multiple image paths concatenated
        const jpgCount = (url.match(/\.jpg/gi) || []).length
        const pngCount = (url.match(/\.png/gi) || []).length
        const webpCount = (url.match(/\.webp/gi) || []).length
        const totalImageExtensions = jpgCount + pngCount + webpCount

        // If more than one image extension, it's likely concatenated URLs
        if (totalImageExtensions > 1) {
          console.warn('[getFeaturedImage] Detected concatenated image URLs:', url)
          return false
        }

        // Basic URL validation
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      }

      // First priority: WordPress featured image
      if (featuredImage && featuredImage.source_url) {
        const sourceUrl = featuredImage.source_url
        console.log('[getFeaturedImage] Checking featured image source_url:', sourceUrl)

        // Validate the source URL
        if (isValidUrl(sourceUrl)) {
          console.log('[getFeaturedImage] Using valid featured image')
          return {
            src: sourceUrl,
            alt: decodeHtmlEntities(featuredImage.alt_text || wpPost.title.rendered),
            width: featuredImage.media_details?.width || 800,
            height: featuredImage.media_details?.height || 600
          }
        } else {
          console.warn(`[getFeaturedImage] Invalid featured image URL for post ${wpPost.id}:`, sourceUrl)
        }
      }

      // Second priority: Extract first image from content
      const imgMatch = wpPost.content.rendered.match(/<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"/)
      if (imgMatch && imgMatch[1] && isValidUrl(imgMatch[1])) {
        console.log('[getFeaturedImage] Using image from content')
        return {
          alt: decodeHtmlEntities(imgMatch[2] || wpPost.title.rendered),
          src: imgMatch[1],
          width: 800,
          height: 600
        }
      }

      // Third priority: Try to extract any image from content (without alt)
      const simpleImgMatch = wpPost.content.rendered.match(/<img[^>]+src="([^">]+)"/)
      if (simpleImgMatch && simpleImgMatch[1] && isValidUrl(simpleImgMatch[1])) {
        console.log('[getFeaturedImage] Using simple image from content')
        return {
          alt: decodeHtmlEntities(wpPost.title.rendered),
          src: simpleImgMatch[1],
          width: 800,
          height: 600
        }
      }

      // Final fallback: Use a diverse set of placeholder images based on post ID
      console.log('[getFeaturedImage] Using fallback placeholder image')
      const fallbackImages = [
        'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // News/general
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Sports
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Politics
        'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Business/Money
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Technology
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Travel
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Entertainment
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Fashion/Lifestyle
      ]

      // Use post ID to select a consistent but varied fallback image
      const imageIndex = wpPost.id % fallbackImages.length

      return {
        alt: decodeHtmlEntities(wpPost.title.rendered),
        src: fallbackImages[imageIndex],
        width: 800,
        height: 600
      }
    }

    const result: TPost = {
      id: `wp-${wpPost._site?.id}-${wpPost.id}`,
      title: decodeHtmlEntities(wpPost.title.rendered),
      handle: `${wpPost._site?.id}-${wpPost.slug}`,
      excerpt: decodeHtmlEntities(wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim()),
      content: wpPost.content.rendered, // Keep HTML in content
      date: wpPost.date,
      categories: categories.map(cat => ({
        id: cat.id.toString(),
        name: decodeHtmlEntities(cat.name),
        handle: cat.slug,
        href: `/category/${cat.slug}`,
        thumbnail: '',
        count: 0,
        color: 'blue'
      })),
      author: {
        id: author?.id.toString() || '1',
        name: decodeHtmlEntities(author?.name || 'Unknown Author'),
        handle: author?.slug || 'unknown',
        description: decodeHtmlEntities(author?.description || ''),
        avatar: {
          src: author?.avatar_urls?.['96'] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          alt: decodeHtmlEntities(author?.name || 'Author'),
          width: 96,
          height: 96
        }
      },
      featuredImage: getFeaturedImage(),
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
        name: decodeHtmlEntities(tag.name),
        handle: tag.slug,
        color: 'blue'
      }))
    }

    console.log('[convertWordPressPostToTPost] Converted result:')
    console.log('  - ID:', result.id)
    console.log('  - Handle:', result.handle)
    console.log('  - Title:', result.title)
    console.log('  - Content length:', result.content?.length || 0)
    console.log('  - Featured image:', result.featuredImage?.src)

    return result
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
  async getPostBySlug(handle: string): Promise<TPost | null> {
    console.log('[getPostBySlug] Received handle:', handle)

    // Check if handle includes site ID (format: siteId-slug)
    const handleParts = handle.split('-')
    let targetSiteId: string | null = null
    let actualSlug = handle

    // If handle contains a dash, check if the first part is a valid site ID
    if (handleParts.length >= 2) {
      const potentialSiteId = handleParts[0]
      console.log('[getPostBySlug] Checking if first part is site ID:', potentialSiteId)
      const site = this.sites.find(s => s.id === potentialSiteId)
      if (site) {
        targetSiteId = potentialSiteId
        actualSlug = handleParts.slice(1).join('-') // Rest is the actual slug
        console.log('[getPostBySlug] Found site ID:', targetSiteId, 'Actual slug:', actualSlug)
      } else {
        console.log('[getPostBySlug] Not a valid site ID, treating entire handle as slug')
      }
    }

    // If we have a specific site ID, only search that site
    const sitesToSearch = targetSiteId
      ? this.sites.filter(s => s.id === targetSiteId)
      : this.sites

    console.log('[getPostBySlug] Searching', sitesToSearch.length, 'site(s) for slug:', actualSlug)

    for (const site of sitesToSearch) {
      try {
        // Encode the slug to handle special characters
        const encodedSlug = encodeURIComponent(actualSlug)
        const url = `${site.apiBase}/posts?slug=${encodedSlug}&_fields=id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded&_embed=author,wp:featuredmedia,wp:term`
        console.log('[getPostBySlug] Fetching from:', site.name)
        console.log('[getPostBySlug] URL:', url)

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'NextJS-Blog-Integration/1.0'
          },
          cache: 'no-store' // Ensure fresh data
        })

        if (response.ok) {
          const posts: WordPressPost[] = await response.json()
          console.log('[getPostBySlug] Response from', site.name, '- Found', posts.length, 'post(s)')
          
          if (posts.length > 0) {
            const post = posts[0]
            console.log('[getPostBySlug] Post details:')
            console.log('  - Title:', post.title.rendered)
            console.log('  - Slug:', post.slug)
            console.log('  - Content length:', post.content?.rendered?.length || 0)
            console.log('  - Has featured media:', !!post._embedded?.['wp:featuredmedia']?.[0])
            
            post._site = {
              id: site.id,
              name: site.name,
              url: site.url
            }
            
            const convertedPost = this.convertWordPressPostToTPost(post)
            console.log('[getPostBySlug] Converted post:')
            console.log('  - ID:', convertedPost.id)
            console.log('  - Handle:', convertedPost.handle)
            console.log('  - Content length:', convertedPost.content?.length || 0)
            console.log('  - Featured image:', convertedPost.featuredImage?.src)
            
            return convertedPost
          }
        } else {
          console.log('[getPostBySlug] Response not OK from', site.name, '- Status:', response.status)
        }
      } catch (error) {
        console.error(`[getPostBySlug] Error fetching post from ${site.name}:`, error)
      }
    }

    console.log('[getPostBySlug] No post found for handle:', handle, 'with slug:', actualSlug)
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