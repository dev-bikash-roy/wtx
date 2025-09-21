# Ncmaz Next.js template

To run the Ncmaz demo, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Deployment to Vercel

To deploy to Vercel and ensure styles work correctly:

1. Make sure you have the following configuration files:
   - `tailwind.config.ts`
   - `postcss.config.mjs`
   - `vercel.json`

2. Ensure your `package.json` has the correct build scripts:
   ```json
   "scripts": {
     "dev": "next dev --turbopack",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
   ```

3. When deploying to Vercel:
   - Connect your Git repository
   - Vercel should automatically detect the Next.js framework
   - Make sure the build command is set to `next build`
   - The output directory should be `.next`

4. If you're still experiencing missing styles after deployment:
   - Check the build logs in Vercel for any CSS-related errors
   - Ensure all CSS files are properly imported in your layout files
   - Verify that Tailwind CSS classes are being generated correctly

## Troubleshooting

If styles are missing after deployment:

1. Check that `tailwind.config.ts` exists and is properly configured
2. Verify that `@import 'tailwindcss';` is at the top of your main CSS file
3. Ensure all CSS files are imported in your root layout
4. Check Vercel build logs for any CSS processing errors

### "Unexpected token '<'" JavaScript Errors

If you see "Uncaught SyntaxError: Unexpected token '<'" errors in the browser console:

1. This happens when JavaScript files are being served as HTML instead of actual JavaScript
2. The issue is typically caused by incorrect routing configuration in `vercel.json`
3. Ensure your `vercel.json` doesn't have conflicting routes that intercept static asset requests
4. The proper `vercel.json` should look like:
   ```json
   {
     "version": 2
   }
   ```
5. If the issue persists:
   - Check if you have any custom middleware that might interfere with static assets
   - Ensure there are no rewrites or redirects that catch JS file requests
   - Add a middleware.ts file to exclude static assets from middleware processing

### Dependency and Build Warnings

If you see warnings during the build process:

1. **Vercel build settings warning**: 
   - This occurs when `builds` property exists in `vercel.json`
   - Solution: Use minimal `vercel.json` configuration to let Vercel auto-detect settings

2. **ESLint deprecation warnings**:
   - Update eslint to version ^8.57.0 or newer
   - This is resolved in the package.json

3. **Peer dependency conflicts**:
   - These are typically resolved automatically by npm
   - They don't affect the functionality of your application

4. **Deprecated packages**:
   - Some nested dependencies may use deprecated packages
   - These warnings don't affect your application's functionality
   - They will be resolved as dependencies update over time