'use client'

import { TNavigationItem } from '@/data/navigation'
import { TPost } from '@/data/posts'
import { Link } from '@/shared/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

const MegaMenuPanelContent = dynamic(() => import('./MegaMenuPanelContent'), {
  loading: () => <div className="h-64 bg-white dark:bg-neutral-900" />,
  ssr: false,
})

export default function MegaMenuPopover({
  megamenu,
  featuredPosts,
  className,
}: {
  megamenu: TNavigationItem
  featuredPosts: TPost[]
  className?: string
}) {
  const renderNavlink = (item: TNavigationItem) => {
    return (
      <li key={item.id} className={`${item.isNew ? 'menuIsNew' : ''}`}>
        <Link
          className="font-normal text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          href={item.href || '#'}
        >
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <div className={clsx('hidden lg:block', className)}>
      <Popover className="group">
        <PopoverButton className="-m-2.5 flex items-center p-2.5 text-sm font-medium text-neutral-700 group-hover:text-neutral-950 focus:outline-hidden dark:text-neutral-300 dark:group-hover:text-neutral-100">
          {megamenu.name}
          <ChevronDownIcon className="ms-1 size-4 group-data-open:rotate-180" aria-hidden="true" />
        </PopoverButton>

        {megamenu.type === 'mega-menu' && (
          <PopoverPanel
            transition
            className="header-popover-full-panel absolute inset-x-0 top-full z-40 w-full transition duration-200 data-closed:translate-y-1 data-closed:opacity-0"
          >
            <MegaMenuPanelContent megamenu={megamenu} featuredPosts={featuredPosts} renderNavlink={renderNavlink} />
          </PopoverPanel>
        )}

        {megamenu.type === 'dropdown' && (
          <PopoverPanel
            transition
            className="absolute left-1/2 z-40 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 transition duration-200 data-closed:translate-y-1 data-closed:opacity-0 sm:px-0 lg:max-w-md"
          >
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative grid gap-6 bg-white px-5 py-6 dark:bg-neutral-900 sm:gap-8 sm:p-8">
                {megamenu.children?.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href || '#'}
                    className="-m-3 flex items-start rounded-lg p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <div className="ml-4">
                      <p className="text-base font-medium text-neutral-900 dark:text-neutral-200">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </PopoverPanel>
        )}
      </Popover>
    </div>
  )
}
