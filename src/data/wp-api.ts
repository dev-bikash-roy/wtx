import { WPPost, WPCategory, WPTag, TemplatePost, TemplateCategory, TemplateTag } from './wp-types'
import he from 'he'

const WP_API_BASE = process.env.WP_API_BASE || 'https://wtxnews.com/wp-json/wp/v2'

// Color mapping for categories
const CATEGORY_COLORS = [
  'blue', 'red', 'green', 'yellow', 'purple',
  'indigo', 'pink', 'teal', 'orange', 'cyan'
]

// Utility function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return he.decode(text)
}

// Utility function to extract featured image from WordPress post
function getFeaturedImage(post: WPPost): { src: string; alt: string; width: number; height: number } {
  const media = post._embedded?.['wp:featuredmedia']?.[0]

  if (media) {
    return {
      src: media.source_url,
      alt: media.alt_text || media.title?.rendered || 'Article Image',
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

  // Determine post type based on format or content
  let postType: 'standard' | 'audio' | 'video' | 'gallery' = 'standard'
  let videoUrl: string | undefined
  let audioUrl: string | undefined

  // Check if post has a video format or contains video URL in content
  if (post.format === 'video') {
    postType = 'video'
    // Try to extract video URL from content
    const videoMatch = post.content.rendered.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?\/\s]{11})/)
    if (videoMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${videoMatch[1]}`
    }
  }
  // Check if post has an audio format
  else if (post.format === 'audio') {
    postType = 'audio'
    // Try to extract audio URL from content (this is a simplified example)
    const audioMatch = post.content.rendered.match(/<audio[^>]*src=["']([^"']*)["']/)
    if (audioMatch) {
      audioUrl = audioMatch[1]
    }
  }

  return {
    id: `post-${post.id}`,
    featuredImage: getFeaturedImage(post),
    title: decodeHtmlEntities(post.title.rendered),
    handle: post.slug,
    excerpt: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200) + '...'),
    // Add the content to the template post
    content: decodeHtmlEntities(post.content.rendered),
    date: post.date,
    readingTime: Math.max(1, Math.floor(post.content.rendered.split(' ').length / 200)),
    commentCount: 0, // WordPress doesn't provide this directly in the API response
    viewCount: 0, // WordPress doesn't provide this directly in the API response
    bookmarkCount: 0, // WordPress doesn't provide this directly in the API response
    bookmarked: false,
    likeCount: 0, // WordPress doesn't provide this directly in the API response
    liked: false,
    postType: postType,
    status: post.status,
    author: getAuthor(post),
    categories: categories.length > 0 ? categories : [{
      id: 'category-uncategorized',
      name: 'Uncategorized',
      handle: 'uncategorized',
      color: 'gray'
    }],
    tags: tags,
    videoUrl: videoUrl,
    audioUrl: audioUrl
  }
}

// Fetch posts from WordPress API
export async function fetchPosts(perPage: number = 20, page: number = 1, apiBase: string = WP_API_BASE): Promise<TemplatePost[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      _embed: '1'
    })

    const response = await fetch(`${apiBase}/posts?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(`Status: ${response.status}. Error fetching posts: ${response.statusText}`)
      return []
    }

    const posts: WPPost[] = await response.json()

    return posts.map(mapWPPostToTemplatePost)
  } catch (error) {
    console.error('Error fetching posts from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch posts by tag from WordPress API
export async function fetchPostsByTag(tagSlug: string, perPage: number = 20, page: number = 1, apiBase: string = WP_API_BASE): Promise<TemplatePost[]> {
  try {
    // First, get the tag ID by slug
    const tagResponse = await fetch(`${apiBase}/tags?slug=${tagSlug}`, { next: { revalidate: 3600 } })

    if (!tagResponse.ok) {
      console.error(`Status: ${tagResponse.status}. Error fetching tag by slug: ${tagResponse.statusText}`)
      return []
    }

    const tags: WPTag[] = await tagResponse.json()

    if (tags.length === 0) {
      console.warn(`No tag found with slug: ${tagSlug}`)
      return []
    }

    const tagId = tags[0].id

    // Then fetch posts with that tag
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      tags: tagId.toString(),
      _embed: '1'
    })

    const response = await fetch(`${apiBase}/posts?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(`Status: ${response.status}. Error fetching posts by tag: ${response.statusText}`)
      return []
    }

    const posts: WPPost[] = await response.json()

    return posts.map(mapWPPostToTemplatePost)
  } catch (error) {
    console.error('Error fetching posts by tag from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch posts by category from WordPress API
export async function fetchPostsByCategory(categorySlug: string, perPage: number = 20, page: number = 1, apiBase: string = WP_API_BASE): Promise<TemplatePost[]> {
  try {
    // First, get the category ID by slug
    const categoryResponse = await fetch(`${apiBase}/categories?slug=${categorySlug}`, { next: { revalidate: 3600 } })

    if (!categoryResponse.ok) {
      console.error(`Status: ${categoryResponse.status}. Error fetching category by slug: ${categoryResponse.statusText}`)
      return []
    }

    const categories: WPCategory[] = await categoryResponse.json()

    if (categories.length === 0) {
      console.warn(`No category found with slug: ${categorySlug}`)
      return []
    }

    const categoryId = categories[0].id

    // Then fetch posts with that category
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      categories: categoryId.toString(),
      _embed: '1'
    })

    const response = await fetch(`${apiBase}/posts?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(`Status: ${response.status}. Error fetching posts by category: ${response.statusText}`)
      return []
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Error: Received non-JSON response from ${apiBase}/posts?${params}`);
      const text = await response.text();
      console.error("Response body:", text.substring(0, 100)); // Log first 100 chars
      return [];
    }

    const posts: WPPost[] = await response.json()

    return posts.map(mapWPPostToTemplatePost)
  } catch (error) {
    console.error('Error fetching posts by category from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch categories from WordPress API
export async function fetchCategories(perPage: number = 100, apiBase: string = WP_API_BASE): Promise<TemplateCategory[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      hide_empty: 'true',
      orderby: 'count',
      order: 'desc'
    })

    const response = await fetch(`${apiBase}/categories?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      // If 404, it might just mean no categories found or endpoint valid but empty?
      // Usually categories endpoint returns empty list, but if status is error, return empty
      console.error(`Status: ${response.status}. Error fetching categories: ${response.statusText}`)
      return []
    }

    const categories: WPCategory[] = await response.json()

    return categories.map((cat, index) => ({
      id: `category-${cat.id}`,
      name: cat.name,
      handle: cat.slug,
      count: cat.count,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }))
  } catch (error) {
    console.error('Error fetching categories from WordPress API:', error)
    return [] // Return empty array on error
  }
}

