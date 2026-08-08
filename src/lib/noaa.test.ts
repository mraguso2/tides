import { describe, expect, it } from "vitest";
import { buildTideUrl, parseTideXml } from "./noaa";

// Mirrors the real response's loose indentation and blank lines
const SAMPLE_XML = `
	<datainfo>
		<stationname>Eatons Neck</stationname>
		<stationid>8515786</stationid>
	<data>

			<item>
				<date>2026/01/01</date>
				<day>Thu</day>

				<time>02:45</time>

				<pred_in_ft>-3.84</pred_in_ft>
				<pred_in_cm>-117</pred_in_cm>

				<highlow>L</highlow>

			</item>

			<item>
				<date>2026/01/01</date>
				<day>Thu</day>

				<time>08:53</time>

				<pred_in_ft>4.40</pred_in_ft>
				<pred_in_cm>134</pred_in_cm>

				<highlow>H</highlow>

			</item>
	</data>
	</datainfo>
`;

describe("parseTideXml", () => {
	it("parses items into typed entries", () => {
		const entries = parseTideXml(SAMPLE_XML);
		expect(entries).toEqual([
			{
				date: "2026/01/01",
				day: "Thu",
				time: "02:45",
				heightFt: -3.84,
				heightCm: -117,
				type: "L",
			},
			{
				date: "2026/01/01",
				day: "Thu",
				time: "08:53",
				heightFt: 4.4,
				heightCm: 134,
				type: "H",
			},
		]);
	});

	it("throws when the response contains no items", () => {
		expect(() => parseTideXml("<datainfo></datainfo>")).toThrow(
			/no tide entries/,
		);
	});

	it("throws on a missing field", () => {
		const xml = "<item><date>2026/01/01</date></item>";
		expect(() => parseTideXml(xml)).toThrow(/missing <day>/);
	});

	it("throws on an unexpected highlow value", () => {
		const xml = SAMPLE_XML.replace(
			"<highlow>L</highlow>",
			"<highlow>X</highlow>",
		);
		expect(() => parseTideXml(xml)).toThrow(/unexpected highlow/);
	});

	it("throws on a non-numeric height", () => {
		const xml = SAMPLE_XML.replace(
			"<pred_in_ft>-3.84</pred_in_ft>",
			"<pred_in_ft>n/a</pred_in_ft>",
		);
		expect(() => parseTideXml(xml)).toThrow(/not a number/);
	});
});

describe("buildTideUrl", () => {
	it("targets the Eatons Neck station for the requested year", () => {
		const url = buildTideUrl(2027);
		expect(url).toContain("stnid=8515786");
		expect(url).toContain("bdate=2027");
		expect(url).toContain("annual=true");
	});
});
