import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rebookingEmailContent, reviewEmailContent } from "../src/lib/automation/email-content";

const base = {
  locationName: "Broadbeach",
  url: "https://moustachebarbersgc.com/review/broadbeach",
  unsubscribeUrl: "https://moustachebarbersgc.com/api/automation/unsubscribe?m=M&c=C&s=S",
  signature: "Aitor\nMr Moustache Barbershop",
};

describe("email content", () => {
  it("greets by first name and escapes it", () => {
    const email = reviewEmailContent({ ...base, name: "<b>Sam</b> Smith" });
    assert.ok(!email.html.includes("<b>Sam</b>"));
    assert.ok(email.html.includes("<div>Hi &lt;b&gt;Sam&lt;/b&gt;,</div>"));
    assert.equal(email.subject, "Thanks for coming in, <b>Sam</b>");
  });

  it("works without a name", () => {
    const email = reviewEmailContent({ ...base, name: undefined });
    assert.equal(email.subject, "Thanks for coming in");
    assert.ok(email.text.startsWith("Hi,\n"));
  });

  it("looks like a message typed in Gmail", () => {
    const { html } = reviewEmailContent({ ...base, name: "Sam" });
    assert.ok(html.startsWith('<div dir="ltr">'));
    for (const marketingMarker of ["<html", "<body", "<table", "<img", "style=", "background", "display:none", "<h1"]) {
      assert.ok(!html.includes(marketingMarker), `no ${marketingMarker}`);
    }
    assert.ok(html.includes("<div>Cheers,</div><div>Aitor</div><div>Mr Moustache Barbershop</div>"));
  });

  it("shows the short link on our own domain and invites a reply", () => {
    const email = reviewEmailContent({ ...base, name: "Sam" });
    assert.ok(
      email.html.includes(
        '<a href="https://moustachebarbersgc.com/review/broadbeach">moustachebarbersgc.com/review/broadbeach</a>',
      ),
    );
    assert.ok(email.text.includes("https://moustachebarbersgc.com/review/broadbeach"));
    assert.match(email.text, /reply to this email/);
  });

  it("keeps a working unsubscribe link at the end", () => {
    const email = reviewEmailContent({ ...base, name: "Sam" });
    assert.ok(email.html.includes(`<a href="${base.unsubscribeUrl.replace(/&/g, "&amp;")}">Unsubscribe</a>`));
    assert.ok(email.text.endsWith(`Unsubscribe: ${base.unsubscribeUrl}`));
  });

  it("avoids marketing words", () => {
    for (const email of [
      reviewEmailContent({ ...base, name: "Sam" }),
      rebookingEmailContent({ ...base, name: "Sam", url: "https://moustachebarbersgc.com/book/broadbeach" }),
    ]) {
      assert.doesNotMatch(`${email.subject} ${email.text}`, /\b(free|offer|deal|discount|sale|limited|%|!)/i);
    }
  });

  it("builds the rebooking reminder", () => {
    const email = rebookingEmailContent({ ...base, name: "Sam", url: "https://moustachebarbersgc.com/book/broadbeach" });
    assert.equal(email.subject, "Time for a trim, Sam?");
    assert.ok(email.html.includes(">moustachebarbersgc.com/book/broadbeach</a>"));
    assert.ok(email.text.includes("See you soon,\nAitor\nMr Moustache Barbershop"));
  });

  it("falls back to a shop signature", () => {
    const email = rebookingEmailContent({ ...base, signature: " ", url: "https://x/book" });
    assert.ok(email.text.includes("See you soon,\nMr Moustache Barbershop"));
  });
});
