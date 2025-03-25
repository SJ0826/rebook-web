import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rebook-assets.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/upload/book/**',
      },
      {
        protocol: 'https',
        hostname: 'd3p7m99awv6l0x.cloudfront.net',
        port: '',
        pathname: '/upload/book/**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
