import { escapeHtml } from "./html";

/*
 * Written to land in Gmail's Primary tab rather than Promotions. Gmail files
 * mail by how much it looks like a person wrote it, so these emails:
 * - use the bare HTML Gmail itself produces when you type a message (no
 *   layout, colours, images, buttons or hidden preheader);
 * - link only to our own domain, with the address visible, like someone
 *   pasting a link;
 * - avoid marketing wording and invite a reply (replies teach Gmail that the
 *   sender is a real contact);
 * - are signed by a person (CUSTOMER_EMAIL_SIGNATURE);
 * - keep the unsubscribe link as a plain line at the end.
 * There is no List-Unsubscribe header either (see resend.ts).
 */

export interface EmailContentInput {
  name?: string;
  locationName: string;
  /** Short link on our domain, e.g. https://moustachebarbersgc.com/review/broadbeach */
  url: string;
  unsubscribeUrl: string;
  /** Sign-off lines, e.g. "Aitor\nMr Moustache Barbershop". */
  signature: string;
}

const DEFAULT_SIGNATURE = "Mr Moustache Barbershop";

function firstName(name: string | undefined) {
  return name?.trim().split(/\s+/)[0] || undefined;
}

/** A link shown as its own address without the scheme, as people paste them. */
function visibleLink(url: string) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(url.replace(/^https?:\/\//, ""))}</a>`;
}

/**
 * Each block is one paragraph of lines. Mirrors Gmail's compose output:
 * a div per line and an empty div between paragraphs.
 */
function gmailLikeHtml(blocks: string[][], unsubscribeUrl: string) {
  const blank = "<div><br></div>";
  const body = blocks.map((lines) => lines.map((line) => `<div>${line}</div>`).join("")).join(blank);
  const footer = `<div>Don't want these emails? <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a></div>`;
  return `<div dir="ltr">${body}${blank}${blank}${footer}</div>`;
}

function plainText(blocks: string[][], unsubscribeUrl: string) {
  return `${blocks.map((lines) => lines.join("\n")).join("\n\n")}\n\n--\nDon't want these emails? Unsubscribe: ${unsubscribeUrl}`;
}

function build(subject: string, blocks: Array<Array<string | { link: string }>>, unsubscribeUrl: string) {
  const html = blocks.map((lines) =>
    lines.map((line) => (typeof line === "string" ? escapeHtml(line) : visibleLink(line.link))),
  );
  const text = blocks.map((lines) =>
    lines.map((line) => (typeof line === "string" ? line : line.link)),
  );
  return { subject, html: gmailLikeHtml(html, unsubscribeUrl), text: plainText(text, unsubscribeUrl) };
}

function signOff(closing: string, signature: string) {
  return [closing, ...(signature.trim() || DEFAULT_SIGNATURE).split("\n").map((line) => line.trim())];
}

export function reviewEmailContent({ name, locationName, url, unsubscribeUrl, signature }: EmailContentInput) {
  const first = firstName(name);
  return build(
    first ? `Thanks for coming in, ${first}` : "Thanks for coming in",
    [
      [first ? `Hi ${first},` : "Hi,"],
      [`Thanks for coming in to Mr Moustache ${locationName}. Hope you're happy with the cut.`],
      [
        "If you've got a minute, would you mind leaving us a quick Google review? It really helps a small local shop like ours:",
        { link: url },
      ],
      ["And if anything wasn't quite right, just reply to this email and let us know."],
      signOff("Cheers,", signature),
    ],
    unsubscribeUrl,
  );
}

export function rebookingEmailContent({ name, locationName, url, unsubscribeUrl, signature }: EmailContentInput) {
  const first = firstName(name);
  return build(
    first ? `Time for a trim, ${first}?` : "Time for a trim?",
    [
      [first ? `Hi ${first},` : "Hi,"],
      [`It's been a few weeks since your last cut at Mr Moustache ${locationName}, so you might be due for a tidy-up.`],
      ["If you want to grab a time, here's the link:", { link: url }],
      ["Any questions, just reply to this email."],
      signOff("See you soon,", signature),
    ],
    unsubscribeUrl,
  );
}
