import { useQuery } from "@tanstack/react-query";
import { useMemo, useSyncExternalStore } from "react";
import { fetchTideYear } from "#/lib/noaa";
import { tideKeys } from "#/lib/queryKeys";
import { mergeTideYears, stationNow } from "#/lib/tides";

type UseTideDataOptions = {
	/** Year of the user's selected calendar date — fetched lazily when it differs from the current year */
	selectedYear: number;
};

const emptySubscribe = () => () => {};

// Plain useQuery (not suspense) so an NOAA outage degrades gracefully:
// SSR renders a shell, the client restores persisted data from localStorage,
// and only a truly empty cache surfaces an error state.
export function useTideData({ selectedYear }: UseTideDataOptions) {
	const currentYear = stationNow().getFullYear();

	// The route component is code-split, so the synchronous localStorage
	// restore can finish before it hydrates. Hold back restored data for the
	// hydration render so it matches the server-rendered loading shell.
	const hydrated = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	const currentQuery = useQuery({
		queryKey: tideKeys.year(currentYear),
		queryFn: () => fetchTideYear(currentYear),
	});

	const selectedQuery = useQuery({
		queryKey: tideKeys.year(selectedYear),
		queryFn: () => fetchTideYear(selectedYear),
		enabled: selectedYear !== currentYear,
	});

	const entries = useMemo(
		() => mergeTideYears(currentQuery.data ?? [], selectedQuery.data ?? []),
		[currentQuery.data, selectedQuery.data],
	);

	return {
		entries: hydrated ? entries : [],
		isError: currentQuery.isError,
		isSelectionLoading: selectedYear !== currentYear && selectedQuery.isLoading,
	};
}
