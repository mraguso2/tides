/** "14:45" → "2:45 PM" */
export function formatTime12(time: string): string {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** 184 → "3h 4m"; 45 → "45m"; 120 → "2h" */
export function formatDuration(totalMinutes: number): string {
	const minutes = Math.abs(Math.round(totalMinutes));
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return `${m}m`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}

export function formatHeight(feet: number): string {
	return `${feet.toFixed(1)} ft`;
}
