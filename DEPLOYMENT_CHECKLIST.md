# Deployment Checklist for Performance Improvements

## Pre-Deployment

### 1. Verify Changes Locally
```bash
# Install dependencies
npm install

# Build production version
npm run build

# Start production server
npm run start
```

### 2. Test Production Build
- [ ] Open http://localhost:3000
- [ ] Open DevTools → Network tab
- [ ] Reload page
- [ ] Verify NO Firebase Auth iframe loads on homepage
- [ ] Check that Google Analytics loads with `lazyOnload`
- [ ] Verify images load with WebP/AVIF format
- [ ] Check bundle sizes in `.next/static/chunks/`

### 3. Test Auth Functionality
- [ ] Navigate to /login - Firebase should load
- [ ] Navigate to /signup - Firebase should load
- [ ] Navigate to /dashboard - Firebase should load
- [ ] Navigate to /profile - Firebase should load
- [ ] Navigate to /admin - Firebase should load
- [ ] Login works correctly
- [ ] Logout works correctly
- [ ] User session persists

### 4. Test Homepage Performance
- [ ] Homepage loads without Firebase
- [ ] LCP image loads with priority
- [ ] Below-fold sections lazy-load
- [ ] No console errors
- [ ] Auth buttons show "Login/Signup"

---

## Deployment Steps

### Option 1: Vercel Deployment

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Wait for deployment to complete
# Note the deployment URL
```

### Option 2: Manual Deployment

```bash
# Build production version
npm run build

# Upload .next folder to server
# Upload public folder to server
# Upload package.json to server
# Upload next.config.mjs to server

# On server, run:
npm install --production
npm run start
```

### Option 3: Using Deployment Script

```bash
# If you have deploy.sh
chmod +x deploy.sh
./deploy.sh

# If you have deploy-production.bat (Windows)
deploy-production.bat
```

---

## Post-Deployment

### 1. Wait for CDN Propagation
- Wait 5-10 minutes for changes to propagate
- Clear CDN cache if using Cloudflare/Fastly
- Test from different geographic locations

### 2. Clear Caches

**Cloudflare**:
1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to Caching → Configuration
4. Click "Purge Everything"

**Vercel**:
```bash
# Purge cache
vercel --prod --force
```

**Browser**:
- Clear browser cache
- Use incognito/private mode
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 3. Verify Deployment

```bash
# Check if site is live
curl -I https://www.wtxnews.co.uk/

# Check response headers
curl -I https://www.wtxnews.co.uk/ | grep -i cache

# Check if Firebase is loading
curl https://www.wtxnews.co.uk/ | grep -i firebase
```

---

## Performance Testing

### 1. Run Lighthouse Test

**Using Chrome DevTools**:
1. Open https://www.wtxnews.co.uk/ in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select "Mobile"
5. Select "Performance" only
6. Click "Analyze page load"
7. Wait for results

**Using Lighthouse CLI**:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run test
lighthouse https://www.wtxnews.co.uk/ \
  --only-categories=performance \
  --form-factor=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --view

# Run multiple tests and average
for i in {1..3}; do
  lighthouse https://www.wtxnews.co.uk/ \
    --only-categories=performance \
    --form-factor=mobile \
    --output=json \
    --output-path=./report-$i.json
done
```

### 2. Check PageSpeed Insights

1. Go to https://pagespeed.web.dev/
2. Enter: https://www.wtxnews.co.uk/
3. Click "Analyze"
4. Check both Mobile and Desktop scores
5. Review opportunities and diagnostics

### 3. Check Core Web Vitals

**Google Search Console**:
1. Go to https://search.google.com/search-console
2. Select your property
3. Go to "Core Web Vitals"
4. Check mobile and desktop reports

**Chrome UX Report**:
1. Go to https://developers.google.com/web/tools/chrome-user-experience-report
2. Enter your domain
3. Check real user metrics

---

## Verification Checklist

### Performance Metrics
- [ ] Lighthouse Mobile Score: 65-75 (target)
- [ ] FCP (First Contentful Paint): < 2s
- [ ] LCP (Largest Contentful Paint): < 3.5s
- [ ] TBT (Total Blocking Time): < 800ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] Speed Index: < 3.5s

