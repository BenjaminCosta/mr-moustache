"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRightIcon,
  ClockIcon,
  PhoneIcon,
  PinOutlineIcon,
} from "@/components/ui/Icons";
import { addressLines, locations } from "@/data/locations";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import type { LocationId } from "@/types";

const ids = locations.map((location) => location.id) as LocationId[];

function idFromHref(href: string | null | undefined): LocationId | null {
  const hash = href?.split("#")[1];
  return hash && (ids as string[]).includes(hash) ? (hash as LocationId) : null;
}

/**
 * Surfers Paradise / Broadbeach tabs. Each tab carries the shop's id, so the
 * navbar and hero links (`/#surfers-paradise`, `/#broadbeach`) scroll here and
 * open the matching tab.
 */
export function LocationTabs() {
  const [active, setActive] = useState<LocationId>(ids[0]);
  const tabRefs = useRef<Partial<Record<LocationId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const fromHash = () => {
      const id = idFromHref(window.location.hash);
      if (id) setActive(id);
    };
    // Next's <Link> updates the hash with pushState (no hashchange), so also
    // react to clicks on links that point at one of the shops.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const id = idFromHref(link?.getAttribute("href"));
      if (id) setActive(id);
    };

    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("popstate", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const select = (id: LocationId, focus = false) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = ids.indexOf(active);
    const next =
      event.key === "ArrowRight"
        ? ids[(index + 1) % ids.length]
        : event.key === "ArrowLeft"
          ? ids[(index - 1 + ids.length) % ids.length]
          : event.key === "Home"
            ? ids[0]
            : event.key === "End"
              ? ids[ids.length - 1]
              : null;
    if (next) {
      event.preventDefault();
      select(next, true);
    }
  };

  return (
    <div className="mt-[1.55rem] lg:mt-12">
      <div
        role="tablist"
        aria-label="Choose a barbershop"
        className="flex gap-[1.8rem] border-b border-ink/20 lg:gap-12"
      >
        {locations.map((location) => {
          const selected = location.id === active;
          return (
            <button
              key={location.id}
              ref={(element) => {
                tabRefs.current[location.id] = element;
              }}
              id={location.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${location.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(location.id)}
              onKeyDown={onKeyDown}
              className={`-mb-px scroll-mt-6 whitespace-nowrap border-b-[2.5px] px-[0.1rem] pb-[0.7rem] text-[0.9rem] leading-none transition-colors duration-200 lg:pb-5 lg:text-[1.2rem] ${
                selected
                  ? "border-primary font-semibold text-ink"
                  : "border-transparent font-medium text-ink/55 hover:text-ink focus-visible:text-ink"
              }`}
            >
              {location.name}
            </button>
          );
        })}
      </div>

      {locations.map((location) => {
        const [street, suburb] = addressLines(location);
        return (
          <div
            key={location.id}
            id={`${location.id}-panel`}
            role="tabpanel"
            aria-labelledby={location.id}
            hidden={location.id !== active}
            className="pt-[1.25rem] lg:pt-10"
          >
            <h3 className="font-display text-[1.45rem] font-bold leading-none tracking-[-0.02em] text-ink lg:text-[2rem]">
              {location.name}
            </h3>

            <ul className="mt-[0.95rem] space-y-[1.05rem] text-[0.91rem] leading-[1.15] lg:mt-8 lg:space-y-8 lg:text-[1.15rem] lg:leading-[1.3]">
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
                {location.hours ? (
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
                  {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
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
                {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
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
                {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
              >
                Get Directions
                <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
