'use client'

import { Button } from '@/shared/Button'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface WordPressSite {
  id: string
  name: string
  url: string
  apiBase: string
  isActive: boolean
}

export default function WordPressSitesPage() {
  const [sites, setSites] = useState<WordPressSite[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSite, setNewSite] = useState({
    name: '',
    url: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/wordpress-sites')
      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      setError('Failed to fetch WordPress sites')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/wordpress-sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newSite.name,
          url: newSite.url,
          isActive: true
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('WordPress site added successfully!')
        setNewSite({ name: '', url: '' })
        setShowAddForm(false)
        fetchSites()
      } else {
        setError(data.error || 'Failed to add site')
      }
    } catch (error) {
      setError('Failed to add WordPress site')
    }
  }

  const testConnection = async (site: WordPressSite) => {
    try {
      const response = await fetch(`${site.apiBase}/posts?per_page=1`)
      if (response.ok) {
        setSuccess(`Connection to ${site.name} successful!`)
      } else {
        setError(`Failed to connect to ${site.name}`)
      }
    } catch (error) {
      setError(`Cannot reach ${site.name}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading WordPress sites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WordPress Sites</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your WordPress sites and their connections
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Site</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New WordPress Site
          </h2>
          <form onSubmit={handleAddSite}>
            <Fieldset className="space-y-4">
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
                  placeholder="https://example.com"
                  required
                />
              </Field>
              <div className="flex space-x-3">
                <Button type="submit">Add Site</Button>
                <Button 
                  type="button" 
                  outline 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </Fieldset>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connected Sites ({sites.length})
          </h2>
        </div>
        
        {sites.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No WordPress sites connected yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sites.map((site) => (
              <div key={site.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {site.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {site.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {site.url}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      API: {site.apiBase}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      outline
                      onClick={() => testConnection(site)}
                    >
                      Test Connection
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        // In a real app, you'd implement site removal
                        setError('Site removal not implemented yet')
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}