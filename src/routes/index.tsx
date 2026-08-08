import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeroBanner } from "#/components/HeroBanner/HeroBanner";
import { SiteFooter } from "#/components/SiteFooter/SiteFooter";
import { SiteHeader } from "#/components/SiteHeader/SiteHeader";
import { TideCalendar } from "#/components/TideCalendar/TideCalendar";
import { TideNow } from "#/components/TideNow/TideNow";
import { TideStrip } from "#/components/TideStrip/TideStrip";
import { WaveDivider } from "#/components/WaveDivider/WaveDivider";
import { useTideData } from "#/hooks/useTideData";
import { stationNow } from "#/lib/tides";
import styles from "./index.module.css";

// No SSR loader prefetch: tide data is fetched client-side only, so NOAA is
// hit at most once per 4 weeks per device — every reload in between is served
// from the localStorage-persisted cache.
export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const today = stationNow();
	const [selectedDate, setSelectedDate] = useState(today);
	const { entries, isError, isSelectionLoading } = useTideData({
		selectedYear: selectedDate.getFullYear(),
	});

	return (
		<div className={styles.page}>
			<SiteHeader />
			<HeroBanner />
			<WaveDivider variant="hero" />
			<main className={styles.main}>
				{entries.length === 0 ? (
					<section className={styles.notice} aria-live="polite">
						{isError ? (
							<>
								<p className={styles.noticeTitle}>
									Tide predictions unavailable
								</p>
								<p className={styles.noticeBody}>
									NOAA's prediction service isn't responding right now.
									Predictions will return automatically once it recovers.
								</p>
							</>
						) : (
							<p className={styles.noticeBody}>Loading tide predictions…</p>
						)}
					</section>
				) : (
					<>
						<TideNow entries={entries} />
						<section aria-labelledby="upcoming-label">
							<h2 className={styles.sectionLabel} id="upcoming-label">
								Upcoming tides
							</h2>
							<TideStrip entries={entries} today={today} />
						</section>
						<section aria-labelledby="calendar-label">
							<h2 className={styles.sectionLabel} id="calendar-label">
								Tide calendar
							</h2>
							<TideCalendar
								entries={entries}
								today={today}
								selectedDate={selectedDate}
								isSelectionLoading={isSelectionLoading}
								onSelectDate={setSelectedDate}
							/>
						</section>
					</>
				)}
			</main>
			<WaveDivider variant="footer" />
			<SiteFooter />
		</div>
	);
}
