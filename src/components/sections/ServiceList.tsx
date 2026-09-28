"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { locations } from "@/data/locations";
import { services } from "@/data/services";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { squareServiceUrl } from "@/lib/constants";
import type { LocationId } from "@/types";

/**
 * Service list with a Surfers Paradise / Broadbeach switch: every row opens
 * that service at the chosen shop in Square, so nobody picks it twice.
 */
export function ServiceList() {
  const [location, setLocation] = useState<LocationId>(locations[0].id);
  const locationName = locations.find((item) => item.id === location)?.name;

  return (
    <div className="mt-[1.3rem] lg:mt-0">
      <div role="group" aria-label="Book at" className="flex items-end gap-[1.5rem] border-b border-white/35 lg:gap-10">
        <span className="pb-[0.7rem] text-[0.5rem] font-medium uppercase leading-none tracking-[0.3em] text-foreground/60 lg:pb-5 lg:text-[0.68rem]">
          Book at
        </span>
        {locations.map((item) => {
          const selected = item.id === location;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setLocation(item.id)}
              className={`-mb-px whitespace-nowrap border-b-[2.5px] px-[0.1rem] pb-[0.7rem] text-[0.86rem] leading-none transition-colors duration-200 lg:pb-5 lg:text-[1.1rem] ${
                selected
                  ? "border-primary font-semibold text-white"
                  : "border-transparent font-medium text-foreground/55 hover:text-white focus-visible:text-white"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <ul>
          {services.map((service) => (
            <li key={service.id} className="border-b border-white/35">
              <a
                href={squareServiceUrl(location, service.squareId)}
                target="_blank"
                rel="noopener noreferrer"
                {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
                className="btn-sweep btn-sweep--row group grid grid-cols-[1fr_4.625rem_0.5rem] items-center gap-x-[1.1rem] py-[0.72rem] pl-[0.22rem] pr-[0.25rem] lg:grid-cols-[1fr_7.75rem_0.75rem] lg:gap-x-6 lg:py-7 lg:pl-4 lg:pr-4 xl:grid-cols-[1fr_9rem_0.75rem] xl:gap-x-8"
              >
                <span>
                  <span className="block font-display text-[1.05rem] font-bold leading-[1.15] text-white transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary lg:text-[1.45rem] xl:text-[1.65rem]">
                    {service.name}
                  </span>
                  <span className="mt-[0.15rem] block whitespace-pre-line text-[0.67rem] leading-[1.22] text-foreground/75 lg:mt-2 lg:whitespace-normal lg:text-[0.95rem] lg:leading-normal">
                    {service.description}
                  </span>
                </span>
                <span className="whitespace-nowrap text-foreground">
                  {service.price ? (
                    <>
                      <span className="text-[0.8rem] lg:text-[1.1rem] xl:text-[1.2rem]">{service.price}</span>
                      {service.duration ? (
                        <span className="text-[0.71rem] lg:text-[0.92rem] xl:text-[1rem]">
                          <span className="px-[0.3rem] lg:px-2">·</span>
                          {service.duration}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="pl-[0.15rem] text-[0.78rem] lg:pl-0 lg:text-[1.1rem]">
                      Price varies
                    </span>
                  )}
                </span>
                <span className="sr-only">
                  Book at {locationName} through Square (opens in a new tab)
                </span>
                <ChevronRightIcon className="h-[0.95rem] w-[0.55rem] text-primary transition-transform duration-300 ease-out group-hover:translate-x-[0.2rem] group-focus-visible:translate-x-[0.2rem] lg:h-5 lg:w-3" />
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
