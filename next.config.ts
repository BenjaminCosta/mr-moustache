import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first for browsers that support it, WebP as the fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
