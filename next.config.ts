import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ekrandagi Next.js "N" belgisi telefonda pastki menyuni to'sib qo'yadi
  devIndicators: false,
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
