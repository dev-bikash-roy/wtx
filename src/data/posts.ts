import { fetchPosts, fetchPostBySlug } from './wp-api'
import { TemplatePost } from './wp-types'
import { _demo_author_image_urls } from './authors'

// TODO: replace with actual images
// TODO: replace with actual images
// _demo_post_image_urls has length 20
const _demo_post_image_urls = [
  'https://images.unsplash.com/photo-1731437519600-f1219cded2cd?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1539477857993-860599c2e840?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1666792890871-0e332b76967d?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592396355679-1e2a094e8bf1?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1532347922424-c652d9b7208e?q=80&w=2639&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1535640597419-853d35e6364f?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1674507593594-964ea25ce06a?q=80&w=2171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1560703650-db93f86c37b3?q=80&w=3791&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1641301365918-c8d4b9ce7d11?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1556104577-09754a15dff2?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1743832354699-c89a3a138237?q=80&w=3057&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1559601531-503da8fa81f7?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622272516403-69dbe7ec7ecd?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

// TODO: replace with actual audio urls
// length NOTE: supported media files mp3, wav, ogg, aac, flac, webm, mp4, mov, etc.
const _demo_post_audio_urls = [
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio2.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio3.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio4.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio5.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio6.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio7.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio2.mp3',
]

// TODO: replace with actual video urls
// length 6
const _demo_post_video_urls = [
  'https://www.youtube.com/watch?v=vHBodN0Mirs',
  'https://www.youtube.com/watch?v=FBFcNPa36m8',
  'https://www.youtube.com/watch?v=oP1rIPkJte0',
  'https://www.youtube.com/watch?v=y7gKlzvg8xk',
  'https://www.youtube.com/watch?v=VJg37fVPy9I',
  'https://www.youtube.com/watch?v=2CquRQiDzx8',
  'https://www.youtube.com/watch?v=vHBodN0Mirs',
]

export async function getPostsDefault(): Promise<TemplatePost[]> {
  // Fetch real posts from WordPress API
  const posts = await fetchPosts(20, 1)
  
  // If we have real posts, return them
  if (posts.length > 0) {
    return posts
  }
  
  // Fallback to mock data if API fails
  return [
    {
      id: 'post-1',
      featuredImage: {
        src: _demo_post_image_urls[0],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: "Lenovo's smarter devices stoke professional passions ",
      handle: 'lenovo-smarter-devices-stoke-professional-passions',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
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
        name: 'Sarah Wilson',
        handle: 'sarah-wilson',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'Sarah Wilson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Garden',
          handle: 'garden',
          color: 'indigo',
        },
      ],
    },
    {
      id: 'post-2',
      featuredImage: {
        src: _demo_post_image_urls[1],
        alt: 'The Future of Remote Work in 2025',
        width: 1920,
        height: 1080,
      },
      title: 'The Future of Remote Work in 2025 - Complete Guide',
      handle: 'future-of-remote-work-2025',
      excerpt:
        'Remote work is evolving rapidly. Discover the latest trends and technologies shaping the future of work.',
      date: '2025-05-15T12:00:00Z',
      readingTime: 4,
      commentCount: 23,
      viewCount: 3200,
      bookmarkCount: 1500,
      bookmarked: true,
      likeCount: 2800,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Dr. Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: _demo_author_image_urls[1],
          alt: 'Dr. Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
    },
    {
      id: 'post-3',
      featuredImage: {
        src: _demo_post_image_urls[2],
        alt: 'Sustainable Living: - The Complete Guide',
        width: 1920,
        height: 1080,
      },
      title: 'The Complete Guide to Living Sustainably',
      handle: 'sustainable-living-complete-guide',
      excerpt:
        'Learn how to reduce your carbon footprint and live a more sustainable lifestyle with these practical tips.',
      date: '2025-04-20T12:00:00Z',
      readingTime: 6,
      commentCount: 45,
      viewCount: 4800,
      bookmarkCount: 2200,
      bookmarked: true,
      likeCount: 3500,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'Emma Green',
        handle: 'emma-green',
        avatar: {
          src: _demo_author_image_urls[2],
          alt: 'Emma Green',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Fitness',
          handle: 'fitness',
          color: 'red',
        },
      ],
    },
    {
      id: 'post-4',
      featuredImage: {
        src: _demo_post_image_urls[3],
        alt: 'AI Revolution: What to Expect in the Next Decade',
        width: 1920,
        height: 1080,
      },
      title: 'AI Revolution: What to Expect in the Next Decade',
      handle: 'ai-revolution-next-decade',
      excerpt: 'Exploring the potential impact of artificial intelligence on our daily lives and future society.',
      date: '2025-03-05T12:00:00Z',
      readingTime: 5,
      commentCount: 67,
      viewCount: 5600,
      bookmarkCount: 2800,
      bookmarked: false,
      likeCount: 4200,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-4',
        name: 'Dr. Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: _demo_author_image_urls[3],
          alt: 'Dr. Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-4',
          name: 'Finance',
          handle: 'finance',
          color: 'green',
        },
      ],
    },
    {
      id: 'post-5',
      featuredImage: {
        src: _demo_post_image_urls[4],
        alt: 'Fitness Trends That Will Dominate 2025',
        width: 1920,
        height: 1080,
      },
      title: 'Fitness Trends That Will Dominate 2025 - A Complete Guide',
      handle: 'fitness-trends-2025',
      excerpt: 'Discover the latest fitness innovations and workout trends that are reshaping the fitness industry.',
      date: '2025-02-15T12:00:00Z',
      readingTime: 3,
      commentCount: 34,
      viewCount: 3800,
      bookmarkCount: 1900,
      bookmarked: false,
      likeCount: 2600,
      liked: false,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-5',
        name: 'Lisa Martinez',
        handle: 'lisa-martinez',
        avatar: {
          src: _demo_author_image_urls[4],
          alt: 'Lisa Martinez',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-5',
          name: 'Fitness',
          handle: 'fitness',
          color: 'red',
        },
      ],
    },
    {
      id: 'post-6',
      featuredImage: {
        src: _demo_post_image_urls[5],
        alt: 'Understanding Cryptocurrency in 2025',
        width: 1920,
        height: 1080,
      },
      title: 'Understanding Cryptocurrency in 2025 - A Complete Guide',
      handle: 'understanding-cryptocurrency-2025',
      excerpt: 'A comprehensive guide to cryptocurrency trends, blockchain technology, and digital finance.',
      date: '2025-01-20T12:00:00Z',
      readingTime: 7,
      commentCount: 89,
      viewCount: 7200,
      bookmarkCount: 3600,
      bookmarked: false,
      likeCount: 4800,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-6',
        name: 'David Thompson',
        handle: 'david-thompson',
        avatar: {
          src: _demo_author_image_urls[5],
          alt: 'David Thompson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-6',
          name: 'Finance',
          handle: 'finance',
          color: 'yellow',
        },
      ],
    },
  ]
}

