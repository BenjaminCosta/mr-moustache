import Image from "next/image";
import { WorkWithUsForm } from "@/app/work-with-us/WorkWithUsForm";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { backgrounds } from "@/data/media";

/** Careers form, kept in the landing flow after the two shop locations. */
export function WorkWithUs() {
  return (
    <section
      id="work-with-us"
      aria-labelledby="work-with-us-title"
      className="relative isolate overflow-hidden bg-background pb-[3.4rem] pt-[3.4rem] lg:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.reputation ? (
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
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.62)_40%,rgba(0,0,0,1)_100%)]" />
      </div>

      <div className="shell px-[1.35rem] lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:px-10 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:gap-x-24">
        <div>
          <RuleLabel
            className="gap-[0.8rem] px-[0.5rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
            lineClassName="bg-foreground/85"
          >
            <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
              Join the team
            </p>
          </RuleLabel>

          <h2
            id="work-with-us-title"
            className="mt-[1.15rem] text-center text-[2.6rem] leading-[0.95] tracking-[-0.02em] text-white lg:mt-8 lg:text-left lg:text-[3.25rem] lg:leading-[1.02] xl:text-[4rem]"
          >
            Work With Us
          </h2>
          <p className="mx-auto mt-[0.7rem] max-w-[21rem] text-center text-[0.9rem] leading-[1.3] text-foreground/80 lg:mx-0 lg:mt-6 lg:text-left lg:text-[1.1rem] lg:leading-normal">
            We&rsquo;re always keen to meet barbers who care about the craft.
            Tell us a little about yourself and which shop suits you, Surfers
            Paradise or Broadbeach, and we&rsquo;ll be in touch.
          </p>
        </div>

        <div className="mt-[1.9rem] lg:mt-0">
          <WorkWithUsForm />
        </div>
      </div>
    </section>
  );
}
