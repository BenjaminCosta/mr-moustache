import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AutomationLocation } from "../src/lib/automation/locations";
import {
  decideRebooking,
  decideReview,
  decideSend,
  tokenNeedsRefresh,
  type FollowUpInput,
  type SendCheckInput,
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
    hasLaterBooking: false,
    reviewEnabled: true,
    rebookingEnabled: true,
    reviewDelayHours: 24,
    rebookingDelayDays: 28,
    ...overrides,
  };
}

const reason = (decision: { action: string; reason?: string }) =>
  decision.action === "skip" ? decision.reason : decision.action;

describe("decideReview", () => {
  it("queues the review for end + delay", () => {
    const endAt = new Date(now.getTime() - 2 * HOUR);
    assert.deepEqual(decideReview(input({ endAt })), {
      action: "queue",
      sendAt: new Date(endAt.getTime() + 24 * HOUR),
    });
  });

  it("queues with a past send time once the delay has passed (sent on this run)", () => {
    const decision = decideReview(input({ endAt: new Date(now.getTime() - 30 * HOUR) }));
    assert.equal(decision.action, "queue");
    assert.ok(decision.action === "queue" && decision.sendAt < now);
  });

  it("skips when disabled, not attended, stale or unreachable", () => {
    const why = (overrides: Partial<FollowUpInput>) => reason(decideReview(input(overrides)));

    assert.equal(why({ reviewEnabled: false }), "disabled");
    assert.equal(why({ status: "NO_SHOW" }), "status_no_show");
    assert.equal(why({ status: "CANCELLED_BY_CUSTOMER" }), "status_cancelled_by_customer");
    assert.equal(why({ endAt: new Date(now.getTime() - 8 * DAY) }), "stale");
    assert.equal(why({ status: "NO_SHOW", endAt: new Date(now.getTime() - 8 * DAY) }), "status_no_show");
    assert.equal(why({ location: undefined }), "unknown_location");
    assert.equal(why({ location: { ...location, reviewUrl: undefined } }), "no_review_url");
    assert.equal(why({ customer: {} }), "no_email");
    assert.equal(why({ customer: { email: "a@b.co", squareUnsubscribed: true } }), "unsubscribed");
    assert.equal(why({ customer: { email: "a@b.co", unsubscribed: true } }), "unsubscribed");
  });

  it("asks regulars at most once per cooldown", () => {
    const recent = decideReview(input({ customer: { email: "a@b.co", lastReviewRequestAt: new Date(now.getTime() - 30 * DAY) } }));
    const old = decideReview(input({ customer: { email: "a@b.co", lastReviewRequestAt: new Date(now.getTime() - 200 * DAY) } }));
    assert.deepEqual(recent, { action: "skip", reason: "cooldown" });
    assert.equal(old.action, "queue");
  });
});

describe("decideRebooking", () => {
  it("queues the reminder 28 days after the visit", () => {
    const endAt = new Date(now.getTime() - 2 * HOUR);
    assert.deepEqual(decideRebooking(input({ endAt })), {
      action: "queue",
      sendAt: new Date(endAt.getTime() + 28 * DAY),
    });
  });

  it("allows delays longer than 30 days now that Resend does no scheduling", () => {
    assert.equal(decideRebooking(input({ rebookingDelayDays: 42 })).action, "queue");
  });

  it("skips customers who already have a later booking", () => {
    assert.deepEqual(decideRebooking(input({ hasLaterBooking: true })), { action: "skip", reason: "rebooked" });
  });

  it("needs a booking URL and respects the flag", () => {
    assert.equal(reason(decideRebooking(input({ location: { ...location, bookingUrl: undefined } }))), "no_booking_url");
    assert.equal(reason(decideRebooking(input({ rebookingEnabled: false }))), "disabled");
  });
});

