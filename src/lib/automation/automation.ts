import { booleanEnv, emailListEnv, positiveIntegerEnv } from "./env";
import { rebookingEmailContent, reviewEmailContent } from "./email-content";
import { automationLocations, locationForSquareId } from "./locations";
import { cancelScheduledEmail, sendCustomerEmail } from "./resend";
import {
  bookingIsCancelled,
  decideRebooking,
  decideReview,
  tokenNeedsRefresh,
  type FollowUpDecision,
  type FollowUpInput,
} from "./schedule";
import {
  bookingEndAt,
  listBookings,
  retrieveBooking,
  retrieveCustomer,
  SquareRequestError,
  type SquareBooking,
  type SquareCustomer,
} from "./square";
import {
  accessTokenFor,
  customerHasUpcomingBooking,
  errorMessage,
  getConnection,
  getCustomer,
  listConnections,
  listDueVisits,
  markVisitFailed,
  markVisitProcessed,
  recordBooking,
  refreshConnection,
  updateCustomer,
  updateFollowUp,
  type FollowUpRecord,
  type SquareConnection,
  type StoredBooking,
} from "./store";
import { unsubscribeUrl } from "./unsubscribe";

const DAY = 86_400_000;
const SYNC_PAST_DAYS = 2;
const SYNC_FUTURE_DAYS = 28;
const MAX_VISITS_PER_RUN = 150;
const MAX_ATTEMPTS = 3;
/** Stop picking up new visits after this long so the run ends inside maxDuration. */
const RUN_TIME_BUDGET_MS = 240_000;
/** Resend's default rate limit is a few requests per second. */
const RESEND_SPACING_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Booking changes (webhook + daily sync) ----------

/**
 * Stores the latest version of a booking and reacts to it: a cancelled visit
 * loses its scheduled emails, and a new upcoming booking cancels the
 * customer's pending "time to rebook" reminder.
 */
export async function handleBookingChange(merchantId: string, booking: SquareBooking, now = new Date()) {
  const { changed, current } = await recordBooking(merchantId, booking);
  if (!changed || !current) return;

  if (bookingIsCancelled(current.status)) {
    await cancelBookingFollowUps(current, `booking_${current.status?.toLowerCase()}`, now);
  }

  if (current.status === "ACCEPTED" && current.customerId && current.startAt > now) {
    await cancelPendingRebooking(merchantId, current.customerId, "rebooked", now);
  }
}

async function cancelFollowUp(
  bookingId: string,
  kind: "review" | "rebooking",
  record: FollowUpRecord | undefined,
  reason: string,
  now: Date,
) {
  if (record?.state !== "scheduled" || !record.emailId || !record.sendAt || record.sendAt <= now) {
    return false;
  }

  try {
    await cancelScheduledEmail(record.emailId);
    await updateFollowUp(bookingId, kind, { ...record, state: "cancelled", reason, updatedAt: now });
  } catch (error) {
    await updateFollowUp(bookingId, kind, {
      ...record,
      state: "cancel_failed",
      reason: `${reason}: ${errorMessage(error)}`,
      updatedAt: now,
    });
  }
  return true;
}

async function cancelBookingFollowUps(booking: StoredBooking, reason: string, now: Date) {
  await cancelFollowUp(booking.id, "review", booking.review, reason, now);
  const cancelled = await cancelFollowUp(booking.id, "rebooking", booking.rebooking, reason, now);

  if (cancelled && booking.customerId) {
    const customer = await getCustomer(booking.merchantId, booking.customerId);
    if (customer.pendingRebooking?.bookingId === booking.id) {
      await updateCustomer(booking.merchantId, booking.customerId, { pendingRebooking: null });
    }
  }
}

export async function cancelPendingRebooking(
  merchantId: string,
  customerId: string,
  reason: string,
  now = new Date(),
) {
  const { pendingRebooking } = await getCustomer(merchantId, customerId);
  if (!pendingRebooking) return;

  if (pendingRebooking.sendAt > now) {
    await cancelFollowUp(
      pendingRebooking.bookingId,
      "rebooking",
      {
        state: "scheduled",
        emailId: pendingRebooking.emailId,
        sendAt: pendingRebooking.sendAt,
        updatedAt: now,
      },
      reason,
      now,
    );
  }
  await updateCustomer(merchantId, customerId, { pendingRebooking: null });
}

// ---------- Finished visits ----------

interface RunContext {
  now: Date;
  connections: Map<string, SquareConnection | undefined>;
  reviewEnabled: boolean;
  rebookingEnabled: boolean;
  reviewDelayHours: number;
  rebookingDelayDays: number;
  testEmails?: string[];
}

