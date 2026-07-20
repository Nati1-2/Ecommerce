import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '../../../.next-cache-ecommerce',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
