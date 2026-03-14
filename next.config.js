/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.7.42',
        port: '4004',
        pathname: '/public/storage/**',
      },
    ],
  },
};

module.exports = nextConfig;
