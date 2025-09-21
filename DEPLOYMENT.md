# Deployment Instructions

## Prerequisites
1. Make sure you have Node.js installed
2. Install Vercel CLI globally:
   ```
   npm install -g vercel
   ```

## Deployment Steps

### Option 1: Automated Deployment (Recommended)
1. Run the deployment script:
   ```
   deploy-production.bat
   ```
2. After the build completes, manually run:
   ```
   vercel --prod
   ```

### Option 2: Manual Deployment
1. Build the project:
   ```
   npm run build
   ```

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

## First-time Setup
If this is your first time deploying to Vercel:
1. Run `vercel` (without --prod) to link your project
2. Follow the prompts to set up your project
3. For subsequent deployments, use `vercel --prod`

## Environment Variables
Make sure to set any required environment variables in your Vercel project settings.

## Custom Domain
To use a custom domain:
1. Add your domain in Vercel project settings
2. Configure DNS records as instructed by Vercel