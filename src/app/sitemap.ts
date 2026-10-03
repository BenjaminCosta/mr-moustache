import type { MetadataRoute } from "next";
import { locationPath, locations } from "@/data/locations";
import { backgrounds } from "@/data/media";
import { SITE_URL } from "@/lib/constants";

// Real photos of the shops and the team (decorative textures are left out).
const brandImages = [
  "/opengraph-image.jpg",
  backgrounds.hero,
  backgrounds.workWithUs,
].filter((path): path is string => Boolean(path));

// No lastModified: stamping every page with the build time on each deploy tells
// search engines everything changed when it did not.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
      images: brandImages.map((path) => `${SITE_URL}${path}`),
    },
    ...locations.map((location) => ({
      url: `${SITE_URL}${locationPath(location.id)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [`${SITE_URL}${location.image.src}`],
    })),
  ];
}
