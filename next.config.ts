import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.suits-r-us.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.hindustantimes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;