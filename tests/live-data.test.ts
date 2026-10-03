import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { services as siteServices } from "../src/data/services";
import { fetchPlace, parsePlace } from "../src/lib/google-places";
import { hoursFor, shopNow, statusLine } from "../src/lib/opening-hours";
import { fetchCatalogServices, formatPrice, mergeServices, parseCatalog } from "../src/lib/square-catalog";
import { mergeSiteData } from "../src/lib/site-data";

const realFetch = globalThis.fetch;

// A Place Details answer shaped like Google's (Places API New).
const place = {
  rating: 4.95,
  userRatingCount: 63,
  regularOpeningHours: {
    periods: [
      { open: { day: 2, hour: 10, minute: 0 }, close: { day: 2, hour: 18, minute: 30 } },
      { open: { day: 3, hour: 10, minute: 0 }, close: { day: 3, hour: 18, minute: 30 } },
      { open: { day: 4, hour: 9, minute: 30 }, close: { day: 4, hour: 12, minute: 0 } },
      { open: { day: 4, hour: 13, minute: 0 }, close: { day: 4, hour: 19, minute: 0 } },
      { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 19, minute: 0 } },
      { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 16, minute: 0 } },
    ],
  },
  currentOpeningHours: {
    specialDays: [{ date: { year: 2026, month: 12, day: 25 } }, { date: { year: 2026, month: 12, day: 26 } }],
    periods: [
      {
        open: { day: 6, hour: 10, minute: 0, date: { year: 2026, month: 12, day: 26 } },
        close: { day: 6, hour: 14, minute: 0, date: { year: 2026, month: 12, day: 26 } },
      },
    ],
  },
  reviews: [
    {
      name: "places/x/reviews/1",
      rating: 5,
      publishTime: "2026-10-01T03:12:00Z",
      text: { text: "Great fade, translated" },
      originalText: { text: "Excelente corte" },
      authorAttribution: { displayName: "Ana López", uri: "https://www.google.com/maps/contrib/1" },
    },
    { name: "places/x/reviews/2", rating: 2, publishTime: "2026-09-30T00:00:00Z", text: { text: "Meh" }, authorAttribution: { displayName: "Bob" } },
    { name: "places/x/reviews/3", rating: 5, publishTime: "2026-09-29T00:00:00Z", authorAttribution: { displayName: "No Text" } },
  ],
};

describe("Google Places", () => {
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.GOOGLE_PLACES_API_KEY;
  });

  it("maps Google's week to the site's hours (Monday first, lunch breaks merged)", () => {
    const { openingHours } = parsePlace(place, "Broadbeach");
    assert.deepEqual(openingHours?.map((day) => [day.day, day.opens, day.closes, Boolean(day.closed)]), [
      ["Monday", null, null, true],
      ["Tuesday", "10:00", "18:30", false],
      ["Wednesday", "10:00", "18:30", false],
      ["Thursday", "09:30", "19:00", false],
      ["Friday", "09:00", "19:00", false],
      ["Saturday", "09:00", "16:00", false],
      ["Sunday", null, null, true],
    ]);
  });

  it("reads holiday hours, closed when Google lists no period that day", () => {
    assert.deepEqual(parsePlace(place, "Broadbeach").specialHours, [
      { date: "2026-12-25", opens: null, closes: null, closed: true },
      { date: "2026-12-26", opens: "10:00", closes: "14:00" },
    ]);
  });

  it("keeps good reviews with text, in the reviewer's own words, with their profile link", () => {
    const { reviews, rating, reviewCount } = parsePlace(place, "Broadbeach");
    assert.equal(rating, 4.95);
    assert.equal(reviewCount, 63);
    assert.equal(reviews.length, 1);
    assert.equal(reviews[0].text, "Excelente corte");
    assert.equal(reviews[0].publishedAt, "2026-10-01");
    assert.equal(reviews[0].authorUrl, "https://www.google.com/maps/contrib/1");
    assert.equal(reviews[0].location, "Broadbeach");
  });

  it("does not call Google without an API key", async () => {
    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response("{}");
    }) as typeof fetch;
    assert.equal(await fetchPlace("ChIJ", "Broadbeach"), null);
    assert.equal(called, false);
  });

  it("asks only for the fields it uses, and falls back on errors", async () => {
    process.env.GOOGLE_PLACES_API_KEY = "test-key";
    let request: { url: string; headers: Record<string, string> } | undefined;
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      request = { url, headers: init.headers as Record<string, string> };
      return new Response(JSON.stringify(place));
    }) as typeof fetch;

    const data = await fetchPlace("ChIJ8Qbj5d4FkWsR53Iktyc_sEI", "Broadbeach");
    assert.equal(data?.reviewCount, 63);
    assert.equal(request?.url, "https://places.googleapis.com/v1/places/ChIJ8Qbj5d4FkWsR53Iktyc_sEI?languageCode=en");
    assert.equal(request?.headers["X-Goog-Api-Key"], "test-key");
    assert.equal(request?.headers["X-Goog-FieldMask"], "rating,userRatingCount,reviews,regularOpeningHours,currentOpeningHours");

    globalThis.fetch = (async () => new Response("denied", { status: 403 })) as typeof fetch;
    assert.equal(await fetchPlace("ChIJ", "Broadbeach"), null);
  });
});

