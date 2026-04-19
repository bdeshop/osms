import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  // Static export for cPanel hosting
  output: "export",
  distDir: "out",
  // Enable trailing slash for proper directory structure
  trailingSlash: true,
};

export default nextConfig;
