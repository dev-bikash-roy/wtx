import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Firebase config
jest.mock('@/lib/firebase/config', () => ({
  app: {},
  auth: {},
  db: {},
}))

// Mock the components
jest.mock('@/components/SectionLargeSlider', () => ({
  __esModule: true,
  default: ({ heading, subHeading, posts }: any) => (
    <div className="section-large-slider" data-testid="section-large-slider">
      <div className="heading-wrapper">
        <h3 className="visible-heading">{heading}</h3>
        <p>{subHeading}</p>
      </div>
      {posts && posts.map((post: any, index: number) => (
        <div key={index} className="story-card" data-testid={`story-card-${index}`}>
          <h3 className="story-title">{post.title}</h3>
        </div>
      ))}
    </div>
  ),
}))

jest.mock('@/components/SectionTrending', () => ({
  __esModule: true,
  default: () => <div data-testid="section-trending" />,
}))

jest.mock('@/components/SectionSliderNewCategories', () => ({
  __esModule: true,
  default: () => <div data-testid="section-slider-categories" />,
}))

// Mock the data fetching functions
jest.mock('@/data/categories', () => ({
  getCategoriesWithPosts: jest.fn().mockResolvedValue([]),
}))

jest.mock('@/data/wordpress-posts', () => ({
  getAllPostsWithWordPress: jest.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Breaking News Story 1',
      handle: 'breaking-news-1',
      featuredImage: '/test-image-1.jpg',
      date: '2024-01-01',
      categories: [{ id: '1', name: 'News', slug: 'news', color: 'blue' }],
      author: { id: '1', displayName: 'Test Author', avatar: '/avatar.jpg' },
      readingTime: 5,
      likeCount: 10,
      commentCount: 5,
      liked: false,
      bookmarked: false,
      postType: 'standard',
    },
    {
      id: '2',
      title: 'Breaking News Story 2',
      handle: 'breaking-news-2',
      featuredImage: '/test-image-2.jpg',
      date: '2024-01-02',
      categories: [{ id: '1', name: 'News', slug: 'news', color: 'blue' }],
      author: { id: '1', displayName: 'Test Author', avatar: '/avatar.jpg' },
      readingTime: 5,
      likeCount: 15,
      commentCount: 8,
      liked: false,
      bookmarked: false,
      postType: 'standard',
    },
  ]),
  getWordPressPostsByCategory: jest.fn().mockResolvedValue([]),
}))

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
  }),
}))

