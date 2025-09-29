import { fetchPosts } from './src/data/wp-api'

async function testHtmlDecoding() {
  try {
    console.log('Testing HTML entity decoding...')
    const posts = await fetchPosts(3, 1)
    console.log(`Successfully fetched ${posts.length} posts`)
    
    posts.forEach((post, index) => {
      console.log(`\nPost ${index + 1}:`)
      console.log(`Title: ${post.title}`)
      console.log(`Excerpt: ${post.excerpt}`)
    })
  } catch (error) {
    console.error('Error testing HTML decoding:', error)
  }
}

testHtmlDecoding()