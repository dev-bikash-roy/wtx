import { getNavigation } from '@/data/navigation'
import { getAllPosts } from '@/data/posts'
import { Button } from '@/shared/Button'
import Logo from '@/shared/Logo'
import { PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import MegaMenuPopover from './MegaMenuPopover'
import NotifyDropdown from './NotifyDropdown'
import SearchModal from './SearchModal'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className }) => {
  const navigation = await getNavigation()
  const featuredPosts = (await getAllPosts()).slice(0, 2)

  return (
    <div className={clsx('relative z-20', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b',
            !bottomBorder && 'has-[.header-popover-full-panel]:border-b'
          )}
        >
          <div className="flex items-center gap-x-4 sm:gap-x-5 lg:gap-x-7">
            <Logo />
            <div className="h-8 border-l"></div>
            <div className="max-w-xs md:w-60 xl:w-72">
              <SearchModal type="type2" />
            </div>
          </div>

          <div className="ms-auto flex items-center justify-end gap-x-0.5">
            {/* Render navigation items */}
            {navigation.map((item) => (
              <div key={item.id} className="hidden lg:block">
                {item.children ? (
                  <MegaMenuPopover 
                    megamenu={item} 
                    featuredPosts={featuredPosts} 
                    className="hidden lg:block" 
                  />
                ) : (
                  <a 
                    href={item.href} 
                    className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
            
            <div className="ms-6 me-3 hidden h-8 border-l lg:block" />
            <div className="hidden sm:block">
              <Button className="h-10 px-3!" href={'/submission'} plain>
                <PlusIcon className="size-5!" />
                Create
              </Button>
            </div>
            <NotifyDropdown className="me-3" />
            <AvatarDropdown />
            <div className="ms-2.5 flex lg:hidden">
              <HamburgerBtnMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header