export async function getPostsAudio(): Promise<TemplatePost[]> {
  // Fetch real posts from WordPress API
  const posts = await fetchPosts(20, 1)
  
  // If we have real posts, return them
  if (posts.length > 0) {
    // Filter for audio posts (this would need to be implemented based on your WordPress setup)
    return posts.filter(post => post.postType === 'audio')
  }
  
  // Fallback to mock data if API fails
  return [
    {
      id: 'post-audio-1',
      featuredImage: {
        src: _demo_post_image_urls[6],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Jacob Collier x Gen Music | Google Lab Sessions | Full Session',
      handle: 'jacob-collier-x-gen-music-google-lab-sessions-full-session',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[6],
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
      audioUrl: _demo_post_audio_urls[0],
    },
    {
      id: 'post-audio-2',
      featuredImage: {
        src: _demo_post_image_urls[7],
        alt: 'Classical Music Masterpieces',
        width: 1920,
        height: 1080,
      },
      title: 'Beethoven Symphony No. 9 - Complete Performance',
      handle: 'beethoven-symphony-no-9-complete-performance',
      excerpt: "Experience the full majesty of Beethoven's Ninth Symphony in this complete performance.",
      date: '2025-05-15T12:00:00Z',
      readingTime: 3,
      commentCount: 45,
      viewCount: 3200,
      bookmarkCount: 1500,
      bookmarked: false,
      likeCount: 2800,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Sarah Wilson',
        handle: 'sarah-wilson',
        avatar: {
          src: _demo_author_image_urls[7],
          alt: 'Sarah Wilson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Photography',
          handle: 'photography',
          color: 'purple',
        },
      ],
      audioUrl: _demo_post_audio_urls[1],
    },
    {
      id: 'post-audio-3',
      featuredImage: {
        src: _demo_post_image_urls[8],
        alt: 'Jazz Night Live',
        width: 1920,
        height: 1080,
      },
      title: 'Jazz Night Live: Miles Davis Tribute',
      handle: 'jazz-night-live-miles-davis-tribute',
      excerpt: 'A special tribute to Miles Davis featuring contemporary jazz artists.',
      date: '2025-04-20T12:00:00Z',
      readingTime: 2,
      commentCount: 34,
      viewCount: 2800,
      bookmarkCount: 1200,
      bookmarked: true,
      likeCount: 2100,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'John Anderson',
        handle: 'john-anderson',
        avatar: {
          src: _demo_author_image_urls[8],
          alt: 'John Anderson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Photography',
          handle: 'photography',
          color: 'blue',
        },
      ],
      audioUrl: _demo_post_audio_urls[2],
    },
    {
      id: 'post-audio-4',
      featuredImage: {
        src: _demo_post_image_urls[9],
        alt: 'Electronic Music Festival',
        width: 1920,
        height: 1080,
      },
      title: 'Tomorrowland 2025: Best Sets Collection',
      handle: 'tomorrowland-2025-best-sets-collection',
      excerpt: 'The most memorable sets from Tomorrowland 2025, featuring top electronic music artists.',
      date: '2025-03-05T12:00:00Z',
      readingTime: 4,
      commentCount: 89,
      viewCount: 4500,
      bookmarkCount: 2300,
      bookmarked: false,
      likeCount: 3800,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-4',
        name: 'Emma Davis',
        handle: 'emma-davis',
        avatar: {
          src: _demo_author_image_urls[9],
          alt: 'Emma Davis',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-4',
          name: 'Architecture',
          handle: 'architecture',
          color: 'purple',
        },
      ],
      audioUrl: _demo_post_audio_urls[3],
    },
    {
      id: 'post-audio-5',
      featuredImage: {
        src: _demo_post_image_urls[10],
        alt: 'Rock Concert Live',
        width: 1920,
        height: 1080,
      },
      title: 'Rock Legends: Live at Madison Square Garden',
      handle: 'rock-legends-live-at-madison-square-garden',
      excerpt: 'Experience the electrifying performance of legendary rock bands at the iconic venue.',
      date: '2025-02-15T12:00:00Z',
      readingTime: 3,
      commentCount: 56,
      viewCount: 3800,
      bookmarkCount: 1900,
      bookmarked: true,
      likeCount: 3200,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-5',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[2],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-5',
          name: 'Architecture',
          handle: 'architecture',
          color: 'red',
        },
      ],
      audioUrl: _demo_post_audio_urls[4],
    },
    {
      id: 'post-audio-6',
      featuredImage: {
        src: _demo_post_image_urls[11],
        alt: 'Hip Hop Studio Session',
        width: 1920,
        height: 1080,
      },
      title: 'Behind the Beats: Hip Hop Production Masterclass',
      handle: 'behind-the-beats-hip-hop-production-masterclass',
      excerpt: 'An exclusive look into the art of hip hop production with industry experts.',
      date: '2025-01-20T12:00:00Z',
      readingTime: 4,
      commentCount: 78,
      viewCount: 4200,
      bookmarkCount: 2100,
      bookmarked: false,
      likeCount: 3500,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-6',
        name: 'Maria Rodriguez',
        handle: 'maria-rodriguez',
        avatar: {
          src: _demo_author_image_urls[1],
          alt: 'Maria Rodriguez',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-6',
          name: 'Wellness',
          handle: 'wellness',
          color: 'purple',
        },
      ],
      audioUrl: _demo_post_audio_urls[5],
    },
    {
      id: 'post-audio-7',
      featuredImage: {
        src: _demo_post_image_urls[12],
        alt: 'World Music Festival',
        width: 1920,
        height: 1080,
      },
      title: 'Global Rhythms: World Music Festival Highlights',
      handle: 'global-rhythms-world-music-festival-highlights',
      excerpt: 'A celebration of diverse musical traditions from around the world.',
      date: '2025-01-05T12:00:00Z',
      readingTime: 3,
      commentCount: 45,
      viewCount: 3600,
      bookmarkCount: 1800,
      bookmarked: true,
      likeCount: 2900,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-7',
        name: 'Alex Kumar',
        handle: 'alex-kumar',
        avatar: {
          src: _demo_author_image_urls[2],
          alt: 'Alex Kumar',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-7',
          name: 'Wellness',
          handle: 'wellness',
          color: 'green',
        },
      ],
      audioUrl: _demo_post_audio_urls[6],
    },
    {
      id: 'post-audio-8',
      featuredImage: {
        src: _demo_post_image_urls[13],
        alt: 'Piano Concert',
        width: 1920,
        height: 1080,
      },
      title: 'Piano Masterpieces: Chopin Nocturnes Collection',
      handle: 'piano-masterpieces-chopin-nocturnes-collection',
      excerpt: "A mesmerizing collection of Chopin's most beautiful nocturnes performed by world-renowned pianists.",
      date: '2024-12-20T12:00:00Z',
      readingTime: 3,
      commentCount: 67,
      viewCount: 4200,
      bookmarkCount: 2100,
      bookmarked: true,
      likeCount: 3500,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-8',
        name: 'Alex Kumar',
        handle: 'alex-kumar',
        avatar: {
          src: _demo_author_image_urls[3],
          alt: 'Alex Kumar',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-8',
          name: 'Education',
          handle: 'education',
          color: 'purple',
        },
      ],
      audioUrl: _demo_post_audio_urls[1],
    },
    {
      id: 'post-audio-9',
      featuredImage: {
        src: _demo_post_image_urls[14],
        alt: 'Podcast Studio',
        width: 1920,
        height: 1080,
      },
      title: 'Tech Talk: The Future of Digital Innovation',
      handle: 'tech-talk-future-of-digital-innovation',
      excerpt: 'An insightful discussion about emerging technologies and their impact on our digital future.',
      date: '2024-12-15T12:00:00Z',
      readingTime: 4,
      commentCount: 89,
      viewCount: 4800,
      bookmarkCount: 2400,
      bookmarked: false,
      likeCount: 3900,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-9',
        name: 'Sarah Wilson',
        handle: 'sarah-wilson',
        avatar: {
          src: _demo_author_image_urls[4],
          alt: 'Sarah Wilson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-9',
          name: 'Education',
          handle: 'education',
          color: 'blue',
        },
      ],
      audioUrl: _demo_post_audio_urls[2],
    },
    {
      id: 'post-audio-10',
      featuredImage: {
        src: _demo_post_image_urls[15],
        alt: 'Meditation Music',
        width: 1920,
        height: 1080,
      },
      title: 'Peaceful Mind: Guided Meditation Collection',
      handle: 'peaceful-mind-guided-meditation-collection',
      excerpt: 'A curated collection of calming meditation sessions for stress relief and mindfulness.',
      date: '2024-12-10T12:00:00Z',
      readingTime: 2,
      commentCount: 45,
      viewCount: 3600,
      bookmarkCount: 1800,
      bookmarked: true,
      likeCount: 2900,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-10',
        name: 'Dr. Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: _demo_author_image_urls[5],
          alt: 'Dr. Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-10',
          name: 'Wellness',
          handle: 'wellness',
          color: 'green',
        },
      ],
      audioUrl: _demo_post_audio_urls[3],
    },
    {
      id: 'post-audio-11',
      featuredImage: {
        src: _demo_post_image_urls[16],
        alt: 'Podcast Studio',
        width: 1920,
        height: 1080,
      },
      title: 'The Future of AI: A Deep Dive Discussion',
      handle: 'future-of-ai-deep-dive-discussion',
      excerpt: 'An in-depth conversation about artificial intelligence, its current state, and future implications.',
      date: '2024-12-05T12:00:00Z',
      readingTime: 4,
      commentCount: 78,
      viewCount: 4200,
      bookmarkCount: 2100,
      bookmarked: true,
      likeCount: 3600,
      liked: true,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-11',
        name: 'Maria Rodriguez',
        handle: 'maria-rodriguez',
        avatar: {
          src: _demo_author_image_urls[6],
          alt: 'Maria Rodriguez',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Education',
          handle: 'education',
          color: 'blue',
        },
      ],
      audioUrl: _demo_post_audio_urls[4],
    },
    {
      id: 'post-audio-12',
      featuredImage: {
        src: _demo_post_image_urls[17],
        alt: 'Meditation Music',
        width: 1920,
        height: 1080,
      },
      title: 'Mindful Living: Daily Meditation Guide',
      handle: 'mindful-living-daily-meditation-guide',
      excerpt: 'A comprehensive guide to incorporating mindfulness and meditation into your daily routine.',
      date: '2024-12-01T12:00:00Z',
      readingTime: 3,
      commentCount: 65,
      viewCount: 3800,
      bookmarkCount: 1900,
      bookmarked: false,
      likeCount: 3200,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-12',
        name: 'Dr. Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: _demo_author_image_urls[7],
          alt: 'Dr. Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-9',
          name: 'Wellness',
          handle: 'wellness',
          color: 'teal',
        },
      ],
      audioUrl: _demo_post_audio_urls[5],
    },
  ]
}

