import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Note: 'eslint.ignoreDuringBuilds' removed because NextConfig type disallows it in this project setup.
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
