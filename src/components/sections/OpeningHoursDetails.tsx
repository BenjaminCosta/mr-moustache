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

      {/* Solid panel so the hours stay readable over the palm backdrop. */}
      <dl className="mt-[0.8rem] divide-y divide-ink/10 rounded-[0.5rem] border border-ink/10 bg-white px-[0.9rem] py-[0.2rem] text-[0.88rem] leading-[1.2] shadow-[0_1px_2px_rgba(17,19,20,0.06)] lg:mt-5 lg:max-w-[23rem] lg:px-5 lg:py-1 lg:text-[1.05rem]">
        {WEEK.map((day) => {
          const item = hours.find((entry) => entry.day === day);
          const isToday = now?.day === day;
          const closed = !item || item.closed;
          return (
            <div
              key={day}
              className={`flex items-center justify-between gap-3 py-[0.55rem] lg:gap-6 lg:py-3 ${
                isToday ? "text-teal-dark" : "text-ink"
              }`}
            >
              <dt className={`flex items-center gap-[0.4rem] ${isToday ? "font-semibold" : ""}`}>
                {day}
                {isToday ? (
                  <span className="rounded-full bg-teal-dark px-[0.35rem] py-[0.15rem] text-[0.5rem] font-semibold uppercase leading-none tracking-[0.12em] text-white lg:text-[0.62rem]">
                    Today
                  </span>
                ) : null}
              </dt>
              <dd className={`whitespace-nowrap text-right tabular-nums ${closed && !isToday ? "text-ink/55" : ""}`}>
                {item ? formatRange(item) : "Closed"}
              </dd>
            </div>
          );
        })}
      </dl>
    </details>
  );
}
