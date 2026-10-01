import { followUpEmail } from "./automation";
import { automationLocations, locationForSquareId } from "./locations";
import { sendCustomerEmail } from "./resend";
import { decideRebooking, decideReview, STALE_VISIT_DAYS, type FollowUpInput } from "./schedule";
import { retrieveCustomer, SquareRequestError, type SquareCustomer } from "./square";
import {
  accessTokenFor,
  customerHasBookingAfter,
  getConnection,
  getCustomer,
  listConnections,
  listVisitsEndedBetween,
  type SquareConnection,
} from "./store";

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
        hasLaterBooking: visit.customerId
          ? await customerHasBookingAfter(visit.merchantId, visit.customerId, visit.endAt)
          : false,
        reviewEnabled: true,
        rebookingEnabled: true,
        reviewDelayHours: 24,
        rebookingDelayDays: 28,
      };

      const reviewDecision = decideReview(input);
      const rebookingDecision = decideRebooking(input);
      tally(review, reviewDecision.action === "queue" ? "would_send" : reviewDecision.reason);
      tally(rebooking, rebookingDecision.action === "queue" ? "would_send" : rebookingDecision.reason);
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

/** Sends the real review and rebooking emails, exactly as customers get them, to `to`. */
export async function sendTestEmails(to: string, locationKey?: string) {
  const locations = automationLocations();
  const location = locations.find((item) => item.key === locationKey) || locations[0];
  if (!location) throw new Error("No SQUARE_LOCATION_ID_* configured");

  const merchantId = (await listConnections())[0]?.merchantId || "test-merchant";
  const stamp = Date.now();
  const sent: Record<string, string> = {};

  for (const kind of ["review", "rebooking"] as const) {
    // The unsubscribe link points to a fake customer, so clicking it is harmless.
    const content = followUpEmail(kind, location, merchantId, "self-test", "Benja");
    sent[kind] = await sendCustomerEmail({
      to,
      ...content,
      subject: `[TEST] ${content.subject}`,
      idempotencyKey: `self-test/${kind}/${stamp}`,
      tags: [
        { name: "type", value: "self_test" },
        { name: "location", value: location.key },
      ],
    });
  }

  return {
    mode: "email",
    to,
    location: location.name,
    sent,
    note: "Check your inbox for 2 [TEST] emails, identical to what customers get.",
  };
}
