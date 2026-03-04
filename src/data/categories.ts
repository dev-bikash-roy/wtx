import { fetchCategories, fetchTags, fetchPosts, fetchPostsByCategory } from './wp-api'
import { TemplateCategory, TemplateTag } from './wp-types'
import { getAllPosts, getPostsDefault, TPost } from './posts'

// Color mapping for categories and tags
const CATEGORY_COLORS = [
  'blue', 'red', 'green', 'yellow', 'purple',
  'indigo', 'pink', 'teal', 'orange', 'cyan'
]

// TODO: replace with actual images
// _demo_category_image_urls has length 10
const _demo_category_image_urls = [
  'https://images.unsplash.com/photo-1539477857993-860599c2e840?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1636306950045-4dbb10b7e0f4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1679913969285-64f089885005?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1680792563719-288027b2a090?q=80&w=2693&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1679403855896-49b0bd34744a?q=80&w=2693&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1533090368676-1fd25485db88?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1660254149750-f31f1c59a86b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1462611290231-f44865b5750c?q=80&w=2271&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

// CATEGORIES
export async function getCategories(): Promise<TemplateCategory[]> {
  // Fetch real categories from WordPress API
  const categories = await fetchCategories(100)

  // If we have real categories, filter out categories with 0 posts and return them
  if (categories.length > 0) {
    // Fetch recent posts to find matched images for categories
    const recentPosts = await fetchPosts(50)

    return categories
      .filter(category => (category.count || 0) > 0) // Only show categories that have posts
      .map((category, index) => {
        // Find a post that belongs to this category
        const categoryPost = recentPosts.find(post =>
          post.categories.some(cat => cat.handle === category.handle)
        )

        // Use post's featured image if available, otherwise fallback to demo
        const thumbnailResponse = categoryPost?.featuredImage || {
          src: _demo_category_image_urls[index % _demo_category_image_urls.length],
          alt: `${category.name} category image`,
          width: 1920,
          height: 1080
        }

        return {
          ...category,
          description: `Explore articles in the ${category.name} category`,
          count: category.count || 0,
          date: new Date().toISOString(),
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
          thumbnail: thumbnailResponse
        }
      })
  }

  // Fallback to mock data if API fails
  return [
    {
      id: 'category-1',
      name: 'England',
      handle: 'england',
      description: 'News and stories from across England.',
      color: 'blue',
      count: 15,
      date: '2025-06-10',
      thumbnail: {
        src: _demo_category_image_urls[0],
        alt: 'England',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-2',
      name: 'Scotland',
      handle: 'scotland',
      description: 'News and stories from Scotland.',
      color: 'indigo',
      count: 12,
      date: '2025-05-15',
      thumbnail: {
        src: _demo_category_image_urls[1],
        alt: 'Scotland',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-3',
      name: 'Wales',
      handle: 'wales',
      description: 'News and stories from Wales.',
      color: 'green',
      count: 8,
      date: '2025-04-20',
      thumbnail: {
        src: _demo_category_image_urls[2],
        alt: 'Wales',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-4',
      name: 'Ireland',
      handle: 'ireland',
      description: 'News and stories from Ireland.',
      color: 'emerald',
      count: 10,
      date: '2025-03-05',
      thumbnail: {
        src: _demo_category_image_urls[3],
        alt: 'Ireland',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-5',
      name: 'Sports',
      handle: 'sports',
      description: 'Latest sports news, scores, and updates.',
      color: 'red',
      count: 22,
      date: '2025-02-15',
      thumbnail: {
        src: _demo_category_image_urls[4],
        alt: 'Sports',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-6',
      name: 'Fashion',
      handle: 'fashion',
      description: 'Latest trends, styles, and fashion news.',
      color: 'pink',
      count: 18,
      date: '2025-01-20',
      thumbnail: {
        src: _demo_category_image_urls[5],
        alt: 'Fashion',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-7',
      name: 'Travel',
      handle: 'travel',
      description: 'Explore travel guides, tips, and destinations.',
      color: 'yellow',
      count: 20,
      date: '2025-01-15',
      thumbnail: {
        src: _demo_category_image_urls[6],
        alt: 'Travel',
        width: 1920,
        height: 1080,
      },
    },
  ]
}

export async function getCategoryByHandle(handle: string) {
  // lower case handle
  handle = handle?.toLowerCase()

  // get posts for this category
  let posts: any[] = []

  if (handle === 'all') {
    posts = (await fetchPosts(20))
  } else {
    posts = await fetchPostsByCategory(handle, 20)
    // If no posts found in WP, try local posts
    if (posts.length === 0) {
      const allPosts = await getAllPosts()
      posts = allPosts.filter(post =>
        post.categories?.some(cat => cat.handle === handle)
      ).slice(0, 20)
    }
  }

  if (handle === 'all') {
    return {
      id: 'category-all',
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: 2500, // TODO: Get real count
      date: '2025-01-01',
      thumbnail: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      color: 'indigo',
      posts,
    }
  }

  // get all categories
  const categories = await getCategories()
  let category = categories.find((category) => category.handle === handle)
  if (!category) {
    // If not found in list, try to reconstruct from posts
    if (posts.length > 0 && posts[0].categories) {
      const catFromPost = posts[0].categories.find((c: any) => c.handle === handle)
      if (catFromPost) {
        category = {
          ...catFromPost,
          description: `Articles about ${catFromPost.name}`,
          count: posts.length,
          date: new Date().toISOString(),
          thumbnail: posts[0].featuredImage, // Use post image
          color: 'blue'
        }
      }
    }

    // Final fallback: create a basic category object
    if (!category) {
      category = {
        id: `category-${handle}`,
        name: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' '),
        handle: handle,
        description: `Articles in the ${handle} category`,
        count: posts.length,
        date: new Date().toISOString(),
        color: 'blue',
        thumbnail: {
          src: _demo_category_image_urls[0],
          alt: handle,
          width: 1920,
          height: 1080,
        }
      }
    }
  }

  if (category) {
    return {
      ...category,
      posts,
      count: posts.length
    }
  }

  // If still no category and no posts...
  return {
    ...categories[0],
    posts: [],
    count: 0
  }
}

export async function getCategoriesWithPosts() {
  const categories = await getCategories()

  // Create an array of promises to fetch posts for each category
  const categoriesWithPostsPromises = categories.map(async (category) => {
    // Fetch posts specifically for this category
    const posts = await fetchPostsByCategory(category.handle, 8)

    // If no posts found, potentially try to get generic posts or keep empty
    // But for "Browse by Category", empty/few is better than wrong/duplicate

    return {
      ...category,
      posts: posts.length > 0 ? posts : []
    }
  })

  return Promise.all(categoriesWithPostsPromises)
}

// TAGS
export async function getTags(): Promise<TemplateTag[]> {
  // Fetch real tags from WordPress API
  const tags = await fetchTags(100)

  // If we have real tags, filter out tags with 0 posts and return them
  if (tags.length > 0) {
    return tags
      .filter(tag => (tag.count || 0) > 0) // Only show tags that have posts
      .map((tag, index) => ({
        ...tag,
        description: `Explore articles tagged with ${tag.name}`,
        count: tag.count || 0,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      }))
  }

  // Fallback to mock data if API fails
  return [
    {
      id: 'tag-1',
      name: 'Politics',
      handle: 'politics',
      description: 'Political news and analysis.',
      count: 45,
      color: 'blue'
    },
    {
      id: 'tag-2',
      name: 'Crime',
      handle: 'crime',
      description: 'Crime and justice reporting.',
      count: 32,
      color: 'red'
    },
    {
      id: 'tag-3',
      name: 'Transport',
      handle: 'transport',
      description: 'Updates on public transit and travel infrastructure.',
      count: 28,
      color: 'yellow'
    },
    {
      id: 'tag-4',
      name: 'Health',
      handle: 'health',
      description: 'Health news and public health updates.',
      count: 40,
      color: 'green'
    },
    {
      id: 'tag-5',
      name: 'Education',
      handle: 'education',
      description: 'Schools, universities, and education policy.',
      count: 35,
      color: 'purple'
    },
    {
      id: 'tag-6',
      name: 'Weather',
      handle: 'weather',
      description: 'Weather forecasts and climate updates.',
      count: 50,
      color: 'indigo'
    },
    {
      id: 'tag-7',
      name: 'Economy',
      handle: 'economy',
      description: 'Business, finance, and economic news.',
      count: 38,
      color: 'pink'
    },
    {
      id: 'tag-8',
      name: 'Housing',
      handle: 'housing',
      description: 'Real estate, renting, and housing market news.',
      count: 25,
      color: 'teal'
    },
    {
      id: 'tag-9',
      name: 'Courts',
      handle: 'courts',
      description: 'Court reports and legal news.',
      count: 22,
      color: 'orange'
    },
    {
      id: 'tag-10',
      name: 'Environment',
      handle: 'environment',
      description: 'Environmental news and sustainability.',
      count: 30,
      color: 'emerald'
    },
  ]
}

export async function getTagsWithPosts() {
  const tags = await getTags()
  const posts = await getPostsDefault()
  return tags.map((tag) => ({
    ...tag,
    posts: posts.slice(0, 8),
  }))
}

export async function getTrendingTags(limit: number = 5) {
  const tags = await getTags()
  // Sort by count (most used) and return top 5
  return tags
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, limit)
    .map(tag => ({
      ...tag,
      trending: true
    }))
}

export async function getTagByHandle(handle: string) {
  // lower case handle
  handle = handle?.toLowerCase()

  if (handle === 'all') {
    const posts = (await getAllPosts()).slice(0, 12)
    return {
      id: 'tag-all',
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: 2500,
      posts,
    }
  }

  // Get posts specifically for this tag
  let posts: any[] = []

  try {
    // First try to get posts from WordPress by tag
    const { getWordPressPostsByTag } = await import('./wordpress-posts')
    posts = await getWordPressPostsByTag(handle, 20)

    // If no WordPress posts found, try to get posts that have this tag from local posts
    if (posts.length === 0) {
      const allPosts = await getAllPosts()
      posts = allPosts.filter(post =>
        post.tags?.some(tag => tag.handle === handle)
      ).slice(0, 12)
    }
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    // Fallback to local posts
    const allPosts = await getAllPosts()
    posts = allPosts.filter(post =>
      post.tags?.some(tag => tag.handle === handle)
    ).slice(0, 12)
  }

  const tags = await getTags()
  let tag = tags.find((tag) => tag.handle === handle)

  if (!tag) {
    // If tag not found in the list, create a basic tag object
    tag = {
      id: `tag-${handle}`,
      name: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' '),
      handle: handle,
      description: `Explore articles tagged with ${handle}`,
      count: posts.length,
      color: 'blue'
    }
  }

  return {
    ...tag,
    posts,
    count: posts.length
  }
}

// Types
export type TCategory = TemplateCategory & {
  posts?: TPost[]
}

export type TTag = TemplateTag & {
  posts?: TPost[]
}