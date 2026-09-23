import Image from "next/image";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { ArrowRightIcon, StarIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Moustache } from "@/components/ui/Moustache";
import { business } from "@/data/business";
import { backgrounds } from "@/data/media";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[43.25rem] flex-col overflow-hidden bg-background pb-[1.625rem]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.hero ? (
          <Image
            src={backgrounds.hero}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_80%_20%,#2a2a2a_0%,#111_45%,#000_80%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/75 to-black" />
      </div>

      <header className="flex items-start justify-between pl-[1.625rem] pr-[1.25rem] pt-[1.4375rem]">
        <a href="#top" aria-label={`${business.shortName} ${business.locationName}, back to top`}>
          <Logo size={85} preload className="size-[5.3125rem]" />
        </a>
        <div className="pt-[0.6rem]">
          <SiteMenu />
        </div>
      </header>

      <div className="mt-auto px-[1.625rem] pt-12">
        <p className="text-[0.6rem] font-medium uppercase leading-none tracking-[0.19em] text-foreground/90">
          {business.shortName} · {business.locationName}
        </p>
        <h1 className="mt-[0.4rem] text-[2.4rem] leading-[0.92] tracking-[-0.015em] text-white">
          Good cuts.
          <br />
          Good people.
          <br />
          Proper barbering.
        </h1>
        <p className="mt-[0.55rem] text-[0.865rem] leading-[1.17] text-foreground/85">
          Classic cuts, skin fades, tapers and beard trims — right in the heart
          of Broadbeach.
        </p>

        <a
          href="#services"
          className="mt-[0.95rem] flex h-[2.35rem] items-center justify-center gap-[1.15rem] rounded-full bg-primary text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white hover:bg-primary-hover"
        >
          View services &amp; book
          <ArrowRightIcon className="size-[1rem]" />
        </a>

        <p className="mt-[0.95rem] flex items-center gap-[0.5rem] text-[0.72rem] leading-none text-foreground">
          <span
            className="flex gap-[0.15rem] text-star"
            role="img"
            aria-label={`Rated ${business.rating.score} out of 5`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon key={index} className="size-[0.8rem]" />
            ))}
          </span>
          <span>
            {business.rating.score} on {business.rating.source} ·{" "}
            {business.locationName}
          </span>
        </p>
        <p className="mt-[0.35rem] text-[0.66rem] leading-tight tracking-[0.03em] text-foreground/80">
          From the team behind Mr Moustache Surfers Paradise.
        </p>
      </div>

      <div className="mt-[1.25rem] flex h-[3.5625rem] items-center border-y border-white/25 bg-[#0e0e0e]/85 pl-[1.625rem]">
        <div className="flex w-[10.625rem] items-center gap-[0.75rem]">
          <Image
            src="/images/icons/palm.png"
            alt=""
            width={28}
            height={33}
            className="h-[2.05rem] w-auto shrink-0"
          />
          <p className="uppercase leading-none text-foreground">
            <span className="block text-[0.42rem] tracking-[0.21em]">
              Our second location
            </span>
            <span className="mt-[0.3rem] block text-[0.7rem] font-medium tracking-[0.1em]">
              BROADBEACH
            </span>
            <span className="mt-[0.3rem] block text-[0.42rem] tracking-[0.21em]">
              After Surfers Paradise
            </span>
          </p>
        </div>
        <span aria-hidden="true" className="h-[2.1rem] w-px bg-white/30" />
        <div className="flex items-center gap-[1.1rem] pl-[1.25rem]">
          <Moustache width={39} />
          <p className="text-[0.46rem] uppercase leading-[1.75] tracking-[0.24em] text-foreground">
            Same standards.
            <br />
            Fresh spot.
          </p>
        </div>
      </div>
    </section>
  );
}