describe("decideSend (re-check right before sending)", () => {
  function send(overrides: Partial<SendCheckInput> = {}): SendCheckInput {
    return {
      kind: "rebooking",
      enabled: true,
      status: "ACCEPTED",
      location,
      customer: { email: "client@example.com" },
      hasLaterBooking: false,
      ...overrides,
    };
  }

  it("sends when nothing changed", () => {
    assert.deepEqual(decideSend(send()), { action: "send" });
    assert.deepEqual(decideSend(send({ kind: "review" })), { action: "send" });
  });

  it("drops the email when the visit became a no-show or was cancelled", () => {
    assert.equal(reason(decideSend(send({ status: "NO_SHOW" }))), "status_no_show");
    assert.equal(reason(decideSend(send({ kind: "review", status: "CANCELLED_BY_SELLER" }))), "status_cancelled_by_seller");
  });

  it("drops the reminder when the customer booked again, but still asks for the review", () => {
    assert.equal(reason(decideSend(send({ hasLaterBooking: true }))), "rebooked");
    assert.equal(reason(decideSend(send({ kind: "review", hasLaterBooking: true }))), "send");
  });

  it("drops the email after an unsubscribe or when the type is switched off", () => {
    assert.equal(reason(decideSend(send({ customer: { email: "a@b.co", unsubscribed: true } }))), "unsubscribed");
    assert.equal(reason(decideSend(send({ customer: { email: "a@b.co", squareUnsubscribed: true } }))), "unsubscribed");
    assert.equal(reason(decideSend(send({ customer: {} }))), "no_email");
    assert.equal(reason(decideSend(send({ enabled: false }))), "disabled");
  });

  it("respects the test list at send time too", () => {
    assert.equal(reason(decideSend(send({ testEmails: ["benja@example.com"] }))), "not_test_recipient");
    assert.equal(
      reason(decideSend(send({ testEmails: ["benja@example.com"], customer: { email: "Benja@example.com" } }))),
      "send",
    );
  });
});

describe("AUTOMATION_TEST_EMAILS", () => {
  it("only queues emails for listed addresses while testing", () => {
    const testEmails = ["benja@example.com"];
    const listed = input({ testEmails, customer: { email: "Benja@Example.com" } });
    const other = input({ testEmails, customer: { email: "client@example.com" } });

    assert.equal(decideReview(listed).action, "queue");
    assert.equal(decideRebooking(listed).action, "queue");
    assert.deepEqual(decideReview(other), { action: "skip", reason: "not_test_recipient" });
    assert.deepEqual(decideRebooking(other), { action: "skip", reason: "not_test_recipient" });
  });

  it("emails everyone when the list is not set", () => {
    assert.equal(decideReview(input({ testEmails: undefined })).action, "queue");
  });
});

describe("helpers", () => {
  it("refreshes tokens about once a week", () => {
    assert.equal(tokenNeedsRefresh(new Date(now.getTime() + 29 * DAY), now), false);
    assert.equal(tokenNeedsRefresh(new Date(now.getTime() + 22 * DAY), now), true);
  });
});

describe("env helpers", () => {
  it("parses a comma-separated, case-insensitive list", async () => {
    const { emailListEnv } = await import("../src/lib/automation/env");
    process.env.TEST_LIST = " A@b.co, ,c@D.co ";
    assert.deepEqual(emailListEnv("TEST_LIST"), ["a@b.co", "c@d.co"]);
    process.env.TEST_LIST = " ";
    assert.equal(emailListEnv("TEST_LIST"), undefined);
    delete process.env.TEST_LIST;
  });

  it("reads the email signature with \\n line breaks", async () => {
    const { emailSignature } = await import("../src/lib/automation/env");
    delete process.env.CUSTOMER_EMAIL_SIGNATURE;
    assert.equal(emailSignature(), "Mr Moustache Barbershop");
    process.env.CUSTOMER_EMAIL_SIGNATURE = "Aitor\\nMr Moustache Barbershop";
    assert.equal(emailSignature(), "Aitor\nMr Moustache Barbershop");
    delete process.env.CUSTOMER_EMAIL_SIGNATURE;
  });
});
