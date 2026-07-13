import { MoveDownRight, MoveUpRight } from "lucide-react";
import { useNow } from "#/hooks/useNow";
import { formatDuration, formatHeight, formatTime12 } from "#/lib/format";
import type { TideEntry } from "#/lib/noaa";
import { entryDateTime, findTideState } from "#/lib/tides";
import { TideTimeline } from "../TideTimeline/TideTimeline";
import styles from "./TideNow.module.css";

type TideNowProps = {
	entries: TideEntry[];
};

const NEAR_MS = 120 * 60_000;

export function TideNow({ entries }: TideNowProps) {
	const now = useNow();
	const state = findTideState(entries, now);

	if (!state) {
		return (
			<section className={styles.card}>
				<p className={styles.empty}>
					No tide predictions available for right now.
				</p>
			</section>
		);
	}

	const nowMs = now.getTime();
	const nextIndex = entries.indexOf(state.next);
	const msToNext = entryDateTime(state.next).getTime() - nowMs;
	const msSincePrev = nowMs - entryDateTime(state.previous).getTime();
	const after = entries[nextIndex + 1];
	const before = entries[nextIndex - 2];

	let visible = [state.previous, state.next];
	if (msToNext < NEAR_MS && after) {
		visible = [state.previous, state.next, after];
	} else if (msSincePrev < NEAR_MS && before) {
		visible = [before, state.previous, state.next];
	}

	const rising = state.direction === "rising";
	const nextLabel = state.next.type === "H" ? "High" : "Low";

	return (
		<section className={styles.card} aria-label="Current tide conditions">
			<div className={styles.nowRow}>
				<time className={styles.clock} suppressHydrationWarning>
					{now.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "2-digit",
					})}
				</time>
				<span className={styles.date} suppressHydrationWarning>
					{now.toLocaleDateString("en-US", {
						weekday: "short",
						month: "short",
						day: "numeric",
					})}
				</span>
			</div>
			<p className={styles.status} data-direction={state.direction}>
				{rising ? (
					<MoveUpRight size={14} aria-hidden />
				) : (
					<MoveDownRight size={14} aria-hidden />
				)}
				<strong>{rising ? "Rising" : "Falling"}</strong>
				<span suppressHydrationWarning>
					· {nextLabel} in {formatDuration(state.minutesToNext)} · est.{" "}
					{formatHeight(state.estimatedHeightFt)} now
				</span>
			</p>
			<TideTimeline tides={visible} now={now} />
			<div className={styles.chips}>
				{visible.map((entry) => {
					const diffMin = (nowMs - entryDateTime(entry).getTime()) / 60_000;
					const isPast = diffMin > 0;
					const isAdjacent = entry === state.previous || entry === state.next;
					return (
						<div
							key={`${entry.date} ${entry.time}`}
							className={styles.chip}
							data-type={entry.type}
							data-dimmed={!isAdjacent || undefined}
						>
							<span className={styles.chipLabel}>
								{entry.type === "H" ? "High tide" : "Low tide"}
							</span>
							<span className={styles.chipTime}>
								{formatTime12(entry.time)}
							</span>
							<span className={styles.chipDelta} suppressHydrationWarning>
								{formatDuration(diffMin)} {isPast ? "ago" : "away"} ·{" "}
								{formatHeight(entry.heightFt)}
							</span>
						</div>
					);
				})}
			</div>
		</section>
	);
}
