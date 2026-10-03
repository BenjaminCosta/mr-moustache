import { ChevronRightIcon } from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { locationFaqs } from "@/lib/faq";
import type { Service, ShopLocation } from "@/types";

/** Short answers to what people ask before booking; the same data feeds the FAQ JSON-LD. */
export function LocationFaq({ location, services }: { location: ShopLocation; services: Service[] }) {
  const faqs = locationFaqs(location, services);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-background pb-[3rem] pt-[4rem] lg:py-32"
    >
      <div className="shell px-[1.35rem] lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:px-10 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:gap-x-24">
        <div>
          <RuleLabel
            className="gap-[0.8rem] px-[0.5rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
            lineClassName="bg-foreground/85"
          >
            <h2
              id="faq-title"
              className="font-sans text-[0.6rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]"
            >
              {location.name} barber FAQ
            </h2>
          </RuleLabel>
          <p className="mt-[1.15rem] text-balance text-center font-display text-[1.87rem] font-bold leading-none tracking-[-0.02em] text-white lg:mt-8 lg:text-left lg:text-[3.25rem] lg:leading-[1.02] xl:text-[4rem]">
            Good to know.
          </p>
        </div>

        <div className="mt-[1.5rem] border-t border-white/30 lg:mt-0">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-white/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-[1rem] py-[1rem] transition-colors duration-200 hover:text-primary lg:gap-8 lg:py-7 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[0.95rem] font-semibold leading-[1.3] text-white transition-colors duration-200 group-hover:text-primary lg:text-[1.25rem]">
                  {faq.question}
                </h3>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-[0.85rem] w-[0.5rem] shrink-0 rotate-90 text-primary transition-transform duration-300 ease-out group-open:-rotate-90 lg:h-5 lg:w-3"
                />
              </summary>
              <p className="pb-[1.1rem] pr-[1.5rem] text-[0.9rem] leading-[1.5] text-foreground/80 lg:pb-8 lg:text-[1.1rem]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
