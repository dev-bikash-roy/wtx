/**
 * Sync WordPress Categories and Tags
 * 
 * This script helps you sync categories and tags from wtxnews.com
 * and identify which ones have been removed or have no posts.
 * 
 * Usage:
 * npm run sync-wp-data
 * or
 * bun run scripts/sync-wordpress-data.ts
 */

import { fetchCategories, fetchTags } from '../src/data/wp-api'

async function syncWordPressData() {
  console.log('🔄 Syncing WordPress data from wtxnews.com...\n')

  try {
    // Fetch categories
    console.log('📁 Fetching categories...')
    const categories = await fetchCategories(100)
    const activeCategories = categories.filter(cat => (cat.count || 0) > 0)
    const emptyCategories = categories.filter(cat => (cat.count || 0) === 0)

    console.log(`✅ Total categories: ${categories.length}`)
    console.log(`✅ Active categories (with posts): ${activeCategories.length}`)
    console.log(`⚠️  Empty categories (no posts): ${emptyCategories.length}`)

    if (emptyCategories.length > 0) {
      console.log('\n📋 Empty categories that will be hidden:')
      emptyCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.handle})`)
      })
    }

    // Fetch tags
    console.log('\n🏷️  Fetching tags...')
    const tags = await fetchTags(100)
    const activeTags = tags.filter(tag => (tag.count || 0) > 0)
    const emptyTags = tags.filter(tag => (tag.count || 0) === 0)

    console.log(`✅ Total tags: ${tags.length}`)
    console.log(`✅ Active tags (with posts): ${activeTags.length}`)
    console.log(`⚠️  Empty tags (no posts): ${emptyTags.length}`)

    if (emptyTags.length > 0) {
      console.log('\n📋 Empty tags that will be hidden:')
      emptyTags.slice(0, 20).forEach(tag => {
        console.log(`   - ${tag.name} (${tag.handle})`)
      })
      if (emptyTags.length > 20) {
        console.log(`   ... and ${emptyTags.length - 20} more`)
      }
    }

    console.log('\n✅ Sync complete!')
    console.log('\n💡 Your site will now automatically:')
    console.log('   - Only show categories and tags that have posts')
    console.log('   - Return 404 for deleted/empty categories and tags')
    console.log('   - Update automatically when WordPress data changes')

  } catch (error) {
    console.error('❌ Error syncing WordPress data:', error)
    process.exit(1)
  }
}

// Run the sync
syncWordPressData()
