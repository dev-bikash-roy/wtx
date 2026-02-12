# Performance Optimization - Detailed Diffs

## 1. src/app/layout.tsx

### Change 1: Lazy Load AuthProvider
```diff
- import { AuthProvider } from '@/contexts/AuthContext'
+ import { LazyAuthProvider } from '@/contexts/LazyAuthProvider'

- <AuthProvider>
+ <LazyAuthProvider>
    <ThemeProvider>
      <div>{children}</div>
    </ThemeProvider>
- </AuthProvider>
+ </LazyAuthProvider>
```

### Change 2: Reduce Preconnects (7 → 3)
```diff
  <head>
-   {/* Preconnect to critical origins */}
+   {/* Preconnect to critical origins only - reduced from 7 to 3 */}
    <link rel="preconnect" href="https://www.googletagmanager.com" />
-   <link rel="preconnect" href="https://fonts.googleapis.com" />
-   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
-
-   {/* Post Image Sources */}
    <link rel="preconnect" href="https://wtxnews.com" />
-   <link rel="preconnect" href="https://blog.wtxnews.co.uk" />
-   <link rel="preconnect" href="https://ichef.bbci.co.uk" />
+   <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
+   <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

### Change 3: Defer Google Analytics
```diff
- {/* Google Analytics */}
+ {/* Google Analytics - Lazy loaded */}
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-SZQJ2R3C2R"
-   strategy="afterInteractive"
+   strategy="lazyOnload"
  />
- <Script id="google-analytics" strategy="afterInteractive">
+ <Script id="google-analytics" strategy="lazyOnload">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
-     gtag('config', 'G-SZQJ2R3C2R');
+     gtag('config', 'G-SZQJ2R3C2R', {
+       page_path: window.location.pathname,
+     });
    `}
  </Script>
```

---

## 2. src/contexts/LazyAuthProvider.tsx (NEW FILE)

```typescript
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AuthProvider } from './AuthContext'

// This wrapper only loads Firebase Auth when actually needed
export function LazyAuthProvider({ children }: { children: ReactNode }) {
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false)

  useEffect(() => {
    // Check if we're on an auth-required route
    const authRoutes = ['/login', '/signup', '/dashboard', '/profile', '/admin', '/make-admin', '/test-auth']
    const isAuthRoute = authRoutes.some(route => window.location.pathname.startsWith(route))
    
    // Check if user has interacted with auth (clicked login/signup button)
    const hasAuthIntent = sessionStorage.getItem('auth-intent') === 'true'
    
    if (isAuthRoute || hasAuthIntent) {
      setShouldLoadAuth(true)
    }
  }, [])

  // Expose a function to trigger auth loading
  useEffect(() => {
    const handleAuthIntent = () => {
      sessionStorage.setItem('auth-intent', 'true')
      setShouldLoadAuth(true)
    }

    window.addEventListener('auth-intent', handleAuthIntent)
    return () => window.removeEventListener('auth-intent', handleAuthIntent)
  }, [])

  if (!shouldLoadAuth) {
    // Return children without auth context for non-auth pages
    return <>{children}</>
  }

  return <AuthProvider>{children}</AuthProvider>
}
```

---

## 3. src/components/Header/AuthButtons.tsx

### Add Auth Intent Trigger
```diff
  'use client'

  import { useAuth } from '@/contexts/AuthContext'
  import Link from 'next/link'
- import { Fragment } from 'react'
+ import { Fragment, useEffect } from 'react'
  import { Menu, Transition } from '@headlessui/react'
  import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline'

+ // Trigger auth loading when user interacts with auth buttons
+ function triggerAuthIntent() {
+   if (typeof window !== 'undefined') {
+     window.dispatchEvent(new Event('auth-intent'))
+   }
+ }

  export default function AuthButtons() {
    const { user, loading, logout } = useAuth()

+   // Trigger auth loading on mount if on auth page
+   useEffect(() => {
+     const authRoutes = ['/login', '/signup', '/dashboard', '/profile', '/admin']
+     if (authRoutes.some(route => window.location.pathname.startsWith(route))) {
+       triggerAuthIntent()
+     }
+   }, [])

    // ... rest of component

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
+         onClick={triggerAuthIntent}
          className="..."
        >
          Login
        </Link>
        <Link
          href="/signup"
+         onClick={triggerAuthIntent}
          className="..."
        >
          Sign up
        </Link>
      </div>
    )
  }
```

