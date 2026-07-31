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
          // Disabled deliberately: the legacy auditor is itself exploitable and
          // is superseded by the CSP below. "0" is the recommended value.
          { key: "X-XSS-Protection", value: "0" },
          // Only serve over HTTPS in production (1 year)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Content Security Policy — the containment layer that was missing.
          // 'unsafe-inline'/'unsafe-eval' on script-src are required by Next's
          // dev overlay and inline bootstrap; tighten to a nonce-based policy if
          // you later move script injection behind middleware.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com",
              "font-src 'self' data:",
              // API + websocket origins the app legitimately talks to
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""} ws: wss:`.trim(),
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
