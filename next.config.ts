import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Allows the Cloudflare Quick Tunnel (used for real-phone testing —
  // see PROJECT-SUMMARY.md) to load the dev server's JS chunks/HMR
  // socket. Without this, Next.js's dev-mode CORS protection silently
  // blocks those requests from any non-localhost origin — the page's
  // initial HTML still loads, but React never hydrates, so every
  // client-interactive piece (Product card gallery arrows, card-flip)
  // silently does nothing and anything relying on client state renders
  // blank. Found 27 Aug 2026 after three separate attempts to fix the
  // card-flip/gallery-arrow bug in ProductCategoryCard.tsx's own code
  // failed to help — the component was never the problem; testing
  // through the tunnel was never actually exercising real JS at all.
  // Wildcarded to `*.trycloudflare.com` since quick tunnels get a new
  // random subdomain every time one is started, not a fixed host.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
