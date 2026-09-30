import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { POST } from "../src/app/api/work-with-us/route";

const SITE = "https://mr-moustache.vercel.app";
const realFetch = globalThis.fetch;

const application = {
  name: "Alex Barber",
  email: "alex@example.com",
  phone: "",
  experience: "3–5 years",
  location: "Broadbeach",
  message: "Five years doing fades.",
  company: "",
};

function post(body: unknown) {
  return POST(
    new Request(`${SITE}/api/work-with-us`, {
      method: "POST",
      headers: { "content-type": "application/json", referer: `${SITE}/` },
      body: JSON.stringify(body),
    }),
  );
}

function mockFormSubmit(status: number, body: string) {
  const calls: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(body, { status });
  }) as typeof fetch;
  return calls;
}

describe("work with us route", () => {
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.FORMSUBMIT_TARGET;
    delete process.env.NEXT_PUBLIC_FORMSUBMIT_TARGET;
  });

  it("forwards a valid application to FormSubmit from the server", async () => {
    const calls = mockFormSubmit(200, JSON.stringify({ success: "true" }));
    const response = await post(application);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://formsubmit.co/ajax/aitgv0@gmail.com");
    const headers = calls[0].init.headers as Record<string, string>;
    assert.equal(headers.Origin, SITE);
    assert.equal(headers.Referer, `${SITE}/`);
    const payload = JSON.parse(String(calls[0].init.body));
    assert.equal(payload.Email, "alex@example.com");
    assert.equal(payload._replyto, "alex@example.com");
    assert.equal(payload["Preferred location"], "Broadbeach");
    assert.equal(payload.Phone, "—");
  });

  it("uses FORMSUBMIT_TARGET when set", async () => {
    process.env.FORMSUBMIT_TARGET = "abc123alias";
    const calls = mockFormSubmit(200, JSON.stringify({ success: "true" }));
    await post(application);
    assert.equal(calls[0].url, "https://formsubmit.co/ajax/abc123alias");
  });

  it("reports FormSubmit rejections, e.g. before activation", async () => {
    mockFormSubmit(200, JSON.stringify({ success: "false", message: "This form needs Activation." }));
    const response = await post(application);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false });
  });

  it("reports non-JSON error pages", async () => {
    mockFormSubmit(403, "<html>Forbidden</html>");
    const response = await post(application);
    assert.equal(response.status, 502);
  });

  it("rejects invalid applications without calling FormSubmit", async () => {
    const calls = mockFormSubmit(200, JSON.stringify({ success: "true" }));
    const response = await post({ ...application, email: "nope", location: "Sydney" });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.ok(result.fieldErrors.email);
    assert.ok(result.fieldErrors.location);
    assert.equal(calls.length, 0);
  });

  it("quietly accepts honeypot submissions without sending them", async () => {
    const calls = mockFormSubmit(200, JSON.stringify({ success: "true" }));
    const response = await post({ ...application, company: "Spam Inc" });
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(calls.length, 0);
  });
});
