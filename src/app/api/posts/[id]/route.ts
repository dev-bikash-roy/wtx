import { NextResponse } from 'next/server'
import dbConnect from '@/db/connection'
import Post from '@/db/models/Post'

// GET /api/posts/[id] - Get a single post by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await dbConnect()
    
    // If database is not connected, return error
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }
    
    // If Post model is not available, return error
    if (!Post) {
      return NextResponse.json({ error: 'Post model not available' }, { status: 500 })
    }
    
    const { id } = await params
    const post = await Post.findById(id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update a post by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await dbConnect()
    
    // If database is not connected, return error
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }
    
    // If Post model is not available, return error
    if (!Post) {
      return NextResponse.json({ error: 'Post model not available' }, { status: 500 })
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    const { id } = await params
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        featuredImage: body.featuredImage,
        categories: body.categories || [],
        tags: body.tags || [],
        status: body.status || 'draft',
        slug: body.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      },
      { new: true } // Return the updated document
    )
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete a post by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await dbConnect()
    
    // If database is not connected, return error
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }
    
    // If Post model is not available, return error
    if (!Post) {
      return NextResponse.json({ error: 'Post model not available' }, { status: 500 })
    }
    
    const { id } = await params
    const post = await Post.findByIdAndDelete(id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}