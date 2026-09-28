export const OAUTH_STATE_COOKIE = "square_oauth_state";

export const oauthStateCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/api/square/oauth",
  maxAge: 10 * 60,
};
