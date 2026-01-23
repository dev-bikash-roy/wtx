'use client'

import { TNavigationItem } from '@/data/navigation'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SocialsList from '@/shared/SocialsList'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserIcon } from '@heroicons/react/24/outline'

interface Props {
  data: TNavigationItem[]
}

const SidebarNavigation: React.FC<Props> = ({ data }) => {
  const handleClose = useClose()
  const { user, loading, logout } = useAuth()

  const renderUserSection = () => {
    if (loading) {
      return (
        <div className="px-3 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-200 rounded dark:bg-neutral-700 mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded dark:bg-neutral-700 w-2/3"></div>
            </div>
          </div>
        </div>
      )
    }

    if (user) {
      return (
        <div className="px-3 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <Disclosure>
            <DisclosureButton className="flex w-full items-center space-x-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg p-2 -m-2">
              {user.firebaseUser.photoURL ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.firebaseUser.photoURL}
                  alt={user.firebaseUser.displayName || 'User'}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-neutral-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {user.firebaseUser.displayName || user.firebaseUser.email?.split('@')[0]}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {user.firebaseUser.email}
                </p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
            </DisclosureButton>
            
            <DisclosurePanel className="mt-2 space-y-1">
              <Link
                href="/profile"
                onClick={handleClose}
                className="flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                My Profile
              </Link>
              
              {user.profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={handleClose}
                  className="flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Admin Panel
                </Link>
              )}
              
              <button
                onClick={() => {
                  logout()
                  handleClose()
                }}
                className="flex w-full items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-left"
              >
                Sign out
              </button>
            </DisclosurePanel>
          </Disclosure>
        </div>
      )
    }

    // Not logged in - show login/signup buttons
    return (
      <div className="px-3 py-4 border-b border-neutral-200 dark:border-neutral-700 space-y-2">
        <Link
          href="/login"
          onClick={handleClose}
          className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={handleClose}
          className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg"
        >
          Sign up
        </Link>
      </div>
    )
  }

  const _renderMenuChild = (
    item: TNavigationItem,
    itemClass = 'ps-3 text-neutral-900 dark:text-neutral-200 font-medium'
  ) => {
    return (
      <ul className="nav-mobile-sub-menu ps-6 pb-1 text-base">
        {item.children?.map((childMenu, index) => (
          <Disclosure key={index} as="li">
            <Link
              href={childMenu.href || '#'}
              onClick={handleClose}
              className={`mt-0.5 flex rounded-lg pe-4 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${itemClass}`}
            >
              <span className={`py-2.5 ${!childMenu.children ? 'block w-full' : ''}`}>{childMenu.name}</span>
              {childMenu.children && (
                <span className="flex grow items-center" onClick={(e) => e.preventDefault()}>
                  <DisclosureButton as="span" className="flex grow justify-end">
                    <ChevronDownIcon className="ms-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
                  </DisclosureButton>
                </span>
              )}
            </Link>
            {childMenu.children && (
              <DisclosurePanel>
                {_renderMenuChild(childMenu, 'ps-3 text-neutral-600 dark:text-neutral-400')}
              </DisclosurePanel>
            )}
          </Disclosure>
        ))}
      </ul>
    )
  }

  const _renderItem = (menu: TNavigationItem, index: number) => {
    return (
      <Disclosure key={index} as="li" className="text-neutral-900 dark:text-white">
        <DisclosureButton className="flex w-full cursor-pointer rounded-lg px-3 text-start text-sm font-medium tracking-wide uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Link
            href={menu.href || '#'}
            className={clsx(!menu.children?.length && 'flex-1', 'block py-2.5')}
            onClick={handleClose}
          >
            {menu.name}
          </Link>
          {menu.children?.length && (
            <div className="flex flex-1 justify-end">
              <ChevronDownIcon className="ms-2 h-4 w-4 self-center text-neutral-500" aria-hidden="true" />
            </div>
          )}
        </DisclosureButton>
        {menu.children && <DisclosurePanel>{_renderMenuChild(menu)}</DisclosurePanel>}
      </Disclosure>
    )
  }

  const renderSearchForm = () => {
    return (
      <form
        action="#"
        method="POST"
        className="flex-1 text-neutral-900 dark:text-neutral-200"
        onSubmit={(e) => {
          e.preventDefault()
          handleClose()
          redirect('/search')
        }}
      >
        <div className="flex h-full items-center gap-x-2.5 rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-800">
          <HugeiconsIcon icon={Search01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Type and press enter"
            className="w-full border-none bg-transparent focus:ring-0 focus:outline-hidden sm:text-sm"
          />
        </div>
        <input type="submit" hidden value="" />
      </form>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-[100vw] overflow-y-auto pb-20">
      {/* User Profile Section */}
      {renderUserSection()}
      
      <div className="px-3 py-4">
        <p className="text-sm/relaxed">
          Discover the most outstanding articles on all topics of life. Write your stories and share them
        </p>
        <div className="mt-5 flex items-center justify-between">
          <SocialsList />
        </div>
        <div className="mt-5">{renderSearchForm()}</div>
      </div>

      <ul className="flex flex-col gap-y-1 px-2 py-6">{data?.map(_renderItem)}</ul>
      <Divider className="mb-6" />

      <div className="flex items-center justify-end gap-x-2.5 py-6">
        <SwitchDarkMode />
      </div>
    </div>
  )
}

export default SidebarNavigation
