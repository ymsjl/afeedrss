/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.inoreader.com', 'do-cdn.appinn.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/inoreader/:path*',
        destination: `${process.env.INOREADER_SERVER_URL}/:path*`,
      }]
  }
}

module.exports = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'all-cache',
        expiration: {
          maxAgeSeconds: 60 * 20, // 20分钟
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxAgeSeconds: 60 * 20, // 20分钟
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ]
})(nextConfig);
