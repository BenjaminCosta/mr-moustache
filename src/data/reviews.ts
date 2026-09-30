import { GOOGLE_MAPS_URL_BROADBEACH, GOOGLE_MAPS_URL_SURFERS_PARADISE } from "@/lib/constants";
import type { GoogleRating, Review } from "@/types";

export const googleRatings = [
  {
    id: "broadbeach",
    location: "Broadbeach",
    rating: 5.0,
    reviewCount: 33,
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
 * 2026 against each location's Google Business Profile.
 */
export const reviews: Review[] = [
  {
    id: "broadbeach-daniel-millward",
    author: "Daniel Millward",
    avatarColor: "#1769aa",
    rating: 5,
    text: "Aitor is a fantastic barber and runs a great operation! Highly recommend this spot!",
    when: "a day ago",
    location: "Broadbeach",
  },
  {
    id: "broadbeach-rueben-tauk",
    author: "Rueben Tauk",
    avatarColor: "#7444a8",
    rating: 5,
    text: "Great haircut. Will be back",
    when: "a day ago",
    location: "Broadbeach",
  },
  {
    id: "broadbeach-inaki-garcia-fernandez",
    author: "Iñaki García Fernández",
    avatarColor: "#a0445f",
    rating: 5,
    text: "Perfect, 10/10 experience",
    when: "2 days ago",
    location: "Broadbeach",
  },
  {
    id: "surfers-jose-daniel-suarez-ferro",
    author: "Jose Daniel Suarez Ferro",
    avatarColor: "#1e6b4f",
    rating: 5,
    text: "Definitely one of the best barbershops around!",
    when: "5 months ago",
    location: "Surfers Paradise",
  },
  {
    id: "surfers-jose-dias-serpa",
    author: "Jose Dias Serpa",
    avatarColor: "#48577f",
    rating: 5,
    text: "Professional, friendly and very attentive to detail.",
    when: "a month ago",
    location: "Surfers Paradise",
  },
  {
    id: "surfers-raphael-alvarenga",
    author: "Raphael Alvarenga",
    avatarColor: "#6a4638",
    rating: 5,
    text: "Professional team, great atmosphere, attention to detail, and consistently excellent results.",
    when: "3 months ago",
    location: "Surfers Paradise",
  },
];

export const displayedReviews = reviews;
