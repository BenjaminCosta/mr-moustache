import type { Review } from "@/types";

// TODO: Add only verified customer reviews with permission and source details.
export const reviews = [
  {
    id: "review-placeholder-1",
    quote: "Verified customer review to be added.",
    author: "Customer name [Placeholder]",
    source: "Review source TBC",
    isPlaceholder: true,
  },
  {
    id: "review-placeholder-2",
    quote: "Verified customer review to be added.",
    author: "Customer name [Placeholder]",
    source: "Review source TBC",
    isPlaceholder: true,
  },
  {
    id: "review-placeholder-3",
    quote: "Verified customer review to be added.",
    author: "Customer name [Placeholder]",
    source: "Review source TBC",
    isPlaceholder: true,
  },
] satisfies Review[];
