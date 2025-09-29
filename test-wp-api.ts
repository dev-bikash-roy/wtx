import { fetchPosts } from './src/data/wp-api'

async function testWPAPI() {
  try {
    console.log('Testing WordPress API connection...')
    const posts = await fetchPosts(5, 1)
    console.log(`Successfully fetched ${posts.length} posts`)
    if (posts.length > 0) {
      console.log('First post title:', posts[0].title)
      console.log('First post type:', posts[0].postType)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

testWPAPI()