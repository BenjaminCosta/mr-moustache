import type { WorkVideo } from "@/types";

/**
 * Background photography slots. Drop the approved files into
 * `public/images/backgrounds` and set the path here; sections fall back to
 * a dark gradient while a slot is `null`.
 */
export const backgrounds = {
  hero: "/images/backgrounds/hero.webp" as string | null,
  services: "/images/backgrounds/services.webp" as string | null,
  // Palm silhouettes exported with transparency so they sit on the palette white.
  location: "/images/backgrounds/location-palms.webp" as string | null,
  locationFeature: "/images/backgrounds/location-broadbeach.webp" as string | null,
  footer: "/images/backgrounds/footer.webp" as string | null,
};

export const workVideo = {
  src: "/videos/our-work.mp4",
  poster: "/images/backgrounds/our-work-poster.jpg",
} satisfies WorkVideo;
