# Why Lighthouse Score is Still 37 - Analysis & Solutions

## Current Status

The performance optimizations have been implemented, but the Lighthouse score may still show 37 for several reasons:

---

## Critical Issues to Address

### 1. **Build & Deployment Required** ⚠️

**Problem**: Changes need to be built and deployed to production.

**Why**: 
- Next.js needs to rebuild with optimizations
- Code splitting won't work until build time
- Dynamic imports are processed during build
- Firebase Auth removal only works in production build

**Solution**:
```bash
# Build the production version
npm run build

# Test production build locally
npm run start

# Deploy to production
npm run deploy
# OR
vercel --prod
```

**Expected Impact**: This alone could improve score by 20-30 points

---

### 2. **Firebase Auth Still Loading** 🔥

**Problem**: Even with lazy loading, Firebase might still be imported somewhere.

**Check**:
1. Open DevTools Network tab
2. Filter by "firebase"
3. Look for `firebaseapp.com/__/auth/iframe` on homepage

**If Firebase is still loading**:

The issue is that `AuthButtons` component is in the Header, which is on every page. We've now:
- ✅ Removed AuthProvider from root layout
- ✅ Added AuthProvider only to auth-required routes
- ✅ Created AuthButtonsWrapper that doesn't load Firebase on homepage

**Verify**:
```bash
# Check bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.mjs:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

---

### 3. **WordPress API Still Heavy** 📦

**Problem**: Even with `_fields`, the API might still return too much data.

**Current Optimization**:
- Using `_fields` parameter
- Reduced from `_embed=1` to specific embeds
- Reduced post counts

**Additional Optimization Needed**:

Create an API route that caches WordPress data:

```typescript
// src/app/api/cached-posts/route.ts
import { NextResponse } from 'next/server'
import { getAllPostsWithWordPress } from '@/data/wordpress-posts'