### Network Analysis
- [ ] No Firebase Auth iframe on homepage
- [ ] Google Analytics loads after page interactive
- [ ] Images are WebP or AVIF format
- [ ] CSS files are code-split
- [ ] JavaScript bundles are optimized
- [ ] API responses are cached

### Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Images display correctly
- [ ] Login/Signup buttons visible
- [ ] Auth routes work (/login, /signup, /dashboard)
- [ ] Admin panel accessible
- [ ] No console errors
- [ ] No broken links

---

## Troubleshooting

### Score Still 37?

**Check 1: Is Firebase Loading?**
```javascript
// Open DevTools Console on homepage
console.log('Firebase:', window.firebase)
// Should be undefined on homepage
```

**Check 2: Are Changes Deployed?**
```bash
# Check deployment timestamp
curl -I https://www.wtxnews.co.uk/ | grep -i date

# Check if new code is live
curl https://www.wtxnews.co.uk/ | grep -i "LazyAuthProvider"
```

**Check 3: Is CDN Cached?**
```bash
# Check cache headers
curl -I https://www.wtxnews.co.uk/ | grep -i cache-control

# If cached, purge and wait 5 minutes
```

**Check 4: Build Successful?**
```bash
# Check build output
npm run build 2>&1 | tee build.log

# Look for errors
grep -i error build.log
```

### Auth Not Working?

**Check 1: Auth Routes Have Provider**
- Verify `/login` has AuthProvider
- Verify `/signup` has AuthProvider
- Verify `/dashboard` has AuthProvider
- Check browser console for errors

**Check 2: Firebase Config**
```bash
# Check environment variables
cat .env.local | grep FIREBASE

# Verify all Firebase env vars are set
```

### Images Not Loading?

**Check 1: Image Domains**
```javascript
// In next.config.mjs
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'wtxnews.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    // Add all image domains
  ]
}
```

---

## Rollback Plan

If issues occur after deployment:

### Quick Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback
```bash
# Revert git changes
git log --oneline
git revert [commit-hash]

# Rebuild and redeploy
npm run build
vercel --prod
```

### Specific File Rollback
```bash
# Revert specific files
git checkout HEAD~1 -- src/app/layout.tsx
git checkout HEAD~1 -- src/components/Header/Header.tsx

# Rebuild
npm run build
```

---

## Success Criteria

### Minimum Requirements
- ✅ Lighthouse Mobile Score: 60+
- ✅ No Firebase on homepage
- ✅ Auth works on auth routes
- ✅ No console errors
- ✅ Images load correctly

### Optimal Results
- ✅ Lighthouse Mobile Score: 70+
- ✅ FCP < 1.8s
- ✅ LCP < 3.0s
- ✅ TBT < 600ms
- ✅ CLS < 0.05

---

## Next Steps After Deployment

1. **Monitor Performance**
   - Set up Google Analytics events
   - Monitor Core Web Vitals in Search Console
   - Track real user metrics

2. **Further Optimizations**
   - Implement service worker
   - Add more aggressive caching
   - Optimize database queries
   - Use CDN for static assets

3. **Regular Testing**
   - Run Lighthouse weekly
   - Monitor PageSpeed Insights
   - Check Core Web Vitals monthly
   - Test on real devices

---

## Support

If you encounter issues:

1. Check `WHY_SCORE_STILL_37.md` for detailed troubleshooting
2. Review `PERFORMANCE_OPTIMIZATION_SUMMARY.md` for what was changed
3. Check `PERFORMANCE_DIFFS.md` for exact code changes
4. Run diagnostics and share results

**Key Files to Check**:
- `src/app/layout.tsx` - Root layout (no AuthProvider)
- `src/app/(auth)/layout.tsx` - Auth routes layout (has AuthProvider)
- `src/app/dashboard/layout.tsx` - Dashboard layout (has AuthProvider)
- `src/components/Header/AuthButtonsWrapper.tsx` - Lazy-loaded auth buttons
- `next.config.mjs` - Next.js configuration
