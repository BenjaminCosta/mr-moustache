import { ArrowUpRightIcon, InstagramIcon } from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { business } from "@/data/business";
import { workVideo } from "@/data/media";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { WorkVideoCard } from "./WorkVideoCard";

export function OurWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="bg-background px-[1.25rem] pb-[3.75rem] pt-[2.55rem]"
    >
      <RuleLabel className="gap-[1.1rem] px-[0.85rem]" lineClassName="bg-foreground/85">
        <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground">
          Our work
        </p>
      </RuleLabel>

      <h2
        id="work-title"
        className="mt-[1.1rem] text-center text-[2.72rem] leading-[0.9] tracking-[-0.02em] text-white"
      >
        Fresh cuts,
        <br />
        done properly.
      </h2>

      <div className="mt-[1.3rem]">
        <WorkVideoCard video={workVideo} fallbackHref={business.links.instagram} />
      </div>

      <a
        href={business.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View more on Instagram (opens in a new tab)"
        className="btn-sweep btn-sweep--fill-primary group mt-[1.1rem] flex h-[2.6rem] items-center justify-center rounded-[0.1875rem] border-[1.5px] border-primary text-primary"
        {...analyticsAttributes(ANALYTICS_EVENTS.instagramClick)}
      >
        <InstagramIcon className="size-[1.15rem]" />
        <span aria-hidden="true" className="ml-[1.25rem] mr-[1rem] h-[1.2rem] w-px bg-current opacity-80" />
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em]">
          View more on Instagram
        </span>
        <ArrowUpRightIcon className="ml-[1rem] size-[0.8rem] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5" />
      </a>
    </section>
  );
}
