import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { before, describe, it } from "node:test";

import {
  bookingEndAt,
  exchangeAuthorizationCode,
  refreshAccessToken,
  squareAuthorizationUrl,
  verifySquareWebhookSignature,
} from "../src/lib/automation/square";

const KEY = "test-signature-key";
const URL_ = "https://mr-moustache.vercel.app/api/square/webhook";

function sign(body: string, url = URL_, key = KEY) {
  return createHmac("sha256", key).update(url + body).digest("base64");
}

describe("Square webhook signature", () => {
  before(() => {
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = KEY;
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL = URL_;
  });

  const body = JSON.stringify({ event_id: "evt_1", type: "booking.created" });

  it("accepts Square's HMAC of URL + raw body", () => {
    assert.equal(verifySquareWebhookSignature(sign(body), body), true);
  });

  it("rejects a modified body", () => {
    assert.equal(verifySquareWebhookSignature(sign(body), body.replace("evt_1", "evt_2")), false);
  });

  it("rejects a signature made for another URL or key", () => {
    assert.equal(verifySquareWebhookSignature(sign(body, "https://example.com/hook"), body), false);
    assert.equal(verifySquareWebhookSignature(sign(body, URL_, "other"), body), false);
  });

  it("rejects garbage", () => {
    assert.equal(verifySquareWebhookSignature("not-base64!", body), false);
  });
});

describe("bookingEndAt", () => {
  it("adds up every appointment segment", () => {
    const end = bookingEndAt({
      id: "b1",
      start_at: "2026-10-01T00:00:00Z",
      appointment_segments: [{ duration_minutes: 30 }, { duration_minutes: 15 }],
    });
    assert.equal(end.toISOString(), "2026-10-01T00:45:00.000Z");
  });

  it("throws without a start time", () => {
    assert.throws(() => bookingEndAt({ id: "b1" }));
  });
});

describe("squareAuthorizationUrl", () => {
  it("asks only for read scopes (bookings, customers, locations, services)", () => {
    process.env.SQUARE_ENVIRONMENT = "production";
    process.env.SQUARE_APPLICATION_ID = "sq0idp-test";
    process.env.SQUARE_OAUTH_REDIRECT_URL = "https://mr-moustache.vercel.app/api/square/oauth/callback";

    const url = squareAuthorizationUrl("state123");
    assert.equal(url.origin, "https://connect.squareup.com");
    assert.equal(url.pathname, "/oauth2/authorize");
    assert.equal(
      url.searchParams.get("scope"),
      "APPOINTMENTS_READ APPOINTMENTS_ALL_READ CUSTOMERS_READ MERCHANT_PROFILE_READ ITEMS_READ",
    );
    assert.equal(url.searchParams.get("state"), "state123");
    assert.equal(url.searchParams.get("session"), "false");
  });
});

describe("OAuth token requests", () => {
  const originalFetch = globalThis.fetch;

  async function capturedBody(run: () => Promise<unknown>) {
    let body: Record<string, unknown> = {};
    globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      body = JSON.parse(String(init?.body));
      return Response.json({ access_token: "a", refresh_token: "r", expires_at: "2026-11-01T00:00:00Z", merchant_id: "M" });
    }) as typeof fetch;
    try {
      await run();
    } finally {
      globalThis.fetch = originalFetch;
    }
    return body;
  }

  before(() => {
    process.env.SQUARE_ENVIRONMENT = "production";
    process.env.SQUARE_APPLICATION_ID = "sq0idp-test";
    process.env.SQUARE_APPLICATION_SECRET = "secret";
    process.env.SQUARE_OAUTH_REDIRECT_URL = "https://mr-moustache.vercel.app/api/square/oauth/callback";
  });

  it("sends the same redirect_uri when exchanging the authorization code", async () => {
    const body = await capturedBody(() => exchangeAuthorizationCode("code123"));
    assert.equal(body.grant_type, "authorization_code");
    assert.equal(body.code, "code123");
    assert.equal(body.redirect_uri, "https://mr-moustache.vercel.app/api/square/oauth/callback");
    assert.equal(body.redirect_uri, squareAuthorizationUrl("s").searchParams.get("redirect_uri"));
  });

  it("refreshes without a redirect_uri", async () => {
    const body = await capturedBody(() => refreshAccessToken("production", "refresh123"));
    assert.equal(body.grant_type, "refresh_token");
    assert.equal(body.refresh_token, "refresh123");
    assert.equal(body.redirect_uri, undefined);
  });
});
