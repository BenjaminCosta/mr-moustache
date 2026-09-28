"use client";

import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { WEEK, formatRange, shopNow, statusLine } from "@/lib/opening-hours";
import type { OpeningHours } from "@/types";

/**
 * Collapsible weekly hours: the summary shows today's status and the panel
 * lists every day, with today highlighted. "Today" is only known in the
 * browser, so the first render shows a neutral label.
 */
export function OpeningHoursDetails({ hours }: { hours: OpeningHours[] }) {
  const [now, setNow] = useState<{ day: string; time: string } | null>(null);

  useEffect(() => {
    const update = () => setNow(shopNow());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <details className="group">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-[0.6rem] transition-colors duration-200 hover:text-teal-dark focus-visible:text-teal-dark lg:gap-3 [&::-webkit-details-marker]:hidden">
        <span>
          {now ? statusLine(hours, now) : "Opening hours"}
          <span className="mt-[0.2rem] block text-ink-muted">
            <span className="group-open:hidden">See all hours</span>
            <span className="hidden group-open:inline">Hide hours</span>
          </span>
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="h-[0.75rem] w-[0.45rem] rotate-90 transition-transform duration-300 ease-out group-open:-rotate-90 lg:h-4 lg:w-2.5"
        />
      </summary>

      <dl className="mt-[0.8rem] grid max-w-[17rem] grid-cols-[1fr_auto] gap-x-6 gap-y-[0.45rem] text-[0.84rem] lg:mt-5 lg:max-w-[22rem] lg:gap-y-3 lg:text-[1.05rem]">
        {WEEK.map((day) => {
          const item = hours.find((entry) => entry.day === day);
          const isToday = now?.day === day;
          return (
            <div key={day} className={`contents ${isToday ? "font-semibold text-teal-dark" : ""}`}>
              <dt>
                {day}
                {isToday ? <span className="sr-only"> (today)</span> : null}
              </dt>
              <dd className={`text-right ${isToday ? "" : "text-ink-muted"}`}>
                {item ? formatRange(item) : "Closed"}
              </dd>
            </div>
          );
        })}
      </dl>
    </details>
  );
}
