'use client'

import { useState } from 'react'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import Select from '@/shared/Select'
import { Switch } from '@/shared/switch'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/Card'
import { Button } from '@/shared/Button'

export default function SettingsPage() {
  const [wordpressSettings, setWordpressSettings] = useState({
    siteUrl: 'https://wtxnews.com',
    username: '',
    applicationPassword: '',
    syncPosts: true,
    syncCategories: true,
    syncUsers: true,
  })

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'My Blog',
    siteDescription: 'A blog about technology and web development',
    defaultKeywords: 'blog, technology, web development',
    twitterHandle: '@myblog',
    facebookPage: 'https://facebook.com/myblog',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleWordpressChange = (field: string, value: string | boolean) => {
    setWordpressSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSeoChange = (field: string, value: string) => {
    setSeoSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      // Reset saved status after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const handleTestConnection = () => {
    alert('Testing connection to WordPress site...')
    // In a real implementation, this would test the connection
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your WordPress integration and SEO settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* WordPress Integration Card */}
        <Card>
          <CardHeader>
            <CardTitle>WordPress Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                WordPress Site URL
              </label>
              <Input
                id="siteUrl"
                value={wordpressSettings.siteUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWordpressChange('siteUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                WordPress Username
              </label>
              <Input
                id="username"
                value={wordpressSettings.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWordpressChange('username', e.target.value)}
                placeholder="Your WordPress username"
              />
            </div>

            <div>
              <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Application Password
              </label>
              <Input
                id="appPassword"
                type="password"
                value={wordpressSettings.applicationPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWordpressChange('applicationPassword', e.target.value)}
                placeholder="Your application password"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Generate an application password in your WordPress admin panel under Users → Profile
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sync Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sync Posts</span>
                  <Switch
                    checked={wordpressSettings.syncPosts}
                    onChange={(checked) => handleWordpressChange('syncPosts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sync Categories</span>
                  <Switch
                    checked={wordpressSettings.syncCategories}
                    onChange={(checked) => handleWordpressChange('syncCategories', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sync Users</span>
                  <Switch
                    checked={wordpressSettings.syncUsers}
                    onChange={(checked) => handleWordpressChange('syncUsers', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button outline onClick={handleTestConnection}>
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>

        {/* SEO Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Title
              </label>
              <Input
                id="siteTitle"
                value={seoSettings.siteTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSeoChange('siteTitle', e.target.value)}
                placeholder="Your site title"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Description
              </label>
              <Textarea
                id="siteDescription"
                value={seoSettings.siteDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSeoChange('siteDescription', e.target.value)}
                placeholder="A brief description of your site"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="defaultKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Keywords
              </label>
              <Input
                id="defaultKeywords"
                value={seoSettings.defaultKeywords}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSeoChange('defaultKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Handle
              </label>
              <Input
                id="twitterHandle"
                value={seoSettings.twitterHandle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSeoChange('twitterHandle', e.target.value)}
                placeholder="@yourhandle"
              />
            </div>

            <div>
              <label htmlFor="facebookPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Facebook Page URL
              </label>
              <Input
                id="facebookPage"
                value={seoSettings.facebookPage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSeoChange('facebookPage', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Connected to WordPress</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last synced: September 30, 2025 at 2:30 PM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {saved && (
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Settings saved successfully!</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Your changes have been saved and will take effect immediately.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}