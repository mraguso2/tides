import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchTideYear } from "#/lib/noaa";
import { tideKeys } from "#/lib/queryKeys";
import { mergeTideYears } from "#/lib/tides";

/** Calendar is hard-capped at December 2027 — no data beyond this year. */
export const FINAL_DATA_YEAR = 2027;

type UseTideDataOptions = {
	/** Set when the user selects a date beyond the current year. */
	includeNextYear: boolean;
};

export function useTideData({ includeNextYear }: UseTideDataOptions) {
	const currentYear = new Date().getFullYear();
	const nextYear = currentYear + 1;
	const nextYearAvailable = nextYear <= FINAL_DATA_YEAR;

	const currentQuery = useSuspenseQuery({
		queryKey: tideKeys.year(currentYear),
		queryFn: () => fetchTideYear(currentYear),
	});

	const nextQuery = useQuery({
		queryKey: tideKeys.year(nextYear),
		queryFn: () => fetchTideYear(nextYear),
		enabled: includeNextYear && nextYearAvailable,
	});

	const entries = useMemo(
		() => mergeTideYears(currentQuery.data, nextQuery.data ?? []),
		[currentQuery.data, nextQuery.data],
	);

	return {
		entries,
		isNextYearLoading: nextQuery.isLoading,
	};
}
