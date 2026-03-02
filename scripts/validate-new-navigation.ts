/**
 * Validate New Navigation Links
 */

import { fetchCategories, fetchTags } from '../src/data/wp-api'

async function validateNavigation() {
  console.log('🔍 Validating NEW navigation links...\n')

  try {
    const categories = await fetchCategories(100)
    const tags = await fetchTags(100)

    const categoryMap = new Map(categories.map(c => [c.handle, c]))
    const tagMap = new Map(tags.map(t => [t.handle, t]))

    // New navigation links
    const navLinks = [
      // UK News
      { type: 'category', handle: 'uk-news', name: 'UK News' },
      { type: 'category', handle: 'england-news', name: 'England' },
      { type: 'category', handle: 'northern-ireland-uk-news', name: 'Northern Ireland' },
      { type: 'tag', handle: 'london', name: 'London' },
      { type: 'tag', handle: 'manchester', name: 'Manchester' },
      
      // Latest News
      { type: 'tag', handle: 'latest-news', name: 'Latest News' },
      { type: 'tag', handle: 'main-headlines', name: 'Main Headlines' },
      { type: 'tag', handle: 'uk-politics', name: 'UK Politics' },
      { type: 'tag', handle: 'world-news', name: 'World News' },
      { type: 'category', handle: 'business', name: 'Business' },
      { type: 'tag', handle: 'uk-crime', name: 'UK Crime' },
      
      // Sport
      { type: 'category', handle: 'sport', name: 'Sport' },
      { type: 'tag', handle: 'premier-league', name: 'Premier League' },
      { type: 'tag', handle: 'football', name: 'Football' },
      { type: 'tag', handle: 'football-gossip', name: 'Football Gossip' },
      { type: 'tag', handle: 'sports-news', name: 'Sports News' },
      
      // Entertainment
      { type: 'category', handle: 'entertainment', name: 'Entertainment' },
      { type: 'tag', handle: 'uk-entertainment', name: 'UK Entertainment' },
      { type: 'tag', handle: 'us-entertainment', name: 'US Entertainment' },
      { type: 'tag', handle: 'celebrities', name: 'Celebrities' },
      { type: 'tag', handle: 'streaming', name: 'Streaming' },
      
      // Lifestyle
      { type: 'category', handle: 'lifestyle', name: 'Lifestyle' },
      { type: 'category', handle: 'health', name: 'Health' },
      { type: 'category', handle: 'fitness', name: 'Fitness' },
      { type: 'category', handle: 'fashion', name: 'Fashion' },
      { type: 'category', handle: 'food-and-drink', name: 'Food & Drink' },
      
      // World
      { type: 'category', handle: 'world', name: 'World' },
      { type: 'category', handle: 'usa-news', name: 'USA' },
      { type: 'category', handle: 'europe', name: 'Europe' },
      { type: 'category', handle: 'canada', name: 'Canada' },
      { type: 'category', handle: 'south-america', name: 'South America' },
      
      // Mega Menu
      { type: 'category', handle: 'politics', name: 'Politics' },
    ]

    let validCount = 0
    let invalidCount = 0

    for (const link of navLinks) {
      const map = link.type === 'category' ? categoryMap : tagMap
      const item = map.get(link.handle)

      if (!item) {
        console.log(`❌ ${link.name} (${link.type}/${link.handle}) - NOT FOUND`)
        invalidCount++
      } else if ((item.count || 0) === 0) {
        console.log(`⚠️  ${link.name} (${link.type}/${link.handle}) - NO POSTS`)
        invalidCount++
      } else {
        console.log(`✅ ${link.name} (${link.type}/${link.handle}) - OK (${item.count} posts)`)
        validCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`\n📈 Summary:`)
    console.log(`   Valid links: ${validCount}`)
    console.log(`   Invalid links: ${invalidCount}`)
    console.log(`   Total checked: ${navLinks.length}`)

    if (invalidCount === 0) {
      console.log('\n✅ ALL NAVIGATION LINKS ARE VALID! Production ready.')
    }

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

validateNavigation()
