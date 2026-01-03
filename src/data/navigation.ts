export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    {
      id: 'uk-news',
      href: '/',
      name: 'UK News',
    },
    {
      id: 'regions',
      href: '#',
      name: 'Regions',
      type: 'dropdown',
      children: [
        { id: 'england', href: '/england-news', name: 'England' },
        { id: 'scotland', href: '/scotland-news', name: 'Scotland' },
        { id: 'wales', href: '/wales-news', name: 'Wales' },
        { id: 'ireland', href: '/ireland-news', name: 'Ireland' },
      ],
    },
    {
      id: 'news',
      href: '/category/news',
      name: 'News',
      type: 'dropdown',
      children: [
        { id: 'latest-news', href: '/latest-news', name: 'Latest News' },
        { id: 'live-news-coverage', href: '/tag/live-news', name: 'Live News Coverage' },
        { id: 'uk-politics', href: '/category/uk-politics', name: 'UK Politics' },
        { id: 'money-news', href: '/category/money-news', name: 'Money News' },
        { id: 'local-economy', href: '/tag/local-economy', name: 'Local Economy' },
        { id: 'bank-of-england', href: '/tag/bank-of-england', name: 'Bank of England' },
      ],
    },
    {
      id: 'sport',
      href: '/sports-news',
      name: 'Sport',
      type: 'dropdown',
      children: [
        { id: 'premier-league', href: '/tag/premier-league', name: 'Premier League' },
        { id: 'tennis', href: '/category/tennis', name: 'Tennis' },
        { id: 'f1', href: '/category/f1', name: 'F1' },
        { id: 'rugby', href: '/category/rugby', name: 'Rugby' },
        { id: 'cricket', href: '/category/cricket', name: 'Cricket' },
        { id: 'snooker', href: '/category/snooker', name: 'Snooker' },
        { id: 'wwe', href: '/category/wwe', name: 'WWE' },
        { id: 'boxing', href: '/category/boxing', name: 'Boxing' },
        { id: 'mma', href: '/category/mma', name: 'MMA' },
        { id: 'winter-sports', href: '/category/winter-sports', name: 'Winter sports' },
      ],
    },
    {
      id: 'entertainment',
      href: '/category/entertainment',
      name: 'Entertainment',
      type: 'dropdown',
      children: [
        { id: 'soaps-tv-shows', href: '/tag/soaps-and-tv-shows', name: 'Soaps and TV Shows' },
        { id: 'showbiz-gossip', href: '/tag/showbiz-gossip', name: 'Showbiz Gossip' },
        { id: 'museums', href: '/tag/museums', name: 'Museums' },
      ],
    },
    {
      id: 'travel',
      href: '/category/travel',
      name: 'Travel',
      type: 'dropdown',
      children: [
        { id: 'uk-holidays', href: '/tag/uk-holidays', name: 'UK Holidays' },
        { id: 'budget-holidays', href: '/tag/budget-holidays', name: 'Budget holidays' },
        { id: 'european-holidays', href: '/tag/european-holidays', name: 'European holidays' },
        { id: 'exotic-holidays', href: '/tag/exotic-holidays', name: 'Exotic holidays' },
        { id: 'couples-holidays', href: '/tag/couples-holidays', name: 'Couples holidays' },
        { id: 'fitness-retreats', href: '/tag/fitness-retreats', name: 'Fitness retreats' },
        { id: 'day-trips', href: '/tag/day-trips', name: 'Day Trips' },
        { id: 'spa-retreats', href: '/tag/spa-retreats', name: 'Spa retreats' },
      ],
    },
    {
      id: 'lifestyle',
      href: '#',
      name: 'Lifestyle',
      type: 'dropdown',
      children: [
        { id: 'influencers', href: '/category/influencers', name: 'Influencers' },
        { id: 'photography', href: '/tag/photography', name: 'Photography' },
        { id: 'cooking', href: '/tag/cooking', name: 'Cooking' },
        { id: 'opinions', href: '/tag/opinions', name: 'Opinions' },
        { id: 'fashion', href: '/category/fashion', name: 'Fashion' },
        { id: 'styling', href: '/tag/styling', name: 'Styling' },
        { id: 'what-to-wear', href: '/tag/what-to-wear', name: 'What to Wear' },
        { id: 'budget-outfits', href: '/tag/budget-outfits', name: 'Budget Outfits' },
        { id: 'work-outfits', href: '/tag/work-outfits', name: 'Work outfits' },
        { id: 'date-night', href: '/tag/date-night', name: 'Date Night' },
      ],
    },
    {
      id: 'money-expert',
      href: '/category/money-expert',
      name: 'Money Expert',
      type: 'dropdown',
      children: [
        { id: 'shopping-deals', href: '/tag/shopping-deals', name: 'Shopping deals' },
        { id: 'supermarkets-deals', href: '/tag/supermarkets-deals', name: 'Supermarkets deals' },
        { id: 'money-saving-hacks', href: '/tag/money-saving-hacks', name: 'Money saving hacks' },
        { id: 'make-money-online', href: '/tag/make-money-online', name: 'Make money online' },
      ],
    },
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  const navigation = await getNavigation()
  return {
    id: 'categories',
    href: '#',
    name: 'Categories',
    type: 'dropdown',
    children: [
      { id: 'news', href: '/category/news', name: 'News' },
      { id: 'sport', href: '/category/sport', name: 'Sport' },
      { id: 'entertainment', href: '/category/entertainment', name: 'Entertainment' },
      { id: 'travel', href: '/category/travel', name: 'Travel' },
      { id: 'money-expert', href: '/category/money-expert', name: 'Money Expert' },
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
