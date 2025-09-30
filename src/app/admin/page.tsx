'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/Card'

interface Post {
  id: number
  title: string
  status: string
  date: string
}

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  categories: number
  users: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: 0,
    users: 0
  })

  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalPosts: 124,
        publishedPosts: 98,
        draftPosts: 26,
        categories: 15,
        users: 8
      })
      
      setRecentPosts([
        { id: 1, title: 'How to integrate WordPress with Next.js', status: 'published', date: '2025-09-28' },
        { id: 2, title: 'Building an admin panel for content management', status: 'draft', date: '2025-09-27' },
        { id: 3, title: 'SEO optimization techniques for blogs', status: 'published', date: '2025-09-25' },
        { id: 4, title: 'Managing multiple WordPress sites', status: 'published', date: '2025-09-22' },
        { id: 5, title: 'Advanced React patterns for admin interfaces', status: 'draft', date: '2025-09-20' },
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to your admin panel. Here you can manage your content and settings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPosts}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">All posts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.publishedPosts}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Live posts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.draftPosts}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Unpublished</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.categories}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Post categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Team members</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-neutral-900">
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                      {post.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Badge color={post.status === 'published' ? 'green' : 'yellow'}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {post.date}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Button plain>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* WordPress Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>WordPress Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Your site is currently integrated with WordPress at <code className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">wtxnews.com</code>.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You can manage content directly from this admin panel, and it will be synchronized with your WordPress site.
            </p>
            <div className="flex space-x-4">
              <Button>Connect New WordPress Site</Button>
              <Button outline>Manage SEO Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}