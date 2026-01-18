import { getCategories } from '@/data/categories'
import { getAllPostsWithWordPress } from '@/data/wordpress-posts'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wtxnews.co.uk'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Get all posts - fetch from WordPress/Mock
  // Use a reasonable limit for sitemap or pagination if extremely large, but for now fetch what we can
  const posts = await getAllPostsWithWordPress({ perPage: 100 })
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/news/${post.handle}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Get all categories
  const categories = await getCategories()
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postUrls, ...categoryUrls]
}