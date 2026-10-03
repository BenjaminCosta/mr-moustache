import { NextResponse, type NextRequest } from "next/server";

import { randomState, safeEqualStrings } from "@/lib/automation/crypto";
import { optionalEnv } from "@/lib/automation/env";
import { htmlPage } from "@/lib/automation/html";
import { OAUTH_STATE_COOKIE, oauthStateCookieOptions } from "@/lib/automation/oauth-state";
import { squareAuthorizationUrl } from "@/lib/automation/square";

const MOVED_PARAM = "moved";

/**
 * Starts the Square OAuth flow. Only whoever holds SQUARE_CONNECT_SECRET can
 * begin it: /api/square/oauth/start?key=<SQUARE_CONNECT_SECRET>
 *
 * The state cookie only reaches the callback on the same domain, so a link
 * opened on another domain of the site (moustachebarbersgc.com while the
 * callback is on mr-moustache.vercel.app) first moves to the callback's domain.
 */
export function GET(request: NextRequest) {
  const expected = optionalEnv("SQUARE_CONNECT_SECRET");
  const key = request.nextUrl.searchParams.get("key") || "";

  if (!expected || !safeEqualStrings(key, expected)) {
    return new Response("Not found", { status: 404 });
  }

  const callback = URL.canParse(optionalEnv("SQUARE_OAUTH_REDIRECT_URL") ?? "")
    ? new URL(optionalEnv("SQUARE_OAUTH_REDIRECT_URL")!)
    : undefined;
  if (callback && callback.host !== request.nextUrl.host) {
    // Already moved once and still elsewhere: that domain redirects back here.
    if (request.nextUrl.searchParams.has(MOVED_PARAM)) {
      return htmlPage(
        "Square connection needs one domain",
        `<p>Square sends you back to ${callback.host}, but that domain redirects to ${request.nextUrl.host}. Set <code>SQUARE_OAUTH_REDIRECT_URL</code> (and the Redirect URL in the Square Developer Dashboard) to <code>https://${request.nextUrl.host}/api/square/oauth/callback</code>.</p>`,
        409,
      );
    }
    const target = new URL(request.nextUrl.pathname, callback.origin);
    target.searchParams.set("key", key);
    target.searchParams.set(MOVED_PARAM, "1");
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const state = randomState();
  const response = NextResponse.redirect(squareAuthorizationUrl(state));
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);
  return response;
}
