import { CustomLink } from '@/data/types'
import Logo from '@/shared/Logo'
import SocialsList1 from '@/shared/SocialsList1'
import React from 'react'

export interface WidgetFooterMenu {
  id: string
  title: string
  menus: CustomLink[]
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: '1',
    title: 'News',
    menus: [
      { href: '/category/news', label: 'Latest News' },
      { href: '/category/local', label: 'Local News' },
      { href: '/category/national', label: 'National' },
      { href: '/category/world', label: 'World' },
      { href: '/category/politics', label: 'Politics' },
    ],
  },
  {
    id: '2',
    title: 'Sports',
    menus: [
      { href: '/category/sports', label: 'All Sports' },
      { href: '/category/football', label: 'Football' },
      { href: '/category/basketball', label: 'Basketball' },
      { href: '/category/baseball', label: 'Baseball' },
      { href: '/category/soccer', label: 'Soccer' },
    ],
  },
  {
    id: '3',
    title: 'Entertainment',
    menus: [
      { href: '/category/entertainment', label: 'Celebrity News' },
      { href: '/category/movies', label: 'Movies' },
      { href: '/category/music', label: 'Music' },
      { href: '/category/tv', label: 'TV Shows' },
      { href: '/category/events', label: 'Events' },
    ],
  },
  {
    id: '4',
    title: 'Business',
    menus: [
      { href: '/category/business', label: 'Business News' },
      { href: '/category/technology', label: 'Technology' },
      { href: '/category/finance', label: 'Finance' },
      { href: '/category/real-estate', label: 'Real Estate' },
      { href: '/category/jobs', label: 'Jobs' },
    ],
  },
]

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">{menu.title}</h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      {/* footer */}
      <div className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-28 dark:border-neutral-700">
        <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
            <div className="col-span-2 md:col-span-1">
              <Logo size="h-10 w-auto" />
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                WTX News - Your trusted source for local and national news.
              </p>
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <SocialsList1 />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
        
        <div className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-700">
          <div className="container flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              © {new Date().getFullYear()} WTX News. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <a href="/privacy" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                Terms of Service
              </a>
              <a href="/contact" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer