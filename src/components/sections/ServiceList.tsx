"use client";

import { useState } from "react";
import { locations } from "@/data/locations";
import type { LocationId, Service } from "@/types";
import { ServiceRows } from "./ServiceRows";

/**
 * Service list with a Surfers Paradise / Broadbeach switch: every row opens
 * that service at the chosen shop in Square, so nobody picks it twice.
 */
export function ServiceList({ services }: { services: Service[] }) {
  const [location, setLocation] = useState<LocationId>(locations[0].id);

  return (
    <div className="mt-[1.3rem] lg:mt-0">
      <div role="group" aria-label="Book at" className="flex items-end gap-[1.5rem] lg:gap-10">
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
              className={`whitespace-nowrap border-b-[2.5px] px-[0.1rem] pb-[0.7rem] text-[0.86rem] leading-none transition-colors duration-200 lg:pb-5 lg:text-[1.1rem] ${
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

      <ServiceRows location={location} services={services} />
    </div>
  );
}
