import type { Service } from "@/types";

// Mirrors the Square service list (same order). squareId comes from each
// service's Square Appointments link and is shared by both shops. Every
// service is a 30-minute appointment in Square, so no per-service duration.
export const services = [
  {
    id: "standard-haircut",
    squareId: "JF6DCGI7P2SRJ26CI65DYCFU",
    name: "Standard Haircut",
    description: "(From comb #1)",
    price: "A$45",
  },
  {
    id: "zero-fade",
    squareId: "TH73T5TV2G7X3KS4RFDDNEB7",
    name: "Zero Fade",
    description: "From 0.5 guard fades, burst fades,\ntaper fades, mullets.",
    price: "A$50",
  },
  {
    id: "skin-fade",
    squareId: "D5UEM7WHJYPBVSSOYMIW2AWW",
    name: "Skin Fade",
    description: "Clean fade from skin to your\nchosen length on top.",
    price: "A$55",
  },
  {
    id: "haircut-beard",
    squareId: "446YG2HFHU6TY47CJPZ7BWV2",
    name: "Haircut & Beard",
    description: "Cut, beard trim and line up.",
    price: null,
  },
  {
    id: "beard-trim-line-up",
    squareId: "FQG4PDPYN2ITBXPUDYXKZ4FQ",
    name: "Beard Trim & Line Up",
    description: "Beard is charged $30 with a haircut.",
    price: "A$35",
  },
  {
    id: "all-scissor-freestyle",
    squareId: "NKF64K7LDJ52IUPXTXMMNK3Q",
    name: "All Scissor / Freestyle",
    description: "Scissors all over, no clippers.",
    price: "A$60",
  },
  {
    id: "buzz-cut",
    squareId: "3SFRSK7TUL4UVKL3TGN53GAV",
    name: "Buzz Cut",
    description: "Same guard all over the head.",
    price: "A$35",
  },
  {
    id: "kids-seniors",
    squareId: "BEVHDMK6IJK5OND4CBZ4UKGL",
    name: "Kids / Seniors",
    description: "Excludes zero and skin fades.",
    price: "A$40",
  },
] satisfies Service[];
