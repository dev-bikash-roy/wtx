import { fetchPosts as fetchWPPosts, fetchPostsByTag } from './wp-api'
import { TemplatePost } from './wp-types'

// Export the main function to get posts
export async function getPostsDefault(): Promise<TemplatePost[]> {
  try {
    // Fetch real posts from WordPress API
    const posts = await fetchWPPosts(20, 1)

    // If we have real posts, return them
    if (posts.length > 0) {
      return posts
    }

    // Fallback to mock data if API fails
    return getMockPosts()
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Fallback to mock data if API fails
    return getMockPosts()
  }
}

export async function getPostsVideo(): Promise<TemplatePost[]> {
  try {
    // Instead of searching for specific video tags that don't exist,
    // let's fetch regular posts and return them as video posts
    // This prevents the "No tag found" errors

    console.log('Fetching posts for video section...')
    const posts = await fetchWPPosts(20, 1)

    if (posts.length > 0) {
      // Take the first few posts and return them
      // In a real implementation, you might want to filter for posts with video content
      return posts.slice(0, 6) // Return 6 posts for video section
    }

    // Fallback to mock data if API fails
    return getMockVideoPosts()
  } catch (error) {
    console.error('Error fetching video posts:', error)
    // Fallback to mock data if API fails
    return getMockVideoPosts()
  }
}

export async function getPostsAudio(): Promise<TemplatePost[]> {
  try {
    // Instead of fetching audio posts, fetch posts from specific categories
    // This addresses the user's request to replace audio posts with other category posts
    const posts = await fetchWPPosts(20, 1)

    // Filter for posts in various categories to provide variety
    const techPosts = posts.filter(post =>
      post.categories.some(cat => cat.handle === 'technology')
    )

    // If we have tech posts, return them
    if (techPosts.length > 0) {
      return techPosts.slice(0, 10) // Limit to 10 posts
    }

    // Try other categories if technology doesn't have enough posts
    const categoriesToTry = ['business', 'health', 'science', 'entertainment']
    for (const categoryHandle of categoriesToTry) {
      const categoryPosts = posts.filter(post =>
        post.categories.some(cat => cat.handle === categoryHandle)
      )

      if (categoryPosts.length > 0) {
        return categoryPosts.slice(0, 10) // Limit to 10 posts
      }
    }

    // If no specific category posts found, return a selection of general posts
    return posts.slice(0, 10)
  } catch (error) {
    console.error('Error fetching category posts:', error)
    // Fallback to mock data if API fails
    return getMockAudioPosts()
  }
}

export async function getPostsGallery(): Promise<TemplatePost[]> {
  try {
    // Fetch real posts from WordPress API
    const posts = await fetchWPPosts(20, 1)

    // Filter for gallery posts
    const galleryPosts = posts.filter(post => post.postType === 'gallery')

    // If we have real gallery posts, return them
    if (galleryPosts.length > 0) {
      return galleryPosts
    }

    // Try to find posts with gallery tags
    const galleryTagPosts = posts.filter(post =>
      post.tags && post.tags.some(tag =>
        tag.handle.includes('gallery') || tag.handle.includes('photo') || tag.handle.includes('image')
      )
    )

    if (galleryTagPosts.length > 0) {
      return galleryTagPosts.slice(0, 10) // Limit to 10 posts
    }

    // Fallback to mock data if API fails or no gallery posts found
    return getMockGalleryPosts()
  } catch (error) {
    console.error('Error fetching gallery posts:', error)
    // Fallback to mock data if API fails
    return getMockGalleryPosts()
  }
}

