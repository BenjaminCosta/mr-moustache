import type { AutomationLocation } from "./locations";

const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;

/** Visits older than this when first processed are skipped instead of emailed late. */
export const STALE_VISIT_DAYS = 7;
/** A regular only gets asked for a Google review once in this many days. */
export const REVIEW_COOLDOWN_DAYS = 180;
/** Tokens are refreshed once fewer than this many days remain (they last 30). */
export const TOKEN_REFRESH_REMAINING_DAYS = 23;

export const ATTENDED_STATUS = "ACCEPTED";

export type FollowUpKind = "review" | "rebooking";

export interface FollowUpInput {
  now: Date;
  endAt: Date;
  status: string | undefined;
  location: AutomationLocation | undefined;
  customer: {
    email?: string;
    squareUnsubscribed?: boolean;
    unsubscribed?: boolean;
    lastReviewRequestAt?: Date;
  };
  /** The customer has another accepted booking starting after this visit ended. */
  hasLaterBooking: boolean;
  /** When set (AUTOMATION_TEST_EMAILS), only these lowercase addresses get emails. */
  testEmails?: string[];
  reviewEnabled: boolean;
  rebookingEnabled: boolean;
  reviewDelayHours: number;
  rebookingDelayDays: number;
}

export type FollowUpDecision = { action: "queue"; sendAt: Date } | { action: "skip"; reason: string };

function skip(reason: string): FollowUpDecision {
  return { action: "skip", reason };
}

interface Recipient {
  status: string | undefined;
  location: AutomationLocation | undefined;
  customer: { email?: string; squareUnsubscribed?: boolean; unsubscribed?: boolean };
  testEmails?: string[];
}

/** Did the visit happen, and may we email this person? Checked when queuing and again when sending. */
function recipientSkipReason(input: Recipient) {
  if (input.status !== ATTENDED_STATUS) return `status_${(input.status || "unknown").toLowerCase()}`;
  if (!input.location) return "unknown_location";
  if (!input.customer.email) return "no_email";
  if (input.testEmails && !input.testEmails.includes(input.customer.email.toLowerCase())) {
    return "not_test_recipient";
  }
  if (input.customer.squareUnsubscribed || input.customer.unsubscribed) return "unsubscribed";
  return undefined;
}

function commonSkipReason(input: FollowUpInput) {
  if (input.status === ATTENDED_STATUS && input.now.getTime() - input.endAt.getTime() > STALE_VISIT_DAYS * DAY) {
    return "stale";
  }
  return recipientSkipReason(input);
}

export function decideReview(input: FollowUpInput): FollowUpDecision {
  if (!input.reviewEnabled) return skip("disabled");

  const common = commonSkipReason(input);
  if (common) return skip(common);
  if (!input.location?.reviewUrl) return skip("no_review_url");

  const last = input.customer.lastReviewRequestAt;
  if (last && input.now.getTime() - last.getTime() < REVIEW_COOLDOWN_DAYS * DAY) {
    return skip("cooldown");
  }

  return { action: "queue", sendAt: new Date(input.endAt.getTime() + input.reviewDelayHours * HOUR) };
}

export function decideRebooking(input: FollowUpInput): FollowUpDecision {
  if (!input.rebookingEnabled) return skip("disabled");

  const common = commonSkipReason(input);
  if (common) return skip(common);
  if (!input.location?.bookingUrl) return skip("no_booking_url");
  if (input.hasLaterBooking) return skip("rebooked");

  const sendAt = new Date(input.endAt.getTime() + input.rebookingDelayDays * DAY);
  if (sendAt.getTime() <= input.now.getTime()) return skip("stale");

  return { action: "queue", sendAt };
}

export interface SendCheckInput extends Recipient {
  kind: FollowUpKind;
  enabled: boolean;
  hasLaterBooking: boolean;
}

/**
 * Last check right before a queued email goes out: the visit may have been
 * marked as a no-show, the customer may have booked again or unsubscribed,
 * or the email type may have been switched off since it was queued.
 */
export function decideSend(input: SendCheckInput): { action: "send" } | { action: "skip"; reason: string } {
  if (!input.enabled) return { action: "skip", reason: "disabled" };

  const reason = recipientSkipReason(input);
  if (reason) return { action: "skip", reason };

  if (input.kind === "review" && !input.location?.reviewUrl) return { action: "skip", reason: "no_review_url" };
  if (input.kind === "rebooking") {
    if (!input.location?.bookingUrl) return { action: "skip", reason: "no_booking_url" };
    if (input.hasLaterBooking) return { action: "skip", reason: "rebooked" };
  }

  return { action: "send" };
}

export function tokenNeedsRefresh(expiresAt: Date, now: Date) {
  return expiresAt.getTime() - now.getTime() < TOKEN_REFRESH_REMAINING_DAYS * DAY;
}
