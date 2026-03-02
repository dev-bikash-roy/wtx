export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    {
      id: 'uk-news',
      href: '/category/uk-news',
      name: 'UK News',
      type: 'dropdown',
      children: [
        { id: 'england', href: '/category/england-news', name: 'England' },
        { id: 'scotland', href: '/scotland-news', name: 'Scotland' },
        { id: 'wales', href: '/wales-news', name: 'Wales' },
        { id: 'northern-ireland', href: '/category/northern-ireland-uk-news', name: 'Northern Ireland' },
        { id: 'london', href: '/tag/london', name: 'London' },
        { id: 'manchester', href: '/tag/manchester', name: 'Manchester' },
      ],
    },
    {
      id: 'latest-news-nav',
      href: '/tag/latest-news',
      name: 'Latest News',
      type: 'dropdown',
      children: [
        { id: 'main-headlines', href: '/tag/main-headlines', name: 'Main Headlines' },
        { id: 'uk-politics', href: '/tag/uk-politics', name: 'UK Politics' },
        { id: 'world-news', href: '/tag/world-news', name: 'World News' },
        { id: 'business', href: '/category/business', name: 'Business' },
        { id: 'uk-crime', href: '/tag/uk-crime', name: 'UK Crime' },
      ],
    },
    {
      id: 'sport',
      href: '/category/sport',
      name: 'Sport',
      type: 'dropdown',
      children: [
        { id: 'premier-league', href: '/tag/premier-league', name: 'Premier League' },
        { id: 'football', href: '/tag/football', name: 'Football' },
        { id: 'football-gossip', href: '/tag/football-gossip', name: 'Football Gossip' },
        { id: 'sports-news', href: '/tag/sports-news', name: 'Sports News' },
      ],
    },
    {
      id: 'entertainment',
      href: '/category/entertainment',
      name: 'Entertainment',
      type: 'dropdown',
      children: [
        { id: 'uk-entertainment', href: '/tag/uk-entertainment', name: 'UK Entertainment' },
        { id: 'us-entertainment', href: '/tag/us-entertainment', name: 'US Entertainment' },
        { id: 'celebrities', href: '/tag/celebrities', name: 'Celebrities' },
        { id: 'streaming', href: '/tag/streaming', name: 'Streaming' },
      ],
    },
    {
      id: 'lifestyle',
      href: '/category/lifestyle',
      name: 'Lifestyle',
      type: 'dropdown',
      children: [
        { id: 'health', href: '/category/health', name: 'Health' },
        { id: 'fitness', href: '/category/fitness', name: 'Fitness' },
        { id: 'fashion', href: '/category/fashion', name: 'Fashion' },
        { id: 'food-and-drink', href: '/category/food-and-drink', name: 'Food & Drink' },
      ],
    },
    {
      id: 'world',
      href: '/category/world',
      name: 'World',
      type: 'dropdown',
      children: [
        { id: 'usa-news', href: '/category/usa-news', name: 'USA' },
        { id: 'europe', href: '/category/europe', name: 'Europe' },
        { id: 'canada', href: '/category/canada', name: 'Canada' },
        { id: 'south-america', href: '/category/south-america', name: 'South America' },
      ],
    },
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  return {
    id: 'categories',
    href: '#',
    name: 'Categories',
    type: 'dropdown',
    children: [
      { id: 'uk-news', href: '/category/uk-news', name: 'UK News' },
      { id: 'world', href: '/category/world', name: 'World News' },
      { id: 'sport', href: '/category/sport', name: 'Sport' },
      { id: 'entertainment', href: '/category/entertainment', name: 'Entertainment' },
      { id: 'politics', href: '/category/politics', name: 'Politics' },
      { id: 'business', href: '/category/business', name: 'Business' },
      { id: 'lifestyle', href: '/category/lifestyle', name: 'Lifestyle' },
      { id: 'health', href: '/category/health', name: 'Health' },
    ],
  }
}

export async function getCategoryMegaMenu(): Promise<TNavigationItem> {
  return {}
}

// ============ TYPE =============
export type TNavigationItem = Partial<{
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}>

export const getLanguages = async () => {
  return [
    {
      id: 'English',
      name: 'English',
      description: 'United Kingdom',
      href: '#',
      active: true,
    },
  ]
}
export const getCurrencies = async () => {
  return [
    {
      id: 'GBP',
      name: 'GBP',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12H13.2M9 12V9.2963C9 8.82489 9 8.58919 9.14645 8.44274C9.29289 8.2963 9.5286 8.2963 10 8.2963H13.2C14.1941 8.2963 15 9.1254 15 10.1481C15 11.1709 14.1941 12 13.2 12M9 12V14.7037C9 15.1751 9 15.4108 9.14645 15.5572C9.29289 15.7037 9.5286 15.7037 10 15.7037H13.2C14.1941 15.7037 15 14.8746 15 13.8518C15 12.8291 14.1941 12 13.2 12M10.4938 8.2963V7M10.4938 17V15.7037M12.8982 8.2963V7M12.8982 17V15.7037" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>`,
      active: true,
    },
  ]
}

export const getHeaderDropdownCategories = async () => {
  return []
}
