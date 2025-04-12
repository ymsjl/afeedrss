const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'https-calls',
        networkTimeoutSeconds: 15,
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 60 * 20 // 20分钟
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.inoreader.com'],
  },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/inoreader/:path*',
        destination: `${process.env.INOREADER_SERVER_URL}/:path*`,
      }
    ];
  }
};

module.exports = withPWA(nextConfig);