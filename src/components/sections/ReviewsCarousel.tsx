"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GoogleG, GoogleStars } from "@/components/ui/Google";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import { useNearViewport } from "@/hooks/useNearViewport";
import { googleRelativeTime } from "@/lib/relative-time";
import type { Review } from "@/types";

type ReviewsCarouselProps = {
  reviews: Review[];
  /** When the page was rendered; dates read from it until the browser takes over. */
  renderedAt: number;
};

// The visitor's clock, read once in the browser, so "2 weeks ago" is right on
// the day they visit even though the page itself was built earlier.
const browserNow = typeof window === "undefined" ? null : Date.now();
const noSubscription = () => () => {};

const controlClasses =
  "btn-sweep btn-sweep--fill-light grid size-[1.45rem] place-items-center rounded-full border-[1.5px] border-foreground/85 text-foreground lg:size-12";

export function ReviewsCarousel({ reviews, renderedAt }: ReviewsCarouselProps) {
  const now = useSyncExternalStore(noSubscription, () => browserNow ?? renderedAt, () => renderedAt);
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  // Roboto (the cards' Google look) is only requested once the cards near the
  // viewport, so it never competes with the first screen's image and fonts.
  const nearViewport = useNearViewport(trackRef);

  // Pages are one visible "screen" of cards, so dots stay right at any width.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth || 1;
    const count = Math.max(1, Math.round(track.scrollWidth / width));
    const maxScroll = track.scrollWidth - width;
    const current =
      track.scrollLeft >= maxScroll - 2
        ? count - 1
        : Math.round(track.scrollLeft / width);
    setPageCount(count);
    setPage(Math.min(current, count - 1));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // ResizeObserver fires once after the first layout, so measuring here too
    // would only force an extra synchronous reflow during hydration.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={trackRef}
        aria-label="Google reviews"
        className={`${nearViewport ? "font-google" : ""} flex snap-x snap-mandatory gap-[0.4rem] overflow-x-auto scroll-px-[0.5rem] px-[0.5rem] [scrollbar-width:none] lg:scroll-px-0 lg:gap-6 lg:px-0 [&::-webkit-scrollbar]:hidden`}
      >
        {reviews.map((review) => (
          <li
            key={review.id}
            className="flex min-h-[10.5rem] w-[10.75rem] shrink-0 snap-start flex-col rounded-[0.4rem] border border-white/15 bg-[#0c0c0c]/90 px-[0.8rem] pb-[0.85rem] pt-[0.8rem] lg:min-h-[17rem] lg:w-[calc((100%-3rem)/3)] lg:rounded-[0.6rem] lg:p-7"
          >
            <figure className="flex h-full flex-col">
              <figcaption className="flex items-center gap-[0.5rem] lg:gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-[2rem] shrink-0 place-items-center rounded-full text-[0.95rem] font-medium text-white lg:size-12 lg:text-[1.35rem]"
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.author.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.75rem] leading-tight text-white lg:text-[1.05rem]">
                    {review.author}
                  </span>
                  <GoogleStars
                    rating={review.rating}
                    className="mt-[0.2rem] gap-[0.08rem] lg:mt-1.5 lg:gap-0.5"
                    starClassName="size-[0.8rem] lg:size-[1.05rem]"
                  />
                </span>
              </figcaption>
              <blockquote className="mt-[0.6rem] text-[0.8125rem] leading-[1.3] text-[#e8eaed] lg:mt-5 lg:text-[1rem] lg:leading-[1.45]">
                {review.text}
              </blockquote>
              <p className="mt-auto flex items-center gap-[0.5rem] pt-[0.55rem] lg:gap-3 lg:pt-6">
                <GoogleG className="size-[1.15rem] shrink-0 lg:size-6" />
                <span className="text-[0.6875rem] leading-[1.3] text-[#bdc1c6] lg:text-[0.8rem]">
                  Google review
                  <span className="block text-[#9aa0a6]">
                    {review.location} · {googleRelativeTime(review.publishedAt, now)}
                  </span>
                </span>
              </p>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-[0.5rem] flex items-center justify-between px-[1.1rem] lg:mt-10 lg:px-0">
        <button
          type="button"
          className={controlClasses}
          aria-label="Previous reviews"
          onClick={() => goTo((page - 1 + pageCount) % pageCount)}
        >
          <ChevronLeftIcon className="h-[0.6rem] w-[0.35rem] lg:h-4 lg:w-2.5" />
        </button>

        <div className="flex gap-[0.5rem] lg:gap-3">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-current={index === page ? "true" : undefined}
              aria-label={`Show review page ${index + 1}`}
              className={`size-[0.34rem] rounded-full transition-colors duration-300 lg:size-2.5 ${
                index === page ? "bg-primary" : "bg-white/35 hover:bg-white/60"
              }`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={controlClasses}
          aria-label="Next reviews"
          onClick={() => goTo((page + 1) % pageCount)}
        >
          <ChevronRightIcon className="h-[0.6rem] w-[0.35rem] lg:h-4 lg:w-2.5" />
        </button>
      </div>
    </div>
  );
}
