import { readApplication } from "@/app/work-with-us/application";
import { SITE_URL } from "@/lib/constants";

/**
 * Inbox for applications. Read on the server only, so the address stays out of
 * the page's JavaScript. Once FormSubmit is activated it can be swapped for the
 * random alias FormSubmit provides. NEXT_PUBLIC_FORMSUBMIT_TARGET is the older
 * name of the same setting and still works.
 */
function formSubmitTarget() {
  return (
    process.env.FORMSUBMIT_TARGET?.trim() ||
    process.env.NEXT_PUBLIC_FORMSUBMIT_TARGET?.trim() ||
    "aitgv0@gmail.com"
  );
}

/** FormSubmit ties a form to the page it is sent from, so pass that page on. */
function sourcePage(request: Request) {
  const referer = request.headers.get("referer");
  try {
    if (referer) return new URL(referer);
  } catch {
    // Fall through to the site URL.
  }
  return new URL(`${SITE_URL}/`);
}

/**
 * Emails a Work With Us application through FormSubmit's AJAX endpoint
 * (https://formsubmit.co). Sending it from the server avoids the browser's
 * CORS check, which hides FormSubmit's real answer whenever it is not a plain
 * success, and logs that answer instead. The first application to a new
 * inbox triggers FormSubmit's activation email; nothing is delivered until
 * its "Activate Form" link is clicked.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  const { values, fieldErrors, isSpam } = readApplication((name) => fields[name]);
  if (isSpam) return Response.json({ ok: true });
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const page = sourcePage(request);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${formSubmitTarget()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: page.origin,
        Referer: page.href,
        "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0 (Mr Moustache website)",
      },
      body: JSON.stringify({
        Name: values.name,
        Email: values.email,
        Phone: values.phone || "—",
        Experience: values.experience,
        "Preferred location": values.location,
        Message: values.message,
        _replyto: values.email,
        _subject: `Work With Us: ${values.name} (${values.location})`,
        _template: "table",
        _captcha: "false",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const raw = await response.text();
    let result: { success?: string | boolean; message?: string } | null = null;
    try {
      result = JSON.parse(raw);
    } catch {
      // Not JSON (e.g. an HTML error page); logged below.
    }

    if (!response.ok || String(result?.success) !== "true") {
      console.error(
        "[work-with-us] FormSubmit rejected the application",
        response.status,
        result ?? raw.slice(0, 500),
      );
      // FormSubmit's own answer (e.g. "This form needs Activation"), so the
      // cause shows in the browser's Network tab without opening Vercel logs.
      const reason = result?.message || `FormSubmit answered HTTP ${response.status}: ${raw.slice(0, 120)}`;
      return Response.json({ ok: false, reason: reason.slice(0, 300) }, { status: 502 });
    }
  } catch (error) {
    console.error("[work-with-us] FormSubmit request failed", error);
    return Response.json({ ok: false, reason: "Could not reach FormSubmit." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
