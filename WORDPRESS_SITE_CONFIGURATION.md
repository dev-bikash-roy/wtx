# WordPress Site Configuration - Updated

## ✅ Configuration Changed

The system now **ONLY** fetches from **wtxnews.com**.

### What Was Changed

**File**: `src/lib/wordpress-auth.ts`

**Before**:
```typescript
const DEFAULT_WP_SITES: WordPressSite[] = [
  {
    id: 'wtxnews',
    name: 'WTX News',
    url: 'https://wtxnews.com',
    apiBase: 'https://wtxnews.com/wp-json/wp/v2',
    isActive: true
  },
  {
    id: 'wtxblog',  // ← REMOVED
    name: 'WTX Blog',
    url: 'https://blog.wtxnews.co.uk',
    apiBase: 'https://blog.wtxnews.co.uk/wp-json/wp/v2',
    isActive: true
  }
]
```

**After**:
```typescript
// ONLY use wtxnews.com - no other domains
const DEFAULT_WP_SITES: WordPressSite[] = [
  {
    id: 'wtxnews',
    name: 'WTX News',
    url: 'https://wtxnews.com',
    apiBase: 'https://wtxnews.com/wp-json/wp/v2',
    isActive: true
  }
]
```

## ⚠️ Important: Data Quality Issue

The build logs show that **wtxnews.com's WordPress database** contains posts with concatenated/invalid image URLs from the beautiful-jemison domain.

### Example from Build Log:
```
[getFeaturedImage] Detected concatenated image URLs: 
https://beautiful-jemison.213-165-92-225.plesk.page/wp-content/uploads/
2025/09/SEI_268402346-e685_1759270421.jpg
wp-content/uploads/2025/11/skynews-football-world-cup_7086757.jpg
wp-content/uploads/2025/02/SEI_238749946-f5eb-e1738823702959_1738827386.jpg
```

### What This Means:

1. ✅ The Next.js app is ONLY fetching from wtxnews.com
2. ❌ The WordPress database at wtxnews.com contains bad data
3. ❌ Posts in wtxnews.com have image URLs from beautiful-jemison domain
4. ❌ Many image URLs are concatenated (multiple URLs joined together)

## 🔧 How to Fix the WordPress Data

You need to clean up your WordPress database at wtxnews.com:

### Option 1: WordPress Admin (Manual)

1. Log into WordPress admin at https://wtxnews.com/wp-admin
2. Go to Posts → All Posts
3. For each post with wrong images:
   - Click Edit
   - Remove the featured image
   - Upload/select the correct image
   - Update post

### Option 2: Database Query (Bulk Fix)

If you have database access, you can run SQL queries to clean up the data:

```sql
-- Find posts with concatenated image URLs
SELECT post_id, meta_value 
FROM wp_postmeta 
WHERE meta_key = '_thumbnail_id' 
AND meta_value LIKE '%beautiful-jemison%';

-- Find posts with concatenated URLs in content
SELECT ID, post_title, post_content
FROM wp_posts
WHERE post_content LIKE '%beautiful-jemison%';
```

### Option 3: WordPress Plugin

Use a plugin like "Better Search Replace" to:
1. Search for: `beautiful-jemison.213-165-92-225.plesk.page`
2. Replace with: `wtxnews.com`
3. Run on: `wp_posts` and `wp_postmeta` tables

### Option 4: WP-CLI (Command Line)

```bash
# Search and replace in database
wp search-replace 'beautiful-jemison.213-165-92-225.plesk.page' 'wtxnews.com' --dry-run

# If looks good, run without --dry-run
wp search-replace 'beautiful-jemison.213-165-92-225.plesk.page' 'wtxnews.com'
```

## 📊 Current Status

### ✅ Working Correctly:
- Next.js app only fetches from wtxnews.com
- No other WordPress sites are queried
- Post content displays correctly
- System properly detects and rejects invalid image URLs
- Fallback to placeholder images when URLs are invalid

### ❌ Needs Fixing in WordPress:
- Many posts have concatenated image URLs
- Image URLs reference beautiful-jemison domain
- Featured images need to be re-uploaded or URLs fixed

## 🧪 How to Verify

### 1. Check Build Logs
```bash
npm run build
```

Look for:
- ✅ "Site with ID wtxblog not found" (expected - we removed it)
- ❌ "[getFeaturedImage] Detected concatenated image URLs" (WordPress data issue)

### 2. Check API Directly
```bash
# Fetch a post from WordPress
curl "https://wtxnews.com/wp-json/wp/v2/posts?per_page=1&_embed=1"
```

Look at the `_embedded['wp:featuredmedia'][0].source_url` field - if it contains concatenated URLs or beautiful-jemison domain, that's the source of the problem.

### 3. Test Post Pages
1. Open http://localhost:3002
2. Click on any post
3. Check browser console for logs
4. If you see "Detected concatenated image URLs", the WordPress data needs fixing

## 📝 Summary

| Item | Status | Notes |
|------|--------|-------|
| WordPress site configuration | ✅ Fixed | Only wtxnews.com is used |
| Post fetching | ✅ Working | All posts come from wtxnews.com |
| Post content display | ✅ Working | Content displays correctly |
| Image URL validation | ✅ Working | Invalid URLs are detected and rejected |
| WordPress database quality | ❌ Needs fixing | Contains bad image URLs |
| Featured images | ⚠️ Fallback | Using placeholders when URLs are invalid |

## 🎯 Next Steps

1. **Immediate**: Site works, posts display with placeholder images where needed
2. **Short term**: Clean up WordPress database to fix image URLs
3. **Long term**: Implement image upload/management system to prevent bad URLs

## 🔗 Related Files

- `src/lib/wordpress-auth.ts` - WordPress site configuration (UPDATED)
- `src/lib/multi-wp-integration.ts` - Post fetching and image validation
- `src/data/wordpress-posts.ts` - WordPress data integration

## ✅ Verification

Build completed successfully:
- Only wtxnews.com is queried
- No other WordPress sites are accessed
- Posts display correctly (with placeholders for invalid images)
- System is working as expected

The remaining issue is **WordPress data quality**, not the Next.js application.