async function connectionFor(context: RunContext, merchantId: string) {
  if (!context.connections.has(merchantId)) {
    context.connections.set(merchantId, await getConnection(merchantId));
  }
  const connection = context.connections.get(merchantId);
  if (!connection) throw new Error(`No Square connection for merchant ${merchantId}`);
  return connection;
}

async function fetchOrUndefined<T>(request: Promise<T>) {
  try {
    return await request;
  } catch (error) {
    if (error instanceof SquareRequestError && error.status === 404) return undefined;
    throw error;
  }
}

function skipped(reason: string, now: Date): FollowUpRecord {
  return { state: "skipped", reason, updatedAt: now };
}

async function processVisit(visit: StoredBooking, context: RunContext) {
  const { now } = context;
  const connection = await connectionFor(context, visit.merchantId);
  const accessToken = await accessTokenFor(connection);

  // Re-read the booking: staff may have marked it NO_SHOW after the webhook.
  const latest = await fetchOrUndefined(retrieveBooking(connection.environment, accessToken, visit.id));
  if (!latest) {
    if (!visit.review) await updateFollowUp(visit.id, "review", skipped("booking_not_found", now));
    if (!visit.rebooking) await updateFollowUp(visit.id, "rebooking", skipped("booking_not_found", now));
    return markVisitProcessed(visit.id);
  }
  await recordBooking(visit.merchantId, latest);

  // Moved to a later time (and the webhook was missed): wait for the new end.
  const endAt = bookingEndAt(latest);
  if (endAt > now) return;

  const customerId = latest.customer_id;
  let squareCustomer: SquareCustomer | undefined;
  if (customerId) {
    squareCustomer = await fetchOrUndefined(retrieveCustomer(connection.environment, accessToken, customerId));
  }

  const stored = customerId ? await getCustomer(visit.merchantId, customerId) : {};
  const input: FollowUpInput = {
    now,
    endAt,
    status: latest.status,
    location: locationForSquareId(latest.location_id),
    customer: {
      email: squareCustomer?.email_address?.trim() || undefined,
      squareUnsubscribed: squareCustomer?.preferences?.email_unsubscribed,
      unsubscribed: !!stored.unsubscribedAt,
      lastReviewRequestAt: stored.lastReviewRequestAt,
    },
    hasUpcomingBooking: customerId
      ? await customerHasUpcomingBooking(visit.merchantId, customerId, now)
      : false,
    reviewEnabled: context.reviewEnabled,
    rebookingEnabled: context.rebookingEnabled,
    reviewDelayHours: context.reviewDelayHours,
    rebookingDelayDays: context.rebookingDelayDays,
    testEmails: context.testEmails,
  };

  // Each email records its own outcome right away, so a retry after a
  // partial failure never sends the same email twice.
  if (!visit.review) {
    const decision = decideReview(input);
    if (decision.action === "skip" || !customerId || !squareCustomer) {
      await updateFollowUp(visit.id, "review", skipped(decisionReason(decision), now));
    } else {
      const unsubscribe = unsubscribeUrl(visit.merchantId, customerId);
      const location = input.location!;
      const content = reviewEmailContent(squareCustomer.given_name, location.name, location.reviewUrl!, unsubscribe);
      const emailId = await sendCustomerEmail({
        to: input.customer.email!,
        ...content,
        scheduledAt: decision.scheduled ? decision.sendAt.toISOString() : undefined,
        idempotencyKey: `review/${visit.id}`,
        unsubscribeUrl: unsubscribe,
        tags: [
          { name: "type", value: "review" },
          { name: "location", value: location.key },
        ],
      });
      await updateFollowUp(visit.id, "review", {
        state: decision.scheduled ? "scheduled" : "sent",
        emailId,
        sendAt: decision.sendAt,
        updatedAt: now,
      });
      await updateCustomer(visit.merchantId, customerId, { lastReviewRequestAt: now });
      await sleep(RESEND_SPACING_MS);
    }
  }

  if (!visit.rebooking) {
    const decision = decideRebooking(input);
    if (decision.action === "skip" || !customerId || !squareCustomer) {
      await updateFollowUp(visit.id, "rebooking", skipped(decisionReason(decision), now));
    } else {
      // Only the most recent visit keeps a reminder.
      await cancelPendingRebooking(visit.merchantId, customerId, "superseded", now);

      const unsubscribe = unsubscribeUrl(visit.merchantId, customerId);
      const location = input.location!;
      const content = rebookingEmailContent(squareCustomer.given_name, location.name, location.bookingUrl!, unsubscribe);
      const emailId = await sendCustomerEmail({
        to: input.customer.email!,
        ...content,
        scheduledAt: decision.scheduled ? decision.sendAt.toISOString() : undefined,
        idempotencyKey: `rebooking/${visit.id}`,
        unsubscribeUrl: unsubscribe,
        tags: [
          { name: "type", value: "rebooking" },
          { name: "location", value: location.key },
        ],
      });
      await updateFollowUp(visit.id, "rebooking", {
        state: decision.scheduled ? "scheduled" : "sent",
        emailId,
        sendAt: decision.sendAt,
        updatedAt: now,
      });
      if (decision.scheduled) {
        await updateCustomer(visit.merchantId, customerId, {
          pendingRebooking: { bookingId: visit.id, emailId, sendAt: decision.sendAt },
        });
      }
      await sleep(RESEND_SPACING_MS);
    }
  }

  await markVisitProcessed(visit.id);
}

