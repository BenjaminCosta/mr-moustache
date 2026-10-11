import type { Locale } from "@/i18n/locales";
import type { OpeningHours, SpecialHours } from "@/types";

export const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const SPANISH_DAYS: Record<(typeof WEEK)[number], string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

/** "Monday" in the page's language ("Lunes"). */
export function dayName(day: string, locale: Locale = "en") {
  return locale === "es" ? (SPANISH_DAYS[day as (typeof WEEK)[number]] ?? day) : day;
}

// Both shops are in Queensland, which has no daylight saving.
const SHOP_TIME_ZONE = "Australia/Brisbane";

/** True once every day of the week has opening and closing times, or is closed. */
export function hasFullWeek(hours: OpeningHours[]) {
  return WEEK.every((day) => {
    const item = hours.find((entry) => entry.day === day);
    return Boolean(item && (item.closed || (item.opens && item.closes)));
  });
}

/** "09:00" → "9:00 am", "13:30" → "1:30 pm"; in Spanish, 24-hour "13:30". */
export function formatTime(value: string, locale: Locale = "en") {
  const [hours, minutes] = value.split(":").map(Number);
  const mm = String(minutes).padStart(2, "0");
  if (locale === "es") return `${hours}:${mm}`;
  const suffix = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  return `${hour}:${mm} ${suffix}`;
}

export function formatRange(item: OpeningHours, locale: Locale = "en") {
  return item.closed || !item.opens || !item.closes
    ? locale === "es"
      ? "Cerrado"
      : "Closed"
    : `${formatTime(item.opens, locale)} – ${formatTime(item.closes, locale)}`;
}

export type ShopNow = { day: string; time: string; /** "YYYY-MM-DD" at the shops. */ date: string };

/** Current weekday, "HH:MM" and date at the shops, whatever the visitor's time zone. */
export function shopNow(date = new Date()): ShopNow {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: SHOP_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    day: get("weekday"),
    time: `${get("hour")}:${get("minute")}`,
    date: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

/** Today's hours: a holiday or special date from Google wins over the weekly hours. */
export function hoursFor(
  hours: OpeningHours[],
  now: { day: string; date?: string },
  special: SpecialHours[] = [],
): (OpeningHours & { special?: boolean }) | undefined {
  const override = now.date ? special.find((item) => item.date === now.date) : undefined;
  if (override) return { ...override, day: now.day, special: true };
  return hours.find((item) => item.day === now.day);
}

/** One-line status such as "Open now · until 7:00 pm" ("Abierto ahora · hasta las 19:00"). */
export function statusLine(
  hours: OpeningHours[],
  now: { day: string; time: string; date?: string },
  special: SpecialHours[] = [],
  locale: Locale = "en",
) {
  const es = locale === "es";
  const today = hoursFor(hours, now, special);
  if (!today || today.closed || !today.opens || !today.closes) return es ? "Cerrado hoy" : "Closed today";
  if (now.time < today.opens) {
    return es ? `Abre hoy a las ${formatTime(today.opens, locale)}` : `Opens today at ${formatTime(today.opens)}`;
  }
  if (now.time < today.closes) {
    return es
      ? `Abierto ahora · hasta las ${formatTime(today.closes, locale)}`
      : `Open now · until ${formatTime(today.closes)}`;
  }
  return es ? "Cerrado ahora" : "Closed now";
}

/** "a", "a and b", "a, b and c" ("a, b y c" in Spanish). */
export function joinList(items: string[], locale: Locale = "en") {
  const and = locale === "es" ? "y" : "and";
  return items.length < 2
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

/**
 * The week in one sentence, grouping consecutive days with the same hours:
 * "Tuesday–Wednesday 10:00 am – 6:30 pm and Saturday 9:00 am – 4:00 pm.
 * Closed Monday and Sunday." In Spanish: "Martes a miércoles de 10:00 a
 * 18:30 y sábado de 9:00 a 16:00. Cerrado lunes y domingo."
 */
export function hoursSentence(hours: OpeningHours[], locale: Locale = "en") {
  const es = locale === "es";
  const groups: { days: string[]; item: OpeningHours | undefined; key: string }[] = [];
  for (const day of WEEK) {
    const item = hours.find((entry) => entry.day === day);
    const key = item ? formatRange(item) : "Closed";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(day);
    else groups.push({ days: [day], item, key });
  }

  const open = groups
    .filter((group) => group.key !== "Closed")
    .map(({ days, item }) => {
      const first = dayName(days[0], locale);
      const last = dayName(days[days.length - 1], locale);
      if (es) {
        const label = days.length > 1 ? `${first} a ${last.toLowerCase()}` : first;
        return `${label.toLowerCase()} de ${formatTime(item!.opens!, locale)} a ${formatTime(item!.closes!, locale)}`;
      }
      return `${days.length > 1 ? `${first}–${last}` : first} ${formatRange(item!)}`;
    });
  const closed = groups
    .filter((group) => group.key === "Closed")
    .flatMap((group) => group.days)
    .map((day) => (es ? dayName(day, locale).toLowerCase() : day));

  const sentences = [
    open.length > 0 ? `${joinList(open, locale)}.` : "",
    closed.length > 0 ? `${es ? "Cerrado" : "Closed"} ${joinList(closed, locale)}.` : "",
  ].filter(Boolean);

  // Spanish day names are lower case mid-sentence; capitalise the start.
  return sentences.map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join(" ");
}
