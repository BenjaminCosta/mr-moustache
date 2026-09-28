import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";

import { NextRequest } from "next/server";

import { GET as cron } from "../src/app/api/cron/booking-automation/route";
import { GET as unsubscribePage } from "../src/app/api/automation/unsubscribe/route";
import { GET as oauthCallback } from "../src/app/api/square/oauth/callback/route";
import { GET as oauthStart } from "../src/app/api/square/oauth/start/route";
import { GET as webhookHealth, POST as webhook } from "../src/app/api/square/webhook/route";
import { unsubscribeUrl } from "../src/lib/automation/unsubscribe";

const SITE = "https://mr-moustache.vercel.app";

describe("cron route", () => {
  it("rejects requests without the cron secret", async () => {
    process.env.CRON_SECRET = "cron-secret";
    const noAuth = await cron(new Request(`${SITE}/api/cron/booking-automation`));
    const wrong = await cron(
      new Request(`${SITE}/api/cron/booking-automation`, { headers: { authorization: "Bearer nope" } }),
    );
    assert.equal(noAuth.status, 401);
    assert.equal(wrong.status, 401);
  });

  it("stays closed when CRON_SECRET is not set", async () => {
    delete process.env.CRON_SECRET;
    const response = await cron(
      new Request(`${SITE}/api/cron/booking-automation`, { headers: { authorization: "Bearer " } }),
    );
    assert.equal(response.status, 401);
  });
});

describe("webhook route", () => {
  const url = `${SITE}/api/square/webhook`;
  const body = JSON.stringify({ event_id: "evt", type: "booking.created" });

  it("answers GET so the deployment can be checked", async () => {
    assert.equal(webhookHealth().status, 200);
  });

  it("returns 503 until the signature key is configured", async () => {
    delete process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL = url;
    const response = await webhook(
      new Request(url, { method: "POST", body, headers: { "x-square-hmacsha256-signature": "abc" } }),
    );
    assert.equal(response.status, 503);
  });

  it("rejects missing or wrong signatures", async () => {
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "key";
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL = url;
    const wrong = createHmac("sha256", "other").update(url + body).digest("base64");

    assert.equal((await webhook(new Request(url, { method: "POST", body }))).status, 401);
    assert.equal(
      (await webhook(new Request(url, { method: "POST", body, headers: { "x-square-hmacsha256-signature": wrong } })))
        .status,
      401,
    );
  });

  it("ignores signed events that are not bookings without touching storage", async () => {
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "key";
    const other = JSON.stringify({ event_id: "evt", type: "customer.created", merchant_id: "M" });
    const signature = createHmac("sha256", "key").update(url + other).digest("base64");
    const response = await webhook(
      new Request(url, { method: "POST", body: other, headers: { "x-square-hmacsha256-signature": signature } }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ignored: true });
  });
});

describe("Square OAuth routes", () => {
  it("hides the start route without the connect secret", () => {
    process.env.SQUARE_CONNECT_SECRET = "connect-secret";
    assert.equal(oauthStart(new NextRequest(`${SITE}/api/square/oauth/start`)).status, 404);
    assert.equal(oauthStart(new NextRequest(`${SITE}/api/square/oauth/start?key=wrong`)).status, 404);
  });

  it("redirects to Square and sets a state cookie", () => {
    process.env.SQUARE_CONNECT_SECRET = "connect-secret";
    process.env.SQUARE_ENVIRONMENT = "production";
    process.env.SQUARE_APPLICATION_ID = "sq0idp-test";
    process.env.SQUARE_OAUTH_REDIRECT_URL = `${SITE}/api/square/oauth/callback`;

    const response = oauthStart(new NextRequest(`${SITE}/api/square/oauth/start?key=connect-secret`));
    const location = new URL(response.headers.get("location")!);
    const cookie = response.headers.get("set-cookie")!;

    assert.equal(response.status, 307);
    assert.equal(location.origin, "https://connect.squareup.com");
    assert.match(cookie, new RegExp(`square_oauth_state=${location.searchParams.get("state")}`));
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Secure/i);
  });

  it("rejects a callback whose state does not match the cookie", async () => {
    const request = new NextRequest(`${SITE}/api/square/oauth/callback?code=abc&state=attacker`, {
      headers: { cookie: "square_oauth_state=expected" },
    });
    const response = await oauthCallback(request);
    assert.equal(response.status, 400);
    assert.match(response.headers.get("set-cookie") || "", /square_oauth_state=;/);
  });

  it("reports a cancelled authorization", async () => {
    const response = await oauthCallback(
      new NextRequest(`${SITE}/api/square/oauth/callback?error=access_denied&error_description=user_denied`),
    );
    assert.equal(response.status, 400);
    assert.match(await response.text(), /user_denied/);
  });
});

describe("unsubscribe route", () => {
  it("asks for confirmation on GET and rejects bad signatures", async () => {
    process.env.MARKETING_UNSUBSCRIBE_SECRET = "secret";
    process.env.NEXT_PUBLIC_SITE_URL = SITE;

    const valid = await unsubscribePage(new NextRequest(unsubscribeUrl("M", "C")));
    assert.equal(valid.status, 200);
    assert.match(await valid.text(), /<form method="post"/);

    const invalid = await unsubscribePage(new NextRequest(`${SITE}/api/automation/unsubscribe?m=M&c=C&s=bad`));
    assert.equal(invalid.status, 400);
  });
});
