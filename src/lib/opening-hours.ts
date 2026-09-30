import type { OpeningHours } from "@/types";

export const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Both shops are in Queensland, which has no daylight saving.
const SHOP_TIME_ZONE = "Australia/Brisbane";

/** True once every day of the week has opening and closing times, or is closed. */
export function hasFullWeek(hours: OpeningHours[]) {
  return WEEK.every((day) => {
    const item = hours.find((entry) => entry.day === day);
    return Boolean(item && (item.closed || (item.opens && item.closes)));
  });
}

/** "09:00" → "9:00 am", "13:30" → "1:30 pm". */
export function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatRange(item: OpeningHours) {
  return item.closed || !item.opens || !item.closes
    ? "Closed"
    : `${formatTime(item.opens)} – ${formatTime(item.closes)}`;
}

/** Current weekday and "HH:MM" at the shops, whatever the visitor's time zone. */
export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: SHOP_TIME_ZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { day: get("weekday"), time: `${get("hour")}:${get("minute")}` };
}

/** One-line status such as "Open now · until 7:00 pm". */
export function statusLine(hours: OpeningHours[], now: { day: string; time: string }) {
  const today = hours.find((item) => item.day === now.day);
  if (!today || today.closed || !today.opens || !today.closes) return "Closed today";
  if (now.time < today.opens) return `Opens today at ${formatTime(today.opens)}`;
  if (now.time < today.closes) return `Open now · until ${formatTime(today.closes)}`;
  return "Closed now";
}

/** "a", "a and b", "a, b and c". */
export function joinList(items: string[]) {
  return items.length < 2
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * The week in one sentence, grouping consecutive days with the same hours:
 * "Tuesday–Wednesday 10:00 am – 6:30 pm and Saturday 9:00 am – 4:00 pm.
 * Closed Monday and Sunday."
 */
export function hoursSentence(hours: OpeningHours[]) {
  const groups: { days: string[]; range: string }[] = [];
  for (const day of WEEK) {
    const item = hours.find((entry) => entry.day === day);
    const range = item ? formatRange(item) : "Closed";
    const last = groups[groups.length - 1];
    if (last && last.range === range) last.days.push(day);
    else groups.push({ days: [day], range });
  }

  const open = groups
    .filter((group) => group.range !== "Closed")
    .map(({ days, range }) => {
      const label = days.length > 1 ? `${days[0]}–${days[days.length - 1]}` : days[0];
      return `${label} ${range}`;
    });
  const closed = groups.filter((group) => group.range === "Closed").flatMap((group) => group.days);

  return [
    open.length > 0 ? `${joinList(open)}.` : "",
    closed.length > 0 ? `Closed ${joinList(closed)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
