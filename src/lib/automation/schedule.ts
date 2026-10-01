import type { AutomationLocation } from "./locations";

const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;

/** Visits older than this when first processed are skipped instead of emailed late. */
export const STALE_VISIT_DAYS = 7;
/** A regular only gets asked for a Google review once in this many days. */
export const REVIEW_COOLDOWN_DAYS = 180;
/** Resend can hold a scheduled email for up to 30 days; keep a margin. */
export const MAX_SCHEDULE_AHEAD_DAYS = 29;
/** Tokens are refreshed once fewer than this many days remain (they last 30). */
export const TOKEN_REFRESH_REMAINING_DAYS = 23;

export const ATTENDED_STATUS = "ACCEPTED";
const CANCELLED_STATUSES = new Set([
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_BY_SELLER",
  "DECLINED",
  "NO_SHOW",
]);

export function bookingIsCancelled(status: string | undefined) {
  return !!status && CANCELLED_STATUSES.has(status);
}

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
  hasUpcomingBooking: boolean;
  /** When set (AUTOMATION_TEST_EMAILS), only these lowercase addresses get emails. */
  testEmails?: string[];
  reviewEnabled: boolean;
  rebookingEnabled: boolean;
  reviewDelayHours: number;
  rebookingDelayDays: number;
}

export type FollowUpDecision =
  | { action: "send"; sendAt: Date; scheduled: boolean }
  | { action: "skip"; reason: string };

function skip(reason: string): FollowUpDecision {
  return { action: "skip", reason };
}

function sendAtOrNow(now: Date, target: Date): FollowUpDecision {
  // Anything due within a minute is sent straight away rather than scheduled.
  if (target.getTime() - now.getTime() <= 60_000) {
    return { action: "send", sendAt: now, scheduled: false };
  }
  return { action: "send", sendAt: target, scheduled: true };
}

/** Checks shared by both emails: did the visit happen and may we email this person? */
function commonSkipReason(input: FollowUpInput) {
  if (input.status !== ATTENDED_STATUS) return `status_${(input.status || "unknown").toLowerCase()}`;
  if (input.now.getTime() - input.endAt.getTime() > STALE_VISIT_DAYS * DAY) return "stale";
  if (!input.location) return "unknown_location";
  if (!input.customer.email) return "no_email";
  if (input.testEmails && !input.testEmails.includes(input.customer.email.toLowerCase())) {
    return "not_test_recipient";
  }
  if (input.customer.squareUnsubscribed || input.customer.unsubscribed) return "unsubscribed";
  return undefined;
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

  return sendAtOrNow(input.now, new Date(input.endAt.getTime() + input.reviewDelayHours * HOUR));
}

export function decideRebooking(input: FollowUpInput): FollowUpDecision {
  if (!input.rebookingEnabled) return skip("disabled");

  const common = commonSkipReason(input);
  if (common) return skip(common);
  if (!input.location?.bookingUrl) return skip("no_booking_url");
  if (input.hasUpcomingBooking) return skip("rebooked");

  const target = new Date(input.endAt.getTime() + input.rebookingDelayDays * DAY);
  if (target.getTime() <= input.now.getTime()) return skip("stale");
  if (target.getTime() - input.now.getTime() > MAX_SCHEDULE_AHEAD_DAYS * DAY) return skip("too_far");

  return sendAtOrNow(input.now, target);
}

export function tokenNeedsRefresh(expiresAt: Date, now: Date) {
  return expiresAt.getTime() - now.getTime() < TOKEN_REFRESH_REMAINING_DAYS * DAY;
}
