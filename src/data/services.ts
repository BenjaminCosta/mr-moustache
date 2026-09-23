import type { Service } from "@/types";

// TODO: Replace with the confirmed Square service list, durations and prices.
export const services = [
  {
    id: "service-placeholder-1",
    name: "Service name [Placeholder]",
    description: "Service description to be confirmed.",
    price: "Price TBC",
    duration: "Duration TBC",
    isPlaceholder: true,
  },
  {
    id: "service-placeholder-2",
    name: "Service name [Placeholder]",
    description: "Service description to be confirmed.",
    price: "Price TBC",
    duration: "Duration TBC",
    isPlaceholder: true,
  },
  {
    id: "service-placeholder-3",
    name: "Service name [Placeholder]",
    description: "Service description to be confirmed.",
    price: "Price TBC",
    duration: "Duration TBC",
    isPlaceholder: true,
  },
] satisfies Service[];
