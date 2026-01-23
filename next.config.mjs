/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,

  // Ensure proper handling of static assets
  images: {
    minimumCacheTTL: 2678400 * 6, // 3 months
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
    ],
  },

  // Ensure proper handling of CSS and static assets
  experimental: {
    optimizeCss: true,
  },

  // External packages for server components
  serverExternalPackages: ['firebase-admin'],

  // Ensure proper asset handling
  assetPrefix: '',

  // Ensure proper trailing slash handling
  trailingSlash: false,

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

  // Headers for better caching and favicon handling
  async headers() {
    return [
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
    ]
  },
}

export default nextConfig