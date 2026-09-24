import type { WorkVideo } from "@/types";

/**
 * Background photography slots. Drop the approved files into
 * `public/images/backgrounds` and set the path here; sections fall back to
 * a dark gradient while a slot is `null`.
 */
export const backgrounds = {
  hero: "/images/backgrounds/mr-moustache-broadbeach-barber-haircut.webp" as string | null,
  services: "/images/backgrounds/barber-scissors-clippers-comb.webp" as string | null,
  // Palm silhouettes exported with transparency so they sit on the palette white.
  location: "/images/backgrounds/palm-tree-silhouettes.webp" as string | null,
  locationFeature: "/images/backgrounds/broadbeach-gold-coast-aerial.webp" as string | null,
  footer: "/images/backgrounds/gold-coast-beach-night.webp" as string | null,
  reputation: "/images/backgrounds/barber-scissors-towel.webp" as string | null,
};

export const workVideo = {
  src: "/videos/mr-moustache-fade-haircut.mp4",
  label: "Fade haircut by a Mr Moustache barber",
  poster: "/images/backgrounds/mr-moustache-fade-haircut-poster.webp",
} satisfies WorkVideo;
