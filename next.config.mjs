/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
}

export default nextConfig
