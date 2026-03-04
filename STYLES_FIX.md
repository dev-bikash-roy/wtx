# Styles Not Loading - Fix

## Issue
After clearing `.next` cache, styles (Tailwind CSS) are not loading, showing unstyled content.

## Cause
When `.next` build cache is cleared, the dev server needs a complete restart to rebuild CSS.

## Solution

### Option 1: Use the restart script (Recommended)
```bash
.\restart-dev.bat
```

This script will:
1. Stop all Node processes
2. Clean `.next` cache
3. Start dev server fresh

### Option 2: Manual restart
```bash
# Stop the dev server (Ctrl+C)
# Then run:
npm run dev
```

### Option 3: Hard refresh browser
After server restarts:
1. Open browser DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

Or use keyboard shortcut:
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

## Prevention

To avoid this issue in the future:
1. Don't manually delete `.next` folder while dev server is running
2. If you need to clear cache, stop server first, then delete, then restart
3. Use `npm run dev` fresh start instead of clearing cache

## Verification

After restart, check:
- [ ] Tailwind styles loading
- [ ] Custom CSS loading
- [ ] Fonts loading correctly
- [ ] Images displaying
- [ ] Components rendering with styles

## Current Status

✅ Dev server restarted
✅ `.next` cache cleared
✅ Styles should load on next page refresh

## Next Steps

1. Wait for dev server to finish compiling (watch terminal)
2. Refresh browser (hard refresh recommended)
3. Styles should be back to normal

If styles still don't load:
1. Check browser console for errors
2. Verify `tailwind.config.ts` exists
3. Verify `src/styles/tailwind.css` exists
4. Check `src/app/layout.tsx` imports styles correctly
