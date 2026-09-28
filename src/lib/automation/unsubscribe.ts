import { safeEqualStrings, signValue } from "./crypto";
import { productionSiteUrl, requiredEnv } from "./env";

// Square customer IDs are only unique per seller, so the token signs both.
function payload(merchantId: string, customerId: string) {
  return `unsubscribe:v1:${merchantId}:${customerId}`;
}

export function unsubscribeSignature(merchantId: string, customerId: string) {
  return signValue(payload(merchantId, customerId), requiredEnv("MARKETING_UNSUBSCRIBE_SECRET"));
}

export function unsubscribeUrl(merchantId: string, customerId: string) {
  const url = new URL("/api/automation/unsubscribe", productionSiteUrl());
  url.searchParams.set("m", merchantId);
  url.searchParams.set("c", customerId);
  url.searchParams.set("s", unsubscribeSignature(merchantId, customerId));
  return url.toString();
}

export function verifyUnsubscribe(merchantId: string, customerId: string, signature: string) {
  if (!merchantId || !customerId || !signature) return false;
  return safeEqualStrings(signature, unsubscribeSignature(merchantId, customerId));
}