describe("special hours", () => {
  const week = parsePlace(place, "Broadbeach").openingHours!;
  const special = parsePlace(place, "Broadbeach").specialHours;

  it("uses the holiday hours on that date only", () => {
    const boxingDay = shopNow(new Date("2026-12-26T01:00:00Z")); // 11:00 am in Brisbane
    assert.equal(boxingDay.date, "2026-12-26");
    assert.equal(statusLine(week, boxingDay, special), "Open now · until 2:00 pm");
    assert.equal(statusLine(week, boxingDay), "Open now · until 4:00 pm");
    assert.equal(hoursFor(week, { day: "Friday", date: "2026-12-25" }, special)?.closed, true);
  });
});

// Square catalog objects shaped like ListCatalog's answer.
const standard = siteServices[0];
const catalog = parseCatalog([
  ...siteServices.slice(1).map((service) => ({
    type: "ITEM",
    id: `ITEM_${service.id}`,
    item_data: {
      name: service.name,
      description_plaintext: service.description.replace(/\s*\n\s*/g, " "),
      product_type: "APPOINTMENTS_SERVICE",
      variations: [
        {
          type: "ITEM_VARIATION",
          id: service.squareId,
          item_variation_data: { price_money: { amount: 9900, currency: "AUD" }, pricing_type: "FIXED_PRICING" },
        },
      ],
    },
  })),
  {
    type: "ITEM",
    id: "ITEM_NEW",
    item_data: {
      name: "Hot Towel Shave",
      description_plaintext: "Straight razor shave.",
      product_type: "APPOINTMENTS_SERVICE",
      variations: [{ type: "ITEM_VARIATION", id: "VAR_NEW", item_variation_data: { price_money: { amount: 4550, currency: "AUD" } } }],
    },
  },
  {
    type: "ITEM",
    id: "ITEM_SHAMPOO",
    item_data: { name: "Shampoo", product_type: "REGULAR", variations: [{ type: "ITEM_VARIATION", id: "VAR_SHAMPOO" }] },
  },
  {
    type: "ITEM",
    id: "ITEM_HIDDEN",
    item_data: {
      name: "Staff only",
      product_type: "APPOINTMENTS_SERVICE",
      variations: [{ type: "ITEM_VARIATION", id: "VAR_HIDDEN", item_variation_data: { available_for_booking: false } }],
    },
  },
]);

describe("Square catalog", () => {
  afterEach(() => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.SQUARE_TOKEN_ENCRYPTION_KEY;
  });

  it("formats Square money the way the site writes prices", () => {
    assert.equal(formatPrice({ amount: 4500, currency: "AUD" }), "A$45");
    assert.equal(formatPrice({ amount: 4550, currency: "AUD" }), "A$45.50");
    assert.equal(formatPrice(undefined), null);
  });

  it("keeps only bookable appointment services", () => {
    assert.ok(catalog.some((service) => service.name === "Hot Towel Shave"));
    assert.ok(!catalog.some((service) => service.name === "Shampoo" || service.name === "Staff only"));
  });

  it("takes Square's prices, drops removed services and adds new ones", () => {
    const merged = mergeServices(siteServices, catalog);
    assert.ok(!merged.some((service) => service.id === standard.id), "removed in Square");
    assert.equal(merged.find((service) => service.id === "zero-fade")?.price, "A$99");
    // Unchanged descriptions keep the site's hand-placed line breaks.
    assert.equal(
      merged.find((service) => service.id === "zero-fade")?.description,
      siteServices.find((service) => service.id === "zero-fade")?.description,
    );
    assert.deepEqual(merged.at(-1), {
      id: "hot-towel-shave",
      squareId: "VAR_NEW",
      name: "Hot Towel Shave",
      description: "Straight razor shave.",
      price: "A$45.50",
    });
  });

  it("keeps the site's list when the Square IDs do not match", () => {
    const other = parseCatalog([
      {
        type: "ITEM",
        id: "X",
        item_data: { name: "Other", product_type: "APPOINTMENTS_SERVICE", variations: [{ type: "ITEM_VARIATION", id: "Y", item_variation_data: {} }] },
      },
    ]);
    assert.equal(mergeServices(siteServices, other), siteServices);
  });

  it("skips Square entirely until the automation is configured", async () => {
    assert.equal(await fetchCatalogServices(["LA3KEKYDA4KV3"]), null);
  });
});

describe("site data", () => {
  it("uses the saved data when Google and Square are not set up", () => {
    const site = mergeSiteData({}, null);
    assert.equal(site.services, siteServices);
    assert.ok(site.ratings.every((rating) => !rating.exact));
    assert.ok(site.reviews.length >= 6);
  });

  it("puts Google's live rating, hours and reviews first", () => {
    const live = parsePlace(place, "Broadbeach");
    const site = mergeSiteData({ broadbeach: live }, null);
    const rating = site.ratings.find((item) => item.id === "broadbeach");
    assert.deepEqual([rating?.rating, rating?.reviewCount, rating?.exact], [4.95, 63, true]);
    assert.equal(site.reviews.find((review) => review.location === "Broadbeach")?.author, "Ana López");
    assert.equal(site.reviews.filter((review) => review.location === "Broadbeach").length, 3);
    const broadbeach = site.locations.find((location) => location.id === "broadbeach");
    assert.equal(broadbeach?.openingHours.find((day) => day.day === "Thursday")?.closes, "19:00");
    assert.equal(broadbeach?.specialHours?.length, 2);
    // Surfers Paradise keeps its saved data.
    assert.ok(!site.ratings.find((item) => item.id === "surfers-paradise")?.exact);
  });
});