// Fetch tags from WordPress API
export async function fetchTags(perPage: number = 100, apiBase: string = WP_API_BASE): Promise<TemplateTag[]> {
  try {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      hide_empty: 'true',
      orderby: 'count',
      order: 'desc'
    })

    const response = await fetch(`${apiBase}/tags?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(`Status: ${response.status}. Error fetching tags: ${response.statusText}`)
      return []
    }

    const tags: WPTag[] = await response.json()

    return tags.map((tag, index) => ({
      id: `tag-${tag.id}`,
      name: tag.name,
      handle: tag.slug,
      count: tag.count,
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

    const response = await fetch(`${WP_API_BASE}/posts?${params}`, { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error(`Status: ${response.status}. Error fetching post by slug: ${response.statusText}`)
      return null
    }

    const posts: WPPost[] = await response.json()

    if (posts.length > 0) {
      return mapWPPostToTemplatePost(posts[0])
    }

    return null
  } catch (error) {
    console.error('Error fetching post by slug from WordPress API:', error)
    return null
  }
}

// Create a new post in WordPress
export async function createPost(
  title: string,
  content: string,
  status: 'publish' | 'draft' | 'pending' = 'draft',
  categories: number[] = [],
  tags: number[] = []
): Promise<TemplatePost | null> {
  try {
    // In a real implementation, you would need to authenticate with WordPress
    // This is a placeholder implementation
    console.log('Creating post:', { title, content, status, categories, tags })

    // For now, return a mock post
    return {
      id: `post-${Date.now()}`,
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Default image',
        width: 1920,
        height: 1080
      },
      title,
      handle: title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: content.substring(0, 200) + '...',
      content,
      date: new Date().toISOString(),
      readingTime: Math.max(1, Math.floor(content.split(' ').length / 200)),
      commentCount: 0,
      viewCount: 0,
      bookmarkCount: 0,
      bookmarked: false,
      likeCount: 0,
      liked: false,
      postType: 'standard',
      status,
      author: {
        id: 'author-1',
        name: 'Current User',
        handle: 'current-user',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Current User',
          width: 96,
          height: 96
        }
      },
      categories: categories.map((id, index) => ({
        id: `category-${id}`,
        name: `Category ${id}`,
        handle: `category-${id}`,
        color: 'blue'
      })),
      tags: tags.map((id, index) => ({
        id: `tag-${id}`,
        name: `Tag ${id}`,
        handle: `tag-${id}`,
        color: 'gray'
      }))
    }
  } catch (error) {
    console.error('Error creating post in WordPress API:', error)
    return null
  }
}

// Update an existing post in WordPress
export async function updatePost(
  id: string,
  title: string,
  content: string,
  status: 'publish' | 'draft' | 'pending' = 'draft',
  categories: number[] = [],
  tags: number[] = []
): Promise<TemplatePost | null> {
  try {
    // In a real implementation, you would need to authenticate with WordPress
    // This is a placeholder implementation
    console.log('Updating post:', { id, title, content, status, categories, tags })

    // For now, return a mock post
    return {
      id,
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Default image',
        width: 1920,
        height: 1080
      },
      title,
      handle: title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: content.substring(0, 200) + '...',
      content,
      date: new Date().toISOString(),
      readingTime: Math.max(1, Math.floor(content.split(' ').length / 200)),
      commentCount: 0,
      viewCount: 0,
      bookmarkCount: 0,
      bookmarked: false,
      likeCount: 0,
      liked: false,
      postType: 'standard',
      status,
      author: {
        id: 'author-1',
        name: 'Current User',
        handle: 'current-user',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Current User',
          width: 96,
          height: 96
        }
      },
      categories: categories.map((id, index) => ({
        id: `category-${id}`,
        name: `Category ${id}`,
        handle: `category-${id}`,
        color: 'blue'
      })),
      tags: tags.map((id, index) => ({
        id: `tag-${id}`,
        name: `Tag ${id}`,
        handle: `tag-${id}`,
        color: 'gray'
      }))
    }
  } catch (error) {
    console.error('Error updating post in WordPress API:', error)
    return null
  }
}

// Delete a post from WordPress
export async function deletePost(id: string): Promise<boolean> {
  try {
    // In a real implementation, you would need to authenticate with WordPress
    // This is a placeholder implementation
    console.log('Deleting post:', id)
    return true
  } catch (error) {
    console.error('Error deleting post from WordPress API:', error)
    return false
  }
}
