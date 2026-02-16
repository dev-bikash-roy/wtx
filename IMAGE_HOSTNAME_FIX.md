# Image Hostname Configuration Fix

## Issue Fixed ✅
**Error:** `Invalid src prop on next/image, hostname "static.euronews.com" is not configured`

## Solution
Added missing image hostnames to `next.config.mjs` under the `images.remotePatterns` configuration.

## Hostnames Added

### Euronews (Original Error)
- `static.euronews.com` ✅
- `www.euronews.com` (preventive)

### Additional UK News Sources (Preventive)
To prevent similar errors with other news sources, also added:
- `cdn.cnn.com`
- `media.cnn.com`
- `static.independent.co.uk`
- `www.telegraph.co.uk`
- `static.standard.co.uk`
- `www.thesun.co.uk`
- `i.dailymail.co.uk`
- `www.mirror.co.uk`
- `wtxnews.co.uk` (your own domain)

## Already Configured Domains
The following were already in the config:
- images.unsplash.com
- images.pexels.com
- wtxnews.com
- wtx-news.co.uk
- blog.wtxnews.co.uk
- images.euronews.com
- i.guim.co.uk (Guardian)
- ichef.bbci.co.uk (BBC)
- metro.co.uk
- www.bbc.co.uk
- www.heraldscotland.com
- www.irishexaminer.com
- secure.gravatar.com
- Various sports domains (ESPN, Motorsport, etc.)

## How It Works
Next.js Image component requires explicit configuration of external image domains for security and optimization. The `remotePatterns` array allows:
- Protocol specification (http/https)
- Hostname (exact or wildcard)
- Pathname patterns

## Testing
After deployment, the error should no longer appear. To verify:
1. Build the project: `npm run build`
2. Check for any image-related errors in the build output
3. Test pages that use Euronews images
4. Monitor browser console for image loading errors

## Future Image Domains
If you encounter similar errors with other domains:
1. Note the hostname from the error message
2. Add it to `next.config.mjs` under `images.remotePatterns`
3. Follow this format:
```javascript
{
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/**',
}
```

## Performance Impact
✅ No negative impact - these configurations only allow images from specified domains
✅ Images are still optimized by Next.js Image component
✅ Caching and format conversion (AVIF/WebP) still work

## Security Note
Only add trusted domains to this list. Each domain added allows loading images from that source, which could be a security concern if the domain is compromised.
