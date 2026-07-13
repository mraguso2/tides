import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteFooter } from "#/components/SiteFooter/SiteFooter";
import { SiteHeader } from "#/components/SiteHeader/SiteHeader";
import { TideCalendar } from "#/components/TideCalendar/TideCalendar";
import { TideNow } from "#/components/TideNow/TideNow";
import { TideStrip } from "#/components/TideStrip/TideStrip";
import { useTideData } from "#/hooks/useTideData";
import { parseISODate, toISODate } from "#/lib/format";
import { fetchTideYear } from "#/lib/noaa";
import { tideKeys } from "#/lib/queryKeys";
import { stationNow } from "#/lib/tides";
import styles from "./index.module.css";

type HomeSearch = {
	date?: string;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): HomeSearch => {
		const date = search.date;
		return {
			date:
				typeof date === "string" && DATE_PATTERN.test(date) ? date : undefined,
		};
	},
	loader: async ({ context }) => {
		const year = stationNow().getFullYear();
		await context.queryClient.ensureQueryData({
			queryKey: tideKeys.year(year),
			queryFn: () => fetchTideYear(year),
		});
	},
	component: Home,
});

function Home() {
	const { date } = Route.useSearch();
	const navigate = useNavigate({ from: "/" });
	const today = stationNow();
	const selectedDate = date ? parseISODate(date) : today;
	const includeNextYear = selectedDate.getFullYear() > today.getFullYear();
	const { entries, isNextYearLoading } = useTideData({ includeNextYear });

	return (
		<div className={styles.page}>
			<SiteHeader />
			<main className={styles.main}>
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
						isSelectionLoading={includeNextYear && isNextYearLoading}
						onSelectDate={(next) =>
							navigate({ search: { date: toISODate(next) }, replace: true })
						}
					/>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
