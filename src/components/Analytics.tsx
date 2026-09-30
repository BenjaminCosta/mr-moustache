"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set; without
 * it nothing loads. gtag.js is fetched in idle time, after the page has
 * loaded, so it never slows the first screen.
 *
 * Every click on a link tagged with analyticsAttributes() is sent as a GA4
 * event (booking_click, directions_click, phone_click, …) with the shop it
 * belongs to in `shop`. Visits from each Google Business Profile carry the UTM
 * tags from gbpWebsiteUrl(), so GA4 shows which profile sent them and whether
 * they booked. See docs/GOOGLE_BUSINESS_PROFILE.md.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Queue commands until gtag.js arrives; it replays the dataLayer on load.
    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
      window.gtag ??
      function gtag() {
        // gtag.js only understands `arguments` objects, not arrays.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLElement>(
        "[data-analytics-event]",
      );
      if (!link) return;
      window.gtag?.("event", link.dataset.analyticsEvent, {
        shop: link.dataset.analyticsLocation,
        link_url: link.getAttribute("href") ?? undefined,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="lazyOnload"
    />
  );
}