// Mock data functions (these would be replaced with real data in a production environment)
function getMockPosts(): TemplatePost[] {
  return [
    {
      id: 'post-1',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Sample post image',
        width: 1920,
        height: 1080,
      },
      title: 'Sample Post Title',
      handle: 'sample-post-title',
      excerpt: 'This is a sample post excerpt...',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
    },
    {
      id: 'post-2',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?q=80&w=2574&auto=format&fit=crop',
        alt: 'Another post image',
        width: 1920,
        height: 1080,
      },
      title: 'Another Post Title',
      handle: 'another-post-title',
      excerpt: 'This is another post excerpt...',
      date: '2025-06-11T14:30:00Z',
      readingTime: 3,
      commentCount: 15,
      viewCount: 3200,
      bookmarkCount: 1500,
      bookmarked: false,
      likeCount: 2800,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Jane Smith',
        handle: 'jane-smith',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Jane Smith',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Travel',
          handle: 'travel',
          color: 'green',
        },
      ],
    },
    {
      id: 'post-3',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1574717024456-4444c0ad7830?q=80&w=2574&auto=format&fit=crop',
        alt: 'Third post image',
        width: 1920,
        height: 1080,
      },
      title: 'Third Post Title',
      handle: 'third-post-title',
      excerpt: 'This is a third post excerpt...',
      date: '2025-06-12T16:45:00Z',
      readingTime: 4,
      commentCount: 8,
      viewCount: 4100,
      bookmarkCount: 2200,
      bookmarked: true,
      likeCount: 3500,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'Robert Johnson',
        handle: 'robert-johnson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Robert Johnson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Food',
          handle: 'food',
          color: 'red',
        },
      ],
    },
    {
      id: 'post-4',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2574&auto=format&fit=crop',
        alt: 'Fourth post image',
        width: 1920,
        height: 1080,
      },
      title: 'Fourth Post Title',
      handle: 'fourth-post-title',
      excerpt: 'This is a fourth post excerpt...',
      date: '2025-06-13T09:15:00Z',
      readingTime: 2,
      commentCount: 12,
      viewCount: 1800,
      bookmarkCount: 900,
      bookmarked: false,
      likeCount: 1600,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-4',
        name: 'Emily Davis',
        handle: 'emily-davis',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Emily Davis',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-4',
          name: 'Health',
          handle: 'health',
          color: 'teal',
        },
      ],
    },
    {
      id: 'post-5',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2775&auto=format&fit=crop',
        alt: 'Fifth post image',
        width: 1920,
        height: 1080,
      },
      title: 'Fifth Post Title',
      handle: 'fifth-post-title',
      excerpt: 'This is a fifth post excerpt...',
      date: '2025-06-14T11:30:00Z',
      readingTime: 5,
      commentCount: 22,
      viewCount: 5200,
      bookmarkCount: 2800,
      bookmarked: true,
      likeCount: 4200,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-5',
        name: 'Michael Wilson',
        handle: 'michael-wilson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Michael Wilson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-5',
          name: 'Finance',
          handle: 'finance',
          color: 'indigo',
        },
      ],
    },
    {
      id: 'post-6',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
        alt: 'Sixth post image',
        width: 1920,
        height: 1080,
      },
      title: 'Sixth Post Title',
      handle: 'sixth-post-title',
      excerpt: 'This is a sixth post excerpt...',
      date: '2025-06-15T13:45:00Z',
      readingTime: 3,
      commentCount: 7,
      viewCount: 2100,
      bookmarkCount: 1100,
      bookmarked: false,
      likeCount: 1900,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-6',
        name: 'Sarah Brown',
        handle: 'sarah-brown',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Sarah Brown',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-6',
          name: 'Education',
          handle: 'education',
          color: 'orange',
        },
      ],
    },
    {
      id: 'post-7',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=2574&auto=format&fit=crop',
        alt: 'Seventh post image',
        width: 1920,
        height: 1080,
      },
      title: 'Seventh Post Title',
      handle: 'seventh-post-title',
      excerpt: 'This is a seventh post excerpt...',
      date: '2025-06-16T15:20:00Z',
      readingTime: 4,
      commentCount: 14,
      viewCount: 3500,
      bookmarkCount: 1700,
      bookmarked: true,
      likeCount: 3100,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-7',
        name: 'David Miller',
        handle: 'david-miller',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'David Miller',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-7',
          name: 'Sports',
          handle: 'sports',
          color: 'pink',
        },
      ],
    },
    {
      id: 'post-8',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2774&auto=format&fit=crop',
        alt: 'Eighth post image',
        width: 1920,
        height: 1080,
      },
      title: 'Eighth Post Title',
      handle: 'eighth-post-title',
      excerpt: 'This is an eighth post excerpt...',
      date: '2025-06-17T17:10:00Z',
      readingTime: 2,
      commentCount: 9,
      viewCount: 2700,
      bookmarkCount: 1300,
      bookmarked: false,
      likeCount: 2300,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-8',
        name: 'Lisa Taylor',
        handle: 'lisa-taylor',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Lisa Taylor',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-8',
          name: 'Entertainment',
          handle: 'entertainment',
          color: 'purple',
        },
      ],
    },
  ]
}

