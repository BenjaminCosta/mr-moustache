import { GOOGLE_MAPS_URL_BROADBEACH, GOOGLE_MAPS_URL_SURFERS_PARADISE } from "@/lib/constants";
import type { GoogleRating, Review } from "@/types";

// Google rating per shop. reviewCount is a floor (shown as "60+"), so it stays
// true as new reviews come in; raise it now and then.
export const googleRatings = [
  {
    id: "broadbeach",
    location: "Broadbeach",
    rating: 5.0,
    reviewCount: 60,
    href: GOOGLE_MAPS_URL_BROADBEACH,
  },
  {
    id: "surfers-paradise",
    location: "Surfers Paradise",
    rating: 4.9,
    reviewCount: 226,
    href: GOOGLE_MAPS_URL_SURFERS_PARADISE,
  },
] satisfies GoogleRating[];

/**
 * Short excerpts from verified public Google reviews, checked 23 September
 * 2026 against each location's Google Business Profile. `publishedAt` is the
 * day Google dated each review; the cards turn it into "2 weeks ago" etc.
 */
export const reviews: Review[] = [
  {
    id: "broadbeach-daniel-millward",
    author: "Daniel Millward",
    avatarColor: "#1769aa",
    rating: 5,
    text: "Aitor is a fantastic barber and runs a great operation! Highly recommend this spot!",
    publishedAt: "2026-09-22",
    location: "Broadbeach",
  },
  {
    id: "broadbeach-rueben-tauk",
    author: "Rueben Tauk",
    avatarColor: "#7444a8",
    rating: 5,
    text: "Great haircut. Will be back",
    publishedAt: "2026-09-22",
    location: "Broadbeach",
  },
  {
    id: "broadbeach-inaki-garcia-fernandez",
    author: "Iñaki García Fernández",
    avatarColor: "#a0445f",
    rating: 5,
    text: "Perfect, 10/10 experience",
    publishedAt: "2026-09-21",
    location: "Broadbeach",
  },
  {
    id: "surfers-jose-daniel-suarez-ferro",
    author: "Jose Daniel Suarez Ferro",
    avatarColor: "#1e6b4f",
    rating: 5,
    text: "Definitely one of the best barbershops around!",
    publishedAt: "2026-04-23",
    location: "Surfers Paradise",
  },
  {
    id: "surfers-jose-dias-serpa",
    author: "Jose Dias Serpa",
    avatarColor: "#48577f",
    rating: 5,
    text: "Professional, friendly and very attentive to detail.",
    publishedAt: "2026-08-23",
    location: "Surfers Paradise",
  },
  {
    id: "surfers-raphael-alvarenga",
    author: "Raphael Alvarenga",
    avatarColor: "#6a4638",
    rating: 5,
    text: "Professional team, great atmosphere, attention to detail, and consistently excellent results.",
    publishedAt: "2026-06-23",
    location: "Surfers Paradise",
  },
];

export const displayedReviews = reviews;
