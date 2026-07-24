import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Build Optimization ──────────────────────────────────────
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Output: standalone reduces Vercel function size by ~80% ──
  output: "standalone",
  outputFileTracingRoot: __dirname,

  // ── Performance ─────────────────────────────────────────────
  productionBrowserSourceMaps: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── Memory: limit CPU & workers for Vercel's 1GB RAM ────────
  experimental: {
    cpus: 1,
    workerThreads: false,
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

  // ── Server-only packages: exclude from client bundle ────────
  serverExternalPackages: ["mongoose", "bcryptjs", "jsonwebtoken"],

  // ── Webpack: reduce bundle size & memory ────────────────────
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

    // Optimize chunk splitting to reduce memory during build
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            recharts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              name: "recharts",
              chunks: "all",
              priority: 30,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 30,
            },
            stripe: {
              test: /[\\/]node_modules[\\/]@stripe[\\/]/,
              name: "stripe",
              chunks: "all",
              priority: 20,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
