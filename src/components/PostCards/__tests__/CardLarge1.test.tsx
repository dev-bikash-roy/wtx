import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CardLarge1 from '../CardLarge1'
import { TPost } from '@/data/posts'

// Mock NcImage component
jest.mock('@/components/NcImage/NcImage', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

// Mock other components
jest.mock('../../CategoryBadgeList', () => ({
  __esModule: true,
  default: () => <div data-testid="category-badge-list" />,
}))

jest.mock('../../PostCardCommentBtn', () => ({
  __esModule: true,
  default: () => <div data-testid="comment-btn" />,
}))

jest.mock('../../PostCardLikeBtn', () => ({
  __esModule: true,
  default: () => <div data-testid="like-btn" />,
}))

jest.mock('../../PostCardSaveBtn', () => ({
  __esModule: true,
  default: () => <div data-testid="save-btn" />,
}))

jest.mock('../../PostCardMeta/PostCardMeta3', () => ({
  __esModule: true,
  default: () => <div data-testid="post-meta" />,
}))

jest.mock('../../PostTypeFeaturedIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="post-type-icon" />,
}))

jest.mock('@/shared/NextPrev', () => ({
  NextPrev: () => <div data-testid="next-prev" />,
}))

const mockPost: TPost = {
  id: '1',
  title: 'Test Story Title',
  handle: 'test-story-title',
  excerpt: 'Test excerpt',
  featuredImage: { src: '/test-image.jpg', alt: 'Test Story Title', width: 800, height: 600 },
  date: '2024-01-01',
  status: 'publish',
  viewCount: 100,
  bookmarkCount: 2,
  categories: [{ id: '1', name: 'News', handle: 'news', color: 'blue' }],
  author: { id: '1', name: 'Test Author', handle: 'test-author', avatar: { src: '/avatar.jpg', alt: 'Test Author', width: 96, height: 96 } },
  readingTime: 5,
  likeCount: 10,
  commentCount: 5,
  liked: false,
  bookmarked: false,
  postType: 'standard',
}

describe('CardLarge1 - Top Stories Card', () => {
  it('should render H3 element for story title', () => {
    render(<CardLarge1 post={mockPost} />)
    
    const h3 = screen.getByRole('heading', { level: 3, name: /Test Story Title/i })
    expect(h3).toBeInTheDocument()
  })

  it('should have correct class on H3 element', () => {
    render(<CardLarge1 post={mockPost} />)
    
    const h3 = screen.getByRole('heading', { level: 3, name: /Test Story Title/i })
    expect(h3).toHaveClass('nc-card-title')
    expect(h3).toHaveClass('text-base')
    expect(h3).toHaveClass('font-semibold')
  })

  it('should render link within H3 element', () => {
    const { container } = render(<CardLarge1 post={mockPost} />)
    
    // Get the H3 element first
    const h3 = screen.getByRole('heading', { level: 3, name: /Test Story Title/i })
    
    // Get the link within the H3
    const link = h3.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/news/test-story-title')
  })

  it('should render AI summary when present', () => {
    const postWithSummary = {
      ...mockPost,
      aiSummary: 'This is an AI-generated summary of the article.',
    }
    
    render(<CardLarge1 post={postWithSummary} />)
    
    expect(screen.getByText(/AI Summary/i)).toBeInTheDocument()
    expect(screen.getByText(/This is an AI-generated summary/i)).toBeInTheDocument()
  })

  it('should not render AI summary section when not present', () => {
    render(<CardLarge1 post={mockPost} />)
    
    expect(screen.queryByText(/AI Summary/i)).not.toBeInTheDocument()
  })
})
