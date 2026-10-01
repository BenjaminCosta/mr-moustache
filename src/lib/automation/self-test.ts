import { rebookingEmailContent, reviewEmailContent } from "./email-content";
import { automationLocations, locationForSquareId } from "./locations";
import { cancelScheduledEmail, sendCustomerEmail } from "./resend";
import { decideRebooking, decideReview, STALE_VISIT_DAYS, type FollowUpInput } from "./schedule";
import { retrieveCustomer, SquareRequestError, type SquareCustomer } from "./square";
import {
  accessTokenFor,
  customerHasUpcomingBooking,
  getConnection,
  getCustomer,
  listConnections,
  listVisitsEndedBetween,
  type SquareConnection,
} from "./store";
import { unsubscribeUrl } from "./unsubscribe";

const DAY = 86_400_000;
const PREVIEW_LIMIT = 200;

function tally(counts: Record<string, number>, key: string) {
  counts[key] = (counts[key] || 0) + 1;
}

/**
 * Dry run over real visits from the last week: decides each follow-up as if
 * both emails were enabled for every customer. Sends nothing, writes nothing,
 * and returns only counts (no customer data).
 */
export async function previewFollowUps(now = new Date()) {
  const visits = await listVisitsEndedBetween(new Date(now.getTime() - STALE_VISIT_DAYS * DAY), now, PREVIEW_LIMIT);
  const connections = new Map<string, SquareConnection | undefined>();
  const customers = new Map<string, SquareCustomer | undefined>();
  const review: Record<string, number> = {};
  const rebooking: Record<string, number> = {};
  const errors: string[] = [];

  for (const visit of visits) {
    try {
      if (!connections.has(visit.merchantId)) {
        connections.set(visit.merchantId, await getConnection(visit.merchantId));
      }
      const connection = connections.get(visit.merchantId);
      if (!connection) throw new Error("merchant not connected");

      let customer: SquareCustomer | undefined;
      if (visit.customerId) {
        const key = `${visit.merchantId}_${visit.customerId}`;
        if (!customers.has(key)) {
          const accessToken = await accessTokenFor(connection);
          customers.set(
            key,
            await retrieveCustomer(connection.environment, accessToken, visit.customerId).catch((error) => {
              if (error instanceof SquareRequestError && error.status === 404) return undefined;
              throw error;
            }),
          );
        }
        customer = customers.get(key);
      }

      const stored = visit.customerId ? await getCustomer(visit.merchantId, visit.customerId) : {};
      const input: FollowUpInput = {
        now,
        endAt: visit.endAt,
        status: visit.status,
        location: locationForSquareId(visit.locationId),
        customer: {
          email: customer?.email_address?.trim() || undefined,
          squareUnsubscribed: customer?.preferences?.email_unsubscribed,
          unsubscribed: !!stored.unsubscribedAt,
          lastReviewRequestAt: stored.lastReviewRequestAt,
        },
        hasUpcomingBooking: visit.customerId
          ? await customerHasUpcomingBooking(visit.merchantId, visit.customerId, now)
          : false,
        reviewEnabled: true,
        rebookingEnabled: true,
        reviewDelayHours: 24,
        rebookingDelayDays: 28,
      };

      const reviewDecision = decideReview(input);
      const rebookingDecision = decideRebooking(input);
      tally(review, reviewDecision.action === "send" ? "would_send" : reviewDecision.reason);
      tally(rebooking, rebookingDecision.action === "send" ? "would_send" : rebookingDecision.reason);
    } catch (error) {
      errors.push(`${visit.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    mode: "preview",
    note: "Dry run: nothing was sent or saved. Counts assume both emails enabled for everyone.",
    since: new Date(now.getTime() - STALE_VISIT_DAYS * DAY).toISOString(),
    visits: visits.length,
    review,
    rebooking,
    errors,
  };
}

/**
 * Sends the real review and rebooking templates to `to` right away, then
 * schedules and cancels a third email to prove Resend scheduling works.
 */
export async function sendTestEmails(to: string, locationKey?: string) {
  const locations = automationLocations();
  const location = locations.find((item) => item.key === locationKey) || locations[0];
  if (!location) throw new Error("No SQUARE_LOCATION_ID_* configured");

  const merchantId = (await listConnections())[0]?.merchantId || "test-merchant";
  const unsubscribe = unsubscribeUrl(merchantId, "self-test");
  const stamp = Date.now();
  const tags = [
    { name: "type", value: "self_test" },
    { name: "location", value: location.key },
  ];

  const review = reviewEmailContent("Benja", location.name, location.reviewUrl || "https://google.com", unsubscribe);
  const reviewId = await sendCustomerEmail({
    to,
    ...review,
    subject: `[TEST] ${review.subject}`,
    idempotencyKey: `self-test/review/${stamp}`,
    unsubscribeUrl: unsubscribe,
    tags,
  });

  const rebooking = rebookingEmailContent("Benja", location.name, location.bookingUrl || "https://squareup.com", unsubscribe);
  const rebookingId = await sendCustomerEmail({
    to,
    ...rebooking,
    subject: `[TEST] ${rebooking.subject}`,
    idempotencyKey: `self-test/rebooking/${stamp}`,
    unsubscribeUrl: unsubscribe,
    tags,
  });

  const scheduledId = await sendCustomerEmail({
    to,
    ...rebooking,
    subject: "[TEST] scheduled then cancelled (you should NOT receive this)",
    scheduledAt: new Date(stamp + 60 * 60_000).toISOString(),
    idempotencyKey: `self-test/scheduled/${stamp}`,
    tags,
  });
  await cancelScheduledEmail(scheduledId);

  return {
    mode: "email",
    to,
    location: location.name,
    sent: { review: reviewId, rebooking: rebookingId },
    scheduledAndCancelled: scheduledId,
    note: "Check your inbox for 2 [TEST] emails. The unsubscribe link in them points to a fake customer.",
  };
}
