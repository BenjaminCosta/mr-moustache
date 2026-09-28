import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { unsubscribeUrl, verifyUnsubscribe } from "../src/lib/automation/unsubscribe";

describe("unsubscribe links", () => {
  before(() => {
    process.env.MARKETING_UNSUBSCRIBE_SECRET = "test-secret";
    process.env.NEXT_PUBLIC_SITE_URL = "https://mr-moustache.vercel.app";
  });

  it("builds a signed link that verifies", () => {
    const url = new URL(unsubscribeUrl("MERCHANT", "CUSTOMER"));
    assert.equal(url.origin + url.pathname, "https://mr-moustache.vercel.app/api/automation/unsubscribe");
    assert.equal(
      verifyUnsubscribe(url.searchParams.get("m")!, url.searchParams.get("c")!, url.searchParams.get("s")!),
      true,
    );
  });

  it("rejects a signature reused for another customer or merchant", () => {
    const signature = new URL(unsubscribeUrl("MERCHANT", "CUSTOMER")).searchParams.get("s")!;
    assert.equal(verifyUnsubscribe("MERCHANT", "OTHER", signature), false);
    assert.equal(verifyUnsubscribe("OTHER", "CUSTOMER", signature), false);
    assert.equal(verifyUnsubscribe("MERCHANT", "CUSTOMER", ""), false);
  });
});
