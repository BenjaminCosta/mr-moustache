import type { Barber } from "@/types";

// TODO: Replace with confirmed barber names, roles, bios and portrait files.
export const barbers = [
  {
    id: "barber-placeholder-1",
    name: "Barber name [Placeholder]",
    role: "Role to be confirmed",
    bio: "Short barber bio to be supplied.",
    image: "/images/barbers/barber-placeholder.svg",
    imageAlt: "Placeholder for a Broadbeach barber portrait",
    isPlaceholder: true,
  },
  {
    id: "barber-placeholder-2",
    name: "Barber name [Placeholder]",
    role: "Role to be confirmed",
    bio: "Short barber bio to be supplied.",
    image: "/images/barbers/barber-placeholder.svg",
    imageAlt: "Placeholder for a Broadbeach barber portrait",
    isPlaceholder: true,
  },
] satisfies Barber[];
