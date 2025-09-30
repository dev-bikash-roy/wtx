'use client'

import { useAuth } from '@/contexts/AuthContext'
import Avatar from '@/shared/Avatar'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import Link from 'next/link'

export default function UserProfileDropdown() {
  // We'll handle the case where useAuth might throw an error
  let user: any = null;
  let logout: (() => void) = () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    // If useAuth throws an error, we'll show a default state
    user = null;
    logout = () => {};
  }

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  const userNavigation = [
    { name: 'Your Profile', href: '/dashboard/edit-profile' },
    { name: 'Settings', href: '/admin/settings' },
    { name: 'Sign out', href: '#', onClick: handleLogout },
  ]

  // If we don't have user data, don't render the dropdown
  if (!user) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownButton as={'button'} className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-neutral-800">
        <span className="sr-only">Open user menu</span>
        <Avatar 
          alt="Admin avatar" 
          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
          className="size-8" 
          width={32} 
          height={32} 
          sizes="32px" 
        />
      </DropdownButton>
      <DropdownMenu>
        {userNavigation.map((item) => (
          <DropdownItem 
            key={item.name} 
            href={item.href}
            onClick={item.onClick}
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}