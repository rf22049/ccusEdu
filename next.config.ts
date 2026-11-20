import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/belajar-ccs",
        destination: "/belajar-ccus",
        permanent: true,
      },
      {
        source: "/belajar-ccs/:slug([a-z0-9-]+)",
        destination: "/belajar-ccus/:slug",
        permanent: true,
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
