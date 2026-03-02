/**
 * Get Available Categories and Tags
 * Shows what's actually available on wtxnews.com
 */

import { fetchCategories, fetchTags } from '../src/data/wp-api'

async function getAvailableItems() {
  console.log('📋 Fetching available categories and tags from wtxnews.com...\n')

  try {
    const categories = await fetchCategories(100)
    const tags = await fetchTags(100)

    const activeCategories = categories.filter(c => (c.count || 0) > 0)
    const activeTags = tags.filter(t => (t.count || 0) > 0)

    console.log('📁 AVAILABLE CATEGORIES (with posts):\n')
    activeCategories
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 30)
      .forEach(cat => {
        console.log(`   { id: '${cat.handle}', href: '/category/${cat.handle}', name: '${cat.name}' }, // ${cat.count} posts`)
      })

    console.log('\n🏷️  AVAILABLE TAGS (with posts, top 50):\n')
    activeTags
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 50)
      .forEach(tag => {
        console.log(`   { id: '${tag.handle}', href: '/tag/${tag.handle}', name: '${tag.name}' }, // ${tag.count} posts`)
      })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

getAvailableItems()
