# Quick Test Guide - Desktop Performance

## 🚀 Production Server Running

**Status**: ✅ Running on port 3002
**URL**: http://localhost:3002

---

## ⚡ Quick Test (5 Minutes)

### 1. Open Site
```
http://localhost:3002
```

### 2. Open Chrome DevTools
Press `F12` or right-click → Inspect

### 3. Run Lighthouse Desktop Audit

**Steps**:
1. Click "Lighthouse" tab in DevTools
2. Select "Desktop" mode
3. Check "Performance" category only (faster)
4. Click "Analyze page load"
5. Wait 30-60 seconds

**Expected Results**:
- Performance Score: 70-80 (target: 70+)
- ✅ Properly defines charset: Pass
- ✅ Properly size images: <30 KiB savings (was 114 KiB)
- ✅ Reduce JavaScript execution time: ~1.2-1.5s (was 2.6s)

---

## 🔍 Quick Verification

### Check 1: Charset (10 seconds)
1. Right-click on page → "View Page Source"
2. Look at the `<head>` section
3. **Expected**: `<meta charset="utf-8">` should be the FIRST meta tag

```html
<head>
  <meta charset="utf-8">  <!-- ✅ Should be here first! -->
  <meta name="viewport" ...>
  ...
</head>
```

### Check 2: Images (30 seconds)
1. Open DevTools → Network tab
2. Filter by "Img"
3. Reload page (Ctrl+R)
4. Click on any card image
5. Look at the URL

**Expected**:
```
/_next/image?url=...&w=384&q=70&fm=avif
                    ^^^    ^^    ^^^^
                    384px  70%   AVIF format
```

**NOT** (old):
```
/_next/image?url=...&w=640&q=85&fm=webp
                    ^^^    ^^
                    640px  85% (too large!)
```

### Check 3: JavaScript (30 seconds)
1. Network tab → Filter by "JS"
2. Reload page
3. Sort by "Time" (click Time column)
4. **Expected**: Google Analytics should load LAST (not first)
5. **Expected**: ReactPlayer should NOT load on homepage

---

## 📊 Score Comparison

### Before (Previous Tests):
- Desktop Score: 45-55
- Mobile Score: 60-70 (was fine)

### After (Expected Now):
- Desktop Score: 70-80 ✅
- Mobile Score: 60-70 (unchanged)

### If Score is 60-69:
- Still good improvement (15-20 points)
- May need to remove duplicate GA script
- Check for other third-party scripts

### If Score is Still <60:
- Check troubleshooting in PRODUCTION_BUILD_READY.md
- Verify all optimizations applied
- Test in incognito mode (no extensions)

---

## 🎯 Key Metrics to Check

### Performance Tab in Lighthouse:

**1. First Contentful Paint (FCP)**
- Before: ~3.5s
- Target: <1.8s

**2. Largest Contentful Paint (LCP)**
- Before: ~8.2s
- Target: <3.5s

**3. Total Blocking Time (TBT)**
- Before: High
- Target: <300ms

**4. Cumulative Layout Shift (CLS)**
- Should be: <0.1

**5. Speed Index**
- Before: ~6s
- Target: <3s

---

## ✅ Success Checklist

After running Lighthouse, verify:

- [ ] Performance Score: 70+ (desktop)
- [ ] "Properly defines charset" audit: ✅ Pass
- [ ] "Properly size images" savings: <30 KiB
- [ ] "Reduce JavaScript execution time": ~1.2-1.5s
- [ ] No console errors
- [ ] Site looks normal (no broken layouts)
- [ ] Images load correctly
- [ ] Navigation works

---

## 🚨 If Something Looks Wrong

### Site Looks Broken:
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Test in incognito mode

### Images Not Loading:
1. Check console for errors
2. Verify image hostnames in next.config.mjs
3. Check Network tab for 404 errors

### Score Still Low:
1. Test in incognito (no extensions)
2. Close other tabs
3. Ensure good internet connection
4. Try different time of day

---

## 📱 Mobile Test (Optional)

If you want to verify mobile score is still good:

1. Lighthouse tab
2. Select "Mobile" mode
3. Run audit
4. **Expected**: Score 60-70 (unchanged)

---

## 🎉 What to Do After Testing

### If Score is 70+:
1. ✅ Success! Optimizations working
2. Deploy to production
3. Test production URL with PageSpeed Insights
4. Monitor performance over time

### If Score is 60-69:
1. Good improvement, but can be better
2. Check for duplicate GA scripts
3. Consider removing third-party scripts
4. Deploy and test in production

### If Score is <60:
1. Check PRODUCTION_BUILD_READY.md troubleshooting
2. Verify all files saved correctly
3. Rebuild: `npm run build`
4. Test again

---

## 🔗 Next Steps

1. **Test locally** (you are here)
2. **Deploy to production** (see PRODUCTION_BUILD_READY.md)
3. **Test production** with PageSpeed Insights
4. **Monitor** performance over time

---

## 📞 Quick Reference

**Production Server**: http://localhost:3002
**Build Command**: `npm run build`
**Start Command**: `npm start`
**Port**: 3002

**Documentation**:
- PRODUCTION_BUILD_READY.md - Full details
- CHARSET_FIX_COMPLETE.md - Charset implementation
- IMAGE_OPTIMIZATION_COMPLETE.md - Image optimization

---

## ⏱️ Time Estimate

- Quick test: 5 minutes
- Full verification: 10 minutes
- Troubleshooting (if needed): 15-30 minutes

**Total**: 5-45 minutes depending on results

---

## 🎯 Bottom Line

**What we did**:
- Fixed charset error
- Optimized images (114 KiB → <30 KiB)
- Optimized JavaScript (2.6s → ~1.2-1.5s)
- Fixed all build errors

**Expected result**:
- Desktop score: 70-80 (up from 45-55)
- All Lighthouse audits passing
- Site loads faster
- No broken functionality

**Test now**: http://localhost:3002
