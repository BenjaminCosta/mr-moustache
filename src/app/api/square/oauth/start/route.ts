import { NextResponse, type NextRequest } from "next/server";

import { randomState, safeEqualStrings } from "@/lib/automation/crypto";
import { optionalEnv } from "@/lib/automation/env";
import { OAUTH_STATE_COOKIE, oauthStateCookieOptions } from "@/lib/automation/oauth-state";
import { squareAuthorizationUrl } from "@/lib/automation/square";

/**
 * Starts the Square OAuth flow. Only whoever holds SQUARE_CONNECT_SECRET can
 * begin it: /api/square/oauth/start?key=<SQUARE_CONNECT_SECRET>
 */
export function GET(request: NextRequest) {
  const expected = optionalEnv("SQUARE_CONNECT_SECRET");
  const key = request.nextUrl.searchParams.get("key") || "";

  if (!expected || !safeEqualStrings(key, expected)) {
    return new Response("Not found", { status: 404 });
  }

  const state = randomState();
  const response = NextResponse.redirect(squareAuthorizationUrl(state));
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);
  return response;
}