export async function getPostsVideo(): Promise<TemplatePost[]> {
  // Fetch real posts from WordPress API
  const posts = await fetchPosts(20, 1)
  
  // If we have real posts, return them
  if (posts.length > 0) {
    // Filter for video posts (this would need to be implemented based on your WordPress setup)
    return posts.filter(post => post.postType === 'video')
  }
  
  // Fallback to mock data if API fails
  return [
    {
      id: 'post-video-1',
      featuredImage: {
        src: _demo_post_image_urls[18],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'The impact of COVID-19 on The Airport Business',
      handle: 'the-impact-of-covid-19-on-the-airport-business',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: false,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[8],
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
      videoUrl: _demo_post_video_urls[0],
    },
    {
      id: 'post-video-2',
      featuredImage: {
        src: _demo_post_image_urls[19],
        alt: 'Space Exploration Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Journey to Mars: The Future of Space Exploration',
      handle: 'journey-to-mars-future-of-space-exploration',
      excerpt: 'An in-depth look at the challenges and possibilities of human exploration of Mars.',
      date: '2025-05-15',
      readingTime: 5,
      commentCount: 67,
      viewCount: 4200,
      bookmarkCount: 2100,
      bookmarked: false,
      likeCount: 3500,
      liked: true,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Dr. Michael Chen',
        handle: 'michael-chen',
        avatar: {
          src: _demo_author_image_urls[9],
          alt: 'Dr. Michael Chen',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-2',
          name: 'Technology',
          handle: 'technology',
          color: 'purple',
        },
      ],
      videoUrl: _demo_post_video_urls[1],
    },
    {
      id: 'post-video-3',
      featuredImage: {
        src: _demo_post_image_urls[1],
        alt: 'Coding Tutorial',
        width: 1920,
        height: 1080,
      },
      title: 'Mastering React: Advanced Patterns and Best Practices',
      handle: 'mastering-react-advanced-patterns',
      excerpt: 'Learn advanced React patterns and best practices from industry experts.',
      date: '2025-04-20',
      readingTime: 3,
      commentCount: 45,
      viewCount: 3800,
      bookmarkCount: 1900,
      bookmarked: true,
      likeCount: 3200,
      liked: false,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'Alex Kumar',
        handle: 'alex-kumar',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'Alex Kumar',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Architecture',
          handle: 'architecture',
          color: 'blue',
        },
      ],
      videoUrl: _demo_post_video_urls[2],
    },
    {
      id: 'post-video-4',
      featuredImage: {
        src: _demo_post_image_urls[2],
        alt: 'Cooking Show',
        width: 1920,
        height: 1080,
      },
      title: 'Mastering French Cuisine: A Complete Guide',
      handle: 'mastering-french-cuisine-complete-guide',
      excerpt: 'Learn the art of French cooking with step-by-step tutorials from a master chef.',
      date: '2025-03-05',
      readingTime: 4,
      commentCount: 78,
      viewCount: 5200,
      bookmarkCount: 2600,
      bookmarked: false,
      likeCount: 4100,
      liked: true,
      postType: 'video',
      videoUrl: _demo_post_video_urls[3],
      status: 'published',
      author: {
        id: 'author-4',
        name: 'David Thompson',
        handle: 'david-thompson',
        avatar: {
          src: _demo_author_image_urls[2],
          alt: 'David Thompson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-4',
          name: 'Architecture',
          handle: 'architecture',
          color: 'red',
        },
      ],
    },
    {
      id: 'post-video-5',
      featuredImage: {
        src: _demo_post_image_urls[10],
        alt: 'Wildlife Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Wildlife Wonders: The Hidden Life of Rainforests',
      handle: 'wildlife-wonders-hidden-life-of-rainforests',
      excerpt: "An extraordinary journey into the heart of the world's most diverse ecosystems.",
      date: '2025-02-15',
      readingTime: 6,
      commentCount: 89,
      viewCount: 4800,
      bookmarkCount: 2400,
      bookmarked: true,
      likeCount: 3900,
      liked: true,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-5',
        name: 'Emma Green',
        handle: 'emma-green',
        avatar: {
          src: _demo_author_image_urls[3],
          alt: 'Emma Green',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-5',
          name: 'Music',
          handle: 'music',
          color: 'green',
        },
      ],
      videoUrl: _demo_post_video_urls[4],
    },
    {
      id: 'post-video-6',
      featuredImage: {
        src: _demo_post_image_urls[3],
        alt: 'AI Technology',
        width: 1920,
        height: 1080,
      },
      title: 'The Future of AI: Breakthroughs and Challenges',
      handle: 'future-of-ai-breakthroughs-and-challenges',
      excerpt: 'Exploring the latest developments in artificial intelligence and their implications.',
      date: '2025-01-20',
      readingTime: 4,
      commentCount: 67,
      viewCount: 4500,
      bookmarkCount: 2250,
      bookmarked: false,
      likeCount: 3700,
      liked: false,
      postType: 'video',
      videoUrl: _demo_post_video_urls[5],
      status: 'published',
      author: {
        id: 'author-6',
        name: 'Emma Green',
        handle: 'emma-green',
        avatar: {
          src: _demo_author_image_urls[3],
          alt: 'Emma Green',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-6',
          name: 'Music',
          handle: 'music',
          color: 'blue',
        },
      ],
    },
    {
      id: 'post-video-7',
      featuredImage: {
        src: _demo_post_image_urls[4],
        alt: 'Travel Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Hidden Gems: Unexplored Destinations of Asia',
      handle: 'hidden-gems-unexplored-destinations-of-asia',
      excerpt: "Discover the lesser-known treasures of Asia's most fascinating locations.",
      date: '2025-01-05',
      readingTime: 5,
      commentCount: 92,
      viewCount: 5100,
      bookmarkCount: 2550,
      bookmarked: true,
      likeCount: 4200,
      liked: true,
      postType: 'video',
      videoUrl: _demo_post_video_urls[0],
      status: 'published',
      author: {
        id: 'author-7',
        name: 'Lisa Martinez',
        handle: 'lisa-martinez',
        avatar: {
          src: _demo_author_image_urls[4],
          alt: 'Lisa Martinez',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-7',
          name: 'Travel',
          handle: 'travel',
          color: 'yellow',
        },
      ],
    },
    {
      id: 'post-video-8',
      featuredImage: {
        src: _demo_post_image_urls[5],
        alt: 'Ocean Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Deep Blue: Mysteries of the Ocean',
      handle: 'deep-blue-mysteries-of-the-ocean',
      excerpt: 'An extraordinary journey into the depths of our oceans, revealing its hidden wonders.',
      date: '2024-12-20',
      readingTime: 5,
      commentCount: 78,
      viewCount: 4500,
      bookmarkCount: 2250,
      bookmarked: true,
      likeCount: 3800,
      liked: true,
      postType: 'video',
      videoUrl: _demo_post_video_urls[1],
      status: 'published',
      author: {
        id: 'author-8',
        name: 'Lisa Martinez',
        handle: 'lisa-martinez',
        avatar: {
          src: _demo_author_image_urls[5],
          alt: 'Lisa Martinez',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-8',
          name: 'Music',
          handle: 'music',
          color: 'blue',
        },
      ],
    },
    {
      id: 'post-video-9',
      featuredImage: {
        src: _demo_post_image_urls[6],
        alt: 'Sports Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Champions: The Making of Olympic Athletes',
      handle: 'champions-making-of-olympic-athletes',
      excerpt: 'An inspiring look at the dedication and training behind Olympic success stories.',
      date: '2024-12-15',
      readingTime: 4,
      commentCount: 92,
      viewCount: 5100,
      bookmarkCount: 2550,
      bookmarked: false,
      likeCount: 4200,
      liked: false,
      postType: 'video',
      videoUrl: _demo_post_video_urls[1],
      status: 'published',
      author: {
        id: 'author-9',
        name: 'David Thompson',
        handle: 'david-thompson',
        avatar: {
          src: _demo_author_image_urls[6],
          alt: 'David Thompson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-9',
          name: 'Architecture',
          handle: 'architecture',
          color: 'red',
        },
      ],
    },
    {
      id: 'post-video-10',
      featuredImage: {
        src: _demo_post_image_urls[7],
        alt: 'History Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'Ancient Civilizations: Lost Cities Revealed',
      handle: 'ancient-civilizations-lost-cities-revealed',
      excerpt: 'Uncovering the mysteries of ancient civilizations through archaeological discoveries.',
      date: '2024-12-10',
      readingTime: 6,
      commentCount: 85,
      viewCount: 4800,
      bookmarkCount: 2400,
      bookmarked: true,
      likeCount: 3900,
      liked: true,
      postType: 'video',
      videoUrl: _demo_post_video_urls[2],
      status: 'published',
      author: {
        id: 'author-10',
        name: 'David Thompson',
        handle: 'david-thompson',
        avatar: {
          src: _demo_author_image_urls[7],
          alt: 'David Thompson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-10',
          name: 'Architecture',
          handle: 'architecture',
          color: 'yellow',
        },
      ],
    },
    {
      id: 'post-video-11',
      featuredImage: {
        src: _demo_post_image_urls[8],
        alt: 'Education Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'The Evolution of Education: Past to Future',
      handle: 'evolution-of-education-past-to-future',
      excerpt: "A comprehensive look at how education has evolved and where it's heading in the digital age.",
      date: '2024-12-05',
      readingTime: 5,
      commentCount: 82,
      viewCount: 4700,
      bookmarkCount: 2350,
      bookmarked: true,
      likeCount: 3900,
      liked: true,
      postType: 'video',
      videoUrl: _demo_post_video_urls[3],
      status: 'published',
      author: {
        id: 'author-11',
        name: 'John Anderson',
        handle: 'john-anderson',
        avatar: {
          src: _demo_author_image_urls[8],
          alt: 'John Anderson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-10',
          name: 'Education',
          handle: 'education',
          color: 'orange',
        },
      ],
    },
    {
      id: 'post-video-12',
      featuredImage: {
        src: _demo_post_image_urls[9],
        alt: 'Photography Documentary',
        width: 1920,
        height: 1080,
      },
      title: 'The Art of Photography: Masterclass Series',
      handle: 'art-of-photography-masterclass-series',
      excerpt:
        'An exclusive masterclass series featuring renowned photographers sharing their techniques and insights.',
      date: '2024-12-01',
      readingTime: 4,
      commentCount: 75,
      viewCount: 4500,
      bookmarkCount: 2250,
      bookmarked: false,
      likeCount: 3700,
      liked: false,
      postType: 'video',
      videoUrl: _demo_post_video_urls[4],
      status: 'published',
      author: {
        id: 'author-12',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[9],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-6',
          name: 'Photography',
          handle: 'photography',
          color: 'purple',
        },
      ],
    },
  ]
}

export async function getPostsGallery(): Promise<TemplatePost[]> {
  // Fetch real posts from WordPress API
  const posts = await fetchPosts(20, 1)
  
  // If we have real posts, return them
  if (posts.length > 0) {
    // Filter for gallery posts (this would need to be implemented based on your WordPress setup)
    return posts.filter(post => post.postType === 'gallery')
  }
  
  // Fallback to mock data if API fails
  return [
    {
      id: 'post-gallery-1',
      featuredImage: {
        src: _demo_post_image_urls[10],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Where the Internet Lives: From Trauma to Triumph Oval',
      handle: 'where-the-internet-lives-from-trauma-to-triumph-oval',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: false,
      likeCount: 3007,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[0],
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
        _demo_post_image_urls[10],
        _demo_post_image_urls[11],
        _demo_post_image_urls[14],
        _demo_post_image_urls[15],
        _demo_post_image_urls[16],
      ],
    },
    {
      id: 'post-gallery-2',
      featuredImage: {
        src: _demo_post_image_urls[11],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Ensure that interactive elements are easy to identify',
      handle: 'ensure-that-interactive-elements-are-easy-to-identify',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: false,
      likeCount: 3007,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[0],
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
        _demo_post_image_urls[1],
        _demo_post_image_urls[3],
        _demo_post_image_urls[4],
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
      ],
    },
    {
      id: 'post-gallery-3',
      featuredImage: {
        src: _demo_post_image_urls[12],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Girls in Ocean Science Conference a First at Maritime Museum',
      handle: 'girls-in-ocean-science-conference-a-first-at-maritime-museum',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: false,
      likeCount: 3007,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Alex Kumar',
        handle: 'alex-kumar',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'Alex Kumar',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Architecture',
          handle: 'architecture',
          color: 'blue',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[2],
        _demo_post_image_urls[3],
        _demo_post_image_urls[4],
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
      ],
    },
    {
      id: 'post-gallery-4',
      featuredImage: {
        src: _demo_post_image_urls[13],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'The 2025 World Cup: A Look at the Teams and Players',
      handle: 'the-2025-world-cup-a-look-at-the-teams-and-players',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: false,
      likeCount: 3007,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-2',
        name: 'Alex Kumar',
        handle: 'alex-kumar',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'Alex Kumar',
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
        _demo_post_image_urls[3],
        _demo_post_image_urls[4],
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
      ],
    },
    {
      id: 'post-gallery-5',
      featuredImage: {
        src: _demo_post_image_urls[14],
        alt: 'Mountain Landscape',
        width: 1920,
        height: 1080,
      },
      title: 'Majestic Mountains: A Photographic Journey',
      handle: 'majestic-mountains-photographic-journey',
      excerpt: 'A stunning collection of mountain landscapes captured across different seasons and times of day.',
      date: '2025-06-10',
      readingTime: 4,
      commentCount: 72,
      viewCount: 4600,
      bookmarkCount: 2300,
      bookmarked: true,
      likeCount: 3700,
      liked: true,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-3',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[1],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-3',
          name: 'Photography',
          handle: 'photography',
          color: 'purple',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[4],
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
        _demo_post_image_urls[8],
      ],
    },
    {
      id: 'post-gallery-6',
      featuredImage: {
        src: _demo_post_image_urls[15],
        alt: 'Urban Architecture',
        width: 1920,
        height: 1080,
      },
      title: 'Urban Perspectives: Modern Architecture',
      handle: 'urban-perspectives-modern-architecture',
      excerpt: 'A visual exploration of contemporary architecture and urban design from around the world.',
      date: '2025-06-10',
      readingTime: 3,
      commentCount: 63,
      viewCount: 4300,
      bookmarkCount: 2150,
      bookmarked: true,
      likeCount: 3500,
      liked: true,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-4',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[1],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-4',
          name: 'Architecture',
          handle: 'architecture',
          color: 'blue',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
        _demo_post_image_urls[8],
        _demo_post_image_urls[9],
      ],
    },
    {
      id: 'post-gallery-7',
      featuredImage: {
        src: _demo_post_image_urls[16],
        alt: 'Wildlife Photography',
        width: 1920,
        height: 1080,
      },
      title: "Wildlife Wonders: Nature's Hidden Treasures",
      handle: 'wildlife-wonders-natures-hidden-treasures',
      excerpt: 'Captivating moments of wildlife in their natural habitats, showcasing the beauty of nature.',
      date: '2025-06-10',
      readingTime: 5,
      commentCount: 85,
      viewCount: 4900,
      bookmarkCount: 2450,
      bookmarked: false,
      likeCount: 4000,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-5',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[1],
          alt: 'Sophia Lee',
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
        _demo_post_image_urls[3],
        _demo_post_image_urls[4],
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
      ],
    },
    {
      id: 'post-gallery-8',
      featuredImage: {
        src: _demo_post_image_urls[14],
        alt: 'Mountain Landscape',
        width: 1920,
        height: 1080,
      },
      title: 'Majestic Mountains: A Photographic Journey',
      handle: 'majestic-mountains-photographic-journey',
      excerpt: 'A stunning collection of mountain landscapes captured across different seasons and times of day.',
      date: '2024-12-20',
      readingTime: 4,
      commentCount: 72,
      viewCount: 4600,
      bookmarkCount: 2300,
      bookmarked: true,
      likeCount: 3700,
      liked: true,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-8',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[2],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-8',
          name: 'Architecture',
          handle: 'architecture',
          color: 'blue',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[4],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
        _demo_post_image_urls[8],
        _demo_post_image_urls[9],
      ],
    },
    {
      id: 'post-gallery-9',
      featuredImage: {
        src: _demo_post_image_urls[15],
        alt: 'Wildlife Photography',
        width: 1920,
        height: 1080,
      },
      title: "Wildlife Wonders: Nature's Hidden Treasures",
      handle: 'wildlife-wonders-natures-hidden-treasures',
      excerpt: 'Captivating moments of wildlife in their natural habitats, showcasing the beauty of nature.',
      date: '2024-12-15',
      readingTime: 5,
      commentCount: 85,
      viewCount: 4900,
      bookmarkCount: 2450,
      bookmarked: false,
      likeCount: 4000,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-9',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[3],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-9',
          name: 'Photography',
          handle: 'photography',
          color: 'green',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[5],
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
        _demo_post_image_urls[8],
      ],
    },
    {
      id: 'post-gallery-10',
      featuredImage: {
        src: _demo_post_image_urls[16],
        alt: 'Urban Architecture',
        width: 1920,
        height: 1080,
      },
      title: 'Urban Perspectives: Modern Architecture',
      handle: 'urban-perspectives-modern-architecture',
      excerpt: 'A visual exploration of contemporary architecture and urban design from around the world.',
      date: '2024-12-10',
      readingTime: 3,
      commentCount: 63,
      viewCount: 4300,
      bookmarkCount: 2150,
      bookmarked: true,
      likeCount: 3500,
      liked: true,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-10',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: _demo_author_image_urls[4],
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-10',
          name: 'Photography',
          handle: 'photography',
          color: 'gray',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[6],
        _demo_post_image_urls[7],
        _demo_post_image_urls[8],
        _demo_post_image_urls[9],
      ],
    },
  ]
}

