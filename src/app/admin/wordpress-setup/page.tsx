'use client'

import { Button } from '@/shared/Button'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  KeyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function WordPressSetupPage() {
  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    username: '',
    applicationPassword: ''
  })
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      // First test if the site is accessible
      const siteUrl = newSite.url.replace(/\/$/, '') // Remove trailing slash
      const apiUrl = `${siteUrl}/wp-json/wp/v2`
      
      console.log('Testing connection to:', apiUrl)
      
      // Test basic API access
      const basicResponse = await fetch(`${apiUrl}/posts?per_page=1`)
      
      if (!basicResponse.ok) {
        setTestResult({
          success: false,
          message: `Cannot access WordPress API at ${apiUrl}. Status: ${basicResponse.status}`
        })
        return
      }

      // Test authentication if credentials provided
      if (newSite.username && newSite.applicationPassword) {
        const credentials = btoa(`${newSite.username}:${newSite.applicationPassword}`)
        
        const authResponse = await fetch(`${apiUrl}/users/me`, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        })

        if (authResponse.ok) {
          const userData = await authResponse.json()
          setTestResult({
            success: true,
            message: 'Connection and authentication successful!',
            details: {
              siteName: newSite.name || 'WordPress Site',
              apiUrl,
              user: userData.name,
              roles: userData.roles
            }
          })
        } else {
          setTestResult({
            success: false,
            message: 'Site is accessible but authentication failed. Please check your username and application password.'
          })
        }
      } else {
        setTestResult({
          success: true,
          message: 'Site is accessible! Add username and application password for full integration.',
          details: {
            siteName: newSite.name || 'WordPress Site',
            apiUrl
          }
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async () => {
    if (!testResult?.success) {
      alert('Please test the connection first')
      return
    }

    try {
      const response = await fetch('/api/wordpress-sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newSite.name,
          url: newSite.url,
          username: newSite.username,
          applicationPassword: newSite.applicationPassword,
          isActive: true
        })
      })

      if (response.ok) {
        alert('WordPress site added successfully!')
        setNewSite({ name: '', url: '', username: '', applicationPassword: '' })
        setTestResult(null)
      } else {
        const error = await response.json()
        alert(`Failed to add site: ${error.error}`)
      }
    } catch (error) {
      alert('Failed to add WordPress site')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WordPress Setup</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connect your WordPress sites to manage content from this admin panel
        </p>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              WordPress Application Password Setup
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-2">To connect your WordPress site, you need to create an Application Password:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Log in to your WordPress admin dashboard</li>
                <li>Go to Users → Profile (or Users → All Users → Edit your user)</li>
                <li>Scroll down to &quot;Application Passwords&quot; section</li>
                <li>Enter a name like &quot;Blog Admin Panel&quot;</li>
                <li>Click &quot;Add New Application Password&quot;</li>
                <li>Copy the generated password (it will only be shown once)</li>
                <li>Use your WordPress username and the application password below</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Site Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <GlobeAltIcon className="h-6 w-6 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add WordPress Site
          </h2>
        </div>

        <Fieldset className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field>
              <Label>Site Name</Label>
              <Input
                type="text"
                value={newSite.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewSite({ ...newSite, name: e.target.value })
                }
                placeholder="My WordPress Site"
                required
              />
            </Field>

            <Field>
              <Label>Site URL</Label>
              <Input
                type="url"
                value={newSite.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewSite({ ...newSite, url: e.target.value })
                }
                placeholder="https://yoursite.com"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field>
              <Label>WordPress Username</Label>
              <Input
                type="text"
                value={newSite.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewSite({ ...newSite, username: e.target.value })
                }
                placeholder="admin"
              />
            </Field>

            <Field>
              <Label>Application Password</Label>
              <div className="relative">
                <Input
                  type="password"
                  value={newSite.applicationPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setNewSite({ ...newSite, applicationPassword: e.target.value })
                  }
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                />
                <KeyIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </Field>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleTestConnection}
              disabled={!newSite.url || loading}
              outline
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {testResult?.success && (
              <Button
                onClick={handleAddSite}
                disabled={!testResult.success}
              >
                Add Site
              </Button>
            )}
          </div>
        </Fieldset>

        {/* Test Results */}
        {testResult && (
          <div className={`mt-6 rounded-md p-4 ${
            testResult.success 
              ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="flex">
              {testResult.success ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              )}
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  testResult.success 
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                </h3>
                <p className={`mt-1 text-sm ${
                  testResult.success 
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {testResult.message}
                </p>
                
                {testResult.details && (
                  <div className="mt-3 text-sm">
                    <p><strong>Site:</strong> {testResult.details.siteName}</p>
                    <p><strong>API URL:</strong> {testResult.details.apiUrl}</p>
                    {testResult.details.user && (
                      <>
                        <p><strong>User:</strong> {testResult.details.user}</p>
                        <p><strong>Roles:</strong> {testResult.details.roles?.join(', ')}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Sites */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current WordPress Sites
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">WTX News</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">https://wtxnews.com</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Active
              </span>
            </div>
            <div className="flex space-x-2">
              <Button outline size="sm">Test</Button>
              <Button outline size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 dark:bg-yellow-900/20 dark:border-yellow-800">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Admin Login Issues?
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p className="mb-2">If you&apos;re having trouble logging into the admin panel:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Try using your WordPress username and application password</li>
                <li>Make sure your WordPress site is accessible</li>
                <li>Check that the Application Password is correctly generated</li>
                <li>Ensure your WordPress user has administrator privileges</li>
                <li>Try the default credentials: admin@example.com / password (for testing)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}