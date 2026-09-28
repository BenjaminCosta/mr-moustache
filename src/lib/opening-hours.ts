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
