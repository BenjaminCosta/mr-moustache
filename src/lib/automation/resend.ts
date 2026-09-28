import { Resend } from "resend";

import { optionalEnv, requiredEnv } from "./env";

let cachedClient: Resend | undefined;

function client() {
  cachedClient ||= new Resend(requiredEnv("RESEND_API_KEY"));
  return cachedClient;
}

export interface CustomerEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  scheduledAt?: string;
  idempotencyKey: string;
  /** Adds RFC 8058 one-click unsubscribe headers when set. */
  unsubscribeUrl?: string;
  tags: Array<{ name: string; value: string }>;
}

export async function sendCustomerEmail(email: CustomerEmail) {
  const { data, error } = await client().emails.send(
    {
      from: requiredEnv("CUSTOMER_EMAIL_FROM"),
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: optionalEnv("CUSTOMER_EMAIL_REPLY_TO"),
      scheduledAt: email.scheduledAt,
      tags: email.tags,
      headers: email.unsubscribeUrl
        ? {
            "List-Unsubscribe": `<${email.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    },
    { idempotencyKey: email.idempotencyKey },
  );

  if (error || !data?.id) {
    throw new Error(error?.message || "Resend did not return an email ID");
  }

  return data.id;
}

export async function cancelScheduledEmail(emailId: string) {
  const { error } = await client().emails.cancel(emailId);
  if (error) throw new Error(error.message);
}
