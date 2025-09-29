'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import Textarea from '@/shared/Textarea'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPostById, createPost, updatePost } from '@/data/posts'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isEdit = searchParams.get('edit')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [postData, setPostData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: [] as string[],
    tags: [] as string[],
    featuredImage: '',
    status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    // If editing, fetch post data
    if (isEdit) {
      const fetchPost = async () => {
        try {
          setIsLoading(true)
          const post = await getPostById(isEdit)
          if (post) {
            setPostData({
              title: post.title,
              excerpt: post.excerpt || '',
              content: (post as any).content || '',
              categories: post.categories.map(cat => cat.name),
              tags: [],
              featuredImage: post.featuredImage?.src || '',
              status: post.status as 'draft' | 'published',
            })
          }
        } catch (err) {
          setError('Failed to load post data')
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchPost()
    }
  }, [isEdit])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    const postDataToSend = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      categories: (formData.get('category') as string)?.split(',').map(cat => cat.trim()).filter(Boolean) || [],
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      featuredImage: formData.get('featuredImage') as string,
      status: formData.get('status') as 'draft' | 'published' || 'draft',
    }
    
    // Use state data if form data is not available
    if (!postDataToSend.title) postDataToSend.title = postData.title
    if (!postDataToSend.content) postDataToSend.content = postData.content
    if (!postDataToSend.categories.length && postData.categories.length) postDataToSend.categories = postData.categories
    
    try {
      let success = false
      if (isEdit) {
        success = await updatePost(isEdit, postDataToSend)
      } else {
        success = await createPost(postDataToSend)
      }
      
      if (success) {
        // Redirect to posts page after successful submission
        router.push('/dashboard/posts')
      } else {
        setError(`Failed to ${isEdit ? 'update' : 'create'} post. Please try again.`)
      }
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} post. Please try again.`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Post' : 'Create New Post'}</h2>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        {isLoading && !isEdit && (
          <div className="mb-6 text-center">
            <p>Loading post data...</p>
          </div>
        )}
        
        <form className="max-w-5xl rounded-xl md:border md:p-6" onSubmit={handleSubmit}>
          <Fieldset className="grid gap-6 md:grid-cols-2">
            <Field className="block md:col-span-2">
              <Label>Post Title *</Label>
              <Input 
                type="text" 
                name="title" 
                className="mt-1" 
                required 
                value={postData.title}
                onChange={(e) => setPostData({...postData, title: e.target.value})}
              />
            </Field>
            <Field className="block md:col-span-2">
              <Label>Post Excerpt</Label>
              <Textarea 
                name="excerpt" 
                className="mt-1" 
                rows={4} 
                value={postData.excerpt}
                onChange={(e) => setPostData({...postData, excerpt: e.target.value})}
              />
              <p className="mt-1 text-sm text-neutral-500">Brief description for your article. URLs are hyperlinked.</p>
            </Field>
            <Field className="block">
              <Label>Category</Label>
              <Select 
                name="category" 
                className="mt-1"
                value={postData.categories[0] || ''}
                onChange={(e) => setPostData({...postData, categories: e.target.value ? [e.target.value] : []})}
              >
                <option value="">-- select --</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="culture">Culture</option>
                <option value="business">Business</option>
                <option value="politics">Politics</option>
                <option value="opinion">Opinion</option>
                <option value="science">Science</option>
                <option value="health">Health</option>
                <option value="style">Style</option>
                <option value="travel">Travel</option>
              </Select>
            </Field>
            <Field className="block">
              <Label>Status</Label>
              <Select 
                name="status" 
                className="mt-1"
                value={postData.status}
                onChange={(e) => setPostData({...postData, status: e.target.value as 'draft' | 'published'})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Field>

            <div className="block md:col-span-2">
              <Label>Featured Image URL</Label>
              <Input 
                type="text" 
                name="featuredImage" 
                className="mt-1" 
                placeholder="https://example.com/image.jpg"
                value={postData.featuredImage}
                onChange={(e) => setPostData({...postData, featuredImage: e.target.value})}
              />
            </div>
            
            <Field className="block md:col-span-2">
              <Label>Tags</Label>
              <Input 
                type="text" 
                name="tags" 
                className="mt-1" 
                placeholder="Comma separated tags"
                value={postData.tags.join(', ')}
                onChange={(e) => setPostData({...postData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
              />
            </Field>
            
            <Field className="block md:col-span-2">
              <Label>Post Content</Label>
              <Textarea 
                name="content" 
                className="mt-1" 
                rows={16} 
                required
                value={postData.content}
                onChange={(e) => setPostData({...postData, content: e.target.value})}
              />
            </Field>

            <div className="md:col-span-2 flex gap-3">
              <ButtonPrimary type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (isEdit ? 'Update Post' : 'Submit Post')}
              </ButtonPrimary>
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={() => router.push('/dashboard/posts')}
              >
                Cancel
              </button>
            </div>
          </Fieldset>
        </form>
      </div>
    </ProtectedRoute>
  )
}

export default Page