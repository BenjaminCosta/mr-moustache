import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";

import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { getLocation, locations } from "../src/data/locations";
import { navigationFor } from "../src/data/navigation";
import { dictionaries } from "../src/i18n/dictionary";
import { localePath } from "../src/i18n/locales";
import { serviceDescription } from "../src/i18n/services";
import { services } from "../src/data/services";
import { SITE_URL } from "../src/lib/constants";
import { locationFaqs } from "../src/lib/faq";
import { formatRange, hoursSentence, statusLine } from "../src/lib/opening-hours";
import { googleRelativeTime } from "../src/lib/relative-time";
import { gbpWebsiteUrl, pageMetadata } from "../src/lib/seo";
import { homeJsonLd, locationJsonLd } from "../src/lib/structured-data";

type Node = Record<string, unknown> & { "@type": string; "@id"?: string };

function graph(data: { "@graph": unknown[] }) {
  return data["@graph"] as Node[];
}

describe("hoursSentence", () => {
  it("groups consecutive days with the same hours and lists closed days", () => {
    assert.equal(
      hoursSentence(getLocation("broadbeach").openingHours),
      "Tuesday–Wednesday 10:00 am – 6:30 pm, Thursday 9:30 am – 7:00 pm, Friday 9:00 am – 7:00 pm and Saturday 9:00 am – 4:00 pm. Closed Monday and Sunday.",
    );
  });

  it("writes the same week in Spanish, with 24-hour times", () => {
    assert.equal(
      hoursSentence(getLocation("broadbeach").openingHours, "es"),
      "Martes a miércoles de 10:00 a 18:30, jueves de 9:30 a 19:00, viernes de 9:00 a 19:00 y sábado de 9:00 a 16:00. Cerrado lunes y domingo.",
    );
  });
});

describe("Spanish formatting", () => {
  it("formats hours, today's status and review dates in Spanish", () => {
    assert.equal(formatRange({ day: "Friday", opens: "09:00", closes: "19:00" }, "es"), "9:00 – 19:00");
    assert.equal(formatRange({ day: "Monday", opens: null, closes: null, closed: true }, "es"), "Cerrado");
    const hours = getLocation("broadbeach").openingHours;
    assert.equal(statusLine(hours, { day: "Friday", time: "08:00" }, [], "es"), "Abre hoy a las 9:00");
    assert.equal(statusLine(hours, { day: "Friday", time: "12:00" }, [], "es"), "Abierto ahora · hasta las 19:00");
    assert.equal(statusLine(hours, { day: "Monday", time: "12:00" }, [], "es"), "Cerrado hoy");
    const now = Date.parse("2026-10-11T00:00:00Z");
    assert.equal(googleRelativeTime("2026-10-10", now, "es"), "hace un día");
    assert.equal(googleRelativeTime("2026-09-20", now, "es"), "hace 3 semanas");
    assert.equal(googleRelativeTime("2026-04-23", now, "es"), "hace 5 meses");
  });

  it("translates every service description, and falls back when Square changes one", () => {
    for (const service of services) {
      assert.ok(dictionaries.es.serviceDescriptions[service.id], service.id);
      assert.notEqual(serviceDescription(service, "es"), service.description);
    }
    const changed = { ...services[0], description: "New description from Square" };
    assert.equal(serviceDescription(changed, "es"), "New description from Square");
  });

  it("answers the FAQ in Spanish from the same data", () => {
    const faqs = locationFaqs(getLocation("broadbeach"), services, "es");
    assert.equal(faqs.length, locationFaqs(getLocation("broadbeach")).length);
    assert.match(faqs[0].question, /^¿Los barberos de Mr Moustache Broadbeach hablan español\?$/);
    assert.match(faqs[1].answer, /Skin Fade A\$55/);
  });

  it("keeps every link in the Spanish navigation under /es", () => {
    assert.equal(localePath("es", "/"), "/es");
    assert.equal(localePath("es", "/#services"), "/es#services");
    assert.deepEqual(
      navigationFor("broadbeach", "es").map((item) => item.href),
      ["/es/broadbeach#services", "/es/surfers-paradise", "/es/broadbeach", "/es#work-with-us"],
    );
  });
});

