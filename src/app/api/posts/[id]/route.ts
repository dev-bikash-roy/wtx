import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// GET /api/posts/[id] - Get a single post by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const postSnap = await getDoc(doc(db, "posts", id));

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ id: postSnap.id, ...postSnap.data() })
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const { id } = await context.params
    const postRef = doc(db, "posts", id);

    const updateData = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      categories: body.categories || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      slug: body.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      updatedAt: serverTimestamp()
    };

    await updateDoc(postRef, updateData);

    const updatedSnap = await getDoc(postRef);

    return NextResponse.json({ id: updatedSnap.id, ...updatedSnap.data() })
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteDoc(doc(db, "posts", id));

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}