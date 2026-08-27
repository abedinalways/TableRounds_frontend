// Next.js config — consolidated image remotePatterns
// next.config.ts takes precedence over next.config.js in Next.js 15+/16,
// so this is the single source of truth (next.config.js has been removed).

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.7.42',
        port: '4001',
        pathname: '/public/storage/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.7.42',
        port: '4004',
        pathname: '/public/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.tablerounds.ai',
        pathname: '/public/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/public/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'tablerounds.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'virtual-remarks-parking-grass.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
