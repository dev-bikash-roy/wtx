import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

// Helper to check if requester is admin
async function isAdmin(request: NextRequest) {
  const uid = request.headers.get("x-user-uid");
  if (!uid) return false;

  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    return userDoc.exists && userDoc.data()?.role === "admin";
  } catch (e) {
    return false;
  }
}

// GET - Fetch all posts (admin only)
export async function GET(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // For now, return mock data since posts are coming from WordPress
    // In a real implementation, you'd fetch from your posts collection
    const mockPosts = [
      {
        slug: 'sample-post-1',
        title: 'Sample Post 1',
        status: 'published',
        accessLevel: 'free',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'premium-content',
        title: 'Premium Content Example',
        status: 'published',
        accessLevel: 'paid',
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(mockPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update post access level (admin only)
// PATCH - Update post access level (admin only)
export async function PATCH(request: NextRequest) {
  try {
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { slug, accessLevel } = body

    if (!slug) {
      return NextResponse.json({ error: 'Post slug required' }, { status: 400 })
    }

    // In a real implementation, you'd update the post in your database
    // For now, we'll just return success since posts are from WordPress
    console.log(`Would update post ${slug} access level to ${accessLevel}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}