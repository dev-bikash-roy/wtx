/**
 * Validate Navigation Links
 * 
 * This script checks if all navigation links point to valid categories/tags
 * that exist on wtxnews.com and have posts.
 */

import { fetchCategories, fetchTags } from '../src/data/wp-api'

async function validateNavigation() {
  console.log('🔍 Validating navigation links...\n')

  try {
    // Fetch all categories and tags
    const categories = await fetchCategories(100)
    const tags = await fetchTags(100)

    // Create lookup maps
    const categoryMap = new Map(categories.map(c => [c.handle, c]))
    const tagMap = new Map(tags.map(t => [t.handle, t]))

    // Navigation links to validate
    const navLinks = [
      // Latest News dropdown
      { type: 'tag', handle: 'live-news', name: 'Live News Coverage' },
      { type: 'category', handle: 'money-news', name: 'Money News' },
      { type: 'tag', handle: 'local-economy', name: 'Local Economy' },
      { type: 'tag', handle: 'bank-of-england', name: 'Bank of England' },
      { type: 'tag', handle: 'uk-eu-relationship', name: 'UK & EU relationship' },
      
      // Sport dropdown
      { type: 'tag', handle: 'premier-league', name: 'Premier League' },
      { type: 'category', handle: 'tennis', name: 'Tennis' },
      { type: 'category', handle: 'f1', name: 'F1' },
      { type: 'category', handle: 'rugby', name: 'Rugby' },
      { type: 'category', handle: 'cricket', name: 'Cricket' },
      { type: 'category', handle: 'wwe', name: 'WWE' },
      
      // Entertainment dropdown
      { type: 'tag', handle: 'soaps-and-tv-shows', name: 'Soaps and TV Shows' },
      { type: 'tag', handle: 'showbiz-gossip', name: 'Showbiz Gossip' },
      { type: 'tag', handle: 'museums', name: 'Museums' },
      
      // Travel dropdown
      { type: 'tag', handle: 'uk-holidays', name: 'UK Holidays' },
      { type: 'tag', handle: 'budget-holidays', name: 'Budget holidays' },
      { type: 'tag', handle: 'european-holidays', name: 'European holidays' },
      { type: 'tag', handle: 'exotic-holidays', name: 'Exotic holidays' },
      { type: 'tag', handle: 'couples-holidays', name: 'Couples holidays' },
      { type: 'tag', handle: 'fitness-retreats', name: 'Fitness retreats' },
      { type: 'tag', handle: 'day-trips', name: 'Day Trips' },
      { type: 'tag', handle: 'spa-retreats', name: 'Spa retreats' },
      { type: 'category', handle: 'influencers', name: 'Influencers' },
      { type: 'tag', handle: 'photography', name: 'Photography' },
      { type: 'tag', handle: 'cooking', name: 'Cooking' },
      
      // Fashion dropdown
      { type: 'tag', handle: 'styling', name: 'Styling' },
      { type: 'tag', handle: 'what-to-wear', name: 'What to Wear' },
      { type: 'tag', handle: 'budget-outfits', name: 'Budget Outfits' },
      { type: 'tag', handle: 'work-outfits', name: 'Work outfits' },
      { type: 'tag', handle: 'date-night', name: 'Date Night' },
      
      // Money Expert dropdown
      { type: 'tag', handle: 'shopping-deals', name: 'Shopping deals' },
      { type: 'tag', handle: 'supermarkets-deals', name: 'Supermarkets deals' },
      { type: 'tag', handle: 'money-saving-hacks', name: 'Money saving hacks' },
      { type: 'tag', handle: 'make-money-online', name: 'Make money online' },
    ]

    let validCount = 0
    let invalidCount = 0
    const invalidLinks: any[] = []

    console.log('📊 Validation Results:\n')

    for (const link of navLinks) {
      const map = link.type === 'category' ? categoryMap : tagMap
      const item = map.get(link.handle)

      if (!item) {
        console.log(`❌ ${link.name} (${link.type}/${link.handle}) - NOT FOUND`)
        invalidCount++
        invalidLinks.push({ ...link, reason: 'Not found' })
      } else if ((item.count || 0) === 0) {
        console.log(`⚠️  ${link.name} (${link.type}/${link.handle}) - NO POSTS (count: 0)`)
        invalidCount++
        invalidLinks.push({ ...link, reason: 'No posts', count: 0 })
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

    if (invalidLinks.length > 0) {
      console.log('\n⚠️  INVALID LINKS THAT NEED FIXING:')
      invalidLinks.forEach(link => {
        console.log(`   - ${link.name}: /${link.type}/${link.handle} (${link.reason})`)
      })
      console.log('\n💡 These links will return 404 pages. Consider removing them from navigation.')
    } else {
      console.log('\n✅ All navigation links are valid!')
    }

  } catch (error) {
    console.error('❌ Error validating navigation:', error)
    process.exit(1)
  }
}

validateNavigation()
