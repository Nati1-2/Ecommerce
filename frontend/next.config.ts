import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── File Tracing Root Scope for Monorepo & Vercel ───────────
  outputFileTracingRoot: path.join(__dirname),

  // ── Build & Linting Settings ───────────────────────────────
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Performance & Optimizations ────────────────────────────
  productionBrowserSourceMaps: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── Package Imports Optimization ───────────────────────────
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion", "date-fns"],
  },

  // ── Images ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // ── Webpack Fallbacks ──────────────────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
