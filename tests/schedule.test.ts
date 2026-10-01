import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AutomationLocation } from "../src/lib/automation/locations";
import {
  bookingIsCancelled,
  decideRebooking,
  decideReview,
  tokenNeedsRefresh,
  type FollowUpInput,
} from "../src/lib/automation/schedule";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const now = new Date("2026-10-01T10:00:00Z");

const location: AutomationLocation = {
  key: "broadbeach",
  name: "Broadbeach",
  squareLocationId: "LOC_BB",
  reviewUrl: "https://g.page/r/review",
  bookingUrl: "https://book.example.com",
};

function input(overrides: Partial<FollowUpInput> = {}): FollowUpInput {
  return {
    now,
    endAt: new Date(now.getTime() - 2 * HOUR),
    status: "ACCEPTED",
    location,
    customer: { email: "client@example.com" },
    hasUpcomingBooking: false,
    reviewEnabled: true,
    rebookingEnabled: true,
    reviewDelayHours: 24,
    rebookingDelayDays: 28,
    ...overrides,
  };
}

describe("decideReview", () => {
  it("schedules the review for end + delay", () => {
    const decision = decideReview(input());
    assert.equal(decision.action, "send");
    assert.ok(decision.action === "send" && decision.scheduled);
    assert.equal(
      decision.action === "send" && decision.sendAt.toISOString(),
      new Date(now.getTime() + 22 * HOUR).toISOString(),
    );
  });

  it("sends immediately once the delay has passed", () => {
    const decision = decideReview(input({ endAt: new Date(now.getTime() - 30 * HOUR) }));
    assert.deepEqual(decision, { action: "send", sendAt: now, scheduled: false });
  });

  it("skips when disabled, not attended, stale or unreachable", () => {
    const reason = (overrides: Partial<FollowUpInput>) => {
      const decision = decideReview(input(overrides));
      return decision.action === "skip" ? decision.reason : "send";
    };

    assert.equal(reason({ reviewEnabled: false }), "disabled");
    assert.equal(reason({ status: "NO_SHOW" }), "status_no_show");
    assert.equal(reason({ status: "CANCELLED_BY_CUSTOMER" }), "status_cancelled_by_customer");
    assert.equal(reason({ endAt: new Date(now.getTime() - 8 * DAY) }), "stale");
    assert.equal(reason({ location: undefined }), "unknown_location");
    assert.equal(reason({ location: { ...location, reviewUrl: undefined } }), "no_review_url");
    assert.equal(reason({ customer: {} }), "no_email");
    assert.equal(reason({ customer: { email: "a@b.co", squareUnsubscribed: true } }), "unsubscribed");
    assert.equal(reason({ customer: { email: "a@b.co", unsubscribed: true } }), "unsubscribed");
  });

  it("asks regulars at most once per cooldown", () => {
    const recent = decideReview(input({ customer: { email: "a@b.co", lastReviewRequestAt: new Date(now.getTime() - 30 * DAY) } }));
    const old = decideReview(input({ customer: { email: "a@b.co", lastReviewRequestAt: new Date(now.getTime() - 200 * DAY) } }));
    assert.deepEqual(recent, { action: "skip", reason: "cooldown" });
    assert.equal(old.action, "send");
  });
});

describe("decideRebooking", () => {
  it("schedules the reminder 28 days after the visit", () => {
    const visitEnd = new Date(now.getTime() - 2 * HOUR);
    const decision = decideRebooking(input({ endAt: visitEnd }));
    assert.equal(decision.action, "send");
    assert.equal(
      decision.action === "send" && decision.sendAt.toISOString(),
      new Date(visitEnd.getTime() + 28 * DAY).toISOString(),
    );
  });

  it("skips customers who already rebooked", () => {
    assert.deepEqual(decideRebooking(input({ hasUpcomingBooking: true })), { action: "skip", reason: "rebooked" });
  });

  it("does not schedule beyond Resend's 30-day window", () => {
    assert.deepEqual(decideRebooking(input({ rebookingDelayDays: 35 })), { action: "skip", reason: "too_far" });
  });

  it("needs a booking URL and respects the flag", () => {
    assert.deepEqual(decideRebooking(input({ location: { ...location, bookingUrl: undefined } })), {
      action: "skip",
      reason: "no_booking_url",
    });
    assert.deepEqual(decideRebooking(input({ rebookingEnabled: false })), { action: "skip", reason: "disabled" });
  });
});

describe("AUTOMATION_TEST_EMAILS", () => {
  it("only emails listed addresses while testing", () => {
    const testEmails = ["benja@example.com"];
    const listed = input({ testEmails, customer: { email: "Benja@Example.com" } });
    const other = input({ testEmails, customer: { email: "client@example.com" } });

    assert.equal(decideReview(listed).action, "send");
    assert.equal(decideRebooking(listed).action, "send");
    assert.deepEqual(decideReview(other), { action: "skip", reason: "not_test_recipient" });
    assert.deepEqual(decideRebooking(other), { action: "skip", reason: "not_test_recipient" });
  });

  it("emails everyone when the list is not set", () => {
    assert.equal(decideReview(input({ testEmails: undefined })).action, "send");
  });
});

describe("helpers", () => {
  it("recognises cancelled bookings", () => {
    assert.equal(bookingIsCancelled("NO_SHOW"), true);
    assert.equal(bookingIsCancelled("DECLINED"), true);
    assert.equal(bookingIsCancelled("ACCEPTED"), false);
    assert.equal(bookingIsCancelled(undefined), false);
  });

  it("refreshes tokens about once a week", () => {
    assert.equal(tokenNeedsRefresh(new Date(now.getTime() + 29 * DAY), now), false);
    assert.equal(tokenNeedsRefresh(new Date(now.getTime() + 22 * DAY), now), true);
  });
});

describe("emailListEnv", () => {
  it("parses a comma-separated, case-insensitive list", async () => {
    const { emailListEnv } = await import("../src/lib/automation/env");
    process.env.TEST_LIST = " A@b.co, ,c@D.co ";
    assert.deepEqual(emailListEnv("TEST_LIST"), ["a@b.co", "c@d.co"]);
    process.env.TEST_LIST = " ";
    assert.equal(emailListEnv("TEST_LIST"), undefined);
    delete process.env.TEST_LIST;
  });
});
