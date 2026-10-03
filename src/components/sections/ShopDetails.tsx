import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  PhoneIcon,
  PinOutlineIcon,
} from "@/components/ui/Icons";
import { addressLines, locationPath } from "@/data/locations";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { hasFullWeek } from "@/lib/opening-hours";
import type { ShopLocation } from "@/types";
import { OpeningHoursDetails } from "./OpeningHoursDetails";

type ShopDetailsProps = {
  location: ShopLocation;
  /** Show the shop name as an H3 (the landing page's tabs) or leave it to the section heading. */
  showName?: boolean;
  /** Start with the weekly hours expanded (the shop's own page). */
  hoursOpen?: boolean;
  /** Link to the shop's own page (from the landing page's tabs). */
  showPageLink?: boolean;
};

/** Address, hours, phone, Book Now and directions for one shop, on a light background. */
export function ShopDetails({
  location,
  showName = true,
  hoursOpen = false,
  showPageLink = false,
}: ShopDetailsProps) {
  const [street, suburb] = addressLines(location);

  return (
    <>
      {showName ? (
        <h3 className="font-display text-[1.45rem] font-bold leading-none tracking-[-0.02em] text-ink lg:text-[2rem]">
          {location.name}
        </h3>
      ) : null}

      <ul
        className={`${showName ? "mt-[0.95rem] lg:mt-8" : ""} space-y-[1.05rem] text-[0.91rem] leading-[1.15] lg:space-y-8 lg:text-[1.15rem] lg:leading-[1.3]`}
      >
        <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
          <PinOutlineIcon className="ml-[0.2rem] mt-[0.05rem] h-[1.5rem] w-[1.15rem] lg:h-7 lg:w-[1.35rem]" />
          <address className="not-italic">
            {street}
            <br />
            {suburb}
          </address>
        </li>
        <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
          <ClockIcon className="-mt-[0.05rem] size-[1.55rem] lg:size-7" />
          {hasFullWeek(location.openingHours) ? (
            <OpeningHoursDetails
              hours={location.openingHours}
              special={location.specialHours}
              defaultOpen={hoursOpen}
            />
          ) : location.hours ? (
            <p>
              {location.hours.summary}
              <span className="mt-[0.2rem] block text-ink-muted">
                {location.hours.detail}
              </span>
            </p>
          ) : (
            // Placeholder until the shop's hours are confirmed.
            <p>
              Opening hours
              <span className="mt-[0.2rem] block text-ink-muted">
                To be confirmed
              </span>
            </p>
          )}
        </li>
        <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
          <PhoneIcon className="ml-[0.1rem] size-[1.4rem] lg:size-[1.6rem]" />
          <a
            href={location.phone.href}
            className="w-fit transition-colors duration-200 hover:text-teal-dark focus-visible:text-teal-dark"
            {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick, location.id)}
          >
            {location.phone.display}
          </a>
        </li>
      </ul>

      <div className="mt-[1.15rem] flex flex-col gap-[0.5rem] lg:mt-10 lg:flex-row lg:gap-4">
        <a
          href={location.links.booking}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book now at ${location.name} through Square (opens in a new tab)`}
          className="btn-sweep btn-sweep--invert-primary group flex h-[2.2rem] items-center justify-center gap-[0.9rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.8rem] font-medium text-white lg:h-14 lg:w-[15rem] lg:gap-[1.3rem] lg:text-[1rem]"
          {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick, location.id)}
        >
          Book Now
          <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
        </a>
        <a
          href={location.links.directions}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get directions to Mr Moustache ${location.name} in Google Maps (opens in a new tab)`}
          className="btn-sweep btn-sweep--fill-ink group flex h-[2.2rem] items-center justify-center gap-[0.9rem] rounded-full border-[1.5px] border-ink text-[0.8rem] font-medium lg:h-14 lg:w-[15rem] lg:gap-[1.3rem] lg:text-[1rem]"
          {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick, location.id)}
        >
          Get Directions
          <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
        </a>
      </div>

      {showPageLink ? (
        <Link
          href={locationPath(location.id)}
          className="group mt-[1rem] inline-flex items-center gap-[0.5rem] text-[0.85rem] font-medium text-teal-dark underline decoration-teal-dark/35 underline-offset-4 transition-colors duration-200 hover:decoration-teal-dark lg:mt-8 lg:text-[1rem]"
        >
          More about Mr Moustache {location.name}
          <ArrowRightIcon className="size-[0.9rem] transition-transform duration-300 ease-out group-hover:translate-x-1 lg:size-4" />
        </Link>
      ) : null}
    </>
  );
}
