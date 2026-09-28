import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rebookingEmailContent, reviewEmailContent } from "../src/lib/automation/email-content";

describe("email content", () => {
  it("escapes customer names", () => {
    const email = reviewEmailContent("<script>", "Broadbeach", "https://g.page/r", "https://x/unsub");
    assert.ok(!email.html.includes("<script>"));
    assert.ok(email.html.includes("&lt;script&gt;"));
  });

  it("includes the review and unsubscribe links", () => {
    const email = reviewEmailContent("Sam", "Broadbeach", "https://g.page/r?a=1&b=2", "https://x/unsub");
    assert.ok(email.html.includes("https://g.page/r?a=1&amp;b=2"));
    assert.ok(email.html.includes("https://x/unsub"));
    assert.ok(email.text.includes("https://x/unsub"));
    assert.match(email.subject, /Broadbeach/);
  });

  it("builds the rebooking reminder", () => {
    const email = rebookingEmailContent(undefined, "Surfers Paradise", "https://book", "https://x/unsub");
    assert.equal(email.subject, "Ready for your next cut?");
    assert.ok(email.html.includes("https://book"));
    assert.ok(email.text.includes("Unsubscribe: https://x/unsub"));
  });
});
