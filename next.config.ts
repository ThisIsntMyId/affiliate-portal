import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '7mb'
    }
  },
  images: {
    remotePatterns: [new URL('http://localhost:3030/**'), new URL('https://images.pexels.com/**')],
  },
};

export default nextConfig;
