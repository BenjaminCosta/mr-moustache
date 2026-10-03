import type { Service } from "@/types";

/**
 * The bookable services and prices from Square, so the site's service list
 * follows Square on its own. Server-only: it reads the shop's Square OAuth
 * token (saved by the booking automation) from Firestore.
 */

/** How often the catalog is read again (once a day). */
export const CATALOG_REVALIDATE_SECONDS = 86_400;

const TOKEN_MIN_REMAINING_MS = 60 * 60_000;
const FIRESTORE_TIMEOUT_MS = 8_000;

type Money = { amount?: number; currency?: string };

export type CatalogObject = {
  type?: string;
  id: string;
  is_deleted?: boolean;
  item_data?: {
    name?: string;
    description?: string;
    description_plaintext?: string;
    product_type?: string;
    is_archived?: boolean;
    variations?: CatalogObject[];
  };
  item_variation_data?: {
    name?: string;
    price_money?: Money;
    pricing_type?: string;
    available_for_booking?: boolean;
  };
};

export type CatalogService = {
  itemId: string;
  variationId: string;
  name: string;
  /** Set when the service has several bookable options ("45 min"). */
  variationName?: string;
  description: string;
  price: string | null;
};

/** 4500 AUD cents → "A$45"; 4550 → "A$45.50". */
export function formatPrice(money: Money | undefined) {
  if (!money || typeof money.amount !== "number") return null;
  const value = money.amount / 100;
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return money.currency && money.currency !== "AUD" ? `${money.currency} ${amount}` : `A$${amount}`;
}

/** Appointment services customers can book, one per bookable variation. */
export function parseCatalog(objects: CatalogObject[]): CatalogService[] {
  return objects.flatMap((item) => {
    const data = item.item_data;
    if (item.is_deleted || !data || data.is_archived || data.product_type !== "APPOINTMENTS_SERVICE") return [];

    const bookable = (data.variations ?? []).filter(
      (variation) =>
        !variation.is_deleted &&
        variation.item_variation_data &&
        variation.item_variation_data.available_for_booking !== false,
    );

    return bookable.flatMap((variation) => {
      const variationData = variation.item_variation_data!;
      return [
        {
          itemId: item.id,
          variationId: variation.id,
          name: (data.name ?? variationData.name ?? "").trim(),
          ...(bookable.length > 1 && variationData.name && { variationName: variationData.name.trim() }),
          description: (data.description_plaintext ?? data.description ?? "").trim(),
          price: variationData.pricing_type === "VARIABLE_PRICING" ? null : formatPrice(variationData.price_money),
        },
      ];
    });
  });
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The site's services with Square's current names, prices and descriptions.
 * Services removed in Square disappear and new bookable ones are added at the
 * end. If the IDs barely match (a different Square account, say), the site's
 * own list is kept untouched rather than guessing.
 */
export function mergeServices(site: Service[], catalog: CatalogService[]): Service[] {
  const find = (squareId: string) =>
    catalog.find((service) => service.variationId === squareId || service.itemId === squareId);

  const matched = site.filter((service) => find(service.squareId));
  if (catalog.length === 0 || matched.length < Math.ceil(site.length / 2)) return site;

  // Booking links use whichever Square ID the site's services already use.
  const byVariation = matched.some((service) => find(service.squareId)?.variationId === service.squareId);
  // Items already on the site; their other options are left to the booking page.
  const usedItems = new Set<string>();

  const updated = matched.map((service) => {
    const live = find(service.squareId)!;
    usedItems.add(live.itemId);
    return {
      ...service,
      name: live.name || service.name,
      // The site's descriptions keep their hand-placed line breaks unless Square's text changed.
      description:
        live.description && live.description !== service.description.replace(/\s*\n\s*/g, " ")
          ? live.description
          : service.description,
      price: live.price,
    };
  });

  const added = catalog
    .filter((service) => !usedItems.has(service.itemId) && service.name)
    .map((service) => ({
      id: slug(`${service.name} ${service.variationName ?? ""}`),
      squareId: byVariation ? service.variationId : service.itemId,
      name: service.variationName ? `${service.name} (${service.variationName})` : service.name,
      description: service.description,
      price: service.price,
    }));

  return [...updated, ...added];
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms)),
  ]);
}

/** A valid access token for the shop's Square account, or null. Never refreshes it here. */
async function squareAccess(locationIds: string[]) {
  const { listConnections } = await import("@/lib/automation/store");
  const { decryptSecret } = await import("@/lib/automation/crypto");

  const connections = await withTimeout(listConnections(), FIRESTORE_TIMEOUT_MS);
  const connection =
    connections.find((item) => item.locations.some((location) => locationIds.includes(location.id))) ??
    connections[0];
  if (!connection) return null;

  // Refreshing writes to Firestore and must not run while a page renders; the
  // automation's daily run renews the token well before it expires.
  if (connection.expiresAt.getTime() - Date.now() < TOKEN_MIN_REMAINING_MS) {
    console.warn("[square-catalog] Square token is about to expire; keeping the saved prices");
    return null;
  }
  return { environment: connection.environment, token: decryptSecret(connection.accessToken) };
}

/**
 * Bookable services from Square, cached by Next.js for a day. Null when Square
 * is not connected (or lacks the ITEMS_READ permission) or fails, so the site
 * keeps the prices it already has.
 */
export async function fetchCatalogServices(locationIds: string[]): Promise<CatalogService[] | null> {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.SQUARE_TOKEN_ENCRYPTION_KEY) return null;

  try {
    const access = await squareAccess(locationIds);
    if (!access) return null;

    const { apiVersion, squareApiBase } = await import("@/lib/automation/square");
    const objects: CatalogObject[] = [];
    let cursor: string | undefined;

    do {
      const params = new URLSearchParams({ types: "ITEM" });
      if (cursor) params.set("cursor", cursor);
      const response = await fetch(`${squareApiBase(access.environment)}/v2/catalog/list?${params}`, {
        headers: { Authorization: `Bearer ${access.token}`, "Square-Version": apiVersion() },
        next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["square-catalog"] },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) {
        // 403 until Square is reconnected with the ITEMS_READ permission.
        console.error("[square-catalog]", response.status, (await response.text()).slice(0, 300));
        return null;
      }
      const page = (await response.json()) as { objects?: CatalogObject[]; cursor?: string };
      objects.push(...(page.objects ?? []));
      cursor = page.cursor;
    } while (cursor);

    return parseCatalog(objects);
  } catch (error) {
    console.error("[square-catalog]", error);
    return null;
  }
}
