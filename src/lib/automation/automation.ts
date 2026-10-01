import { booleanEnv, emailListEnv, emailSignature, positiveIntegerEnv } from "./env";
import { rebookingEmailContent, reviewEmailContent } from "./email-content";
import { automationLocations, locationForSquareId, type AutomationLocation } from "./locations";
import { sendCustomerEmail } from "./resend";
import {
  decideRebooking,
  decideReview,
  decideSend,
  tokenNeedsRefresh,
  type FollowUpDecision,
  type FollowUpInput,
  type FollowUpKind,
} from "./schedule";
import {
  bookingEndAt,
  listBookings,
  retrieveBooking,
  retrieveCustomer,
  SquareRequestError,
  type SquareBooking,
} from "./square";
import {
  accessTokenFor,
  customerHasBookingAfter,
  deleteOutbox,
  enqueueEmail,
  errorMessage,
  getBooking,
  getConnection,
  getCustomer,
  listConnections,
  listDueOutbox,
  listDueVisits,
  markOutboxAttempt,
  markVisitFailed,
  markVisitProcessed,
  recordBooking,
  refreshConnection,
  releaseOutboxAttempt,
  updateCustomer,
  updateFollowUp,
  type FollowUpRecord,
  type OutboxItem,
  type SquareConnection,
  type StoredBooking,
} from "./store";
import { unsubscribeUrl } from "./unsubscribe";

const DAY = 86_400_000;
const SYNC_PAST_DAYS = 2;
const SYNC_FUTURE_DAYS = 28;
const MAX_VISITS_PER_RUN = 150;
const MAX_EMAILS_PER_RUN = 150;
const MAX_ATTEMPTS = 3;
/** Stop picking up new work after this long so the run ends inside maxDuration. */
const RUN_TIME_BUDGET_MS = 240_000;
/** Resend's default rate limit is a few requests per second. */
const RESEND_SPACING_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Booking changes (webhook + daily sync) ----------

/**
 * Stores the latest version of a booking. Cancellations, no-shows and new
 * bookings need no extra work here: queued emails are re-checked against the
 * stored bookings right before they are sent.
 */
export async function handleBookingChange(merchantId: string, booking: SquareBooking) {
  await recordBooking(merchantId, booking);
}

// ---------- Shared helpers ----------

interface RunContext {
  now: Date;
  connections: Map<string, SquareConnection | undefined>;
  reviewEnabled: boolean;
  rebookingEnabled: boolean;
  reviewDelayHours: number;
  rebookingDelayDays: number;
  testEmails?: string[];
}

function contextFromEnv(now: Date, connections = new Map<string, SquareConnection | undefined>()): RunContext {
  return {
    now,
    connections,
    reviewEnabled: booleanEnv("REVIEW_AUTOMATION_ENABLED"),
    rebookingEnabled: booleanEnv("REBOOKING_AUTOMATION_ENABLED"),
    reviewDelayHours: positiveIntegerEnv("REVIEW_DELAY_HOURS", 24),
    rebookingDelayDays: positiveIntegerEnv("REBOOKING_DELAY_DAYS", 28),
    testEmails: emailListEnv("AUTOMATION_TEST_EMAILS"),
  };
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

/** The real email for a follow-up, as customers receive it. */
export function followUpEmail(
  kind: FollowUpKind,
  location: AutomationLocation,
  merchantId: string,
  customerId: string,
  name: string | undefined,
) {
  const input = {
    name,
    locationName: location.name,
    unsubscribeUrl: unsubscribeUrl(merchantId, customerId),
    signature: emailSignature(),
  };
  return kind === "review"
    ? reviewEmailContent({ ...input, url: location.reviewUrl! })
    : rebookingEmailContent({ ...input, url: location.bookingUrl! });
}

// ---------- 1. Finished visits: decide and queue ----------

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
  const squareCustomer = customerId
    ? await fetchOrUndefined(retrieveCustomer(connection.environment, accessToken, customerId))
    : undefined;
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
    hasLaterBooking: customerId ? await customerHasBookingAfter(visit.merchantId, customerId, endAt) : false,
    reviewEnabled: context.reviewEnabled,
    rebookingEnabled: context.rebookingEnabled,
    reviewDelayHours: context.reviewDelayHours,
    rebookingDelayDays: context.rebookingDelayDays,
    testEmails: context.testEmails,
  };

  const queue = async (kind: FollowUpKind, decision: FollowUpDecision) => {
    if (decision.action === "skip" || !customerId) {
      await updateFollowUp(visit.id, kind, skipped(decision.action === "skip" ? decision.reason : "no_customer", now));
      return false;
    }
    await enqueueEmail({ bookingId: visit.id, merchantId: visit.merchantId, customerId, kind, sendAt: decision.sendAt });
    await updateFollowUp(visit.id, kind, { state: "scheduled", sendAt: decision.sendAt, updatedAt: now });
    return true;
  };

  if (!visit.review && (await queue("review", decideReview(input)))) {
    // Counts from queueing, so two visits close together never both ask.
    await updateCustomer(visit.merchantId, customerId!, { lastReviewRequestAt: now });
  }
  if (!visit.rebooking) await queue("rebooking", decideRebooking(input));

  await markVisitProcessed(visit.id);
}

// ---------- 2. Queued emails: re-check and send ----------

type SendOutcome = "sent" | "skipped" | "failed" | "retry";

