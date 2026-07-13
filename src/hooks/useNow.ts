import { useEffect, useState } from "react";
import { stationNow } from "#/lib/tides";

/** Station wall-clock time, ticking every interval. */
export function useNow(intervalMs = 30_000): Date {
	const [now, setNow] = useState(() => stationNow());

	useEffect(() => {
		const id = setInterval(() => setNow(stationNow()), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);

	return now;
}
