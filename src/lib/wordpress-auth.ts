// WordPress Authentication and Multi-site Management

export interface WordPressSite {
  id: string
  name: string
  url: string
  apiBase: string
  username?: string
  password?: string
  applicationPassword?: string
  isActive: boolean
}

export interface WordPressUser {
  id: number
  username: string
  name: string
  email: string
  roles: string[]
  capabilities: Record<string, boolean>
  avatar_urls: Record<string, string>
}

export interface WordPressAuthResponse {
  success: boolean
  user?: WordPressUser
  token?: string
  error?: string
}

// Default WordPress sites configuration
const DEFAULT_WP_SITES: WordPressSite[] = [
  {
    id: 'wtxnews',
    name: 'WTX News',
    url: 'https://wtxnews.com',
    apiBase: 'https://wtxnews.com/wp-json/wp/v2',
    isActive: true
  },
  {
    id: 'wtxblog',
    name: 'WTX Blog',
    url: 'https://blog.wtxnews.co.uk',
    apiBase: 'https://blog.wtxnews.co.uk/wp-json/wp/v2',
    isActive: true
  }
]

// In-memory storage for additional sites (in production, use a database)
let additionalSites: WordPressSite[] = []

// WordPress Authentication Class
export class WordPressAuth {
  private sites: WordPressSite[]

  constructor(sites: WordPressSite[] = [...DEFAULT_WP_SITES, ...additionalSites]) {
    this.sites = sites
  }

  // Add a new WordPress site
  addSite(site: WordPressSite) {
    this.sites.push(site)
    additionalSites.push(site)
  }

  // Remove a WordPress site
  removeSite(siteId: string) {
    this.sites = this.sites.filter(site => site.id !== siteId)
    additionalSites = additionalSites.filter(site => site.id !== siteId)
  }

  // Update a WordPress site
  updateSite(siteId: string, updates: Partial<WordPressSite>) {
    const siteIndex = this.sites.findIndex(site => site.id === siteId)
    if (siteIndex !== -1) {
      this.sites[siteIndex] = { ...this.sites[siteIndex], ...updates }
    }

    const additionalIndex = additionalSites.findIndex(site => site.id === siteId)
    if (additionalIndex !== -1) {
      additionalSites[additionalIndex] = { ...additionalSites[additionalIndex], ...updates }
    }
  }

  // Get all active sites
  getActiveSites(): WordPressSite[] {
    return this.sites.filter(site => site.isActive)
  }

  // Get site by ID
  getSite(siteId: string): WordPressSite | undefined {
    return this.sites.find(site => site.id === siteId)
  }

  // Authenticate with WordPress using Application Password
  async authenticateWithApplicationPassword(
    siteId: string,
    username: string,
    applicationPassword: string
  ): Promise<WordPressAuthResponse> {
    const site = this.getSite(siteId)
    if (!site) {
      return { success: false, error: 'Site not found' }
    }

    try {
      // Create Basic Auth header
      const credentials = btoa(`${username}:${applicationPassword}`)

      // Test authentication by fetching user info
      const response = await fetch(`${site.apiBase}/users/me`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const user: WordPressUser = await response.json()

        // Generate our own token for session management
        const token = this.generateSessionToken(siteId, user.id)

        return {
          success: true,
          user,
          token
        }
      } else {
        const error = await response.text()
        return { success: false, error: `Authentication failed: ${error}` }
      }
    } catch (error) {
      return {
        success: false,
        error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Authenticate with WordPress using username/password (JWT)
  async authenticateWithJWT(
    siteId: string,
    username: string,
    password: string
  ): Promise<WordPressAuthResponse> {
    const site = this.getSite(siteId)
    if (!site) {
      return { success: false, error: 'Site not found' }
    }

    try {
      // Try JWT authentication if JWT plugin is available
      const jwtResponse = await fetch(`${site.url}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json()

        // Fetch user details
        const userResponse = await fetch(`${site.apiBase}/users/me`, {
          headers: {
            'Authorization': `Bearer ${jwtData.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (userResponse.ok) {
          const user: WordPressUser = await userResponse.json()
          return {
            success: true,
            user,
            token: jwtData.token
          }
        }
      }

      // Fallback to Application Password method
      return this.authenticateWithApplicationPassword(siteId, username, password)
    } catch (error) {
      return {
        success: false,
        error: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Generate session token
  private generateSessionToken(siteId: string, userId: number): string {
    const timestamp = Date.now()
    const payload = { siteId, userId, timestamp }
    // In production, use proper JWT signing
    return btoa(JSON.stringify(payload))
  }

  // Verify session token
  verifySessionToken(token: string): { siteId: string; userId: number; timestamp: number } | null {
    try {
      const payload = JSON.parse(atob(token))

      // Check if token is not expired (24 hours)
      const now = Date.now()
      const tokenAge = now - payload.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (tokenAge > maxAge) {
        return null
      }

      return payload
    } catch {
      return null
    }
  }

  // Create post on WordPress site
  async createPost(
    siteId: string,
    token: string,
    postData: {
      title: string
      content: string
      excerpt?: string
      status: 'publish' | 'draft' | 'pending'
      categories?: number[]
      tags?: number[]
      featured_media?: number
      meta?: Record<string, any>
    }
  ): Promise<any> {
    const site = this.getSite(siteId)
    if (!site) {
      throw new Error('Site not found')
    }

    const response = await fetch(`${site.apiBase}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`)
    }

    return response.json()
  }

  // Update post on WordPress site
  async updatePost(
    siteId: string,
    token: string,
    postId: number,
    postData: Partial<{
      title: string
      content: string
      excerpt: string
      status: 'publish' | 'draft' | 'pending'
      categories: number[]
      tags: number[]
      featured_media: number
      meta: Record<string, any>
    }>
  ): Promise<any> {
    const site = this.getSite(siteId)
    if (!site) {
      throw new Error('Site not found')
    }

    const response = await fetch(`${site.apiBase}/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`)
    }

    return response.json()
  }

  // Delete post from WordPress site
  async deletePost(siteId: string, token: string, postId: number): Promise<boolean> {
    const site = this.getSite(siteId)
    if (!site) {
      throw new Error('Site not found')
    }

    const response = await fetch(`${site.apiBase}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.ok
  }
}

// Global instance
export const wpAuth = new WordPressAuth()