async function sendQueuedEmail(item: OutboxItem, context: RunContext): Promise<SendOutcome> {
  const { now } = context;
  const finish = async (record: FollowUpRecord) => {
    await updateFollowUp(item.bookingId, item.kind, record);
    await deleteOutbox(item.id);
  };

  // A previous run died between claiming and confirming this send. It may
  // already have gone out, and a duplicate is worse than a missed email.
  if (item.attemptAt) {
    await finish({ state: "failed", reason: "interrupted", sendAt: item.sendAt, updatedAt: now });
    return "failed";
  }

  const booking = await getBooking(item.bookingId);
  if (!booking) {
    await deleteOutbox(item.id);
    return "skipped";
  }

  const connection = await connectionFor(context, item.merchantId);
  const accessToken = await accessTokenFor(connection);
  const customer = await fetchOrUndefined(retrieveCustomer(connection.environment, accessToken, item.customerId));
  const stored = await getCustomer(item.merchantId, item.customerId);
  const location = locationForSquareId(booking.locationId);

  const decision = decideSend({
    kind: item.kind,
    enabled: item.kind === "review" ? context.reviewEnabled : context.rebookingEnabled,
    status: booking.status,
    location,
    customer: {
      email: customer?.email_address?.trim() || undefined,
      squareUnsubscribed: customer?.preferences?.email_unsubscribed,
      unsubscribed: !!stored.unsubscribedAt,
    },
    testEmails: context.testEmails,
    hasLaterBooking:
      item.kind === "rebooking"
        ? await customerHasBookingAfter(item.merchantId, item.customerId, booking.endAt)
        : false,
  });

  if (decision.action === "skip") {
    await finish({ ...skipped(decision.reason, now), sendAt: item.sendAt });
    return "skipped";
  }

  const content = followUpEmail(item.kind, location!, item.merchantId, item.customerId, customer?.given_name);
  await markOutboxAttempt(item.id, now);
  try {
    const emailId = await sendCustomerEmail({
      to: customer!.email_address!.trim(),
      ...content,
      idempotencyKey: `${item.kind}/${item.bookingId}`,
      tags: [
        { name: "type", value: item.kind },
        { name: "location", value: location!.key },
      ],
    });
    await finish({ state: "sent", emailId, sendAt: item.sendAt, updatedAt: now });
    return "sent";
  } catch (error) {
    const attempts = item.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await finish({ state: "failed", reason: errorMessage(error), sendAt: item.sendAt, updatedAt: now });
      return "failed";
    }
    await releaseOutboxAttempt(item.id, attempts, error);
    return "retry";
  }
}

// ---------- Daily run ----------

export interface DailyRunSummary {
  tokensRefreshed: number;
  bookingsSynced: number;
  visitsProcessed: number;
  visitsFailed: number;
  emailsSent: number;
  emailsSkipped: number;
  emailsFailed: number;
  errors: string[];
}

export async function runDailyAutomation(now = new Date()): Promise<DailyRunSummary> {
  const startedAt = Date.now();
  const outOfTime = () => Date.now() - startedAt > RUN_TIME_BUDGET_MS;
  const summary: DailyRunSummary = {
    tokensRefreshed: 0,
    bookingsSynced: 0,
    visitsProcessed: 0,
    visitsFailed: 0,
    emailsSent: 0,
    emailsSkipped: 0,
    emailsFailed: 0,
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
          await handleBookingChange(connection.merchantId, booking);
          summary.bookingsSynced += 1;
        }
      }
    } catch (error) {
      summary.errors.push(`sync ${connection.merchantId}: ${errorMessage(error)}`);
    }
  }

  const context = contextFromEnv(now, connections);

  // 3. Decide follow-ups for visits that have finished and queue them.
  for (const visit of await listDueVisits(now, MAX_VISITS_PER_RUN)) {
    if (outOfTime()) break;
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

  // 4. Send what is due, re-checking each email first.
  for (const item of await listDueOutbox(now, MAX_EMAILS_PER_RUN)) {
    if (outOfTime()) break;
    try {
      const outcome = await sendQueuedEmail(item, context);
      if (outcome === "sent") summary.emailsSent += 1;
      if (outcome === "skipped") summary.emailsSkipped += 1;
      if (outcome === "failed") summary.emailsFailed += 1;
      if (outcome === "retry") summary.errors.push(`email ${item.id}: send failed, will retry`);
      if (outcome === "sent" || outcome === "retry") await sleep(RESEND_SPACING_MS);
    } catch (error) {
      // Failed before reaching Resend (e.g. Square unavailable): safe to retry.
      summary.errors.push(`email ${item.id}: ${errorMessage(error)}`);
      const attempts = item.attempts + 1;
      await (attempts >= MAX_ATTEMPTS
        ? updateFollowUp(item.bookingId, item.kind, {
            state: "failed",
            reason: errorMessage(error),
            sendAt: item.sendAt,
            updatedAt: now,
          }).then(() => deleteOutbox(item.id))
        : releaseOutboxAttempt(item.id, attempts, error)
      ).catch(() => undefined);
      if (attempts >= MAX_ATTEMPTS) summary.emailsFailed += 1;
    }
  }

  return summary;
}

// ---------- Opt-out ----------

/** Queued emails for this customer are dropped when the cron re-checks them. */
export async function unsubscribeCustomer(merchantId: string, customerId: string) {
  await updateCustomer(merchantId, customerId, { unsubscribedAt: new Date() });
}

