import { formatTime12 } from "#/lib/format";
import type { TideEntry } from "#/lib/noaa";
import { entriesForDate } from "#/lib/tides";
import styles from "./TideStrip.module.css";

type TideStripProps = {
	entries: TideEntry[];
	today: Date;
};

export function TideStrip({ entries, today }: TideStripProps) {
	const days = [1, 2, 3].map((offset) => {
		const date = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + offset,
		);
		return { date, tides: entriesForDate(entries, date) };
	});

	return (
		<div className={styles.card}>
			{days.map(({ date, tides }) => (
				<div className={styles.dayRow} key={date.toISOString()}>
					<div>
						<div className={styles.dayName}>
							{date.toLocaleDateString("en-US", { weekday: "long" })}
						</div>
						<div className={styles.dayDate}>
							{date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</div>
					</div>
					<div className={styles.tides}>
						{tides.map((tide) => (
							<div className={styles.tide} key={tide.time}>
								<span className={styles.badge} data-type={tide.type}>
									{tide.type === "H" ? "HIGH" : "LOW"}
								</span>
								<span className={styles.time}>{formatTime12(tide.time)}</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
