import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { distDir: '../../../.next-cache-ecommerce' }),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
