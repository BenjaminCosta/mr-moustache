import type { NextRequest } from "next/server";

import { unsubscribeCustomer } from "@/lib/automation/automation";
import { escapeHtml, htmlPage } from "@/lib/automation/html";
import { errorMessage } from "@/lib/automation/store";
import { verifyUnsubscribe } from "@/lib/automation/unsubscribe";

function signedParams(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const merchantId = params.get("m") || "";
  const customerId = params.get("c") || "";
  const signature = params.get("s") || "";
  return verifyUnsubscribe(merchantId, customerId, signature) ? { merchantId, customerId } : undefined;
}

const invalidLink = () =>
  htmlPage("Link not valid", "<p>This unsubscribe link is invalid. Reply to any of our emails and we will remove you.</p>", 400);

/**
 * Shows a confirmation button instead of unsubscribing on GET, so link
 * scanners in mail filters cannot opt people out by accident.
 */
export function GET(request: NextRequest) {
  if (!signedParams(request)) return invalidLink();

  const action = escapeHtml(request.nextUrl.pathname + request.nextUrl.search);
  return htmlPage(
    "Unsubscribe from Mr Moustache emails",
    `<p>You will stop getting review requests and rebooking reminders. Booking confirmations from Square are not affected.</p>
     <form method="post" action="${action}">
       <button type="submit" style="background:#10c0d9;color:#001216;border:0;border-radius:3px;padding:14px 24px;font-weight:700;font-size:16px;cursor:pointer">Unsubscribe</button>
     </form>`,
  );
}

/** Handles the confirmation button and RFC 8058 one-click unsubscribe from mail clients. */
export async function POST(request: NextRequest) {
  const customer = signedParams(request);
  if (!customer) return invalidLink();

  try {
    await unsubscribeCustomer(customer.merchantId, customer.customerId);
  } catch (error) {
    console.error("Unsubscribe failed", errorMessage(error));
    return htmlPage("Something went wrong", "<p>Please try again in a moment.</p>", 500);
  }

  return htmlPage("You're unsubscribed", "<p>You won't get any more review or rebooking emails from us.</p>");
}
