import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rebookingEmailContent, reviewEmailContent } from "../src/lib/automation/email-content";

const base = {
  locationName: "Broadbeach",
  url: "https://g.page/r?a=1&b=2",
  unsubscribeUrl: "https://x/unsub",
  signature: "Aitor\nMr Moustache Barbershop",
};

describe("email content", () => {
  it("greets by first name and escapes it", () => {
    const email = reviewEmailContent({ ...base, name: "<b>Sam</b> Smith" });
    assert.ok(!email.html.includes("<b>Sam</b>"));
    assert.ok(email.html.includes("Hi &lt;b&gt;Sam&lt;/b&gt;,"));
    assert.equal(email.subject, "Thanks for coming in, <b>Sam</b>");
  });

  it("works without a name", () => {
    const email = reviewEmailContent({ ...base, name: undefined });
    assert.equal(email.subject, "Thanks for coming in");
    assert.ok(email.text.startsWith("Hi,\n"));
  });

  it("reads like a personal note: link instead of button, signed, unsubscribe in the footer", () => {
    const email = reviewEmailContent({ ...base, name: "Sam" });
    assert.ok(email.html.includes('href="https://g.page/r?a=1&amp;b=2"'));
    assert.ok(email.html.includes("Cheers,<br>Aitor<br>Mr Moustache Barbershop"));
    assert.ok(email.html.includes("background:#ffffff"));
    assert.ok(!email.html.includes("display:none"), "no hidden preheader");
    assert.ok(!email.html.includes("display:inline-block"), "no button");
    assert.ok(email.html.includes('href="https://x/unsub"'));
    assert.ok(email.text.includes("Unsubscribe: https://x/unsub"));
    assert.match(email.text, /Broadbeach/);
  });

  it("builds the rebooking reminder", () => {
    const email = rebookingEmailContent({ ...base, name: "Sam", url: "https://book" });
    assert.equal(email.subject, "Time for a trim, Sam?");
    assert.ok(email.html.includes('href="https://book"'));
    assert.ok(email.text.includes("See you soon,\nAitor"));
    assert.ok(email.text.includes("Unsubscribe: https://x/unsub"));
  });

  it("falls back to a shop signature", () => {
    const email = rebookingEmailContent({ ...base, signature: " ", url: "https://book" });
    assert.ok(email.text.includes("See you soon,\nMr Moustache Barbershop"));
  });
});
