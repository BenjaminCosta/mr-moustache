export const ANALYTICS_EVENTS = {
  bookingClick: "booking_click",
  directionsClick: "directions_click",
  instagramClick: "instagram_click",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Adds a stable event name without shipping an analytics client.
 * A future provider can listen for these attributes in one place.
 */
export function analyticsAttributes(event: AnalyticsEvent) {
  return { "data-analytics-event": event } as const;
}