function decisionReason(decision: FollowUpDecision) {
  return decision.action === "skip" ? decision.reason : "no_customer";
}

// ---------- Daily run ----------

export interface DailyRunSummary {
  tokensRefreshed: number;
  bookingsSynced: number;
  visitsProcessed: number;
  visitsFailed: number;
  errors: string[];
}

export async function runDailyAutomation(now = new Date()): Promise<DailyRunSummary> {
  const startedAt = Date.now();
  const summary: DailyRunSummary = {
    tokensRefreshed: 0,
    bookingsSynced: 0,
    visitsProcessed: 0,
    visitsFailed: 0,
    errors: [],
  };

  // 1. Keep Square tokens fresh (they expire after 30 days).
  const connections = new Map<string, SquareConnection | undefined>();
  for (const connection of await listConnections()) {
    let current = connection;
    if (tokenNeedsRefresh(connection.expiresAt, now)) {
      try {
        current = await refreshConnection(connection);
        summary.tokensRefreshed += 1;
      } catch (error) {
        summary.errors.push(`refresh ${connection.merchantId}: ${errorMessage(error)}`);
      }
    }
    connections.set(current.merchantId, current);
  }

  // 2. Re-sync recent and upcoming bookings in case a webhook was missed.
  const configuredLocationIds = automationLocations().map((location) => location.squareLocationId);
  for (const connection of connections.values()) {
    if (!connection) continue;
    try {
      const accessToken = await accessTokenFor(connection);
      const locationIds = configuredLocationIds.length
        ? configuredLocationIds
        : connection.locations.filter((location) => location.status !== "INACTIVE").map((location) => location.id);

      for (const locationId of locationIds) {
        const bookings = await listBookings(
          connection.environment,
          accessToken,
          locationId,
          new Date(now.getTime() - SYNC_PAST_DAYS * DAY),
          new Date(now.getTime() + SYNC_FUTURE_DAYS * DAY),
        );
        for (const booking of bookings) {
          await handleBookingChange(connection.merchantId, booking, now);
          summary.bookingsSynced += 1;
        }
      }
    } catch (error) {
      summary.errors.push(`sync ${connection.merchantId}: ${errorMessage(error)}`);
    }
  }

  // 3. Decide and send follow-ups for visits that have finished.
  const context: RunContext = {
    now,
    connections,
    reviewEnabled: booleanEnv("REVIEW_AUTOMATION_ENABLED"),
    rebookingEnabled: booleanEnv("REBOOKING_AUTOMATION_ENABLED"),
    reviewDelayHours: positiveIntegerEnv("REVIEW_DELAY_HOURS", 24),
    rebookingDelayDays: positiveIntegerEnv("REBOOKING_DELAY_DAYS", 28),
    testEmails: emailListEnv("AUTOMATION_TEST_EMAILS"),
  };

  for (const visit of await listDueVisits(now, MAX_VISITS_PER_RUN)) {
    if (Date.now() - startedAt > RUN_TIME_BUDGET_MS) break;
    try {
      await processVisit(visit, context);
      summary.visitsProcessed += 1;
    } catch (error) {
      const attempts = visit.attempts + 1;
      summary.visitsFailed += 1;
      summary.errors.push(`visit ${visit.id}: ${errorMessage(error)}`);
      await markVisitFailed(visit.id, attempts, error, attempts >= MAX_ATTEMPTS).catch(() => undefined);
    }
  }

  return summary;
}

// ---------- Opt-out ----------

export async function unsubscribeCustomer(merchantId: string, customerId: string) {
  const now = new Date();
  await cancelPendingRebooking(merchantId, customerId, "unsubscribed", now);
  await updateCustomer(merchantId, customerId, { unsubscribedAt: now });
}
