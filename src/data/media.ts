import type { WorkVideo } from "@/types";

/**
 * Background photography slots. Drop the approved files into
 * `public/images/backgrounds` and set the path here; sections fall back to
 * a dark gradient while a slot is `null`.
 */
export const backgrounds = {
  hero: null as string | null,
  services: null as string | null,
  location: null as string | null,
  locationFeature: null as string | null,
  footer: null as string | null,
};

// TODO: Add the approved "cut in progress" clip and poster frame.
export const workVideo = {
  src: null,
  poster: null,
  title: "Cut in progress",
  location: "Broadbeach",
  duration: "0:28",
} satisfies WorkVideo;
