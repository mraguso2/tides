import { NOAA_STATION_ID } from "#/lib/noaa";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
	return (
		<footer className={styles.footer}>
			<p className={styles.wordmark}>Harbor Tides</p>
			<p className={styles.locations}>Northport · Huntington · Centerport</p>
			<div className={styles.divider} aria-hidden>
				<span className={styles.dividerLine} />
				<svg
					width="18"
					height="10"
					viewBox="0 0 18 10"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M1 5 Q3 1 5 5 Q7 9 9 5 Q11 1 13 5 Q15 9 17 5"
						stroke="rgba(255,255,255,0.3)"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
				</svg>
				<span className={styles.dividerLine} />
			</div>
			<p className={styles.note}>
				Predictions from NOAA CO-OPS · Station {NOAA_STATION_ID}, Eatons Neck
			</p>
		</footer>
	);
}