---

## 4. src/app/(app)/(home)/(home-1)/page.tsx

### Change 1: Lazy Load Components
```diff
  import SectionLargeSlider from '@/components/SectionLargeSlider'
- import SectionGridPosts from '@/components/SectionGridPosts'
  import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
  import SectionMagazine1 from '@/components/SectionMagazine1'
  import SectionMagazine2 from '@/components/SectionMagazine2'
- import SectionMagazine3 from '@/components/SectionMagazine3'
  import SectionTrending from '@/components/SectionTrending'
  import SectionTrendingTags from '@/components/SectionTrendingTags'
- import SectionSliderPosts from '@/components/SectionSliderPosts'
  import dynamic from 'next/dynamic'
  const SectionMagazine6 = dynamic(() => import('@/components/SectionMagazine6'))
  const SectionSubscribe2 = dynamic(() => import('@/components/SectionSubscribe2'))
+ const SectionGridPosts = dynamic(() => import('@/components/SectionGridPosts'))
+ const SectionSliderPosts = dynamic(() => import('@/components/SectionSliderPosts'))
+ const SectionMagazine3 = dynamic(() => import('@/components/SectionMagazine3'))
```

### Change 2: Reduce Initial Posts
```diff
  const [
    latestNewsPosts,
    // ... other posts
  ] = await Promise.all([
-   // 1. Latest news today (Tag: uk-featured-news)
-   getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 5 }),
-   getAllPostsWithWordPress({ perPage: 5 }), // Fallback
+   // 1. Latest news today (Tag: uk-featured-news) - reduced from 5 to 3
+   getAllPostsWithWordPress({ tags: ['uk-featured-news'], perPage: 3 }),
+   getAllPostsWithWordPress({ perPage: 3 }), // Fallback

-   // 2. Trending news
-   getAllPostsWithWordPress({ perPage: 6 }),
+   // 2. Trending news - reduced from 6 to 4
+   getAllPostsWithWordPress({ perPage: 4 }),

-   // 3. Editors picks (Tag: editors-picks)
-   getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 5 }),
+   // 3. Editors picks (Tag: editors-picks) - reduced from 5 to 3
+   getAllPostsWithWordPress({ tags: ['editors-picks'], perPage: 3 }),

-   // 4. What's happening near you (Regions)
-   getWordPressPostsByCategory('england-news', 3),
-   getWordPressPostsByCategory('scotland-uk-news', 3),
-   getWordPressPostsByCategory('wales-uk-news', 3),
-   getWordPressPostsByCategory('ireland-news', 3),
+   // 4. What's happening near you (Regions) - reduced from 3 to 2 each
+   getWordPressPostsByCategory('england-news', 2),
+   getWordPressPostsByCategory('scotland-uk-news', 2),
+   getWordPressPostsByCategory('wales-uk-news', 2),
+   getWordPressPostsByCategory('ireland-news', 2),

-   // 5. Celebs & Showbiz (Tag: uk-entertainment)
-   getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 8 }),
+   // 5. Celebs & Showbiz (Tag: uk-entertainment) - reduced from 8 to 6
+   getAllPostsWithWordPress({ tags: ['uk-entertainment'], perPage: 6 }),

-   // 6. Latest Sports News (Category: sport)
-   getWordPressPostsByCategory('sport', 6),
+   // 6. Latest Sports News (Category: sport) - reduced from 6 to 4
+   getWordPressPostsByCategory('sport', 4),

-   // 7. Money Saving Expert (Category: money-expert)
-   getWordPressPostsByCategory('money-expert', 5),
+   // 7. Money Saving Expert (Category: money-expert) - reduced from 5 to 3
+   getWordPressPostsByCategory('money-expert', 3),

-   // 8. Explore the UK
+   // 8. Explore the UK - reduced from 5 to 3
    getAllPostsWithWordPress({
      categories: ['travel'],
      tags: ['uk-holidays', 'nature-holidays', 'cabin-holidays', 'hiking-holidays', 'weekend-spa-getaways'],
-     perPage: 5
+     perPage: 3
    }),

-   // Fallback and categories
-   getAllPostsWithWordPress({ perPage: 20 }),
+   // Fallback and categories - reduced from 20 to 12
+   getAllPostsWithWordPress({ perPage: 12 }),
    getCategoriesWithPosts()
  ])
```

