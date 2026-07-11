import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // /llms/claude-header.txt → /llms/claude-header
      { source: "/llms/:name.txt", destination: "/llms/:name" },
    ];
  },
};

export default nextConfig;
