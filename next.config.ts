import type { NextConfig } from "next";
import { SECURITY_HEADER_RULES } from "./lib/security-headers.ts";

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

  /**
   * Defense-in-depth security headers applied to every response.
   *
   * The full set is defined in lib/security-headers.ts so it can be shared
   * with the Cloudflare worker (which re-applies them at the edge in case
   * the app router's RSC streaming path bypasses this rule). See the JSDoc
   * in that file for the rationale and the per-header choices.
   */
  async headers() {
    return SECURITY_HEADER_RULES;
  },
};

export default nextConfig;
