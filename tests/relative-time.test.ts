import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { googleRelativeTime, reviewCountLabel } from "../src/lib/relative-time";
import { reviews } from "../src/data/reviews";

const at = (iso: string) => Date.parse(`${iso}T09:00:00Z`);

describe("review dates", () => {
  it("reads like Google's relative dates", () => {
    const posted = "2026-09-22";
    assert.equal(googleRelativeTime(posted, at("2026-09-22")), "today");
    assert.equal(googleRelativeTime(posted, at("2026-09-23")), "a day ago");
    assert.equal(googleRelativeTime(posted, at("2026-09-25")), "3 days ago");
    assert.equal(googleRelativeTime(posted, at("2026-09-29")), "a week ago");
    assert.equal(googleRelativeTime(posted, at("2026-10-13")), "3 weeks ago");
    assert.equal(googleRelativeTime(posted, at("2026-10-23")), "a month ago");
    assert.equal(googleRelativeTime(posted, at("2027-03-01")), "5 months ago");
    assert.equal(googleRelativeTime(posted, at("2027-09-30")), "a year ago");
    assert.equal(googleRelativeTime(posted, at("2029-01-01")), "2 years ago");
  });

  it("never shows a future date", () => {
    assert.equal(googleRelativeTime("2026-10-05", at("2026-10-03")), "today");
  });

  it("gives every review a real calendar date", () => {
    for (const review of reviews) {
      assert.match(review.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(!Number.isNaN(Date.parse(review.publishedAt)), review.id);
    }
  });

  it("shows review totals as a floor", () => {
    assert.equal(reviewCountLabel(60), "60+");
  });
});
