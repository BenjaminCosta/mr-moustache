import Image from "next/image";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { ArrowRightIcon, StarIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Moustache } from "@/components/ui/Moustache";
import { business } from "@/data/business";
import { backgrounds } from "@/data/media";
import { navigation } from "@/data/navigation";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[43.25rem] flex-col overflow-hidden bg-background pb-[1.625rem] lg:min-h-[max(44rem,100svh)] lg:pb-0"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.hero ? (
          // Desktop: the portrait photo sits on the right and fades into the copy.
          <div className="absolute inset-0 lg:left-auto lg:w-[58%]">
            <Image
              src={backgrounds.hero}
              alt=""
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[70%_center] lg:object-[center_35%]"
            />
            <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-black to-transparent lg:block" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_80%_20%,#2a2a2a_0%,#111_45%,#000_80%)] lg:bg-[radial-gradient(70%_90%_at_75%_35%,#2a2a2a_0%,#111_45%,#000_85%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/75 to-black lg:h-1/2 lg:via-black/40" />
        <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-gradient-to-r from-black/85 via-black/45 to-transparent lg:block" />
      </div>

      <header className="shell flex items-start justify-between pl-[1.625rem] pr-[1.25rem] pt-[1.4375rem] lg:items-center lg:px-10 lg:pt-8">
        <a href="#top" aria-label={`${business.shortName} ${business.locationName}, back to top`}>
          <Logo size={112} eager className="size-[5.3125rem] lg:size-[7rem]" />
        </a>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative py-2 text-[0.75rem] font-medium uppercase tracking-[0.28em] text-foreground transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href={business.links.booking}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book now through Square (opens in a new tab)"
                className="btn-sweep btn-sweep--invert-primary inline-flex h-11 items-center rounded-full border-[1.5px] border-primary bg-primary px-7 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-white"
                {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
              >
                Book now
              </a>
            </li>
          </ul>
        </nav>

        <div className="pt-[0.6rem] lg:hidden">
          <SiteMenu />
        </div>
      </header>

      <div className="shell mt-auto px-[1.625rem] pt-12 lg:px-10 lg:pb-14">
        <div className="lg:max-w-[52rem]">
          {/* The business name is the page's H1; the headline below stays the visual lead. */}
          <h1 className="font-sans text-[0.6rem] font-medium uppercase leading-none tracking-[0.19em] text-foreground/90 lg:text-[0.8rem] lg:tracking-[0.3em]">
            {business.name}
          </h1>
          <p className="mt-[0.4rem] text-balance font-display text-[2.4rem] font-bold leading-[0.92] tracking-[-0.015em] text-white lg:mt-5 lg:whitespace-nowrap lg:text-[4.5rem] lg:leading-[0.95] xl:text-[5.25rem]">
            Good cuts.
            <br />
            Good people.
            <br />
            Proper barbering.
          </p>
          <p className="mt-[0.55rem] text-[0.865rem] leading-[1.17] text-foreground/85 lg:mt-6 lg:max-w-[30rem] lg:text-[1.2rem] lg:leading-[1.45]">
            Classic cuts, skin fades, tapers and beard trims — right in the heart
            of Broadbeach.
          </p>

          <a
            href="#services"
            className="btn-sweep btn-sweep--invert-primary group mt-[0.95rem] flex h-[2.35rem] items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white lg:mt-9 lg:inline-flex lg:h-14 lg:gap-5 lg:px-10 lg:text-[0.85rem] lg:tracking-[0.24em]"
          >
            View services &amp; book
            <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
          </a>

          <p className="mt-[0.95rem] flex items-center gap-[0.5rem] text-[0.72rem] leading-none text-foreground lg:mt-8 lg:gap-3 lg:text-[0.95rem]">
            <span
              className="flex gap-[0.15rem] text-star lg:gap-1"
              role="img"
              aria-label={`Rated ${business.rating.score} out of 5`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon key={index} className="size-[0.8rem] lg:size-[1.05rem]" />
              ))}
            </span>
            <span>
              {business.rating.score} on {business.rating.source} ·{" "}
              {business.locationName}
            </span>
          </p>
          <p className="mt-[0.35rem] text-[0.66rem] leading-tight tracking-[0.03em] text-foreground/80 lg:mt-3 lg:text-[0.9rem]">
            From the team behind Mr Moustache Surfers Paradise.
          </p>
        </div>
      </div>

      <div className="mt-[1.25rem] border-y border-white/25 bg-[#0e0e0e]/85 lg:mt-0 lg:border-b-0">
        <div className="shell flex h-[3.5625rem] items-center pl-[1.625rem] lg:h-[5.5rem] lg:justify-center lg:gap-16 lg:px-10">
          <div className="flex w-[10.625rem] items-center gap-[0.75rem] lg:w-auto lg:gap-5">
            <Image
              src="/images/icons/palm.png"
              alt=""
              width={40}
              height={47}
              className="h-[2.05rem] w-auto shrink-0 lg:h-[2.9rem]"
            />
            <p className="uppercase leading-none text-foreground">
              <span className="block text-[0.42rem] tracking-[0.21em] lg:text-[0.62rem] lg:tracking-[0.3em]">
                Our second location
              </span>
              <span className="mt-[0.3rem] block text-[0.7rem] font-medium tracking-[0.1em] lg:mt-2 lg:text-[1.05rem] lg:tracking-[0.14em]">
                BROADBEACH
              </span>
              <span className="mt-[0.3rem] block text-[0.42rem] tracking-[0.21em] lg:mt-2 lg:text-[0.62rem] lg:tracking-[0.3em]">
                After Surfers Paradise
              </span>
            </p>
          </div>
          <span aria-hidden="true" className="h-[2.1rem] w-px bg-white/30 lg:h-12" />
          <div className="flex items-center gap-[1.1rem] pl-[1.25rem] lg:gap-6 lg:pl-0">
            <Moustache width={39} className="lg:w-[3.5rem]" />
            <p className="text-[0.46rem] uppercase leading-[1.75] tracking-[0.24em] text-foreground lg:text-[0.68rem] lg:tracking-[0.32em]">
              Same standards.
              <br />
              Fresh spot.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
