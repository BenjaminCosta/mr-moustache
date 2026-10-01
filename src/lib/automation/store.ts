import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";

import { decryptSecret, encryptSecret, type EncryptedSecret } from "./crypto";
import type { SquareEnvironment } from "./env";
import type { FollowUpKind } from "./schedule";
import { firestore, isAlreadyExistsError, toDate } from "./firebase";
import {
  bookingEndAt,
  refreshAccessToken,
  type SquareBooking,
  type SquareLocation,
  type SquareTokenResponse,
} from "./square";

/*
 * Firestore layout (server-only; rules deny all client access):
 *   squareConnections/{merchantId}  encrypted OAuth tokens for a seller
 *   squareEvents/{eventId}          webhook dedup markers (TTL on expireAt)
 *   bookings/{bookingId}            latest known booking + follow-up state
 *   customers/{merchantId}_{id}     opt-out and email history per customer
 *   outbox/{bookingId}_{kind}       queued emails, deleted once sent or dropped
 *   automationRuns/{startedAt}      summary of each daily cron run (TTL on expireAt)
 */
const CONNECTIONS = "squareConnections";
const EVENTS = "squareEvents";
const BOOKINGS = "bookings";
const CUSTOMERS = "customers";
const OUTBOX = "outbox";

const RUNS = "automationRuns";
const EVENT_RETENTION_DAYS = 30;
const RUN_RETENTION_DAYS = 90;
const ACCESS_TOKEN_MIN_REMAINING_MS = 60 * 60_000;

// ---------- Square connections ----------

export interface SquareConnection {
  merchantId: string;
  environment: SquareEnvironment;
  accessToken: EncryptedSecret;
  refreshToken: EncryptedSecret;
  expiresAt: Date;
  locations: Array<{ id: string; name: string; status?: string }>;
}

function connectionFromData(data: DocumentData): SquareConnection {
  return {
    merchantId: data.merchantId,
    environment: data.environment,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: toDate(data.expiresAt) || new Date(0),
    locations: data.locations || [],
  };
}

export async function saveConnection(
  environment: SquareEnvironment,
  token: SquareTokenResponse,
  locations: SquareLocation[],
) {
  const now = new Date();
  await firestore()
    .collection(CONNECTIONS)
    .doc(token.merchant_id)
    .set(
      {
        merchantId: token.merchant_id,
        environment,
        accessToken: encryptSecret(token.access_token),
        refreshToken: encryptSecret(token.refresh_token),
        expiresAt: new Date(token.expires_at),
        locations: locations.map(({ id, name, status }) => ({ id, name: name || id, status })),
        connectedAt: now,
        refreshedAt: now,
        refreshError: null,
      },
      { merge: true },
    );
}

export async function listConnections() {
  const snapshot = await firestore().collection(CONNECTIONS).get();
  return snapshot.docs.map((doc) => connectionFromData(doc.data()));
}

export async function getConnection(merchantId: string) {
  const snapshot = await firestore().collection(CONNECTIONS).doc(merchantId).get();
  return snapshot.exists ? connectionFromData(snapshot.data()!) : undefined;
}

export async function refreshConnection(connection: SquareConnection) {
  const ref = firestore().collection(CONNECTIONS).doc(connection.merchantId);

  try {
    const token = await refreshAccessToken(
      connection.environment,
      decryptSecret(connection.refreshToken),
    );
    const refreshed: SquareConnection = {
      ...connection,
      accessToken: encryptSecret(token.access_token),
      // Code-flow refresh tokens do not rotate, but store a new one if Square sends it.
      refreshToken: token.refresh_token ? encryptSecret(token.refresh_token) : connection.refreshToken,
      expiresAt: new Date(token.expires_at),
    };

    await ref.update({
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: refreshed.expiresAt,
      refreshedAt: new Date(),
      refreshError: null,
    });
    return refreshed;
  } catch (error) {
    await ref.update({ refreshError: errorMessage(error), refreshFailedAt: new Date() });
    throw error;
  }
}

/** Decrypted access token, refreshed first if it is about to expire. */
export async function accessTokenFor(connection: SquareConnection) {
  let current = connection;
  if (current.expiresAt.getTime() - Date.now() < ACCESS_TOKEN_MIN_REMAINING_MS) {
    current = await refreshConnection(current);
  }
  return decryptSecret(current.accessToken);
}

// ---------- Webhook dedup ----------

/** Returns false when this event ID has already been claimed (a Square retry). */
export async function claimEvent(eventId: string, type: string | undefined, merchantId: string | undefined) {
  const now = new Date();
  try {
    await firestore()
      .collection(EVENTS)
      .doc(eventId)
      .create({
        type: type || null,
        merchantId: merchantId || null,
        receivedAt: now,
        status: "processing",
        expireAt: new Date(now.getTime() + EVENT_RETENTION_DAYS * 86_400_000),
      });
    return true;
  } catch (error) {
    if (isAlreadyExistsError(error)) return false;
    throw error;
  }
}

