import { NextResponse } from 'next/server'
import dbConnect from '@/db/connection'
import Post from '@/db/models/Post'

// GET /api/posts - Get all posts
export async function GET(request: Request) {
  try {
    const db = await dbConnect()
    
    // If database is not connected, return mock data
    if (!db) {
      return NextResponse.json({
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      })
    }
    
    // If Post model is not available, return mock data
    if (!Post) {
      return NextResponse.json({
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      })
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const authorId = searchParams.get('authorId')
    
    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (authorId) filter.author = authorId
    
    // Get posts with pagination
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    // Get total count
    const total = await Post.countDocuments(filter)
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const db = await dbConnect()
    
    // If database is not connected, return mock success
    if (!db) {
      return NextResponse.json(
        { message: 'Post created successfully (mock)' },
        { status: 201 }
      )
    }
    
    // If Post model is not available, return mock success
    if (!Post) {
      return NextResponse.json(
        { message: 'Post created successfully (mock)' },
        { status: 201 }
      )
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    // Create post
    const post = await Post.create({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      categories: body.categories || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      author: 'admin', // In a real implementation, you would get this from the session
      slug: body.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}