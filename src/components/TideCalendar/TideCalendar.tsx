import { ChevronLeft, ChevronRight, Minus, Sailboat } from "lucide-react";
import { useState } from "react";
import { formatHeight, formatTime12 } from "#/lib/format";
import type { TideEntry } from "#/lib/noaa";
import { entriesForDate } from "#/lib/tides";
import styles from "./TideCalendar.module.css";

type TideCalendarProps = {
	entries: TideEntry[];
	today: Date;
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
	/** True while a lazily-fetched future year is still loading */
	isSelectionLoading: boolean;
};

/** Predictions are browsable a rolling 18 months ahead of the current month */
const MONTHS_AHEAD = 18;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function TideCalendar({
	entries,
	today,
	selectedDate,
	onSelectDate,
	isSelectionLoading,
}: TideCalendarProps) {
	const [monthIndex, setMonthIndex] = useState(
		() => selectedDate.getFullYear() * 12 + selectedDate.getMonth(),
	);

	const year = Math.floor(monthIndex / 12);
	const month = monthIndex % 12;
	const minMonthIndex = today.getFullYear() * 12 + today.getMonth();
	const canPrev = monthIndex > minMonthIndex;
	const canNext = monthIndex < minMonthIndex + MONTHS_AHEAD;

	const firstWeekday = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const todayStart = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);

	const selectedTides = entriesForDate(entries, selectedDate);

	return (
		<div className={styles.card}>
			<div className={styles.nav}>
				<button
					type="button"
					className={styles.navButton}
					onClick={() => setMonthIndex(monthIndex - 1)}
					disabled={!canPrev}
					aria-label="Previous month"
				>
					<ChevronLeft size={16} aria-hidden />
				</button>
				<span className={styles.monthLabel}>
					{new Date(year, month).toLocaleDateString("en-US", {
						month: "long",
						year: "numeric",
					})}
				</span>
				<button
					type="button"
					className={styles.navButton}
					onClick={() => setMonthIndex(monthIndex + 1)}
					disabled={!canNext}
					aria-label="Next month"
				>
					<ChevronRight size={16} aria-hidden />
				</button>
			</div>

			<div className={styles.grid}>
				{WEEKDAYS.map((day) => (
					<span className={styles.weekday} key={day}>
						{day}
					</span>
				))}
				{Array.from({ length: firstWeekday }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static leading blanks
					<span key={i} />
				))}
				{Array.from({ length: daysInMonth }, (_, i) => {
					const dayNumber = i + 1;
					const date = new Date(year, month, dayNumber);
					const isPast = date < todayStart;
					const isToday = date.getTime() === todayStart.getTime();
					const isSelected =
						date.getFullYear() === selectedDate.getFullYear() &&
						date.getMonth() === selectedDate.getMonth() &&
						date.getDate() === selectedDate.getDate();
					return (
						<button
							type="button"
							key={dayNumber}
							className={styles.day}
							disabled={isPast}
							data-state={
								isSelected ? "selected" : isToday ? "today" : undefined
							}
							onClick={() => onSelectDate(date)}
						>
							{dayNumber}
						</button>
					);
				})}
			</div>

			<div className={styles.selection}>
				<p className={styles.selectionTitle}>
					Tides for{" "}
					<strong>
						{selectedDate.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</strong>
				</p>
				{isSelectionLoading ? (
					<p className={styles.selectionNote}>Loading tide predictions…</p>
				) : selectedTides.length === 0 ? (
					<p className={styles.selectionNote}>
						No predictions available for this date.
					</p>
				) : (
					<ul className={styles.tideList} key={selectedDate.toDateString()}>
						{selectedTides.map((tide) => (
							<li
								className={styles.tideItem}
								data-type={tide.type}
								key={tide.time}
							>
								{tide.type === "H" ? (
									<Sailboat size={12} aria-hidden />
								) : (
									<Minus size={12} aria-hidden />
								)}
								<span className={styles.tideType}>
									{tide.type === "H" ? "High tide" : "Low tide"}
								</span>
								<span className={styles.tideTime}>
									{formatTime12(tide.time)}
								</span>
								<span className={styles.tideHeight}>
									{formatHeight(tide.heightFt)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
