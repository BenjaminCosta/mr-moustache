import Image from "next/image";
import { GoogleStars, GoogleWordmark } from "@/components/ui/Google";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { backgrounds } from "@/data/media";
import { displayedReviews, googleRatings } from "@/data/reviews";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { ReviewsCarousel } from "./ReviewsCarousel";

export function Reputation() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden bg-background pb-[1.6rem] pt-[3.4rem] lg:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.reputation ? (
          // Desktop: the portrait photo sits on the right and fades into the copy.
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <Image
              src={backgrounds.reputation}
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-right-top"
            />
            <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-black to-transparent lg:block" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(75%_32%_at_85%_8%,#262626_0%,#101010_45%,transparent_100%)] lg:bg-[radial-gradient(45%_45%_at_85%_15%,#262626_0%,#101010_45%,transparent_100%)]" />
        )}
        {/* Darkens the lower half and fades both edges into the neighbouring sections. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.25)_8%,rgba(0,0,0,0.35)_30%,rgba(0,0,0,0.88)_55%,rgba(0,0,0,0.92)_92%,rgba(0,0,0,1)_100%)]" />
      </div>

      <div className="shell lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-x-20 lg:px-10">
        <div>
          <RuleLabel
            className="gap-[0.8rem] px-[1.7rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
            lineClassName="bg-foreground/85"
          >
            <h2 id="reviews-title" className="text-[0.5rem] font-sans font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
              Google reviews
            </h2>
          </RuleLabel>

          <p className="text-balance font-display font-bold mt-[0.95rem] whitespace-nowrap px-[1.85rem] text-[2.6rem] leading-[0.84] tracking-[-0.02em] text-white lg:mt-8 lg:px-0 lg:text-[3.6rem] lg:leading-[1.02] xl:text-[4.25rem]">
            Trusted on
            <br />
            the Gold Coast.
          </p>
          <p className="mt-[0.6rem] max-w-[21.9rem] px-[1.9rem] text-[0.9rem] leading-[1.15] text-foreground/85 lg:mt-6 lg:max-w-[30rem] lg:px-0 lg:text-[1.15rem] lg:leading-[1.45]">
            Broadbeach is our new home. The standard comes from the reputation
            Mr Moustache has already built in Surfers Paradise.
          </p>
        </div>

        <ul className="mt-[0.8rem] space-y-[0.35rem] px-[1.1rem] lg:mt-0 lg:space-y-4 lg:px-0">
          {googleRatings.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.location}: rated ${item.rating.toFixed(1)} from ${item.reviewCount} Google reviews (opens in a new tab)`}
                className="btn-sweep btn-sweep--row group grid h-[4.2rem] grid-cols-[7.25rem_1px_1fr_auto] items-center rounded-[0.4rem] border border-white/20 bg-[#0b0b0b]/80 pl-[0.95rem] pr-[0.75rem] lg:h-32 lg:grid-cols-[8.5rem_1px_1fr_auto] lg:rounded-[0.6rem] lg:gap-x-4 lg:pl-6 lg:pr-6 xl:grid-cols-[10.5rem_1px_1fr_auto] xl:pl-8 xl:pr-7"
                {...analyticsAttributes(ANALYTICS_EVENTS.googleClick)}
              >
                <span className="self-center">
                  <GoogleWordmark className="h-[1.78rem] w-auto lg:h-10 xl:h-11" />
                  <span className="mt-[0.2rem] block whitespace-nowrap text-[0.54rem] font-bold uppercase leading-none tracking-[0.16em] text-foreground lg:mt-3 lg:text-[0.6rem] lg:tracking-[0.1em] xl:text-[0.74rem] xl:tracking-[0.18em]">
                    {item.location}
                  </span>
                  <span className="mt-[0.2rem] block text-[0.44rem] uppercase leading-none tracking-[0.35em] text-foreground/70 lg:mt-2 lg:text-[0.62rem]">
                    On Google
                  </span>
                </span>

                <span aria-hidden="true" className="h-[2.65rem] w-px bg-white/30 lg:h-20" />

                <span className="pl-[1.35rem] lg:pl-2 xl:pl-6">
                  <span className="flex items-center gap-[0.75rem] lg:gap-3 xl:gap-5">
                    <span className="font-display text-[2.1rem] font-bold leading-none text-white lg:text-[2.6rem] xl:text-[3.25rem]">
                      {item.rating.toFixed(1)}
                    </span>
                    <GoogleStars
                      rating={item.rating}
                      className="gap-[0.12rem] lg:gap-0.5 xl:gap-1"
                      starClassName="size-[1.05rem] lg:size-5 xl:size-6"
                    />
                  </span>
                  <span className="mt-[0.35rem] block text-[0.52rem] uppercase leading-none tracking-[0.3em] text-foreground lg:mt-3 lg:text-[0.72rem]">
                    {item.reviewCount} reviews
                  </span>
                </span>

                <ChevronRightIcon className="h-[0.85rem] w-[0.5rem] text-primary transition-transform duration-300 ease-out group-hover:translate-x-[0.2rem] group-focus-visible:translate-x-[0.2rem] lg:h-6 lg:w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {displayedReviews.length > 0 ? (
        <div className="shell mt-[1rem] lg:mt-24 lg:px-10">
          <RuleLabel className="gap-[0.55rem] px-[1.1rem] lg:gap-8 lg:px-0" lineClassName="bg-foreground/85">
            <p className="text-[0.46rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
              What people are saying
            </p>
          </RuleLabel>
          <div className="mt-[0.75rem] lg:mt-12">
            <ReviewsCarousel reviews={displayedReviews} />
          </div>
        </div>
      ) : null}

      <div className="mt-[0.7rem] flex flex-col items-center text-center lg:mt-24">
        <RuleLabel className="w-[14rem] gap-[0.95rem] lg:w-[28rem] lg:gap-8" lineClassName="bg-foreground/40">
          <Moustache width={25} className="text-foreground/55 lg:w-11" />
        </RuleLabel>
        <p className="mt-[0.75rem] font-display text-[0.95rem] font-bold leading-[1.1] text-white lg:mt-6 lg:text-[2.25rem]">
          Two Gold Coast locations.
          <br />
          One Mr Moustache.
        </p>
        <p className="mt-[0.95rem] text-[0.47rem] uppercase leading-none tracking-[0.36em] text-foreground/55 lg:mt-6 lg:text-[0.66rem]">
          Mr Moustache
        </p>
        <p className="mt-[0.4rem] text-[0.34rem] uppercase leading-none tracking-[0.45em] text-foreground/55 lg:mt-2 lg:text-[0.5rem]">
          Broadbeach
        </p>
      </div>
    </section>
  );
}
