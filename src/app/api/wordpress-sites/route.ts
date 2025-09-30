import { NextResponse } from 'next/server'
import { wpAuth, WordPressSite } from '@/lib/wordpress-auth'

// GET - List all WordPress sites
export async function GET() {
  try {
    const sites = wpAuth.getActiveSites()
    return NextResponse.json({ sites })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

// POST - Add a new WordPress site
export async function POST(request: Request) {
  try {
    const siteData: Omit<WordPressSite, 'id'> = await request.json()
    
    // Generate ID from URL
    const url = new URL(siteData.url)
    const id = url.hostname.replace(/\./g, '-')
    
    const newSite: WordPressSite = {
      id,
      ...siteData,
      apiBase: `${siteData.url}/wp-json/wp/v2`
    }
    
    // Test connection to the site
    try {
      const testResponse = await fetch(`${newSite.apiBase}/posts?per_page=1`)
      if (!testResponse.ok) {
        return NextResponse.json(
          { error: 'Cannot connect to WordPress site' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Cannot reach WordPress site' },
        { status: 400 }
      )
    }
    
    wpAuth.addSite(newSite)
    
    return NextResponse.json({ 
      message: 'Site added successfully',
      site: newSite 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add site' },
      { status: 500 }
    )
  }
}