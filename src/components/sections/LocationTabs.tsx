"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { locations } from "@/data/locations";
import type { LocationId } from "@/types";
import { ShopDetails } from "./ShopDetails";

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
        className="flex gap-[1.8rem] lg:gap-12"
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
              className={`scroll-mt-6 whitespace-nowrap border-b-[2.5px] px-[0.1rem] pb-[0.7rem] text-[0.9rem] leading-none transition-colors duration-200 lg:pb-5 lg:text-[1.2rem] ${
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

      {locations.map((location) => (
        <div
          key={location.id}
          id={`${location.id}-panel`}
          role="tabpanel"
          aria-labelledby={location.id}
          hidden={location.id !== active}
          className="pt-[1.25rem] lg:pt-10"
        >
          <ShopDetails location={location} showPageLink />
        </div>
      ))}
    </div>
  );
}
