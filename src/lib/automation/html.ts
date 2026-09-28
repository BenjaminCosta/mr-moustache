export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Minimal standalone page for OAuth and unsubscribe responses. `body` must already be escaped. */
export function htmlPage(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#000;color:#eff4f5;font-family:Arial,sans-serif">
    <main style="max-width:560px;margin:0 auto;padding:48px 24px;line-height:1.6">
      <p style="color:#10c0d9;font-size:13px;letter-spacing:.14em;text-transform:uppercase">Mr Moustache Barbershop</p>
      <h1 style="font-size:30px;line-height:1.15">${escapeHtml(title)}</h1>
      ${body}
    </main>
  </body>
</html>`;

  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
