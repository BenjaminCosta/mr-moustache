const DAY = 24 * 60 * 60 * 1000;

/**
 * Relative date in the words Google uses on reviews ("a day ago",
 * "3 weeks ago", "5 months ago"), from an ISO date ("2026-09-22").
 */
export function googleRelativeTime(publishedAt: string, now: number) {
  const days = Math.max(0, Math.floor((now - Date.parse(`${publishedAt}T00:00:00Z`)) / DAY));

  const ago = (count: number, unit: string) =>
    count === 1 ? `a ${unit} ago` : `${count} ${unit}s ago`;

  if (days === 0) return "today";
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.floor(days / 7), "week");
  if (days < 365) return ago(Math.max(1, Math.floor(days / 30.44)), "month");
  return ago(Math.floor(days / 365.25), "year");
}

/**
 * Review total: exact when it comes live from Google, otherwise a lower bound
 * ("60+") so the saved number stays true as reviews come in.
 */
export function reviewCountLabel(count: number, exact = false) {
  return exact ? String(count) : `${count}+`;
}
