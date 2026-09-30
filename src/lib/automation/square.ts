import { createHmac, timingSafeEqual } from "node:crypto";

import {
  optionalEnv,
  requiredEnv,
  squareEnvironment,
  type SquareEnvironment,
} from "./env";

const OAUTH_SCOPES = [
  "APPOINTMENTS_READ",
  "APPOINTMENTS_ALL_READ",
  "CUSTOMERS_READ",
  "MERCHANT_PROFILE_READ",
] as const;

export interface SquareAppointmentSegment {
  duration_minutes?: number;
}

export interface SquareBooking {
  id: string;
  location_id?: string;
  customer_id?: string;
  start_at?: string;
  status?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
  appointment_segments?: SquareAppointmentSegment[];
}

export interface SquareLocation {
  id: string;
  name?: string;
  status?: string;
}

export interface SquareCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  preferences?: {
    email_unsubscribed?: boolean;
  };
}

export interface SquareTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  merchant_id: string;
  token_type: string;
}

interface SquareErrorResponse {
  errors?: Array<{ code?: string; detail?: string; category?: string }>;
}

export interface SquareWebhookEvent {
  event_id?: string;
  merchant_id?: string;
  type?: string;
  created_at?: string;
  data?: {
    id?: string;
    object?: {
      booking?: SquareBooking;
    };
  };
}

export class SquareRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function squareApiBase(environment: SquareEnvironment) {
  return environment === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
}

function squareOAuthBase(environment: SquareEnvironment) {
  return `${squareApiBase(environment)}/oauth2`;
}

function apiVersion() {
  return optionalEnv("SQUARE_API_VERSION") || "2026-09-16";
}

async function squareJson<T>(response: Response) {
  const payload = (await response.json()) as T & SquareErrorResponse;

  if (!response.ok) {
    const detail = payload.errors?.map((error) => error.detail || error.code).filter(Boolean).join("; ");
    throw new SquareRequestError(detail || `Square returned ${response.status}`, response.status);
  }

  return payload;
}

export function squareAuthorizationUrl(state: string) {
  const environment = squareEnvironment();
  const url = new URL(`${squareOAuthBase(environment)}/authorize`);
  url.searchParams.set("client_id", requiredEnv("SQUARE_APPLICATION_ID"));
  url.searchParams.set("scope", OAUTH_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", requiredEnv("SQUARE_OAUTH_REDIRECT_URL"));

  if (environment === "production") {
    url.searchParams.set("session", "false");
  }

  return url;
}

export async function exchangeAuthorizationCode(code: string) {
  // Square rejects the exchange unless redirect_uri matches the one sent to /authorize.
  return obtainToken(squareEnvironment(), {
    code,
    grant_type: "authorization_code",
    redirect_uri: requiredEnv("SQUARE_OAUTH_REDIRECT_URL"),
  });
}

export async function refreshAccessToken(environment: SquareEnvironment, refreshToken: string) {
  return obtainToken(environment, {
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
}

async function obtainToken(
  environment: SquareEnvironment,
  grant:
    | { code: string; grant_type: "authorization_code"; redirect_uri: string }
    | { refresh_token: string; grant_type: "refresh_token" },
) {
  const response = await fetch(`${squareOAuthBase(environment)}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Square-Version": apiVersion(),
    },
    body: JSON.stringify({
      client_id: requiredEnv("SQUARE_APPLICATION_ID"),
      client_secret: requiredEnv("SQUARE_APPLICATION_SECRET"),
      ...grant,
    }),
    cache: "no-store",
  });

  return squareJson<SquareTokenResponse>(response);
}

async function squareApi<T>(
  environment: SquareEnvironment,
  accessToken: string,
  path: string,
) {
  const response = await fetch(`${squareApiBase(environment)}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Square-Version": apiVersion(),
    },
    cache: "no-store",
  });

  return squareJson<T>(response);
}

export async function retrieveBooking(
  environment: SquareEnvironment,
  accessToken: string,
  bookingId: string,
) {
  const payload = await squareApi<{ booking?: SquareBooking }>(
    environment,
    accessToken,
    `/v2/bookings/${encodeURIComponent(bookingId)}`,
  );

  if (!payload.booking) throw new Error(`Square booking ${bookingId} was not returned`);
  return payload.booking;
}

export async function listLocations(environment: SquareEnvironment, accessToken: string) {
  const payload = await squareApi<{ locations?: SquareLocation[] }>(
    environment,
    accessToken,
    "/v2/locations",
  );

  return payload.locations || [];
}

/**
 * Lists every booking of a location that starts inside [startAtMin, startAtMax).
 * Square caps the window at 31 days; APPOINTMENTS_ALL_READ returns all staff.
 */
export async function listBookings(
  environment: SquareEnvironment,
  accessToken: string,
  locationId: string,
  startAtMin: Date,
  startAtMax: Date,
) {
  const bookings: SquareBooking[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({
      location_id: locationId,
      start_at_min: startAtMin.toISOString(),
      start_at_max: startAtMax.toISOString(),
      limit: "100",
    });
    if (cursor) params.set("cursor", cursor);

    const payload = await squareApi<{ bookings?: SquareBooking[]; cursor?: string }>(
      environment,
      accessToken,
      `/v2/bookings?${params}`,
    );

    bookings.push(...(payload.bookings || []));
    cursor = payload.cursor || undefined;
  } while (cursor);

  return bookings;
}

export async function retrieveCustomer(
  environment: SquareEnvironment,
  accessToken: string,
  customerId: string,
) {
  const payload = await squareApi<{ customer?: SquareCustomer }>(
    environment,
    accessToken,
    `/v2/customers/${encodeURIComponent(customerId)}`,
  );

  if (!payload.customer) throw new Error(`Square customer ${customerId} was not returned`);
  return payload.customer;
}

export function bookingEndAt(booking: SquareBooking) {
  if (!booking.start_at) throw new Error("Square booking is missing start_at");

  const start = new Date(booking.start_at);
  if (Number.isNaN(start.getTime())) throw new Error("Square booking has an invalid start_at");

  const durationMinutes = (booking.appointment_segments || []).reduce(
    (total, segment) => total + (segment.duration_minutes || 0),
    0,
  );

  return new Date(start.getTime() + durationMinutes * 60_000);
}

export function bookingCanReceiveFollowUp(status?: string) {
  return status === "ACCEPTED";
}

export function verifySquareWebhookSignature(signature: string, rawBody: string) {
  const expected = createHmac("sha256", requiredEnv("SQUARE_WEBHOOK_SIGNATURE_KEY"))
    .update(requiredEnv("SQUARE_WEBHOOK_NOTIFICATION_URL") + rawBody)
    .digest();
  const received = Buffer.from(signature, "base64");

  return received.length === expected.length && timingSafeEqual(received, expected);
}
