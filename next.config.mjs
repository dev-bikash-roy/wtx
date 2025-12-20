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
    ],
  },

  // Ensure proper handling of CSS and static assets
  experimental: {
    optimizeCss: true,
  },

  // Ensure proper asset handling
  assetPrefix: '',

  // Ensure proper trailing slash handling
  trailingSlash: false,
}

export default nextConfig