import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, type Firestore } from "firebase-admin/firestore";

import { requiredEnv } from "./env";

let cachedFirestore: Firestore | undefined;

export function firestore() {
  if (cachedFirestore) return cachedFirestore;

  const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: requiredEnv("FIREBASE_PROJECT_ID"),
          clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
          privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
      });

  cachedFirestore = getFirestore(app);
  // Optional Square fields arrive as undefined; drop them instead of throwing.
  cachedFirestore.settings({ ignoreUndefinedProperties: true });
  return cachedFirestore;
}

/** Firestore returns Timestamps for stored Dates; normalise either back to a Date. */
export function toDate(value: unknown): Date | undefined {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return undefined;
}

export function isAlreadyExistsError(error: unknown) {
  const code = (error as { code?: unknown } | null)?.code;
  return code === 6 || code === "already-exists" || code === "ALREADY_EXISTS";
}
