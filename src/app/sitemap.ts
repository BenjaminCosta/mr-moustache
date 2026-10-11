import type { MetadataRoute } from "next";
import { locationPath, locations } from "@/data/locations";
import { backgrounds } from "@/data/media";
import { LOCALES, localePath } from "@/i18n/locales";
import { SITE_URL } from "@/lib/constants";
import { languageAlternates } from "@/lib/seo";

// Real photos of the shops and the team (decorative textures are left out).
const brandImages = [
  "/images/branding/mr-moustache-barbershop-logo-tee.jpg",
  backgrounds.hero,
  backgrounds.workWithUs,
].filter((path): path is string => Boolean(path));

const absolute = (path: string) => `${SITE_URL}${path}`;

/** Every language of a page, each listing the others (hreflang in the sitemap). */
function pageEntries(path: string, priority: number, images: string[]): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([language, href]) => [language, absolute(href)]),
  );

  return LOCALES.map((locale) => ({
    url: absolute(localePath(locale, path)),
    changeFrequency: "monthly" as const,
    // The English pages are the ones each Google Business Profile links to.
    priority: locale === "en" ? priority : priority - 0.1,
    images: images.map((image) => `${SITE_URL}${image}`),
    alternates: { languages },
  }));
}

// No lastModified: stamping every page with the build time on each deploy tells
// search engines everything changed when it did not.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pageEntries("/", 1, brandImages),
    ...locations.flatMap((location) =>
      pageEntries(locationPath(location.id), 0.9, [location.image.src]),
    ),
  ];
}
