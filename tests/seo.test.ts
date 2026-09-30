import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";

import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { getLocation, locations } from "../src/data/locations";
import { services } from "../src/data/services";
import { SITE_URL } from "../src/lib/constants";
import { locationFaqs } from "../src/lib/faq";
import { hoursSentence } from "../src/lib/opening-hours";
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
  }

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
  it("lists the landing page and both shop pages", () => {
    assert.deepEqual(
      sitemap().map((entry) => entry.url),
      [`${SITE_URL}/`, `${SITE_URL}/surfers-paradise`, `${SITE_URL}/broadbeach`],
    );
  });

  it("points to the sitemap and keeps the API out of the index", () => {
    const result = robots();
    assert.equal(result.sitemap, `${SITE_URL}/sitemap.xml`);
    assert.equal((result.rules as { disallow?: string }).disallow, "/api/");
  });
});

describe("page metadata", () => {
  it("gives each page its own canonical and Open Graph URL", () => {
    const metadata = pageMetadata({ title: "T", description: "D", path: "/broadbeach" });
    assert.equal(metadata.alternates?.canonical, "/broadbeach");
    assert.equal(metadata.openGraph?.url, "/broadbeach");
    assert.deepEqual(metadata.title, { absolute: "T" });
  });

  it("gives each shop page its own share image and alt text", () => {
    for (const location of locations) {
      for (const file of ["opengraph-image.jpg", "opengraph-image.alt.txt", "twitter-image.jpg", "twitter-image.alt.txt"]) {
        assert.ok(existsSync(`src/app/${location.id}/${file}`), `${location.id}/${file}`);
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
