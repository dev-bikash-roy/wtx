/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds for faster compilation
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable source maps for better debugging
  productionBrowserSourceMaps: false,

  // External packages for server components
  serverExternalPackages: ['firebase-admin'],

  // Ensure proper asset handling
  assetPrefix: '',

  // Ensure proper trailing slash handling
  trailingSlash: false,

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Optimize bundle
  compress: true,

  // Ensure proper handling of CSS and static assets
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@headlessui/react', 'framer-motion', 'lodash'],
  },
  
  // Reduce JavaScript bundle size
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },

  // Optimize images
  images: {
    minimumCacheTTL: 2678400 * 6, // 6 months
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // News posts embed images from arbitrary publisher domains. Enumerating each
    // host one-by-one is fragile — a single un-listed host (e.g. a missing
    // "assets2.cbsnewsstatic.com") throws and 500s the whole page. Allow any
    // remote host so new sources never break rendering.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  async redirects() {
    return [
      {
        source: '/post/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/news/:slug*',
        destination: '/post/:slug*',
      },
    ]
  },

  // Headers for optimization and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '<https://www.googletagmanager.com>; rel=preconnect, <https://wtxnews.com>; rel=preconnect',
          },
          // CSP removed - Google Ad Manager requires many dynamic domains
          // that cannot be fully enumerated in a static CSP header.
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/apple-icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig