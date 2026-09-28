import { escapeHtml } from "./html";

function layout(preview: string, heading: string, message: string, cta: string, href: string, footer?: string) {
  const safeHref = escapeHtml(href);
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(preview)}</title></head>
  <body style="margin:0;background:#000;color:#eff4f5;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preview)}</div>
    <main style="max-width:560px;margin:0 auto;padding:48px 24px">
      <p style="color:#10c0d9;font-size:13px;letter-spacing:.14em;text-transform:uppercase">Mr Moustache Barbershop</p>
      <h1 style="font-size:34px;line-height:1.1;margin:24px 0 16px">${escapeHtml(heading)}</h1>
      <p style="font-size:17px;line-height:1.6;color:#d8e1e3">${escapeHtml(message)}</p>
      <p style="margin:32px 0">
        <a href="${safeHref}" style="display:inline-block;background:#10c0d9;color:#001216;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:3px">${escapeHtml(cta)}</a>
      </p>
      ${footer ? `<p style="font-size:12px;line-height:1.5;color:#91a1a5">${footer}</p>` : ""}
    </main>
  </body>
</html>`;
}

function unsubscribeFooter(label: string, unsubscribeUrl: string) {
  return `${escapeHtml(label)} <a href="${escapeHtml(unsubscribeUrl)}" style="color:#91a1a5">Unsubscribe</a>.`;
}

export function reviewEmailContent(
  name: string | undefined,
  locationName: string,
  reviewUrl: string,
  unsubscribeUrl: string,
) {
  const greeting = name ? `Thanks for visiting, ${name}` : "Thanks for visiting";
  const message = `We hope you enjoyed your cut at Mr Moustache ${locationName}. If you have a minute, a Google review helps our local barbershop more than you might think.`;
  const footer = unsubscribeFooter("Prefer not to get emails like this?", unsubscribeUrl);

  return {
    subject: `How was your visit to Mr Moustache ${locationName}?`,
    html: layout("Tell us how we did", greeting, message, "Leave a Google review", reviewUrl, footer),
    text: `${greeting}\n\n${message}\n\nLeave a Google review: ${reviewUrl}\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

export function rebookingEmailContent(
  name: string | undefined,
  locationName: string,
  bookingUrl: string,
  unsubscribeUrl: string,
) {
  const greeting = name ? `Ready for your next cut, ${name}?` : "Ready for your next cut?";
  const message = `It has been a few weeks since your visit to Mr Moustache ${locationName}. Book your next appointment whenever you are ready.`;
  const unsubscribe = unsubscribeFooter("Prefer not to get emails like this?", unsubscribeUrl);

  return {
    subject: "Ready for your next cut?",
    html: layout("Time for a fresh cut?", greeting, message, "Book again", bookingUrl, unsubscribe),
    text: `${greeting}\n\n${message}\n\nBook again: ${bookingUrl}\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}
