import { escapeHtml } from "./html";

/*
 * Written to look like a short personal note rather than a newsletter: plain
 * white layout, a text link instead of a button, signed by a person. Gmail is
 * then less likely to file it under Promotions.
 */

export interface EmailContentInput {
  name?: string;
  locationName: string;
  url: string;
  unsubscribeUrl: string;
  /** Sign-off lines, e.g. "Aitor\nMr Moustache Barbershop". */
  signature: string;
}

const DEFAULT_SIGNATURE = "Mr Moustache Barbershop";

function firstName(name: string | undefined) {
  return name?.trim().split(/\s+/)[0] || undefined;
}

function paragraph(html: string) {
  return `<p style="margin:0 0 16px">${html}</p>`;
}

function layout(paragraphs: string[], signOff: string, signature: string, unsubscribeUrl: string) {
  const sign = [signOff, ...signature.split("\n")].map(escapeHtml).join("<br>");
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:24px 16px;background:#ffffff;color:#222222;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55">
    <div style="max-width:560px">
      ${paragraphs.map(paragraph).join("\n      ")}
      ${paragraph(sign)}
      <p style="margin:32px 0 0;font-size:12px;color:#888888">Don't want emails like this? <a href="${escapeHtml(unsubscribeUrl)}" style="color:#888888">Unsubscribe</a></p>
    </div>
  </body>
</html>`;
}

function link(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="color:#0b6fa4">${escapeHtml(label)}</a>`;
}

export function reviewEmailContent({ name, locationName, url, unsubscribeUrl, signature }: EmailContentInput) {
  const first = firstName(name);
  const greeting = first ? `Hi ${first},` : "Hi,";
  const thanks = `Thanks for coming in to Mr Moustache ${locationName}. Hope you're happy with the cut.`;
  const ask = "If you've got a minute, would you mind leaving us a quick Google review? It really helps a small local shop like ours.";
  const sign = signature.trim() || DEFAULT_SIGNATURE;

  return {
    subject: first ? `Thanks for coming in, ${first}` : "Thanks for coming in",
    html: layout(
      [escapeHtml(greeting), escapeHtml(thanks), escapeHtml(ask), link(url, "Leave a Google review")],
      "Cheers,",
      sign,
      unsubscribeUrl,
    ),
    text: `${greeting}\n\n${thanks}\n\n${ask}\n\nLeave a Google review: ${url}\n\nCheers,\n${sign}\n\n--\nDon't want emails like this? Unsubscribe: ${unsubscribeUrl}`,
  };
}

export function rebookingEmailContent({ name, locationName, url, unsubscribeUrl, signature }: EmailContentInput) {
  const first = firstName(name);
  const greeting = first ? `Hi ${first},` : "Hi,";
  const body = `It's been a few weeks since your last cut at Mr Moustache ${locationName}, so you might be due for a tidy-up.`;
  const book = "Grab a time whenever it suits you:";
  const sign = signature.trim() || DEFAULT_SIGNATURE;

  return {
    subject: first ? `Time for a trim, ${first}?` : "Time for a trim?",
    html: layout(
      [escapeHtml(greeting), escapeHtml(body), `${escapeHtml(book)} ${link(url, "book your next cut")}`],
      "See you soon,",
      sign,
      unsubscribeUrl,
    ),
    text: `${greeting}\n\n${body}\n\n${book} ${url}\n\nSee you soon,\n${sign}\n\n--\nDon't want emails like this? Unsubscribe: ${unsubscribeUrl}`,
  };
}
