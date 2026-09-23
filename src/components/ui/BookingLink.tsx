import type { ComponentPropsWithoutRef } from "react";
import { business } from "@/data/business";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { Button } from "./Button";

type BookingLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "href" | "target" | "rel"
>;

export function BookingLink({ children = "Book Now", ...props }: BookingLinkProps) {
  return (
    <Button
      href={business.links.booking}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book now through Square (opens in a new tab)"
      {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
      {...props}
    >
      {children}
    </Button>
  );
}
