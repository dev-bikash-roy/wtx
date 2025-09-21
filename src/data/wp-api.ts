import { WPPost, WPCategory, WPTag, TemplatePost, TemplateCategory, TemplateTag } from './wp-types'

const WP_API_BASE = process.env.WP_API_BASE || 'https://wtxnews.com/wp-json/wp/v2'

// Color mapping for categories
const CATEGORY_COLORS = [
  'blue', 'red', 'green', 'yellow', 'purple', 
  'indigo', 'pink', 'teal', 'orange', 'cyan'
]

// Utility function to extract featured image from WordPress post
function getFeaturedImage(post: WPPost): { src: string; alt: string; width: number; height: number } {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  
  if (media) {
    return {
      src: media.source_url,
      alt: media.alt_text || media.title.rendered,
      width: media.media_details?.width || 1920,
      height: media.media_details?.height || 1080
    }
  }
  
  // Default image if none found
  return {
    src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
    alt: 'Default image',
    width: 1920,
    height: 1080
  }
}

// Utility function to extract author from WordPress post
function getAuthor(post: WPPost): TemplatePost['author'] {
  const author = post._embedded?.author?.[0]
  
  if (author) {
    return {
      id: `author-${author.id}`,
      name: author.name,
      handle: author.slug,
      description: author.description,
      avatar: {
        src: author.avatar_urls?.['96'] || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
        alt: `${author.name}'s avatar`,
        width: 96,
        height: 96
      }
    }
  }
  
  // Default author if none found
  return {
    id: 'author-default',
    name: 'Unknown Author',
    handle: 'unknown-author',
    description: 'An experienced writer with a passion for sharing knowledge.',
    avatar: {
      src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
      alt: 'Default avatar',
      width: 96,
      height: 96
    }
  }
}

// Utility function to map WordPress categories to template categories
function getCategories(categories: WPCategory[]): TemplatePost['categories'] {
  return categories.map((cat, index) => ({
    id: `category-${cat.id}`,
    name: cat.name,
    handle: cat.slug,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }))
}

// Map WordPress post to template post
function mapWPPostToTemplatePost(post: WPPost): TemplatePost {
  // Extract categories from embedded data
  const wpCategories = post._embedded?.['wp:term']?.[0] || []
  const categories = getCategories(wpCategories.filter(term => term.taxonomy === 'category') as WPCategory[])
  
  // Extract tags from embedded data
  const wpTags = post._embedded?.['wp:term']?.[1] || []
  const tags = wpTags.filter(term => term.taxonomy === 'post_tag').map((tag, index) => ({
    id: `tag-${tag.id}`,
    name: tag.name,
    handle: tag.slug,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }))
  
  return {
    id: `post-${post.id}`,
    featuredImage: getFeaturedImage(post),
    title: post.title.rendered,
    handle: post.slug,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
    // Add the content to the template post
    content: post.content.rendered,
    date: post.date,
    readingTime: Math.max(1, Math.floor(post.content.rendered.split(' ').length / 200)),
    commentCount: 0, // WordPress doesn't provide this directly in the API response
    viewCount: 0, // WordPress doesn't provide this directly in the API response
    bookmarkCount: 0, // WordPress doesn't provide this directly in the API response
    bookmarked: false,
    likeCount: 0, // WordPress doesn't provide this directly in the API response
    liked: false,
    postType: 'standard', // Default to standard, could be enhanced based on post format
    status: post.status,
    author: getAuthor(post),
    categories: categories.length > 0 ? categories : [{
      id: 'category-uncategorized',
      name: 'Uncategorized',
      handle: 'uncategorized',
      color: 'gray'
    }],
    tags: tags
  }
}

// Fetch posts from WordPress API
export async function fetchPosts(perPage: number = 10, page: number = 1): Promise<TemplatePost[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      _embed: '1'
    })
    
    const response = await fetch(`${WP_API_BASE}/posts?${params}`)
    const posts: WPPost[] = await response.json()
    
    return posts.map(mapWPPostToTemplatePost)
  } catch (error) {
    console.error('Error fetching posts from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch categories from WordPress API
export async function fetchCategories(perPage: number = 100): Promise<TemplateCategory[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      hide_empty: 'true',
      orderby: 'count',
      order: 'desc'
    })
    
    const response = await fetch(`${WP_API_BASE}/categories?${params}`)
    const categories: WPCategory[] = await response.json()
    
    return categories.map((cat, index) => ({
      id: `category-${cat.id}`,
      name: cat.name,
      handle: cat.slug,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }))
  } catch (error) {
    console.error('Error fetching categories from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch tags from WordPress API
export async function fetchTags(perPage: number = 100): Promise<TemplateTag[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      hide_empty: 'true',
      orderby: 'count',
      order: 'desc'
    })
    
    const response = await fetch(`${WP_API_BASE}/tags?${params}`)
    const tags: WPTag[] = await response.json()
    
    return tags.map((tag, index) => ({
      id: `tag-${tag.id}`,
      name: tag.name,
      handle: tag.slug,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }))
  } catch (error) {
    console.error('Error fetching tags from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string): Promise<TemplatePost | null> {
  try {
    const params = new URLSearchParams({
      slug: slug,
      _embed: '1'
    })
    
    const response = await fetch(`${WP_API_BASE}/posts?${params}`)
    const posts: WPPost[] = await response.json()
    
    if (posts.length > 0) {
      return mapWPPostToTemplatePost(posts[0])
    }
    
    return null
  } catch (error) {
    console.error('Error fetching post from WordPress API:', error)
    return null
  }
}