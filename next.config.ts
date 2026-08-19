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

  /**
   * Defense-in-depth security headers applied to every response.
   * These are the baseline a production web app should ship; the
   * site currently has none.
   *
   * - HSTS: 1 year, includeSubDomains, preload-ready
   * - X-Content-Type-Options: blocks MIME-sniffing exploits
   * - X-Frame-Options: DENY (clickjacking)
   * - Referrer-Policy: strict-origin-when-cross-origin (privacy)
   * - Permissions-Policy: deny sensors we don't use
   * - Cross-Origin-Opener-Policy: same-origin (Spectre mitigation)
   * - X-DNS-Prefetch-Control: off
   */
  async headers() {
    const securityHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "X-DNS-Prefetch-Control", value: "off" },
    ];

    return [
      {
        // Apply the security baseline to every route, including API routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