export async function getAllPosts(): Promise<TemplatePost[]> {
  const posts = await Promise.all([getPostsDefault(), getPostsVideo(), getPostsAudio(), getPostsGallery()])

  // random shuffle
  return posts.flat().sort(() => Math.random() - 0.5)
}

export async function getPostByHandle(handle: string): Promise<any> {
  // Try to fetch real post from WordPress API
  const post = await fetchPostBySlug(handle)
  
  // If we have a real post, return it
  if (post) {
    return {
      ...post,
      // for demo purposes
      galleryImgs: [...(post.galleryImgs || []), ..._demo_post_image_urls],
      // for demo purposes
      videoUrl: post.videoUrl || 'https://www.youtube.com/watch?v=JcDBFAm9PPI',
      // for demo purposes
      audioUrl: post.audioUrl || 'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio3.mp3',
      author: {
        ...post.author,
      },
      tags: [
        ...(post.tags || []),
        // for demo purposes, only add if there are no tags
        ...(!post.tags || post.tags.length === 0 ? [
          {
            id: 'tag-1',
            name: 'Technology',
            handle: 'technology',
            color: 'blue',
          },
          {
            id: 'tag-2',
            name: 'Travel',
            handle: 'travel',
            color: 'blue',
          },
          {
            id: 'tag-3',
            name: 'Food',
            handle: 'food',
            color: 'blue',
          },
          {
            id: 'tag-4',
            name: 'Health',
            handle: 'health',
            color: 'blue',
          }
        ] : [])
      ],
      categories: [
        ...(post.categories || []),
        // for demo purposes, only add if there are no categories
        ...(!post.categories || post.categories.length === 0 ? [
          {
            id: 'category-typography',
            name: 'Typography',
            handle: 'typography',
            color: 'sky',
          }
        ] : [])
      ],
    }
  }
  
  // Fallback to mock data if API fails
  const posts = await getAllPosts()
  let foundPost = posts.find((post) => post.handle === handle)
  
  if (!foundPost) {
    // only for demo purposes, if the post is not found, return the first post as a fallback
    console.warn(`Post with handle "${handle}" not found. Returning the first post as a fallback.`)
    foundPost = posts[0]
  }

  // Generate more realistic content based on the post title and categories
  const contentParagraphs = [
    `Welcome to "${foundPost.title}". This is a detailed exploration of the topic covered in this article.`,
    "In today's fast-paced world, staying informed about the latest developments is crucial for success.",
    "This comprehensive guide will walk you through the essential aspects of the subject matter.",
    "Our expert analysis provides valuable insights that will help you understand the nuances of this topic.",
    "Whether you're a beginner or an experienced professional, this article offers something for everyone.",
    "We've gathered the most relevant information to ensure you get a well-rounded perspective.",
    "The following sections will delve deeper into specific aspects that are particularly important.",
    "By the end of this article, you'll have a solid understanding of the key concepts discussed.",
    "We encourage you to share your thoughts and experiences in the comments section below.",
    "Stay tuned for more updates and insights on this and related topics."
  ];

  return {
    ...foundPost,
    // for demo purposes
    galleryImgs: [...(_demo_post_image_urls)],
    // for demo purposes
    videoUrl: 'https://www.youtube.com/watch?v=JcDBFAm9PPI',
    // for demo purposes
    audioUrl: 'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio3.mp3',
    content: contentParagraphs.join('\n\n'),
    author: {
      ...foundPost.author,
    },
    tags: [
      // for demo purposes
      {
        id: 'tag-1',
        name: 'Technology',
        handle: 'technology',
        color: 'blue',
      },
      {
        id: 'tag-2',
        name: 'Travel',
        handle: 'travel',
        color: 'blue',
      },
      {
        id: 'tag-3',
        name: 'Food',
        handle: 'food',
        color: 'blue',
      },
      {
        id: 'tag-4',
        name: 'Health',
        handle: 'health',
        color: 'blue',
      },
    ],
    categories: [
      ...(foundPost.categories || []),
      // for demo purposes
      {
        id: 'category-typography',
        name: 'Typography',
        handle: 'typography',
        color: 'sky',
      },
    ],
  }
}

export async function getCommentsByPostId(postId: string) {
  const comments = [
    {
      id: 1,
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-10',
      content: 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.',
      like: { count: 96, isLiked: false },
    },

    {
      id: 3,
      author: {
        id: 'author-3',
        name: 'John Anderson',
        handle: 'john-anderson',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          alt: 'John Anderson',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-10',
      content:
        'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
      like: { count: 66, isLiked: true },
    },
    {
      id: 4,
      author: {
        id: 'author-4',
        name: 'Sophia Lee',
        handle: 'sophia-lee',
        avatar: {
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3922&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          alt: 'Sophia Lee',
          width: 1920,
          height: 1080,
        },
      },
      date: '2025-06-10',
      content:
        'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
      like: { count: 45, isLiked: true },
    },
  ]
  // random shuffle
  return comments.flat().sort(() => Math.random() - 0.5)
}

// Types
export type TPost = TemplatePost
export type TPostDetail = Awaited<ReturnType<typeof getPostByHandle>>
export type TComment = Awaited<ReturnType<typeof getCommentsByPostId>>[number]