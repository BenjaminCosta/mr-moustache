import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { OurWork } from "@/components/sections/OurWork";
import { Reputation } from "@/components/sections/Reputation";
import { Services } from "@/components/sections/Services";
import { WorkWithUs } from "@/components/sections/WorkWithUs";
import { JsonLd } from "@/components/seo/JsonLd";
import { localePath, type Locale } from "@/i18n/locales";
import { HOME_SEO, pageMetadata } from "@/lib/seo";
import { getSiteData } from "@/lib/site-data";
import { homeJsonLd } from "@/lib/structured-data";

export function homePageMetadata(locale: Locale): Metadata {
  return pageMetadata({ ...HOME_SEO[locale], path: "/", locale });
}

/** The landing page with both shops, in English (/) or Spanish (/es). */
export async function HomePage({ locale }: { locale: Locale }) {
  const site = await getSiteData();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero locale={locale} />
        <Services locale={locale} />
        <OurWork locale={locale} />
        <Reputation locale={locale} />
        <Location locale={locale} />
        <WorkWithUs locale={locale} />
      </main>
      <Footer locale={locale} languagePaths={{ en: "/", es: localePath("es", "/") }} />
      <JsonLd data={homeJsonLd(site, locale)} />
    </div>
  );
}
