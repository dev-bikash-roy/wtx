// WordPress API Response Types
export interface WPPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
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
    author?: WPUser[]
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: WPTerm[][]
  }
}

export interface WPUser {
  id: number
  name: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    [key: string]: string
  }
}

export interface WPMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  author: number
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    filesize?: number
    sizes: {
      [key: string]: {
        file: string
        width: number
        height: number
        mime_type: string
        source_url: string
      }
    }
  }
  source_url: string
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface WPTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: string
}

export interface WPApiResponse<T> {
  data: T
  total: number
  totalPages: number
}

export interface PostQuery {
  page?: number
  per_page?: number
  categories?: string
  tags?: string
  search?: string
  orderby?: 'date' | 'modified' | 'title' | 'menu_order'
  order?: 'asc' | 'desc'
  _embed?: boolean | number
}

// Template Data Types (Mapped from WordPress)
export interface TemplatePost {
  id: string
  featuredImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  title: string
  handle: string
  excerpt: string
  // Add content field
  content?: string
  date: string
  modified?: string
  readingTime: number
  commentCount: number
  viewCount: number
  bookmarkCount: number
  bookmarked: boolean
  likeCount: number
  liked: boolean
  postType: 'standard' | 'audio' | 'video' | 'gallery'
  status: string
  author: {
    id: string
    name: string
    handle: string
    description?: string
    avatar: {
      src: string
      alt: string
      width: number
      height: number
    }
  }
  categories: Array<{
    id: string
    name: string
    handle: string
    color: string
  }>
  tags?: Array<{
    id: string
    name: string
    handle: string
    color: string
  }>
  audioUrl?: string
  videoUrl?: string
  galleryImgs?: string[]
  aiSummary?: string
}

export interface TemplateCategory {
  id: string
  name: string
  handle: string
  color?: string
  description?: string
  count?: number
  date?: string
  thumbnail?: {
    src: string
    alt: string
    width: number
    height: number
  }
  cover?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export interface TemplateTag {
  id: string
  name: string
  handle: string
  color?: string
  description?: string
  count?: number
}