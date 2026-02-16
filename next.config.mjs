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
    // Reduce client-side JavaScript
    optimizeServerReact: true,
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
  
  // Webpack optimization for smaller bundles
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Optimize images
  images: {
    minimumCacheTTL: 2678400 * 6, // 6 months
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'e3.365dm.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wtxnews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wtx-news.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.espncdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.motorsport.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'metro.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-3.motorsport.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-4.motorsport.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.wtxnews.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.guim.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets1.cbsnewsstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets3.cbsnewsstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.unitedinfocus.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.heraldscotland.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.heraldscotland.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'beautiful-jemison.213-165-92-225.plesk.page',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.irishexaminer.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.bbc.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bbc.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.euronews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.euronews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.euronews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.independent.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.telegraph.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.standard.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thesun.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.dailymail.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mirror.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wtxnews.co.uk',
        pathname: '/**',
      },
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
        source: '/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
          {
            key: 'Link',
            value: '<https://www.googletagmanager.com>; rel=preconnect, <https://wtxnews.com>; rel=preconnect',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
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