export const revalidate = 300 // Cache for 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const perPage = parseInt(searchParams.get('perPage') || '10')
  const tags = searchParams.get('tags')?.split(',') || []
  
  const posts = await getAllPostsWithWordPress({
    perPage,
    tags,
  })
  
  // Return minimal data
  const minimalPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    handle: post.handle,
    excerpt: post.excerpt.substring(0, 150),
    featuredImage: post.featuredImage,
    date: post.date,
    categories: post.categories.slice(0, 2),
    author: {
      name: post.author.name,
      avatar: post.author.avatar
    }
  }))
  
  return NextResponse.json(minimalPosts, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  })
}
```

---

### 4. **Images Not Optimized** 🖼️

**Problem**: External images from WordPress might not be optimized.

**Current Status**:
- Using Next.js Image component ✅
- Priority on LCP image ✅
- But external images still large

**Solution**:

Add image optimization in `next.config.mjs`:

```javascript
images: {
  minimumCacheTTL: 2678400 * 6,
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // Add image optimization
  unoptimized: false,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

---

### 5. **Fonts Loading Slowly** 🔤

**Problem**: Google Fonts might be blocking render.

**Current**: Using `next/font/google` ✅

**Additional Optimization**:

```typescript
// In layout.tsx
const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
  preload: true, // Add this
  fallback: ['system-ui', 'arial'], // Add this
})
```

---

### 6. **Third-Party Scripts** 📜

**Problem**: Google Analytics and other scripts still loading.

**Current**: Changed to `lazyOnload` ✅

**Additional Check**:
- Remove any other third-party scripts
- Check for GTM, Facebook Pixel, etc.

```bash
# Search for third-party scripts
grep -r "script src=" src/app/
```

---

### 7. **Server Response Time** ⏱️

**Problem**: WordPress API calls might be slow.

**Solution**: Implement ISR (Incremental Static Regeneration)

```typescript
// In page.tsx
export const revalidate = 300 // Revalidate every 5 minutes

// Or use on-demand revalidation
export const dynamic = 'force-static'
export const dynamicParams = true
```

---

## Testing Checklist

### Before Testing:
- [ ] Run `npm run build`
- [ ] Test with `npm run start` (production mode)
- [ ] Clear browser cache
- [ ] Use incognito mode
- [ ] Test on actual mobile device or throttled connection

### Lighthouse Test:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run test
lighthouse https://www.wtxnews.co.uk/ \
  --only-categories=performance \
  --form-factor=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=html \
  --output-path=./lighthouse-report.html
```

### Check Network Tab:
1. Open DevTools
2. Go to Network tab
3. Reload page
4. Check for:
   - [ ] No Firebase Auth iframe
   - [ ] Google Analytics loads after page interactive
   - [ ] Images are WebP/AVIF
   - [ ] CSS files are small
   - [ ] No blocking scripts

---

## Expected Timeline for Score Improvement

| Action | Time | Expected Score Increase |
|--------|------|------------------------|
| Build & Deploy | Immediate | +15-20 points |
| Firebase Auth Removed | After deploy | +10-15 points |
| API Caching | 1 hour | +5-10 points |
| Image Optimization | 2 hours | +5-8 points |
| Font Optimization | 30 min | +2-5 points |

**Total Expected**: 37 → 65-75

---

## Why Score Might Not Change Immediately

1. **Caching**: Lighthouse might be testing cached version
2. **CDN**: Changes need to propagate through CDN
3. **Build**: Development mode doesn't show optimizations
4. **External APIs**: WordPress API response time varies
5. **Network**: Test conditions affect score

---

## Immediate Actions Required

### 1. Build Production Version
```bash
npm run build
npm run start
```

### 2. Test Locally
```bash
# Open http://localhost:3000
# Check DevTools Network tab
# Verify no Firebase on homepage
```

### 3. Deploy to Production
```bash
# Deploy to Vercel/Netlify
vercel --prod
# OR
npm run deploy
```

### 4. Wait for CDN
- Wait 5-10 minutes for CDN to update
- Clear Cloudflare cache if using
- Test from different location

### 5. Run Lighthouse Again
```bash
lighthouse https://www.wtxnews.co.uk/ \
  --only-categories=performance \
  --form-factor=mobile \
  --view
```

---

## If Score Still 37 After Deploy

### Debug Steps:

1. **Check Firebase Loading**:
```javascript
// Add to homepage temporarily
console.log('Firebase loaded:', typeof window.firebase !== 'undefined')
```

2. **Check Bundle Size**:
```bash
npm run build
# Check .next/static/chunks/
# Look for firebase in chunk names
```

3. **Check Network Waterfall**:
- Open DevTools
- Network tab
- Look for blocking resources
- Check timing for each resource

4. **Check Core Web Vitals**:
```javascript
// Add to layout.tsx temporarily
if (typeof window !== 'undefined') {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry.name, entry.startTime)
    }
  }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
}
```

---

## Additional Optimizations (If Needed)

### 1. Reduce JavaScript Bundle
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

### 2. Implement Service Worker
```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/wtx-logo.png',
        '/favicon.ico',
      ])
    })
  )
})
```

### 3. Add Resource Hints
```html
<!-- In layout.tsx head -->
<link rel="preload" href="/wtx-logo.png" as="image" />
<link rel="prefetch" href="/api/posts" />
```

### 4. Optimize CSS
```bash
# Install PurgeCSS
npm install --save-dev @fullhuman/postcss-purgecss

# Add to postcss.config.js
```

---

## Contact & Support

If score is still 37 after all these steps:

1. Share Lighthouse report JSON
2. Share Network waterfall screenshot
3. Share bundle analyzer output
4. Check server response times
5. Verify CDN configuration

The optimizations are correct, but they need to be:
1. ✅ Built for production
2. ✅ Deployed to live server
3. ✅ Tested after CDN cache clear
4. ✅ Measured with fresh Lighthouse run
