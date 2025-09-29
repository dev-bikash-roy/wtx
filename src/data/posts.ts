import { fetchPosts as fetchWPPosts } from './wp-api'
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
    // Fetch real posts from WordPress API
    const posts = await fetchWPPosts(20, 1)
    
    // Filter for video posts
    const videoPosts = posts.filter(post => post.postType === 'video')
    
    // If we have real video posts, return them
    if (videoPosts.length > 0) {
      return videoPosts
    }
    
    // Fallback to mock data if API fails or no video posts found
    return getMockVideoPosts()
  } catch (error) {
    console.error('Error fetching video posts:', error)
    // Fallback to mock data if API fails
    return getMockVideoPosts()
  }
}

export async function getPostsAudio(): Promise<TemplatePost[]> {
  try {
    // Fetch real posts from WordPress API
    const posts = await fetchWPPosts(20, 1)
    
    // Filter for audio posts
    const audioPosts = posts.filter(post => post.postType === 'audio')
    
    // If we have real audio posts, return them
    if (audioPosts.length > 0) {
      return audioPosts
    }
    
    // Fallback to mock data if API fails or no audio posts found
    return getMockAudioPosts()
  } catch (error) {
    console.error('Error fetching audio posts:', error)
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
  ]
}

function getMockVideoPosts(): TemplatePost[] {
  return [
    {
      id: 'post-video-1',
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
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      galleryImgs: [
        'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
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

export async function getPostByHandle(handle: string) {
  const posts = await getAllPosts()
  const post = posts.find((post) => post.handle === handle)
  if (!post) {
    // only for demo purposes, if the post is not found, return the first post
    console.warn(`Post with handle "${handle}" not found. Returning the first post as a fallback.`)
    return posts[0]
  }
  return post
}

export async function getCommentsByPostId(postId: string) {
  // For now, return mock comments
  return [
    {
      id: 1,
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
      date: '2025-06-10',
      content: 'This is a sample comment.',
      like: { count: 5, isLiked: false },
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
