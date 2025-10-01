'use client'

import { Button } from '@/shared/Button'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  GlobeAltIcon, 
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalPosts: number
  totalSites: number
  activeSites: number
  recentPosts: Array<{
    id: string
    title: string
    date: string
    source: string
  }>
  siteStatus: Array<{
    siteId: string
    siteName: string
    success: boolean
    postCount: number
    error?: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch WordPress posts and site status
      const wpResponse = await fetch('/api/wordpress-posts?per_page=5')
      const wpData = await wpResponse.json()
      
      // Fetch local posts count (you might need to create this endpoint)
      const localResponse = await fetch('/api/posts')
      const localData = await localResponse.json()
      
      setStats({
        totalPosts: (wpData.totalPosts || 0) + (localData.posts?.length || 0),
        totalSites: wpData.sites?.length || 0,
        activeSites: wpData.sites?.filter((s: any) => s.success).length || 0,
        recentPosts: [
          ...(wpData.posts || []).slice(0, 3).map((post: any) => ({
            id: post.id,
            title: post.title?.rendered || 'Untitled',
            date: post.date,
            source: post._site?.name || 'WordPress'
          })),
          ...(localData.posts || []).slice(0, 2).map((post: any) => ({
            id: post.id,
            title: post.title,
            date: post.date,
            source: 'Local'
          }))
        ],
        siteStatus: wpData.sites || []
      })
    } catch (error) {
      setError('Failed to fetch dashboard statistics')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your blog and WordPress integrations
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Posts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats?.totalPosts || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    WordPress Sites
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats?.totalSites || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Sites
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats?.activeSites || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Authors
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    5
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Posts</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats?.recentPosts.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No recent posts found
              </div>
            ) : (
              stats?.recentPosts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()} • {post.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <Link href="/admin/posts">
              <Button outline className="w-full">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* WordPress Sites Status */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">WordPress Sites</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats?.siteStatus.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No WordPress sites configured
              </div>
            ) : (
              stats?.siteStatus.map((site) => (
                <div key={site.siteId} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        site.success ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {site.siteName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {site.success 
                            ? `${site.postCount} posts available`
                            : site.error || 'Connection failed'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <Link href="/admin/wordpress-sites">
              <Button outline className="w-full">
                Manage Sites
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/posts/create">
              <Button className="w-full">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                New Post
              </Button>
            </Link>
            <Link href="/admin/wordpress-sites">
              <Button outline className="w-full">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                Add WordPress Site
              </Button>
            </Link>
            <Link href="/admin/posts">
              <Button outline className="w-full">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Button 
              outline 
              className="w-full"
              onClick={() => fetchDashboardStats()}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}