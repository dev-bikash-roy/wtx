'use client'

import clsx from 'clsx'
import { FC } from 'react'
import WidgetHeading from './WidgetHeading'

interface Props {
  className?: string
}

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/WtxNews',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
    color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
    followers: '12.5K'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/wtxnews',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
    color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
    followers: '8.2K'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/wtxnews/',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.73.333 4.058.63c-.68.3-1.18.66-1.73 1.22-.55.55-.92 1.05-1.22 1.73-.297.672-.499 1.435-.558 2.652C.013 7.929 0 8.396 0 12.017c0 3.624.013 4.09.072 5.311.059 1.217.261 1.98.558 2.652.3.68.67 1.18 1.22 1.73.55.55 1.05.92 1.73 1.22.672.297 1.435.499 2.652.558C7.929 23.987 8.396 24 12.017 24c3.624 0 4.09-.013 5.311-.072 1.217-.059 1.98-.261 2.652-.558a4.994 4.994 0 001.73-1.22c.55-.55.92-1.05 1.22-1.73.297-.672.499-1.435.558-2.652.059-1.22.072-1.687.072-5.311 0-3.621-.013-4.088-.072-5.309-.059-1.217-.261-1.98-.558-2.652a4.994 4.994 0 00-1.22-1.73 4.994 4.994 0 00-1.73-1.22c-.672-.297-1.435-.499-2.652-.558C16.107.013 15.64 0 12.017 0zM12.017 2.163c3.557 0 3.983.014 5.388.072 1.3.059 2.006.277 2.477.46.622.242 1.067.532 1.533.998.466.466.756.911.998 1.533.183.471.401 1.177.46 2.477.058 1.405.072 1.831.072 5.388 0 3.557-.014 3.983-.072 5.388-.059 1.3-.277 2.006-.46 2.477a4.13 4.13 0 01-.998 1.533 4.13 4.13 0 01-1.533.998c-.471.183-1.177.401-2.477.46-1.405.058-1.831.072-5.388.072-3.557 0-3.983-.014-5.388-.072-1.3-.059-2.006-.277-2.477-.46a4.13 4.13 0 01-1.533-.998 4.13 4.13 0 01-.998-1.533c-.183-.471-.401-1.177-.46-2.477-.058-1.405-.072-1.831-.072-5.388 0-3.557.014-3.983.072-5.388.059-1.3.277-2.006.46-2.477.242-.622.532-1.067.998-1.533a4.13 4.13 0 011.533-.998c.471-.183 1.177-.401 2.477-.46 1.405-.058 1.831-.072 5.388-.072z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM12.017 16a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
        <path d="M19.846 5.595a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z" />
      </svg>
    ),
    color: 'hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400',
    followers: '15.8K'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
      </svg>
    ),
    color: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
    followers: '5.3K'
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400',
    followers: '22.1K'
  }
]

const WidgetSocialFollow: FC<Props> = ({ className = 'bg-neutral-100 dark:bg-neutral-800' }) => {
  return (
    <div className={clsx('widget-social-follow overflow-hidden rounded-3xl', className)}>
      <WidgetHeading title="Follow Us" viewAll={{ label: '', href: '' }} />
      <div className="p-4 xl:p-5">
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'flex flex-col items-center justify-center rounded-2xl border border-neutral-200 p-4 text-center transition-colors dark:border-neutral-700',
                social.color
              )}
            >
              <div className="mb-2">
                {social.icon}
              </div>
              <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {social.name}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {social.followers}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WidgetSocialFollow