function getMockVideoPosts(): TemplatePost[] {
  return [
    {
      id: 'post-video-1-mock',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Sample video post image',
        width: 1920,
        height: 1080,
      },
      title: 'Sample Video Post',
      handle: 'sample-video-post',
      excerpt: 'This is a sample video post excerpt...',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: true,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 'post-video-2-mock',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?q=80&w=2574&auto=format&fit=crop',
        alt: 'Another video post image',
        width: 1920,
        height: 1080,
      },
      title: 'Another Video Post',
      handle: 'another-video-post',
      excerpt: 'This is another video post excerpt...',
      date: '2025-06-11T14:30:00Z',
      readingTime: 3,
      commentCount: 15,
      viewCount: 3200,
      bookmarkCount: 1500,
      bookmarked: false,
      likeCount: 2800,
      liked: false,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Jane Smith',
        handle: 'jane-smith',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Jane Smith',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Travel',
          handle: 'travel',
          color: 'green',
        },
      ],
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    },
    {
      id: 'post-video-3-mock',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1574717024456-4444c0ad7830?q=80&w=2574&auto=format&fit=crop',
        alt: 'Third video post image',
        width: 1920,
        height: 1080,
      },
      title: 'Third Video Post',
      handle: 'third-video-post',
      excerpt: 'This is a third video post excerpt...',
      date: '2025-06-12T16:45:00Z',
      readingTime: 4,
      commentCount: 8,
      viewCount: 4100,
      bookmarkCount: 2200,
      bookmarked: true,
      likeCount: 3500,
      liked: true,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'Robert Johnson',
        handle: 'robert-johnson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Robert Johnson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Food',
          handle: 'food',
          color: 'red',
        },
      ],
      videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    },
  ]
}

function getMockAudioPosts(): TemplatePost[] {
  return [
    {
      id: 'post-audio-1',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Sample audio post image',
        width: 1920,
        height: 1080,
      },
      title: 'Sample Audio Post',
      handle: 'sample-audio-post',
      excerpt: 'This is a sample audio post excerpt...',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      audioUrl: 'https://example.com/sample-audio.mp3',
    },
    {
      id: 'post-audio-2',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2574&auto=format&fit=crop',
        alt: 'Another audio post image',
        width: 1920,
        height: 1080,
      },
      title: 'Another Audio Post',
      handle: 'another-audio-post',
      excerpt: 'This is another audio post excerpt...',
      date: '2025-06-11T13:20:00Z',
      readingTime: 5,
      commentCount: 18,
      viewCount: 2900,
      bookmarkCount: 1800,
      bookmarked: false,
      likeCount: 2400,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Jane Smith',
        handle: 'jane-smith',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Jane Smith',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Music',
          handle: 'music',
          color: 'purple',
        },
      ],
      audioUrl: 'https://example.com/another-audio.mp3',
    },
  ]
}

