import type { GoogleRating, Review } from "@/types";

export const googleRatings = [
  {
    id: "broadbeach",
    location: "Broadbeach",
    rating: 5.0,
    reviewCount: 33,
    href: "https://www.google.com/maps/search/?api=1&query=Mr.+Moustache+Barbershop+Broadbeach+Unit+5%2F2623+Gold+Coast+Hwy",
  },
  {
    id: "surfers-paradise",
    location: "Surfers Paradise",
    rating: 4.9,
    reviewCount: 226,
    href: "https://www.google.com/maps/search/?api=1&query=Mr.+Moustache+Barbershop+Surfers+Paradise&query_place_id=ChIJMUVO7fEFkWsRsYBHrfV0y7Y",
  },
] satisfies GoogleRating[];

/**
 * Verified Google reviews, copied word for word from the Google Business
 * profiles (with the reviewer's first name and last initial).
 * TODO: Add the real reviews here; the carousel only renders what is listed.
 */
export const reviews: Review[] = [];

/**
 * Layout samples from the design mockup. They are NOT real reviews, so they
 * only render in local development and never in a production build.
 */
export const sampleReviews: Review[] = [
  {
    id: "sample-1",
    author: "Jamie L.",
    avatarColor: "#1e6b4f",
    rating: 5,
    text: "Best barbers on the Gold Coast. Always consistent, great vibes and proper attention to detail.",
    when: "2 weeks ago",
    location: "Surfers Paradise",
  },
  {
    id: "sample-2",
    author: "Matt R.",
    avatarColor: "#48577f",
    rating: 5,
    text: "Been coming for years in Surfers and stoked to have you in Broadbeach now. Same high standard every time.",
    when: "3 weeks ago",
    location: "Broadbeach",
  },
  {
    id: "sample-3",
    author: "Sarah T.",
    avatarColor: "#6a4638",
    rating: 5,
    text: "My partner always looks sharp after a cut here. Friendly crew, clean shop and consistently top quality.",
    when: "1 month ago",
    location: "Surfers Paradise",
  },
];

// In development the three samples repeat so the carousel shows three pages,
// as in the mockup.
export const displayedReviews =
  reviews.length > 0
    ? reviews
    : process.env.NODE_ENV === "development"
      ? [0, 1, 2].flatMap((round) =>
          sampleReviews.map((review) => ({ ...review, id: `${review.id}-${round}` })),
        )
      : [];
