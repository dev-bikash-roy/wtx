'use client'

import { useAuth, type AuthUser } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline'

// Trigger auth loading when user interacts with auth buttons
function triggerAuthIntent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-intent'))
  }
}

export default function AuthButtons() {
  // Try to use auth context, but don't fail if it's not available
  let user: AuthUser | null = null
  let loading: boolean = false
  let logout: () => Promise<void> = async () => {}

  try {
    const auth = useAuth()
    user = auth.user
    loading = auth.loading
    logout = auth.logout
  } catch (e) {
    // Auth context not available - user not on auth route
  }

  // Trigger auth loading on mount if on auth page
  useEffect(() => {
    const authRoutes = ['/login', '/signup', '/dashboard', '/profile', '/admin']
    if (authRoutes.some(route => window.location.pathname.startsWith(route))) {
      triggerAuthIntent()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    )
  }

  if (user) {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:ring-neutral-600 dark:hover:bg-neutral-700">
            {user.firebaseUser.photoURL ? (
              <img
                className="h-6 w-6 rounded-full"
                src={user.firebaseUser.photoURL}
                alt={user.firebaseUser.displayName || 'User'}
              />
            ) : (
              <UserIcon className="h-5 w-5" />
            )}
            <span className="hidden sm:block">
              {user.firebaseUser.displayName || user.firebaseUser.email?.split('@')[0]}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:ring-neutral-700">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-700">
                <p className="font-medium">{user.firebaseUser.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.firebaseUser.email}</p>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  user.profile?.plan === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                  user.profile?.plan === 'basic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-gray-400'
                }`}>
                  {user.profile?.plan ?? 'free'} plan
                </span>
              </div>
              
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    } block px-4 py-2 text-sm`}
                  >
                    My Profile
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/pricing"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    } block px-4 py-2 text-sm`}
                  >
                    {user.profile?.plan === 'free' ? '⭐ Upgrade Plan' : 'Manage Membership'}
                  </Link>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/test-auth"
                    className={`${
                      active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    } block px-4 py-2 text-sm`}
                  >
                    Test Auth
                  </Link>
                )}
              </Menu.Item>

              {user.profile?.role === 'admin' && (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/admin"
                      className={`${
                        active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      } block px-4 py-2 text-sm`}
                    >
                      Admin Panel
                    </Link>
                  )}
                </Menu.Item>
              )}
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    } block w-full text-left px-4 py-2 text-sm`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/pricing"
        onClick={triggerAuthIntent}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500"
      >
        Membership
      </Link>
      <Link
        href="/login"
        onClick={triggerAuthIntent}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-500"
      >
        Login
      </Link>
      <Link
        href="/signup"
        onClick={triggerAuthIntent}
        className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Sign up
      </Link>
    </div>
  )
}