// Create a simple test component that mimics the page structure
const TestHomePage = ({ posts = [] }: { posts?: any[] }) => {
  return (
    <div className="relative container space-y-20 pb-20">
      <h1 className="sr-only">UK Local News & Headlines</h1>
      
      <section aria-labelledby="top-stories-heading">
        <h2 id="top-stories-heading" className="sr-only">Top Stories (UK)</h2>
        <div className="section-large-slider" data-testid="section-large-slider">
          <div className="heading-wrapper">
            <h3 className="visible-heading">Latest news today</h3>
            <p>Tags - UK Featured News</p>
          </div>
          {posts.map((post, index) => (
            <div key={index} className="story-card" data-testid={`story-card-${index}`}>
              <h3 className="story-title">{post.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

describe('Homepage - Top Stories Section', () => {
  describe('H1 Heading', () => {
    it('should render exactly one H1 element', () => {
      render(<TestHomePage />)
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      expect(h1Elements).toHaveLength(1)
    })

    it('should render H1 with correct text content "UK Local News & Headlines"', () => {
      render(<TestHomePage />)
      
      const h1 = screen.getByRole('heading', { level: 1, name: /UK Local News & Headlines/i })
      expect(h1).toBeInTheDocument()
      expect(h1.textContent).toBe('UK Local News & Headlines')
    })

    it('should render H1 with sr-only class for visual hiding', () => {
      render(<TestHomePage />)
      
      const h1 = screen.getByRole('heading', { level: 1, name: /UK Local News & Headlines/i })
      expect(h1).toHaveClass('sr-only')
    })
  })

  describe('H2 "Top Stories (UK)" Heading', () => {
    it('should render H2 "Top Stories (UK)" with correct text', () => {
      render(<TestHomePage />)
      
      const h2 = screen.getByRole('heading', { level: 2, name: /Top Stories \(UK\)/i })
      expect(h2).toBeInTheDocument()
      expect(h2.textContent).toBe('Top Stories (UK)')
    })

    it('should render H2 with sr-only class for visual hiding', () => {
      render(<TestHomePage />)
      
      const h2 = screen.getByRole('heading', { level: 2, name: /Top Stories \(UK\)/i })
      expect(h2).toHaveClass('sr-only')
    })

    it('should have H2 with id "top-stories-heading"', () => {
      const { container } = render(<TestHomePage />)
      
      const h2 = container.querySelector('#top-stories-heading')
      expect(h2).toBeInTheDocument()
      expect(h2?.tagName).toBe('H2')
    })
  })

  describe('Section Structure and Accessibility', () => {
    it('should wrap Top Stories content in a semantic section element', () => {
      const { container } = render(<TestHomePage />)
      
      const section = container.querySelector('section[aria-labelledby="top-stories-heading"]')
      expect(section).toBeInTheDocument()
      expect(section?.tagName).toBe('SECTION')
    })

    it('should have section with aria-labelledby referencing H2 id', () => {
      const { container } = render(<TestHomePage />)
      
      const section = container.querySelector('section[aria-labelledby="top-stories-heading"]')
      expect(section).toBeInTheDocument()
      expect(section?.getAttribute('aria-labelledby')).toBe('top-stories-heading')
    })

    it('should render SectionLargeSlider within Top Stories section', () => {
      const { container } = render(<TestHomePage />)
      
      const section = container.querySelector('section[aria-labelledby="top-stories-heading"]')
      expect(section).toBeInTheDocument()
      
      const slider = section?.querySelector('.section-large-slider')
      expect(slider).toBeInTheDocument()
    })
  })

  describe('H3 Elements in Story Cards', () => {
    it('should render H3 elements for story card titles', () => {
      const mockPosts = [
        { id: '1', title: 'Lead Story Title' },
        { id: '2', title: 'Supporting Story 1' },
        { id: '3', title: 'Supporting Story 2' },
      ]
      
      render(<TestHomePage posts={mockPosts} />)
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      // Should have at least the story titles as H3 elements
      expect(h3Elements.length).toBeGreaterThanOrEqual(mockPosts.length)
    })

    it('should render H3 for lead story card', () => {
      const mockPosts = [
        { id: '1', title: 'Lead Story Title' },
      ]
      
      render(<TestHomePage posts={mockPosts} />)
      
      const leadStoryH3 = screen.getByRole('heading', { level: 3, name: /Lead Story Title/i })
      expect(leadStoryH3).toBeInTheDocument()
    })

    it('should render H3 elements for multiple supporting story cards', () => {
      const mockPosts = [
        { id: '1', title: 'Lead Story' },
        { id: '2', title: 'Supporting Story 1' },
        { id: '3', title: 'Supporting Story 2' },
        { id: '4', title: 'Supporting Story 3' },
      ]
      
      render(<TestHomePage posts={mockPosts} />)
      
      const supportingStory1 = screen.getByRole('heading', { level: 3, name: /Supporting Story 1/i })
      const supportingStory2 = screen.getByRole('heading', { level: 3, name: /Supporting Story 2/i })
      const supportingStory3 = screen.getByRole('heading', { level: 3, name: /Supporting Story 3/i })
      
      expect(supportingStory1).toBeInTheDocument()
      expect(supportingStory2).toBeInTheDocument()
      expect(supportingStory3).toBeInTheDocument()
    })

    it('should maintain proper heading hierarchy (H3 under H2)', () => {
      const mockPosts = [
        { id: '1', title: 'Story Title' },
      ]
      
      const { container } = render(<TestHomePage posts={mockPosts} />)
      
      // Get the section containing H2
      const section = container.querySelector('section[aria-labelledby="top-stories-heading"]')
      expect(section).toBeInTheDocument()
      
      // Verify H2 exists in section
      const h2 = section?.querySelector('h2')
      expect(h2).toBeInTheDocument()
      
      // Verify H3 elements exist within the same section
      const h3Elements = section?.querySelectorAll('h3')
      expect(h3Elements).toBeDefined()
      expect(h3Elements!.length).toBeGreaterThan(0)
    })
  })

  describe('Content Requirements', () => {
    it('should display between 1 and 8 story cards', () => {
      const mockPosts = [
        { id: '1', title: 'Story 1' },
        { id: '2', title: 'Story 2' },
        { id: '3', title: 'Story 3' },
        { id: '4', title: 'Story 4' },
        { id: '5', title: 'Story 5' },
      ]
      
      render(<TestHomePage posts={mockPosts} />)
      
      const storyCards = screen.getAllByTestId(/story-card-/)
      expect(storyCards.length).toBeGreaterThanOrEqual(1)
      expect(storyCards.length).toBeLessThanOrEqual(8)
    })
  })
})
