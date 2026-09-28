import { handleBookingChange } from "@/lib/automation/automation";
import {
  claimEvent,
  completeEvent,
  errorMessage,
  getConnection,
  releaseEvent,
} from "@/lib/automation/store";
import { verifySquareWebhookSignature, type SquareWebhookEvent } from "@/lib/automation/square";

// Square retries anything slower than 10 seconds; the extra headroom lets a
// slow cold start finish its write instead of being cut off mid-way.
export const maxDuration = 30;

const BOOKING_EVENTS = new Set(["booking.created", "booking.updated"]);

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Lets anyone confirm the endpoint is deployed; it reveals nothing else. */
export function GET() {
  return json({ ok: true });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") || "";

  let valid: boolean;
  try {
    valid = !!signature && verifySquareWebhookSignature(signature, rawBody);
  } catch (error) {
    // Signature key or notification URL not configured yet.
    console.error("Square webhook is not configured", errorMessage(error));
    return json({ error: "not_configured" }, 503);
  }
  if (!valid) return json({ error: "invalid_signature" }, 401);

  let event: SquareWebhookEvent;
  try {
    event = JSON.parse(rawBody) as SquareWebhookEvent;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const booking = event.data?.object?.booking;
  const merchantId = event.merchant_id;
  if (!event.event_id || !event.type || !BOOKING_EVENTS.has(event.type) || !booking || !merchantId) {
    return json({ ignored: true });
  }

  // Only track sellers that connected through our OAuth flow.
  if (!(await getConnection(merchantId))) return json({ ignored: "merchant_not_connected" });

  if (!(await claimEvent(event.event_id, event.type, merchantId))) {
    return json({ duplicate: true });
  }

  try {
    await handleBookingChange(merchantId, booking);
    await completeEvent(event.event_id);
    return json({ ok: true });
  } catch (error) {
    console.error("Square webhook processing failed", event.event_id, errorMessage(error));
    await releaseEvent(event.event_id).catch(() => undefined);
    return json({ error: "processing_failed" }, 500);
  }
}
