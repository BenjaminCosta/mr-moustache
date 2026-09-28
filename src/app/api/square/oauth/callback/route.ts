import { NextResponse, type NextRequest } from "next/server";

import { safeEqualStrings } from "@/lib/automation/crypto";
import { squareEnvironment } from "@/lib/automation/env";
import { escapeHtml, htmlPage } from "@/lib/automation/html";
import { OAUTH_STATE_COOKIE, oauthStateCookieOptions } from "@/lib/automation/oauth-state";
import { exchangeAuthorizationCode, listLocations } from "@/lib/automation/square";
import { errorMessage, saveConnection } from "@/lib/automation/store";

function clearStateCookie(page: Response) {
  const response = new NextResponse(page.body, page);
  response.cookies.set(OAUTH_STATE_COOKIE, "", { ...oauthStateCookieOptions, maxAge: 0 });
  return response;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const error = params.get("error");

  if (error) {
    const detail = params.get("error_description") || error;
    return clearStateCookie(
      htmlPage("Square was not connected", `<p>Square returned: ${escapeHtml(detail)}</p>`, 400),
    );
  }

  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || !safeEqualStrings(state, expectedState)) {
    return clearStateCookie(
      htmlPage(
        "Link expired",
        "<p>This connection link is invalid or has expired. Start again from the connect link.</p>",
        400,
      ),
    );
  }

  try {
    const environment = squareEnvironment();
    const token = await exchangeAuthorizationCode(code);
    const locations = await listLocations(environment, token.access_token);
    await saveConnection(environment, token, locations);

    const rows = locations
      .map(
        (location) =>
          `<li><strong>${escapeHtml(location.name || "Unnamed")}</strong>: <code>${escapeHtml(location.id)}</code>${
            location.status === "INACTIVE" ? " (inactive)" : ""
          }</li>`,
      )
      .join("");

    return clearStateCookie(
      htmlPage(
        "Square connected",
        `<p>Merchant <code>${escapeHtml(token.merchant_id)}</code> (${environment}) is connected. Tokens are stored encrypted.</p>
         <p>Use these IDs for <code>SQUARE_LOCATION_ID_*</code> in Vercel:</p>
         <ul>${rows}</ul>`,
      ),
    );
  } catch (caught) {
    console.error("Square OAuth callback failed", errorMessage(caught));
    return clearStateCookie(
      htmlPage("Square was not connected", "<p>Something went wrong. Check the Vercel logs and try again.</p>", 500),
    );
  }
}
