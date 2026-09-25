import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { backgrounds } from "@/data/media";
import { WorkWithUsForm } from "./WorkWithUsForm";

export const metadata: Metadata = {
  title: "Work With Us",
  description:
    "Join the Mr Moustache Barbershop team in Surfers Paradise or Broadbeach on the Gold Coast.",
  alternates: { canonical: "/work-with-us" },
};

export default function WorkWithUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative isolate flex-1 overflow-hidden bg-background pb-[3.4rem] lg:pb-32">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[34rem] lg:h-[46rem]">
          {backgrounds.reputation ? (
            <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
              <Image
                src={backgrounds.reputation}
                alt=""
                fill
                preload
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-right-top"
              />
              <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-black to-transparent lg:block" />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.55)_40%,rgba(0,0,0,1)_100%)]" />
        </div>

        <SiteHeader />

        <div className="shell mt-[2.6rem] px-[1.35rem] lg:mt-16 lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:px-10 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:gap-x-24">
          <div>
            <RuleLabel
              className="gap-[0.8rem] px-[0.5rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
              lineClassName="bg-foreground/85"
            >
              <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
                Join the team
              </p>
            </RuleLabel>
            <h1 className="mt-[1.15rem] text-center text-[2.6rem] leading-[0.95] tracking-[-0.02em] text-white lg:mt-8 lg:text-left lg:text-[3.25rem] lg:leading-[1.02] xl:text-[4rem]">
              Work With Us
            </h1>
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
      </main>
      <Footer />
    </div>
  );
}
