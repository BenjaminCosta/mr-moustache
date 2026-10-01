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
  idempotencyKey: string;
  tags: Array<{ name: string; value: string }>;
}

/**
 * Sends right away. Emails are queued in Firestore instead of Resend's
 * scheduler, so a send-only API key is enough and nothing needs cancelling.
 * No List-Unsubscribe header: it marks mail as bulk and pushes it towards
 * Gmail's Promotions tab; every email carries an unsubscribe link instead.
 */
export async function sendCustomerEmail(email: CustomerEmail) {
  const { data, error } = await client().emails.send(
    {
      from: requiredEnv("CUSTOMER_EMAIL_FROM"),
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: optionalEnv("CUSTOMER_EMAIL_REPLY_TO"),
      tags: email.tags,
    },
    { idempotencyKey: email.idempotencyKey },
  );

  if (error || !data?.id) {
    throw new Error(error?.message || "Resend did not return an email ID");
  }

  return data.id;
}
