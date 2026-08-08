import { describe, expect, it } from "vitest";
import { formatDuration, formatHeight, formatTime12 } from "./format";

describe("formatTime12", () => {
	it("converts 24-hour to 12-hour", () => {
		expect(formatTime12("00:05")).toBe("12:05 AM");
		expect(formatTime12("02:45")).toBe("2:45 AM");
		expect(formatTime12("12:00")).toBe("12:00 PM");
		expect(formatTime12("16:11")).toBe("4:11 PM");
	});
});

describe("formatDuration", () => {
	it("formats minutes, hours, and mixed", () => {
		expect(formatDuration(45)).toBe("45m");
		expect(formatDuration(120)).toBe("2h");
		expect(formatDuration(184)).toBe("3h 4m");
		expect(formatDuration(-90)).toBe("1h 30m");
	});
});

describe("formatHeight", () => {
	it("shows one decimal with unit", () => {
		expect(formatHeight(4.4)).toBe("4.4 ft");
		expect(formatHeight(-3.842)).toBe("-3.8 ft");
	});
});
