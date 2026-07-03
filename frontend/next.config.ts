import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  devIndicators: false,

  // V-10 FIX: Add HTTP security headers to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents this site from being embedded in iframes (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevents browsers from guessing file types (MIME sniffing protection)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controls how much referrer info is sent with requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restricts access to sensitive browser APIs
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          // Legacy XSS filter for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Only serve over HTTPS in production (1 year)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