---

## 5. src/lib/multi-wp-integration.ts

### Optimize WordPress API Calls (3 locations)
```diff
  // Location 1: fetchPostsBySiteId
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
-   _embed: '1',
+   _fields: 'id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded',
+   _embed: 'author,wp:featuredmedia,wp:term',
    orderby: 'date',
    order: 'desc'
  })

  // Location 2: fetchAllPosts
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
-   _embed: '1',
+   _fields: 'id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded',
+   _embed: 'author,wp:featuredmedia,wp:term',
    orderby: 'date',
    order: 'desc'
  })

  // Location 3: getPostBySlug
- const url = `${site.apiBase}/posts?slug=${actualSlug}&_embed=1`
+ const url = `${site.apiBase}/posts?slug=${actualSlug}&_fields=id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded&_embed=author,wp:featuredmedia,wp:term`
```

---

## 6. src/components/PostFeaturedMedia/PostFeaturedMedia.tsx

### Add fetchPriority to Images
```diff
  const renderImage = () => {
    // ... validation code

    return (
      <Link href={`/news/${handle}`}>
        <Image
          alt={featuredImage.alt || title}
          fill
          className="object-cover"
          src={featuredImage.src}
          sizes="(max-width: 600px) 100vw, 50vw"
          priority={priority}
+         fetchPriority={priority ? "high" : "auto"}
          onError={(e) => {
            // ... error handling
          }}
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    )
  }
```

---

## 7. src/hooks/use-cursor-visibility.ts

### Prevent Forced Reflow
```diff
  const updateRect = React.useCallback(() => {
    const element = elementRef?.current ?? document.body

-   const { x, y, width, height } = element.getBoundingClientRect()
-   setRect({ x, y, width, height })
+   // Use requestAnimationFrame to batch DOM reads and prevent forced reflow
+   window.requestAnimationFrame(() => {
+     const { x, y, width, height } = element.getBoundingClientRect()
+     setRect({ x, y, width, height })
+   })
  }, [elementRef])
```

---

## 8. next.config.mjs

### Update Preconnect Headers
```diff
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
-           value: '<https://www.googletagmanager.com>; rel=preconnect, <https://www.google-analytics.com>; rel=preconnect',
+           value: '<https://www.googletagmanager.com>; rel=preconnect, <https://wtxnews.com>; rel=preconnect',
          },
        ],
      },
      // ... rest of headers
    ]
  }
```

---

## Summary of Changes

| File | Lines Changed | Type |
|------|---------------|------|
| src/app/layout.tsx | ~15 | Modified |
| src/contexts/LazyAuthProvider.tsx | ~40 | New |
| src/components/Header/AuthButtons.tsx | ~15 | Modified |
| src/app/(app)/(home)/(home-1)/page.tsx | ~30 | Modified |
| src/lib/multi-wp-integration.ts | ~12 | Modified |
| src/components/PostFeaturedMedia/PostFeaturedMedia.tsx | ~2 | Modified |
| src/hooks/use-cursor-visibility.ts | ~5 | Modified |
| next.config.mjs | ~2 | Modified |

**Total**: ~121 lines changed across 8 files (1 new, 7 modified)
