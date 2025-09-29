import { fetchPosts } from './src/data/wp-api'

async function testPostContent() {
  try {
    console.log('Testing post content structure...')
    const posts = await fetchPosts(5, 1)
    
    posts.forEach((post, index) => {
      // Look for posts that contain "Cliff Notes" in their content
      if (post.content && (post.content.includes('Cliff Notes') || post.excerpt.includes('Cliff Notes'))) {
        console.log(`\nPost ${index + 1} (contains Cliff Notes):`)
        console.log(`Title: ${post.title}`)
        console.log(`Excerpt: ${post.excerpt}`)
        console.log(`Content length: ${post.content?.length || 0}`)
        
        // Show a portion of the content to understand the structure
        if (post.content) {
          const contentPreview = post.content.substring(0, 500)
          console.log(`Content preview: ${contentPreview}...`)
        }
      }
    })
  } catch (error) {
    console.error('Error testing post content:', error)
  }
}

testPostContent()