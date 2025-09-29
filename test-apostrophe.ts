import { fetchPosts } from './src/data/wp-api'
import he from 'he'

async function testApostrophe() {
  try {
    console.log('Testing apostrophe decoding...')
    
    // Test the he library directly
    const testString = 'Gustavo Petro: US revokes Colombian president&#8217;s visa after he urges troops to disobey Donald Trump&#8217;s orders'
    const decodedString = he.decode(testString)
    console.log('Original:', testString)
    console.log('Decoded:', decodedString)
    
    // Test with actual posts
    console.log('\nTesting with actual posts...')
    const posts = await fetchPosts(10, 1)
    
    let foundApostrophePost = false
    posts.forEach((post, index) => {
      // Check if the title or excerpt contains apostrophes
      if (post.title.includes('\'') || post.excerpt.includes('\'')) {
        console.log(`\nPost with apostrophe:`)
        console.log(`Title: ${post.title}`)
        console.log(`Excerpt: ${post.excerpt}`)
        foundApostrophePost = true
      }
      
      // Also check for any remaining HTML entities
      if (post.title.includes('&#') || post.excerpt.includes('&#')) {
        console.log(`\nPost with HTML entities:`)
        console.log(`Title: ${post.title}`)
        console.log(`Excerpt: ${post.excerpt}`)
      }
    })
    
    if (!foundApostrophePost) {
      console.log('\nNo posts with apostrophes found in this batch.')
    }
  } catch (error) {
    console.error('Error testing apostrophe decoding:', error)
  }
}

testApostrophe()