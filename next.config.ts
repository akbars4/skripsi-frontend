import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['images.igdb.com'], // ✅ ini yang penting
  },
};

export default nextConfig;
