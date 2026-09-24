import type { NextConfig } from "next";

// Files in public/ keep stable names, so a week of caching (then revalidating
// in the background) avoids re-requests without pinning them forever.
const publicAssetCache = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  images: {
    // AVIF first for browsers that support it, WebP as the fallback.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return ["/images/:path*", "/videos/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: publicAssetCache }],
    }));
  },
};

export default nextConfig;
