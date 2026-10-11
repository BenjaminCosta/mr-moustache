import { locations } from "@/data/locations";

// Values stay in English (they are what the shop reads in the email); the form
// shows them in the page's language from the dictionary, in the same order.
export const EXPERIENCE_OPTIONS = [
  "Apprentice / under 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
] as const;

export const LOCATION_OPTIONS = [
  ...locations.map((location) => location.name),
  "Either location",
];

export type ApplicationField = "name" | "email" | "experience" | "location" | "message";
