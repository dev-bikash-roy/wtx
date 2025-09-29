import dbConnect from './connection'
import Post from './models/Post'

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Connect to database
    const connection = await dbConnect()
    
    if (!connection) {
      console.log('Database connection not configured or failed. This is normal if you haven\'t set up MongoDB yet.')
      console.log('To use the database features, please:')
      console.log('1. Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas')
      console.log('2. Get your connection string')
      console.log('3. Update the MONGODB_URI in your .env.local file')
      return
    }
    
    // Check if Post model is available
    if (!Post) {
      console.log('Post model not available. Database connection may not be properly configured.')
      return
    }
    
    console.log('Database connected successfully!')
    
    // Test creating a post
    console.log('Testing post creation...')
    const testPost = await Post.create({
      title: 'Test Post',
      content: 'This is a test post to verify database functionality',
      excerpt: 'Test post excerpt',
      slug: 'test-post',
      status: 'published',
      author: 'test-author',
    })
    
    console.log('Post created successfully:', testPost.title)
    
    // Test retrieving posts
    console.log('Testing post retrieval...')
    const posts = await Post.find({})
    console.log(`Found ${posts.length} posts in the database`)
    
    // Clean up - delete test post
    await Post.findByIdAndDelete(testPost._id)
    console.log('Test post cleaned up')
    
    console.log('All tests passed!')
  } catch (error: any) {
    console.error('Database test failed:', error.message)
    console.log('This is normal if you haven\'t set up MongoDB yet.')
    console.log('To use the database features, please:')
    console.log('1. Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas')
    console.log('2. Get your connection string')
    console.log('3. Update the MONGODB_URI in your .env.local file')
  }
}

testConnection()