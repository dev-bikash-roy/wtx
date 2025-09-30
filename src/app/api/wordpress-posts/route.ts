import { NextResponse } from 'next/server'
import { wpAuth } from '@/lib/wordpress-auth'

// GET - Fetch posts from all WordPress sites or specific site
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    
    const sites = siteId ? [wpAuth.getSite(siteId)].filter(Boolean) : wpAuth.getActiveSites()
    
    if (sites.length === 0) {
      return NextResponse.json({ posts: [], sites: [] })
    }
    
    const allPosts = []
    const siteResults = []
    
    for (const site of sites) {
      try {
        const params = new URLSearchParams({
          per_page: perPage.toString(),
          page: page.toString(),
          _embed: '1'
        })
        
        const response = await fetch(`${site!.apiBase}/posts?${params}`)
        
        if (response.ok) {
          const posts = await response.json()
          
          // Add site information to each post
          const postsWithSite = posts.map((post: any) => ({
            ...post,
            _site: {
              id: site!.id,
              name: site!.name,
              url: site!.url
            }
          }))
          
          allPosts.push(...postsWithSite)
          siteResults.push({
            siteId: site!.id,
            siteName: site!.name,
            postCount: posts.length,
            success: true
          })
        } else {
          siteResults.push({
            siteId: site!.id,
            siteName: site!.name,
            postCount: 0,
            success: false,
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        siteResults.push({
          siteId: site!.id,
          siteName: site!.name,
          postCount: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    // Sort posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return NextResponse.json({
      posts: allPosts,
      sites: siteResults,
      totalPosts: allPosts.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create a new post on specified WordPress site(s)
export async function POST(request: Request) {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      status = 'draft',
      categories = [],
      tags = [],
      siteIds = [],
      publishToAll = false
    } = await request.json()
    
    // Get authentication token from headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const targetSites = publishToAll 
      ? wpAuth.getActiveSites()
      : siteIds.map((id: string) => wpAuth.getSite(id)).filter(Boolean)
    
    if (targetSites.length === 0) {
      return NextResponse.json(
        { error: 'No valid sites specified' },
        { status: 400 }
      )
    }
    
    const results = []
    
    for (const site of targetSites) {
      try {
        const postData = {
          title,
          content,
          excerpt,
          status,
          categories,
          tags
        }
        
        const createdPost = await wpAuth.createPost(site!.id, token, postData)
        
        results.push({
          siteId: site!.id,
          siteName: site!.name,
          success: true,
          postId: createdPost.id,
          postUrl: createdPost.link
        })
      } catch (error) {
        results.push({
          siteId: site!.id,
          siteName: site!.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    
    return NextResponse.json({
      message: `Post created on ${successCount}/${results.length} sites`,
      results
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}