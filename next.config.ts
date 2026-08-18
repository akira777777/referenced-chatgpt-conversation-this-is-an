import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Vercel deployments
  output: "standalone",

  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