describe("location structured data", () => {
  for (const location of locations) {
    it(`describes ${location.name} on its own page`, () => {
      const nodes = graph(locationJsonLd(location));
      const shop = nodes.find((node) => node["@type"] === "HairSalon");
      const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
      const faq = nodes.find((node) => node["@type"] === "FAQPage");

      assert.ok(shop && breadcrumb && faq);
      assert.equal(shop.url, `${SITE_URL}/${location.id}`);
      assert.equal(shop.name, location.fullName);
      assert.equal((shop.address as Node).streetAddress, location.address.street);
      assert.equal((shop.hasOfferCatalog as { itemListElement: unknown[] }).itemListElement.length, services.length);
      assert.deepEqual(
        (breadcrumb.itemListElement as Node[]).map((item) => item.item),
        [`${SITE_URL}/`, `${SITE_URL}/${location.id}`],
      );
      assert.equal((faq.mainEntity as unknown[]).length, locationFaqs(location).length);
    });

    it(`describes the same ${location.name} shop on its Spanish page`, () => {
      const nodes = graph(locationJsonLd(location, services, "es"));
      const page = nodes.find((node) => node["@type"] === "WebPage");
      const shop = nodes.find((node) => node["@type"] === "HairSalon");
      const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
      const faq = nodes.find((node) => node["@type"] === "FAQPage");

      assert.ok(page && shop && breadcrumb && faq);
      assert.equal(page.url, `${SITE_URL}/es/${location.id}`);
      assert.equal(page.inLanguage, "es");
      // The shop entity is the same on both pages: Google merges them by @id.
      assert.equal(shop["@id"], graph(locationJsonLd(location))[3]["@id"]);
      assert.equal(shop.url, `${SITE_URL}/${location.id}`);
      assert.deepEqual(
        (breadcrumb.itemListElement as Node[]).map((item) => [item.name, item.item]),
        [
          ["Inicio", `${SITE_URL}/es`],
          [location.name, `${SITE_URL}/es/${location.id}`],
        ],
      );
      assert.match(String((faq.mainEntity as Node[])[0].name), /^¿/);
    });
  }

  it("gives each shop its own phone number", () => {
    const phones = Object.fromEntries(
      graph(homeJsonLd())
        .filter((node) => node["@type"] === "HairSalon")
        .map((node) => [node.name, node.telephone]),
    );
    assert.deepEqual(phones, {
      "Mr Moustache Barbershop Surfers Paradise": "+61421574445",
      "Mr Moustache Barbershop Broadbeach": "+61403930440",
    });
    assert.equal(getLocation("broadbeach").phone.display, "0403 930 440");
  });

  it("lists both shops on the home page with the same ids as their pages", () => {
    const home = graph(homeJsonLd());
    const shopIds = home.filter((node) => node["@type"] === "HairSalon").map((node) => node["@id"]);
    const pageIds = locations.map(
      (location) => graph(locationJsonLd(location)).find((node) => node["@type"] === "HairSalon")?.["@id"],
    );

    assert.deepEqual(shopIds, pageIds);
    assert.ok(home.some((node) => node["@type"] === "WebSite"));
  });

  it("never lets data close the script tag", () => {
    for (const location of locations) {
      assert.ok(!JSON.stringify(locationJsonLd(location)).replace(/</g, "\\u003c").includes("<"));
    }
  });
});

describe("sitemap and robots", () => {
  it("lists every page in English and Spanish, each pointing to the other", () => {
    const entries = sitemap();
    assert.deepEqual(
      entries.map((entry) => entry.url),
      [
        `${SITE_URL}/`,
        `${SITE_URL}/es`,
        `${SITE_URL}/surfers-paradise`,
        `${SITE_URL}/es/surfers-paradise`,
        `${SITE_URL}/broadbeach`,
        `${SITE_URL}/es/broadbeach`,
      ],
    );
    assert.deepEqual(entries[4].alternates?.languages, {
      "en-AU": `${SITE_URL}/broadbeach`,
      es: `${SITE_URL}/es/broadbeach`,
      "x-default": `${SITE_URL}/broadbeach`,
    });
  });

  it("points to the sitemap and keeps the API and email short links out of the index", () => {
    const result = robots();
    assert.equal(result.sitemap, `${SITE_URL}/sitemap.xml`);
    assert.deepEqual((result.rules as { disallow?: string[] }).disallow, ["/api/", "/review/", "/book/"]);
  });
});

describe("page metadata", () => {
  it("gives each page its own canonical and Open Graph URL", () => {
    const metadata = pageMetadata({ title: "T", description: "D", path: "/broadbeach" });
    assert.equal(metadata.alternates?.canonical, "/broadbeach");
    assert.equal(metadata.openGraph?.url, "/broadbeach");
    assert.deepEqual(metadata.title, { absolute: "T" });
  });

  it("links each page to its translation with hreflang", () => {
    const metadata = pageMetadata({ title: "T", description: "D", path: "/broadbeach", locale: "es" });
    assert.equal(metadata.alternates?.canonical, "/es/broadbeach");
    assert.deepEqual(metadata.alternates?.languages, {
      "en-AU": "/broadbeach",
      es: "/es/broadbeach",
      "x-default": "/broadbeach",
    });
    assert.equal((metadata.openGraph as { locale?: string })?.locale, "es_ES");
  });

  it("gives every page, in both languages, its own share image and alt text", () => {
    const folders = [
      "src/app/(en)",
      "src/app/(es)/es",
      ...locations.flatMap((location) => [`src/app/(en)/${location.id}`, `src/app/(es)/es/${location.id}`]),
    ];
    for (const folder of folders) {
      for (const file of ["opengraph-image.jpg", "opengraph-image.alt.txt", "twitter-image.jpg", "twitter-image.alt.txt"]) {
        assert.ok(existsSync(`${folder}/${file}`), `${folder}/${file}`);
      }
    }
  });

  it("tags each Google Business Profile link with its shop", () => {
    const url = new URL(gbpWebsiteUrl("surfers-paradise"));
    assert.equal(url.pathname, "/surfers-paradise");
    assert.equal(url.searchParams.get("utm_source"), "google");
    assert.equal(url.searchParams.get("utm_medium"), "organic");
    assert.equal(url.searchParams.get("utm_campaign"), "gbp-surfers-paradise");
  });
});
