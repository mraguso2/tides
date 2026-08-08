import { STATION_TIME_ZONE, type TideEntry } from "./noaa";

export type TideDirection = "rising" | "falling";

/**
 * Current station wall-clock time expressed as a plain Date, so it compares
 * directly with entryDateTime(). NOAA times are station-local, but SSR runs
 * on Cloudflare Workers in UTC — never trust the runtime's local timezone.
 */
export function stationNow(): Date {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: STATION_TIME_ZONE,
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
	}).formatToParts(new Date());
	const get = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value);
	return new Date(
		get("year"),
		get("month") - 1,
		get("day"),
		get("hour") % 24,
		get("minute"),
		get("second"),
	);
}

export type TideState = {
	previous: TideEntry;
	next: TideEntry;
	direction: TideDirection;
	/** 0..1 position between previous and next tide */
	progress: number;
	/** Sinusoidal estimate of the current water height */
	estimatedHeightFt: number;
	minutesToNext: number;
};

export function entryDateTime(entry: TideEntry): Date {
	const [year, month, day] = entry.date.split("/").map(Number);
	const [hours, minutes] = entry.time.split(":").map(Number);
	return new Date(year, month - 1, day, hours, minutes);
}

export function dateKey(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}/${month}/${day}`;
}

export function mergeTideYears(...years: TideEntry[][]): TideEntry[] {
	const byDateTime = new Map<string, TideEntry>();
	for (const entries of years) {
		for (const entry of entries) {
			byDateTime.set(`${entry.date} ${entry.time}`, entry);
		}
	}
	return [...byDateTime.values()].sort(
		(a, b) => entryDateTime(a).getTime() - entryDateTime(b).getTime(),
	);
}

export function entriesForDate(entries: TideEntry[], date: Date): TideEntry[] {
	const key = dateKey(date);
	return entries.filter((entry) => entry.date === key);
}

/**
 * Water height between two tide extremes follows an approximately
 * sinusoidal curve, so interpolate with a half-cosine rather than linearly.
 */
export function findTideState(
	entries: TideEntry[],
	now: Date,
): TideState | null {
	const nowMs = now.getTime();
	const nextIndex = entries.findIndex(
		(entry) => entryDateTime(entry).getTime() > nowMs,
	);
	if (nextIndex <= 0) {
		return null;
	}

	const previous = entries[nextIndex - 1];
	const next = entries[nextIndex];
	const previousMs = entryDateTime(previous).getTime();
	const nextMs = entryDateTime(next).getTime();

	const progress = (nowMs - previousMs) / (nextMs - previousMs);
	const eased = (1 - Math.cos(Math.PI * progress)) / 2;
	const estimatedHeightFt =
		previous.heightFt + (next.heightFt - previous.heightFt) * eased;

	return {
		previous,
		next,
		direction: next.type === "H" ? "rising" : "falling",
		progress,
		estimatedHeightFt,
		minutesToNext: Math.round((nextMs - nowMs) / 60_000),
	};
}
