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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: brandImages.map((path) => `${SITE_URL}${path}`),
    },
    ...locations.map((location) => ({
      url: `${SITE_URL}${locationPath(location.id)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [`${SITE_URL}${location.image.src}`],
    })),
  ];
}