function getMockGalleryPosts(): TemplatePost[] {
  return [
    {
      id: 'post-gallery-1',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        alt: 'Sample gallery post image',
        width: 1920,
        height: 1080,
      },
      title: 'Sample Gallery Post',
      handle: 'sample-gallery-post',
      excerpt: 'This is a sample gallery post excerpt...',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: true,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Photography',
          handle: 'photography',
          color: 'yellow',
        },
      ],
      galleryImgs: [
        'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
      ],
    },
    {
      id: 'post-gallery-2',
      featuredImage: {
        src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2775&auto=format&fit=crop',
        alt: 'Another gallery post image',
        width: 1920,
        height: 1080,
      },
      title: 'Another Gallery Post',
      handle: 'another-gallery-post',
      excerpt: 'This is another gallery post excerpt...',
      date: '2025-06-11T15:30:00Z',
      readingTime: 3,
      commentCount: 9,
      viewCount: 3100,
      bookmarkCount: 1900,
      bookmarked: false,
      likeCount: 2600,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Jane Smith',
        handle: 'jane-smith',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop',
          alt: 'Jane Smith',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Nature',
          handle: 'nature',
          color: 'green',
        },
      ],
      galleryImgs: [
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2775&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
      ],
    },
  ]
}

// Types
export type TPost = TemplatePost
export type TPostDetail = TemplatePost
export type TComment = any

// Utility functions
export async function getAllPosts() {
  const posts = await Promise.all([getPostsDefault(), getPostsVideo(), getPostsAudio(), getPostsGallery()])
  // random shuffle
  return posts.flat().sort(() => Math.random() - 0.5)
}

export async function getPostByHandle(handle: string): Promise<TemplatePost | null> {
  const posts = await getAllPosts()
  const post = posts.find((post) => post.handle === handle)
  if (!post) {
    console.warn(`Post with handle "${handle}" not found in local posts.`)
    return null // Return null instead of fallback to first post
  }
  return post
}

export async function getCommentsByPostId(postId: string) {
  // For now, return mock comments with realistic content
  return [
    {
      id: 1,
      author: {
        id: 'author-1',
        name: 'Sarah Mitchell',
        handle: 'sarah-mitchell',
        avatar: {
          src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3687&auto=format&fit=crop',
          alt: 'Sarah Mitchell',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-10',
      content: 'Great article! This really puts things into perspective. I appreciate the thorough research and balanced viewpoint.',
      like: { count: 12, isLiked: false },
    },
    {
      id: 2,
      author: {
        id: 'author-2',
        name: 'James Anderson',
        handle: 'james-anderson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3687&auto=format&fit=crop',
          alt: 'James Anderson',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-10',
      content: 'Interesting read, though I think there are some points that could have been explored further. Would love to see a follow-up on this topic.',
      like: { count: 8, isLiked: false },
    },
    {
      id: 3,
      author: {
        id: 'author-3',
        name: 'Emma Thompson',
        handle: 'emma-thompson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop',
          alt: 'Emma Thompson',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-11',
      content: 'Thanks for sharing this! I had no idea about some of these details. Definitely bookmarking this for future reference.',
      like: { count: 15, isLiked: true },
    },
    {
      id: 4,
      author: {
        id: 'author-4',
        name: 'Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3687&auto=format&fit=crop',
          alt: 'Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-11',
      content: 'Well written and informative. The examples provided really help illustrate the main points effectively.',
      like: { count: 6, isLiked: false },
    },
    {
      id: 5,
      author: {
        id: 'author-5',
        name: 'Olivia Rodriguez',
        handle: 'olivia-rodriguez',
        avatar: {
          src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3688&auto=format&fit=crop',
          alt: 'Olivia Rodriguez',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-12',
      content: 'This is exactly what I was looking for! Clear, concise, and very helpful. Keep up the excellent work!',
      like: { count: 20, isLiked: true },
    },
  ]
}

export async function getPostById(id: string): Promise<TemplatePost | null> {
  try {
    const posts = await getAllPosts()
    const post = posts.find(p => p.id === id)
    return post || null
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }
}

export async function createPost(postData: any): Promise<boolean> {
  try {
    // In a real implementation, this would make an API call
    console.log('Creating post:', postData)
    return true
  } catch (error) {
    console.error('Error creating post:', error)
    return false
  }
}

export async function updatePost(id: string, postData: any): Promise<boolean> {
  try {
    // In a real implementation, this would make an API call
    console.log('Updating post:', id, postData)
    return true
  } catch (error) {
    console.error('Error updating post:', error)
    return false
  }
}
