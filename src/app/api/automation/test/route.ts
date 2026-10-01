import type { NextRequest } from "next/server";

import { safeEqualStrings } from "@/lib/automation/crypto";
import { optionalEnv } from "@/lib/automation/env";
import { previewFollowUps, sendTestEmails } from "@/lib/automation/self-test";
import { errorMessage } from "@/lib/automation/store";

export const maxDuration = 60;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Admin self-test, opened from a browser with ?key=<AUTOMATION_ADMIN_KEY>:
 *   (default)                 dry run over last week's real visits, sends nothing
 *   ?mode=email&to=<address>  sends the two real templates to that address
 */
export async function GET(request: NextRequest) {
  const secret = optionalEnv("AUTOMATION_ADMIN_KEY");
  const params = request.nextUrl.searchParams;
  if (!secret || !safeEqualStrings(params.get("key") || "", secret)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    if (params.get("mode") === "email") {
      const to = params.get("to")?.trim() || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return json({ error: "add &to=<your email>" }, 400);
      return json(await sendTestEmails(to, params.get("location") || undefined));
    }
    return json(await previewFollowUps());
  } catch (error) {
    console.error("Automation self-test failed", errorMessage(error));
    return json({ error: errorMessage(error) }, 500);
  }
}
