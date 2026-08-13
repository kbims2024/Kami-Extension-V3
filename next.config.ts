import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Correction pour Recharts
  transpilePackages: ['recharts'],
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
