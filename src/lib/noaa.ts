export const NOAA_STATION_ID = "8515786";
export const STATION_TIME_ZONE = "America/New_York";

export type TideType = "H" | "L";

export type TideEntry = {
	/** Station-local date, e.g. "2026/01/01" */
	date: string;
	/** Abbreviated weekday, e.g. "Thu" */
	day: string;
	/** Station-local 24-hour time, e.g. "02:45" */
	time: string;
	heightFt: number;
	heightCm: number;
	type: TideType;
};

export function buildTideUrl(year: number): string {
	const params = new URLSearchParams({
		stnid: NOAA_STATION_ID,
		threshold: "",
		thresholdDirection: "greaterThan",
		bdate: String(year),
		timezone: "LST/LDT",
		datum: "MSL",
		clock: "24hour",
		type: "xml",
		annual: "true",
	});
	return `https://tidesandcurrents.noaa.gov/cgi-bin/predictiondownload.cgi?&${params}`;
}

const ITEM_PATTERN = /<item>([\s\S]*?)<\/item>/g;

function readTag(block: string, tag: string): string {
	const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
	if (!match) {
		throw new Error(`NOAA parse error: missing <${tag}> in item`);
	}
	return match[1].trim();
}

function readNumber(block: string, tag: string): number {
	const value = Number(readTag(block, tag));
	if (!Number.isFinite(value)) {
		throw new Error(`NOAA parse error: <${tag}> is not a number`);
	}
	return value;
}

function readTideType(block: string): TideType {
	const value = readTag(block, "highlow");
	if (value !== "H" && value !== "L") {
		throw new Error(`NOAA parse error: unexpected highlow "${value}"`);
	}
	return value;
}

export function parseTideXml(xml: string): TideEntry[] {
	const entries: TideEntry[] = [];
	for (const [, block] of xml.matchAll(ITEM_PATTERN)) {
		entries.push({
			date: readTag(block, "date"),
			day: readTag(block, "day"),
			time: readTag(block, "time"),
			heightFt: readNumber(block, "pred_in_ft"),
			heightCm: readNumber(block, "pred_in_cm"),
			type: readTideType(block),
		});
	}
	if (entries.length === 0) {
		throw new Error("NOAA parse error: no tide entries found in response");
	}
	return entries;
}

export async function fetchTideYear(year: number): Promise<TideEntry[]> {
	const response = await fetch(buildTideUrl(year));
	if (!response.ok) {
		throw new Error(`NOAA request failed: ${response.status} for ${year}`);
	}
	return parseTideXml(await response.text());
}
