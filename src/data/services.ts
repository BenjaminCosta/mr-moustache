import type { Service } from "@/types";

// TODO: Keep in sync with the Square service list for Broadbeach.
export const services = [
  {
    id: "standard-haircut",
    name: "Standard Haircut",
    description: "(From comb #1)",
    price: "A$45",
    duration: "30 min",
  },
  {
    id: "zero-fade",
    name: "Zero Fade",
    description: "From 0.5 guard fades, burst fades,\ntaper fades, mullets.",
    price: "A$50",
    duration: "45 min",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    description: "Clean fade from skin to your\nchosen length on top.",
    price: "A$55",
    duration: "45 min",
  },
  {
    id: "beard-trim-line-up",
    name: "Beard Trim & Line Up",
    description: "Beard is charged $30 with a haircut.",
    price: "A$35",
    duration: "20 min",
  },
  {
    id: "haircut-beard",
    name: "Haircut & Beard",
    description: "Cut, beard trim and line up.",
    price: null,
    duration: null,
  },
] satisfies Service[];
