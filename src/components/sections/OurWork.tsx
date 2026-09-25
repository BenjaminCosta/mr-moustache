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
      className="bg-background px-[1.25rem] pb-[4.5rem] pt-[3.25rem] lg:px-0 lg:py-32"
    >
      <div className="shell flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-x-20 lg:px-10">
        {/* Mobile: heading, video, button. Desktop: heading + button beside the video. */}
        <div className="contents lg:block">
          <RuleLabel
            className="gap-[1.1rem] px-[0.85rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
            lineClassName="bg-foreground/85"
          >
            <h2 id="work-title" className="text-[0.5rem] font-sans font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
              Our work
            </h2>
          </RuleLabel>

          <p className="text-balance font-display font-bold mt-[1.1rem] text-center text-[2.72rem] leading-[0.9] tracking-[-0.02em] text-white lg:mt-8 lg:whitespace-nowrap lg:text-left lg:text-[3.6rem] lg:leading-[1.02] xl:text-[4.1rem]">
            Fresh cuts,
            <br />
            done properly.
          </p>

          <a
            href={business.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View more on Instagram (opens in a new tab)"
            className="btn-sweep btn-sweep--fill-white group order-last mt-[1.1rem] flex h-[2.6rem] items-center justify-center rounded-[0.1875rem] border-[1.5px] border-foreground text-foreground lg:mt-12 lg:h-14 lg:max-w-[26rem]"
            {...analyticsAttributes(ANALYTICS_EVENTS.instagramClick)}
          >
            <InstagramIcon className="size-[1.15rem] lg:size-6" />
            <span aria-hidden="true" className="ml-[1.25rem] mr-[1rem] h-[1.2rem] w-px bg-current opacity-80 lg:ml-6 lg:mr-5 lg:h-6" />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] lg:text-[0.78rem] lg:tracking-[0.26em]">
              View more on Instagram
            </span>
            <ArrowUpRightIcon className="ml-[1rem] size-[0.8rem] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 lg:ml-5 lg:size-4" />
          </a>
        </div>

        <div className="mt-[1.3rem] lg:mt-0">
          <WorkVideoCard video={workVideo} />
        </div>
      </div>
    </section>
  );
}
