import { formatTime12 } from "#/lib/format";
import type { TideEntry } from "#/lib/noaa";
import { entryDateTime } from "#/lib/tides";
import styles from "./TideTimeline.module.css";

type TideTimelineProps = {
	/** 2–3 chronological tides bracketing the current moment */
	tides: TideEntry[];
	now: Date;
};

// SVG coordinate space — scales with the card via viewBox
const WIDTH = 340;
const HEIGHT = 120;
const PAD = { left: 16, right: 16, top: 28, bottom: 32 };
const WINDOW_PAD_MS = 45 * 60_000;

function bezierY(y0: number, y1: number, t: number): number {
	const mid = (y0 + y1) / 2;
	return (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * mid + t * t * y1;
}

export function TideTimeline({ tides, now }: TideTimelineProps) {
	const drawW = WIDTH - PAD.left - PAD.right;
	const drawH = HEIGHT - PAD.top - PAD.bottom;
	const midY = PAD.top + drawH / 2;
	const nowMs = now.getTime();

	const times = tides.map((tide) => entryDateTime(tide).getTime());
	const minMs = Math.min(...times, nowMs) - WINDOW_PAD_MS;
	const maxMs = Math.max(...times, nowMs) + WINDOW_PAD_MS;
	const toX = (ms: number) =>
		PAD.left + ((ms - minMs) / (maxMs - minMs)) * drawW;

	const points = tides.map((tide, i) => ({
		tide,
		x: toX(times[i]),
		y: tide.type === "H" ? PAD.top + 8 : PAD.top + drawH - 8,
	}));

	let path = "";
	if (points.length === 2) {
		const cp = (points[0].x + points[1].x) / 2;
		path = `M${points[0].x},${points[0].y} C${cp},${points[0].y} ${cp},${points[1].y} ${points[1].x},${points[1].y}`;
	} else if (points.length === 3) {
		const cp1 = (points[0].x + points[1].x) / 2;
		const cp2 = (points[1].x + points[2].x) / 2;
		path = `M${points[0].x},${points[0].y} C${cp1},${points[0].y} ${cp1},${points[1].y} ${points[1].x},${points[1].y} S${cp2},${points[2].y} ${points[2].x},${points[2].y}`;
	}

	const nowX = toX(nowMs);
	let nowY = midY;
	if (points.length >= 2) {
		const first = points[0];
		const last = points[points.length - 1];
		const frac = (nowX - first.x) / (last.x - first.x);
		if (points.length === 2) {
			nowY = bezierY(first.y, last.y, Math.min(1, Math.max(0, frac)));
		} else {
			const [from, to] =
				frac < 0.5 ? [points[0], points[1]] : [points[1], points[2]];
			const t = frac < 0.5 ? frac * 2 : (frac - 0.5) * 2;
			nowY = bezierY(from.y, to.y, Math.min(1, Math.max(0, t)));
		}
	}

	return (
		<svg
			viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			className={styles.svg}
			role="img"
			aria-label="Timeline of nearby high and low tides with the current moment marked"
		>
			<line
				className={styles.axis}
				x1={PAD.left}
				y1={midY}
				x2={WIDTH - PAD.right}
				y2={midY}
			/>
			<text className={styles.axisHigh} x={PAD.left} y={PAD.top + 5}>
				HIGH
			</text>
			<text className={styles.axisLow} x={PAD.left} y={PAD.top + drawH + 1}>
				LOW
			</text>
			{path && <path className={styles.wave} d={path} />}
			{points.map((point) => (
				<g
					key={`${point.tide.date} ${point.tide.time}`}
					className={styles.tidePoint}
					data-type={point.tide.type}
				>
					<circle cx={point.x} cy={point.y} r={4.5} />
					<text
						x={point.x}
						y={point.y > midY ? point.y + 16 : point.y - 10}
						textAnchor="middle"
					>
						{formatTime12(point.tide.time)}
					</text>
				</g>
			))}
			<g className={styles.now}>
				<line x1={nowX} y1={PAD.top - 8} x2={nowX} y2={PAD.top + drawH + 10} />
				<circle cx={nowX} cy={nowY} r={6} />
				<circle className={styles.nowDot} cx={nowX} cy={nowY} r={2.5} />
				<rect x={nowX - 16} y={PAD.top - 20} width={32} height={14} rx={7} />
				<text x={nowX} y={PAD.top - 10} textAnchor="middle">
					NOW
				</text>
			</g>
		</svg>
	);
}
