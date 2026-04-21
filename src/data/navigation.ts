export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    {
      id: 'home',
      href: '/',
      name: 'Home',
      type: undefined,
    },
    {
      id: 'uk-news',
      href: '/category/uk-news',
      name: 'UK News',
      type: 'dropdown',
      children: [
        { id: 'england', href: '/england-news', name: 'England' },
        { id: 'scotland', href: '/scotland-news', name: 'Scotland' },
        { id: 'wales', href: '/wales-news', name: 'Wales' },
        { id: 'ireland', href: '/ireland-news', name: 'Ireland' },
      ],
    },
    {
      id: 'news-briefing',
      href: '/latest-news',
      name: 'News Briefing',
      type: 'dropdown',
      children: [
        { id: 'uk-politics', href: '/uk-politics', name: 'UK Politics' },
        { id: 'world-news', href: '/tag/world-news', name: 'World News' },
        { id: 'uk-us-relations', href: '/tag/uk-us-relations', name: 'UK–US Relations' },
        { id: 'uk-eu-relations', href: '/tag/uk-eu-relations', name: 'UK/EU Relations' },
        { id: 'money-matters', href: '/money-expert', name: 'Money Matters' },
        { id: 'uk-elections', href: '/tag/uk-elections', name: 'UK Elections' },
        { id: 'uk-news-briefing', href: '/tag/uk-news-briefing', name: 'UK News Briefing' },
        { id: 'world-news-briefing', href: '/tag/world-news-briefing', name: 'World News Briefing' },
      ],
    },
    {
      id: 'sport',
      href: '/sports',
      name: 'Sport',
      type: 'dropdown',
      children: [
        { id: 'football', href: '/tag/football', name: 'Football' },
        { id: 'premier-league', href: '/tag/premier-league', name: 'Premier League' },
        { id: 'cricket', href: '/tag/cricket', name: 'Cricket' },
        { id: 'formula-1', href: '/tag/formula-1', name: 'Formula 1' },
        { id: 'tennis', href: '/tag/tennis', name: 'Tennis' },
        { id: 'boxing', href: '/tag/boxing', name: 'Boxing' },
        { id: 'rugby', href: '/tag/rugby', name: 'Rugby' },
      ],
    },
    {
      id: 'entertainment',
      href: '/entertainment',
      name: 'Entertainment',
      type: 'dropdown',
      children: [
        { id: 'celebrity-gossip', href: '/tag/celebrity-gossip', name: 'Celebrity Gossip' },
        { id: 'streaming', href: '/tag/streaming', name: 'Streaming' },
        { id: 'royals', href: '/tag/royals', name: 'Royals' },
      ],
    },
    {
      id: 'lifestyle',
      href: '/category/lifestyle',
      name: 'Lifestyle',
      type: 'dropdown',
      children: [
        { id: 'health', href: '/category/health', name: 'Health' },
        { id: 'fitness', href: '/tag/fitness', name: 'Fitness' },
        { id: 'fashion', href: '/fashion', name: 'Fashion' },
      ],
    },
    {
      id: 'videos',
      href: '/category/videos',
      name: 'Videos',
      type: 'dropdown',
      children: [
        { id: 'news-clips', href: '/tag/news-clips', name: 'News Clips' },
        { id: 'viral-videos', href: '/tag/viral-videos', name: 'Viral Videos' },
      ],
    },
    {
      id: 'travel',
      href: '/travel',
      name: 'Travel',
      type: 'dropdown',
      children: [
        { id: 'hiking', href: '/tag/hiking', name: 'Hiking' },
        { id: 'staycations', href: '/tag/staycations', name: 'Staycations' },
        { id: 'budget-holidays', href: '/tag/budget-holidays', name: 'Budget Holidays' },
      ],
    },
    {
      id: 'opinions',
      href: '/opinions',
      name: 'Opinions',
      type: undefined,
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
