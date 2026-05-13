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
    ],
  },
};

module.exports = nextConfig;
