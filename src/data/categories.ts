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

  // If we have real categories, return them
  if (categories.length > 0) {
    // Fetch recent posts to find matched images for categories
    const recentPosts = await fetchPosts(50)

    return categories.map((category, index) => {
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
      name: 'Garden',
      handle: 'garden',
      description:
        'Explore the world of gardening, from planting to harvesting and everything in between. Discover tips, tricks, and expert advice to make your garden thrive.',
      color: 'indigo',
      count: 13,
      date: '2025-06-10',
      thumbnail: {
        src: _demo_category_image_urls[0],
        alt: 'Garden',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-2',
      name: 'Technology',
      handle: 'technology',
      description:
        'Stay updated with the latest technology news, trends, and innovations. Explore the world of AI, blockchain, and the future of technology.',
      color: 'blue',
      count: 25,
      date: '2025-05-15',
      thumbnail: {
        src: _demo_category_image_urls[1],
        alt: 'Technology',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-3',
      name: 'Fitness',
      handle: 'fitness',
      description:
        'Discover workout routines, health tips, and wellness advice for a better lifestyle. Stay fit and healthy with our expert tips and advice.',
      color: 'red',
      count: 18,
      date: '2025-04-20',
      thumbnail: {
        src: _demo_category_image_urls[2],
        alt: 'Fitness',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-4',
      name: 'Finance',
      handle: 'finance',
      description:
        'Stay updated with financial news, investment strategies, and money management tips. Make informed decisions with our expert advice.',
      color: 'green',
      count: 22,
      date: '2025-03-05',
      thumbnail: {
        src: _demo_category_image_urls[3],
        alt: 'Finance',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-5',
      name: 'Travel',
      handle: 'travel',
      description:
        'Explore travel guides, destination reviews, and adventure stories from around the world. Plan your next adventure with our expert tips and advice.',
      color: 'yellow',
      count: 30,
      date: '2025-02-15',
      thumbnail: {
        src: _demo_category_image_urls[4],
        alt: 'Travel',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-6',
      name: 'Photography',
      handle: 'photography',
      description:
        'Discover the art of photography, from landscape shots to portrait techniques and editing tips. Capture the beauty of the world with our expert tips and advice.',
      color: 'purple',
      count: 28,
      date: '2025-01-20',
      thumbnail: {
        src: _demo_category_image_urls[5],
        alt: 'Photography',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-7',
      name: 'Music',
      handle: 'music',
      description:
        'Explore music reviews, artist interviews, and the latest trends in the music industry. Stay updated with the latest music news and trends.',
      color: 'pink',
      count: 35,
      date: '2025-01-15',
      thumbnail: {
        src: _demo_category_image_urls[6],
        alt: 'Music',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-8',
      name: 'Architecture',
      handle: 'architecture',
      description:
        'Discover architectural marvels, design trends, and insights into the world of building and construction. Explore the world of architecture with our expert tips and advice.',
      color: 'gray',
      count: 22,
      date: '2025-01-10',
      thumbnail: {
        src: _demo_category_image_urls[7],
        alt: 'Architecture',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-9',
      name: 'Wellness',
      handle: 'wellness',
      description:
        'Find tips and advice for mental and physical wellness, including meditation, yoga, and healthy living. Stay fit and healthy with our expert tips and advice.',
      color: 'teal',
      count: 27,
      date: '2025-01-05',
      thumbnail: {
        src: _demo_category_image_urls[8],
        alt: 'Wellness',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-10',
      name: 'Education',
      handle: 'education',
      description:
        'Stay informed about educational trends, learning resources, and academic insights. Stay updated with the latest educational news and trends.',
      color: 'orange',
      count: 31,
      date: '2025-01-01',
      thumbnail: {
        src: _demo_category_image_urls[9],
        alt: 'Education',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-11',
      name: 'Typography',
      handle: 'typography',
      description:
        'Stay informed about educational trends, learning resources, and academic insights. Stay updated with the latest educational news and trends.',
      color: 'sky',
      count: 31,
      date: '2025-06-15',
      thumbnail: {
        src: _demo_category_image_urls[1],
        alt: 'Education',
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
    // If no posts found in WP, try local or empty
    if (posts.length === 0) {
      // Should we fallback to all posts? User complained about "correct posts", so probably NO.
      // But we can fallback to searching if it's a mix?
      // For now, respect the empty result but maybe fallback to generic if really needed? 
      // Nah, correct behavior is to show logic.
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
    // If not found in list (maybe not in top 100), try to fetch it or return generic?
    // We already return the whole category object.

    // Fallback: create a dummy category object if not found in list, or return null
    // But keeping existing fallback behavior but using the posts we fetched
    category = categories[0]

    // Better logic: if we have posts, we can reconstruct the category from the first post?
    if (posts.length > 0 && posts[0].categories) {
      const catFromPost = posts[0].categories.find((c: any) => c.handle === handle)
      if (catFromPost) {
        category = {
          ...catFromPost,
          description: `Articles about ${catFromPost.name}`,
          count: posts.length, // Approximate
          date: new Date().toISOString(),
          thumbnail: posts[0].featuredImage, // Use post image
        }
      }
    }
  }

  if (category) {
    return {
      ...category,
      posts,
    }
  }

  // If still no category and no posts...
  return {
    ...categories[0],
    posts: []
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

  // If we have real tags, return them
  if (tags.length > 0) {
    return tags.map((tag, index) => ({
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
      name: 'Technology',
      handle: 'technology',
      description: 'Explore the latest innovations, gadgets, and tech trends shaping our digital future.',
      count: 10,
      color: 'blue'
    },
    {
      id: 'tag-2',
      name: 'Travel',
      handle: 'travel',
      description: 'Explore travel guides, destination reviews, and adventure stories from around the world.',
      count: 10,
      color: 'yellow'
    },
    {
      id: 'tag-3',
      name: 'Food',
      handle: 'food',
      description: 'Discover the best food and drink experiences, from local cuisine to gourmet dining.',
      count: 10,
      color: 'red'
    },
    {
      id: 'tag-4',
      name: 'Health',
      handle: 'health',
      description: 'Stay updated with health and wellness news, tips, and expert advice.',
      count: 10,
      color: 'green'
    },
    {
      id: 'tag-5',
      name: 'Science',
      handle: 'science',
      description: 'Explore the latest scientific discoveries, research, and breakthroughs.',
      count: 10,
      color: 'purple'
    },
    {
      id: 'tag-6',
      name: 'History',
      handle: 'history',
      description: 'Discover historical events, cultural heritage, and the stories of our past.',
      count: 10,
      color: 'indigo'
    },
    {
      id: 'tag-7',
      name: 'Art',
      handle: 'art',
      description: 'Explore the world of art, from painting to sculpture and everything in between.',
      count: 10,
      color: 'pink'
    },
    {
      id: 'tag-8',
      name: 'Photography',
      handle: 'photography',
      description: 'Discover the art of photography, from landscape shots to portrait techniques and editing tips.',
      count: 15,
      color: 'teal'
    },
    {
      id: 'tag-9',
      name: 'Music',
      handle: 'music',
      description: 'Explore music reviews, artist interviews, and the latest trends in the music industry.',
      count: 12,
      color: 'orange'
    },
    {
      id: 'tag-10',
      name: 'Architecture',
      handle: 'architecture',
      description:
        'Discover architectural marvels, design trends, and insights into the world of building and construction.',
      count: 8,
      color: 'gray'
    },
    {
      id: 'tag-11',
      name: 'Wellness',
      handle: 'wellness',
      description:
        'Find tips and advice for mental and physical wellness, including meditation, yoga, and healthy living.',
      count: 14,
      color: 'green'
    },
    {
      id: 'tag-12',
      name: 'Education',
      handle: 'education',
      description: 'Stay informed about educational trends, learning resources, and academic insights.',
      count: 11,
      color: 'blue'
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

export async function getTagByHandle(handle: string) {
  // lower case handle
  handle = handle?.toLowerCase()

  const posts = (await getAllPosts()).slice(0, 12)

  if (handle === 'all') {
    return {
      id: 'tag-all',
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: 2500,
      posts,
    }
  }

  const tags = await getTags()
  let tag = tags.find((tag) => tag.handle === handle)
  if (!tag) {
    // return null
    // for demo purpose, return the first tag
    tag = tags[0]
  }
  return {
    ...tag,
    posts,
  }
}

// Types
export type TCategory = TemplateCategory & {
  posts?: TPost[]
}

export type TTag = TemplateTag & {
  posts?: TPost[]
}