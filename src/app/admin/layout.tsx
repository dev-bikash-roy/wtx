'use client'

import NotifyDropdown from '@/components/Header/NotifyDropdown'
import Logo from '@/shared/Logo'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Posts', href: '/admin/posts' },
  { name: 'WordPress Sites', href: '/admin/wordpress-sites' },
  { name: 'WordPress Setup', href: '/admin/wordpress-setup' },
  { name: 'Categories', href: '/admin/categories' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  const isActive = (href: string) => pathname === href
  const pageTitle = navigation.find((item) => isActive(item.href))?.name ?? 'Admin Dashboard'

  return (
    // Removed ProtectedRoute wrapper
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <Disclosure as="nav" className="bg-white shadow dark:bg-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Logo size="size-8" />
                  <span className="ml-2 text-xl font-bold dark:text-white">Admin Panel</span>
                </div>
                <div className="hidden sm:-my-px sm:ms-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        isActive(item.href)
                          ? 'border-primary-500 text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-gray-200',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <NotifyDropdown />
                {/* UserProfileDropdown will be rendered within the protected child components */}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-neutral-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={clsx(
                    isActive(item.href)
                      ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3 dark:border-gray-700">
              {/* For mobile, user info will be shown within the protected child components */}
              <div className="px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please log in to view user information
                </p>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div className="py-6">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">{pageTitle}</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="rounded-lg bg-white px-4 py-6 shadow dark:bg-neutral-800 sm:px-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}