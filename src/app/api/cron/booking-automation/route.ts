import { runDailyAutomation } from "@/lib/automation/automation";
import { safeEqualStrings } from "@/lib/automation/crypto";
import { optionalEnv } from "@/lib/automation/env";
import { errorMessage } from "@/lib/automation/store";

export const maxDuration = 300;

/**
 * Daily job (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`.
 * Refreshes Square tokens, re-syncs bookings and sends due follow-up emails.
 */
export async function GET(request: Request) {
  const secret = optionalEnv("CRON_SECRET");
  const authorization = request.headers.get("authorization") || "";

  if (!secret || !safeEqualStrings(authorization, `Bearer ${secret}`)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runDailyAutomation();
    if (summary.errors.length) console.error("Booking automation finished with errors", summary.errors);
    return Response.json(summary, {
      status: summary.errors.length ? 500 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Booking automation failed", errorMessage(error));
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
