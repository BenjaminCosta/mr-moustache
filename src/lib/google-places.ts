import { WEEK } from "@/lib/opening-hours";
import type { OpeningHours, Review, SpecialHours } from "@/types";

/**
 * Live rating, reviews and opening hours for one shop from the Google Places
 * API (New), so the site follows each Google Business Profile on its own.
 * Server-only: the API key never reaches the browser.
 */

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "rating,userRatingCount,reviews,regularOpeningHours,currentOpeningHours";

/** How often Google is asked again (6 h): ~250 calls a month for both shops. */
export const PLACES_REVALIDATE_SECONDS = 21_600;

// Avatar colours like Google's initial avatars, picked from the reviewer's name.
const AVATAR_COLORS = ["#1769aa", "#7444a8", "#a0445f", "#1e6b4f", "#48577f", "#6a4638", "#8a5a00", "#2f6f8f"];

type GoogleTime = { day?: number; hour?: number; minute?: number; date?: GoogleDate };
type GoogleDate = { year: number; month: number; day: number };
type GooglePeriod = { open?: GoogleTime; close?: GoogleTime };

type GooglePlace = {
  rating?: number;
  userRatingCount?: number;
  reviews?: Array<{
    name?: string;
    rating?: number;
    publishTime?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string };
  }>;
  regularOpeningHours?: { periods?: GooglePeriod[] };
  currentOpeningHours?: { periods?: GooglePeriod[]; specialDays?: Array<{ date?: GoogleDate }> };
};

export type PlaceData = {
  rating: number | null;
  reviewCount: number | null;
  reviews: Review[];
  /** Full week, or null when Google has no regular hours for the shop. */
  openingHours: OpeningHours[] | null;
  specialHours: SpecialHours[];
};

const pad = (value: number) => String(value).padStart(2, "0");
const clock = (time: GoogleTime | undefined) =>
  time?.hour === undefined ? null : `${pad(time.hour)}:${pad(time.minute ?? 0)}`;
const isoDate = (date: GoogleDate) => `${date.year}-${pad(date.month)}-${pad(date.day)}`;

// Google numbers days from Sunday (0); WEEK starts on Monday.
const googleDay = (weekday: (typeof WEEK)[number]) => (WEEK.indexOf(weekday) + 1) % 7;

/** One range per day (first opening to last closing); several periods mean a lunch break. */
function rangeOf(periods: GooglePeriod[]) {
  if (periods.length === 0) return { opens: null, closes: null, closed: true };
  const opens = periods.map((period) => clock(period.open)).filter(Boolean).sort()[0] ?? null;
  // A period without a close is open 24 hours.
  const closes = periods.some((period) => !period.close)
    ? "23:59"
    : (periods.map((period) => clock(period.close)).filter(Boolean).sort().at(-1) ?? null);
  return opens && closes ? { opens, closes } : { opens: null, closes: null, closed: true };
}

export function weeklyHours(periods: GooglePeriod[] | undefined): OpeningHours[] | null {
  if (!periods || periods.length === 0) return null;
  return WEEK.map((day) => ({
    day,
    ...rangeOf(periods.filter((period) => period.open?.day === googleDay(day))),
  }));
}

/** Hours on each special day Google lists in the coming week (holidays, events). */
export function specialHours(current: GooglePlace["currentOpeningHours"]): SpecialHours[] {
  const days = current?.specialDays ?? [];
  return days
    .filter((entry): entry is { date: GoogleDate } => Boolean(entry.date))
    .map(({ date }) => {
      const iso = isoDate(date);
      const periods = (current?.periods ?? []).filter(
        (period) => period.open?.date && isoDate(period.open.date) === iso,
      );
      return { date: iso, ...rangeOf(periods) };
    });
}

function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Good reviews only (4–5 stars) with text, in the reviewer's own words.
 * Google returns up to five per shop, the ones it ranks most relevant.
 */
export function placeReviews(place: GooglePlace, locationName: string): Review[] {
  return (place.reviews ?? []).flatMap((review, index) => {
    const author = review.authorAttribution?.displayName?.trim();
    const text = (review.originalText?.text ?? review.text?.text ?? "").trim();
    const publishedAt = review.publishTime?.slice(0, 10);
    if (!author || !text || !publishedAt || (review.rating ?? 0) < 4) return [];

    return [
      {
        id: review.name ?? `${locationName}-${index}`,
        author,
        authorUrl: review.authorAttribution?.uri,
        avatarColor: avatarColor(author),
        rating: review.rating ?? 5,
        text,
        publishedAt,
        location: locationName,
      },
    ];
  });
}

export function parsePlace(place: GooglePlace, locationName: string): PlaceData {
  return {
    rating: typeof place.rating === "number" ? place.rating : null,
    reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
    reviews: placeReviews(place, locationName),
    openingHours: weeklyHours(place.regularOpeningHours?.periods),
    specialHours: specialHours(place.currentOpeningHours),
  };
}

/**
 * Place Details for one shop, cached by Next.js for six hours (the page is
 * regenerated in the background, so visitors never wait on Google). Null when
 * no key is set or Google fails, so callers keep the data already in the site.
 */
export async function fetchPlace(placeId: string, locationName: string): Promise<PlaceData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: PLACES_REVALIDATE_SECONDS, tags: ["google-places"] },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error("[google-places]", placeId, response.status, (await response.text()).slice(0, 300));
      return null;
    }
    return parsePlace((await response.json()) as GooglePlace, locationName);
  } catch (error) {
    console.error("[google-places]", placeId, error);
    return null;
  }
}
