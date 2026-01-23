import { NextResponse } from 'next/server'
import { collection, getDocs, addDoc, query, orderBy, limit as firestoreLimit, where, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// GET /api/posts - Get all posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    // const page = parseInt(searchParams.get('page') || '1') // Firestore pagination is complex, simplified for now
    const limitVal = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Build query
    const postsRef = collection(db, "posts");
    let q = query(postsRef, orderBy("createdAt", "desc"), firestoreLimit(limitVal));

    if (status) {
      q = query(postsRef, where("status", "==", status), orderBy("createdAt", "desc"), firestoreLimit(limitVal));
    }

    const snap = await getDocs(q);
    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json({
      posts,
      pagination: {
        page: 1,
        limit: limitVal,
        total: posts.length, // Approximate
        pages: 1,
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
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const newPost = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      categories: body.categories || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      author: 'admin', // Placeholder
      slug: body.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);

    return NextResponse.json({ id: docRef.id, ...newPost }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}