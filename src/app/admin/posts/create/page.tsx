'use client'

import { useState, useEffect } from 'react'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import Select from '@/shared/Select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/shared/Button'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

// Dynamically import the editor to avoid SSR issues
const TiptapEditor = dynamic(() => import('@/components/tiptap-extension/TiptapEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

interface WordPressSite {
  id: string
  name: string
  url: string
  isActive: boolean
}

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'pending'>('draft')
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [publishResults, setPublishResults] = useState<any[]>([])
  
  // WordPress integration
  const [wpSites, setWpSites] = useState<WordPressSite[]>([])
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [publishToAll, setPublishToAll] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    fetchWordPressSites()
  }, [])

  const fetchWordPressSites = async () => {
    try {
      const response = await fetch('/api/wordpress-sites')
      const data = await response.json()
      setWpSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch WordPress sites:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setPublishResults([])

    try {
      // Prepare post data
      const postData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        status,
        categories,
        tags,
        siteIds: publishToAll ? [] : selectedSites,
        publishToAll,
        meta: {
          seo_title: seoTitle || title,
          seo_description: seoDescription || excerpt,
          featured_image_url: featuredImage
        }
      }

      console.log('Creating post:', postData)

      // Call WordPress API
      const response = await fetch('/api/wordpress-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`
        },
        body: JSON.stringify(postData)
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setPublishResults(result.results || [])
        
        // Redirect to posts list after 3 seconds
        setTimeout(() => {
          router.push('/admin/posts')
        }, 3000)
      } else {
        setError(result.error || 'Failed to create post')
      }
    } catch (err) {
      setError('Failed to create post. Please try again.')
      console.error('Error creating post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteSelection = (siteId: string, checked: boolean) => {
    if (checked) {
      setSelectedSites([...selectedSites, siteId])
    } else {
      setSelectedSites(selectedSites.filter(id => id !== siteId))
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Write and publish your new blog post
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Post created successfully!</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Your post has been created and is now {status === 'published' ? 'published' : status === 'draft' ? 'saved as draft' : 'pending review'}.</p>
                
                {publishResults.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Publishing Results:</p>
                    <ul className="mt-1 space-y-1">
                      {publishResults.map((result, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          {result.success ? (
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span>
                            {result.siteName}: {result.success ? 'Published' : result.error}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <TiptapEditor 
                content={content} 
                onChange={handleContentChange}
                className="min-h-[400px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Publish</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as any)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending Review</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="publish-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish Date
                  </label>
                  <Input
                    id="publish-date"
                    type="datetime-local"
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    onChange={() => {}} // Placeholder to avoid TypeScript error
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Saving...' : status === 'published' ? 'Publish' : 'Save Draft'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Featured Image</h3>
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  {featuredImage ? (
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600" />
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder="Enter image URL"
                      value={featuredImage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeaturedImage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
              <div className="mt-4">
                <Input
                  placeholder="Add categories (comma separated)"
                  value={categories.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategories(e.target.value.split(',').map(cat => cat.trim()))}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tags</h3>
              <div className="mt-4">
                <Input
                  placeholder="Add tags (comma separated)"
                  value={tags.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* WordPress Sites */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">WordPress Sites</h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    id="publish-all"
                    type="checkbox"
                    checked={publishToAll}
                    onChange={(e) => setPublishToAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publish-all" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish to all sites
                  </label>
                </div>
                
                {!publishToAll && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select sites to publish to:</p>
                    {wpSites.map((site) => (
                      <div key={site.id} className="flex items-center">
                        <input
                          id={`site-${site.id}`}
                          type="checkbox"
                          checked={selectedSites.includes(site.id)}
                          onChange={(e) => handleSiteSelection(site.id, e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`site-${site.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {site.name}
                          <span className="text-xs text-gray-500 ml-1">({site.url})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                {wpSites.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No WordPress sites configured. 
                    <Link href="/admin/wordpress-sites" className="text-primary-600 hover:text-primary-500 ml-1">
                      Add sites
                    </Link>
                  </p>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">SEO Settings</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO Title
                  </label>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeoTitle(e.target.value)}
                    placeholder={title || "Enter SEO title"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {seoTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <label htmlFor="seo-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO Description
                  </label>
                  <Textarea
                    id="seo-description"
                    value={seoDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || "Enter SEO description"}
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {seoDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Excerpt
          </label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExcerpt(e.target.value)}
            placeholder="Enter a short excerpt for your post"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Link href="/admin/posts">
            <Button outline>Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : status === 'published' ? 'Publish' : 'Save Draft'}
          </Button>
        </div>
      </form>
    </div>
  )
}