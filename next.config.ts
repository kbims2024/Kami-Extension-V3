import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppression de output: 'export' pour permettre le fonctionnement des API sur Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
