import { describe, expect, it } from "vitest";
import type { TideEntry } from "./noaa";
import {
	entriesForDate,
	entryDateTime,
	findTideState,
	mergeTideYears,
} from "./tides";

function entry(overrides: Partial<TideEntry>): TideEntry {
	return {
		date: "2026/01/01",
		day: "Thu",
		time: "02:45",
		heightFt: -3.84,
		heightCm: -117,
		type: "L",
		...overrides,
	};
}

const JAN_1_LOW = entry({});
const JAN_1_HIGH = entry({
	time: "08:53",
	heightFt: 4.4,
	heightCm: 134,
	type: "H",
});
const JAN_2_LOW = entry({ date: "2026/01/02", day: "Fri", time: "03:30" });
const NEXT_YEAR_HIGH = entry({
	date: "2027/06/15",
	day: "Tue",
	time: "12:00",
	heightFt: 3.9,
	heightCm: 119,
	type: "H",
});

describe("entryDateTime", () => {
	it("builds a local Date from date and time fields", () => {
		expect(entryDateTime(JAN_1_HIGH)).toEqual(new Date(2026, 0, 1, 8, 53));
	});
});

describe("mergeTideYears", () => {
	it("merges, sorts chronologically, and dedupes across years", () => {
		const merged = mergeTideYears(
			[JAN_2_LOW, JAN_1_HIGH],
			[JAN_1_LOW, JAN_1_HIGH, NEXT_YEAR_HIGH],
		);
		expect(merged).toEqual([JAN_1_LOW, JAN_1_HIGH, JAN_2_LOW, NEXT_YEAR_HIGH]);
	});
});

describe("entriesForDate", () => {
	it("returns only entries matching the given calendar day", () => {
		const all = [JAN_1_LOW, JAN_1_HIGH, JAN_2_LOW];
		expect(entriesForDate(all, new Date(2026, 0, 1))).toEqual([
			JAN_1_LOW,
			JAN_1_HIGH,
		]);
	});
});

describe("findTideState", () => {
	const entries = [JAN_1_LOW, JAN_1_HIGH, JAN_2_LOW];

	it("reports rising toward an upcoming high", () => {
		// Exact midpoint of the 02:45 → 08:53 window
		const state = findTideState(entries, new Date(2026, 0, 1, 5, 49));
		expect(state).not.toBeNull();
		expect(state?.direction).toBe("rising");
		expect(state?.previous).toEqual(JAN_1_LOW);
		expect(state?.next).toEqual(JAN_1_HIGH);
		expect(state?.progress).toBeCloseTo(0.5, 5);
		expect(state?.estimatedHeightFt).toBeCloseTo((-3.84 + 4.4) / 2, 5);
		expect(state?.minutesToNext).toBe(184);
	});

	it("reports falling toward an upcoming low", () => {
		const state = findTideState(entries, new Date(2026, 0, 1, 20, 0));
		expect(state?.direction).toBe("falling");
		expect(state?.next).toEqual(JAN_2_LOW);
	});

	it("returns null before the first or after the last entry", () => {
		expect(findTideState(entries, new Date(2025, 11, 31))).toBeNull();
		expect(findTideState(entries, new Date(2026, 0, 3))).toBeNull();
	});
});