export async function completeEvent(eventId: string) {
  await firestore().collection(EVENTS).doc(eventId).update({ status: "done", completedAt: new Date() });
}

/** Lets Square's retry process the event again after a failure. */
export async function releaseEvent(eventId: string) {
  await firestore().collection(EVENTS).doc(eventId).delete();
}

// ---------- Bookings ----------

/** scheduled = waiting in the outbox; sent/skipped/failed are final. */
export type FollowUpState = "scheduled" | "sent" | "skipped" | "failed";

export interface FollowUpRecord {
  state: FollowUpState;
  reason?: string;
  emailId?: string;
  sendAt?: Date;
  updatedAt: Date;
}

export interface StoredBooking {
  id: string;
  merchantId: string;
  locationId?: string;
  customerId?: string;
  status?: string;
  version: number;
  startAt: Date;
  endAt: Date;
  processed: boolean;
  attempts: number;
  review?: FollowUpRecord;
  rebooking?: FollowUpRecord;
}

function followUpFromData(value: unknown): FollowUpRecord | undefined {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  return {
    state: data.state as FollowUpState,
    reason: data.reason as string | undefined,
    emailId: data.emailId as string | undefined,
    sendAt: toDate(data.sendAt),
    updatedAt: toDate(data.updatedAt) || new Date(0),
  };
}

function bookingFromDoc(doc: DocumentSnapshot): StoredBooking {
  const data = doc.data()!;
  return {
    id: doc.id,
    merchantId: data.merchantId,
    locationId: data.locationId || undefined,
    customerId: data.customerId || undefined,
    status: data.status || undefined,
    version: data.version || 0,
    startAt: toDate(data.startAt)!,
    endAt: toDate(data.endAt)!,
    processed: !!data.processed,
    attempts: data.attempts || 0,
    review: followUpFromData(data.review),
    rebooking: followUpFromData(data.rebooking),
  };
}

export interface RecordBookingResult {
  changed: boolean;
  previous?: StoredBooking;
  current?: StoredBooking;
}

/**
 * Upserts a Square booking, ignoring stale versions (webhooks can arrive out
 * of order) and skipping the write entirely when nothing changed.
 */
export async function recordBooking(merchantId: string, booking: SquareBooking): Promise<RecordBookingResult> {
  if (!booking.id || !booking.start_at) return { changed: false };

  const ref = firestore().collection(BOOKINGS).doc(booking.id);
  const version = booking.version || 0;
  const startAt = new Date(booking.start_at);
  const endAt = bookingEndAt(booking);

  return firestore().runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const previous = snapshot.exists ? bookingFromDoc(snapshot) : undefined;

    if (previous && (previous.version > version || (previous.version === version && previous.status === booking.status))) {
      return { changed: false, previous, current: previous };
    }

    const now = new Date();
    const fields = {
      merchantId,
      locationId: booking.location_id || null,
      customerId: booking.customer_id || null,
      status: booking.status || null,
      version,
      startAt,
      endAt,
      updatedAt: now,
    };

    if (previous) {
      tx.update(ref, fields);
    } else {
      tx.set(ref, { ...fields, processed: false, attempts: 0, createdAt: now });
    }

    const current: StoredBooking = {
      ...(previous || { id: booking.id, processed: false, attempts: 0 }),
      id: booking.id,
      merchantId,
      locationId: booking.location_id,
      customerId: booking.customer_id,
      status: booking.status,
      version,
      startAt,
      endAt,
    };
    return { changed: true, previous, current };
  });
}

/** Finished visits whose follow-ups have not been decided yet, oldest first. */
export async function listDueVisits(now: Date, limit: number) {
  const snapshot = await firestore()
    .collection(BOOKINGS)
    .where("processed", "==", false)
    .where("endAt", "<=", now)
    .orderBy("endAt", "asc")
    .limit(limit)
    .get();
  return snapshot.docs.map(bookingFromDoc);
}

/** Bookings that ended inside [from, to], any processing state. */
export async function listVisitsEndedBetween(from: Date, to: Date, limit: number) {
  const snapshot = await firestore()
    .collection(BOOKINGS)
    .where("endAt", ">=", from)
    .where("endAt", "<=", to)
    .orderBy("endAt", "asc")
    .limit(limit)
    .get();
  return snapshot.docs.map(bookingFromDoc);
}

export async function getBooking(bookingId: string) {
  const snapshot = await firestore().collection(BOOKINGS).doc(bookingId).get();
  return snapshot.exists ? bookingFromDoc(snapshot) : undefined;
}

