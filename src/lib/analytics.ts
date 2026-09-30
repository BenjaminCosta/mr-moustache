import type { LocationId } from "@/types";

export const ANALYTICS_EVENTS = {
  bookingClick: "booking_click",
  directionsClick: "directions_click",
  instagramClick: "instagram_click",
  googleClick: "google_click",
  phoneClick: "phone_click",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Tags a link with its event name (and the shop it belongs to, when there is
 * one). `src/components/Analytics.tsx` forwards clicks on tagged links to
 * Google Analytics once a measurement ID is configured.
 */
export function analyticsAttributes(event: AnalyticsEvent, location?: LocationId) {
  return {
    "data-analytics-event": event,
    ...(location && { "data-analytics-location": location }),
  } as const;
}
