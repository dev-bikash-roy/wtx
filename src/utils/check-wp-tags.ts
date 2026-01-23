// Utility to check available WordPress tags
// This can be used to find actual tags that exist on wtxnews.com

import { fetchTags } from '@/data/wp-api'

export async function checkAvailableTags() {
  try {
    console.log('Checking available tags on WordPress...')
    const tags = await fetchTags(100)
    
    console.log(`Found ${tags.length} tags:`)
    tags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag.name} (${tag.handle}) - ${tag.count} posts`)
    })
    
    // Look for video-related tags
    const videoRelatedTags = tags.filter(tag => 
      tag.handle.includes('video') || 
      tag.handle.includes('media') || 
      tag.handle.includes('multimedia') ||
      tag.name.toLowerCase().includes('video')
    )
    
    if (videoRelatedTags.length > 0) {
      console.log('\nVideo-related tags found:')
      videoRelatedTags.forEach(tag => {
        console.log(`- ${tag.name} (${tag.handle}) - ${tag.count} posts`)
      })
    } else {
      console.log('\nNo video-related tags found')
    }
    
    return tags
  } catch (error) {
    console.error('Error checking tags:', error)
    return []
  }
}

// Function to suggest better tag alternatives
export function suggestVideoTags(availableTags: any[]) {
  const suggestions = availableTags.filter(tag => 
    // Look for tags that might contain video content
    tag.handle.includes('news') ||
    tag.handle.includes('breaking') ||
    tag.handle.includes('latest') ||
    tag.handle.includes('featured') ||
    tag.count > 10 // Tags with decent amount of content
  ).slice(0, 5) // Top 5 suggestions
  
  return suggestions
}