/** Whether the customer has an accepted booking (past or future) starting after `after`. */
export async function customerHasBookingAfter(merchantId: string, customerId: string, after: Date) {
  const snapshot = await firestore()
    .collection(BOOKINGS)
    .where("merchantId", "==", merchantId)
    .where("customerId", "==", customerId)
    .where("startAt", ">", after)
    .get();
  return snapshot.docs.some((doc) => doc.data().status === "ACCEPTED");
}

export async function updateFollowUp(bookingId: string, kind: FollowUpKind, record: FollowUpRecord) {
  await firestore().collection(BOOKINGS).doc(bookingId).update({ [kind]: record });
}

export async function markVisitProcessed(bookingId: string) {
  await firestore().collection(BOOKINGS).doc(bookingId).update({ processed: true, processedAt: new Date() });
}

export async function markVisitFailed(bookingId: string, attempts: number, error: unknown, giveUp: boolean) {
  await firestore()
    .collection(BOOKINGS)
    .doc(bookingId)
    .update({
      attempts,
      lastError: errorMessage(error),
      ...(giveUp ? { processed: true, processedAt: new Date() } : {}),
    });
}

// ---------- Customers ----------

export interface StoredCustomer {
  unsubscribedAt?: Date;
  lastReviewRequestAt?: Date;
}

function customerRef(merchantId: string, customerId: string) {
  return firestore().collection(CUSTOMERS).doc(`${merchantId}_${customerId}`);
}

export async function getCustomer(merchantId: string, customerId: string): Promise<StoredCustomer> {
  const snapshot = await customerRef(merchantId, customerId).get();
  const data = snapshot.data();
  if (!data) return {};

  return {
    unsubscribedAt: toDate(data.unsubscribedAt),
    lastReviewRequestAt: toDate(data.lastReviewRequestAt),
  };
}

export async function updateCustomer(
  merchantId: string,
  customerId: string,
  fields: Partial<Record<"unsubscribedAt" | "lastReviewRequestAt", Date>>,
) {
  await customerRef(merchantId, customerId).set(
    { merchantId, customerId, ...fields, updatedAt: new Date() },
    { merge: true },
  );
}

// ---------- Outbox ----------

/**
 * Emails waiting for their send time. The daily cron sends what is due and
 * re-checks each one first, so nothing has to be cancelled at the provider.
 */
export interface OutboxItem {
  id: string;
  bookingId: string;
  merchantId: string;
  customerId: string;
  kind: FollowUpKind;
  sendAt: Date;
  attempts: number;
  /** Set right before sending; still set on a later run means that run died mid-send. */
  attemptAt?: Date;
}

const outboxId = (bookingId: string, kind: FollowUpKind) => `${bookingId}_${kind}`;

export async function enqueueEmail(item: Omit<OutboxItem, "id" | "attempts" | "attemptAt">) {
  await firestore()
    .collection(OUTBOX)
    .doc(outboxId(item.bookingId, item.kind))
    .set({ ...item, attempts: 0, attemptAt: null, createdAt: new Date() });
}

export async function listDueOutbox(now: Date, limit: number): Promise<OutboxItem[]> {
  const snapshot = await firestore()
    .collection(OUTBOX)
    .where("sendAt", "<=", now)
    .orderBy("sendAt", "asc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      bookingId: data.bookingId,
      merchantId: data.merchantId,
      customerId: data.customerId,
      kind: data.kind,
      sendAt: toDate(data.sendAt)!,
      attempts: data.attempts || 0,
      attemptAt: toDate(data.attemptAt),
    };
  });
}

export async function markOutboxAttempt(id: string, attemptAt: Date) {
  await firestore().collection(OUTBOX).doc(id).update({ attemptAt });
}

/** A send failed before reaching Resend's success response: retry on the next run. */
export async function releaseOutboxAttempt(id: string, attempts: number, error: unknown) {
  await firestore()
    .collection(OUTBOX)
    .doc(id)
    .update({ attemptAt: null, attempts, lastError: errorMessage(error) });
}

export async function deleteOutbox(id: string) {
  await firestore().collection(OUTBOX).doc(id).delete();
}

// ---------- Cron run history ----------

/**
 * Keeps each daily run's outcome in Firestore: Vercel Hobby only retains
 * function logs for an hour, which is too short to audit a nightly job.
 */
export async function recordAutomationRun(
  startedAt: Date,
  result: { summary?: Record<string, unknown>; error?: string },
) {
  const finishedAt = new Date();
  const errors = Array.isArray(result.summary?.errors) ? result.summary.errors : [];

  await firestore()
    .collection(RUNS)
    .doc(startedAt.toISOString())
    .set({
      startedAt,
      finishedAt,
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      ok: !result.error && errors.length === 0,
      ...(result.summary || {}),
      error: result.error || null,
      expireAt: new Date(finishedAt.getTime() + RUN_RETENTION_DAYS * 86_400_000),
    });
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
