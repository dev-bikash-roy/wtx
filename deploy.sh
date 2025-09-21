#!/bin/bash
# Deployment script for Vercel

# Build the project
npm run build

# The build output will be in the .next directory
# Vercel will automatically deploy this when connected

echo "Build completed successfully!"
echo "To deploy to Vercel:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Run: vercel --prod"