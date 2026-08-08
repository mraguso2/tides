import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type { PersistQueryClientOptions } from "@tanstack/react-query-persist-client";

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: FOUR_WEEKS_MS,
				// Not FOUR_WEEKS_MS: gcTime feeds setTimeout, and delays over
				// ~24.8 days overflow the 32-bit limit, firing GC immediately —
				// which deleted the restored query before observers mounted.
				// Infinity skips the timer; persistOptions.maxAge still expires
				// stored data.
				gcTime: Infinity,
			},
		},
	});

	return { queryClient };
}

// Used by PersistQueryClientProvider, which pauses all queries until the
// localStorage restore resolves. That ordering is what guarantees a single
// NOAA fetch per 4 weeks: a query that mounted before the restore would see
// an empty cache and refetch on every reload. It also keeps hydration safe —
// server and client both first-render the loading shell, then restored data
// appears as a client update. storage is undefined during SSR; the persister
// no-ops there.
export const persistOptions = {
	persister: createSyncStoragePersister({
		storage: typeof window === "undefined" ? undefined : window.localStorage,
	}),
	maxAge: FOUR_WEEKS_MS,
} satisfies Omit<PersistQueryClientOptions, "queryClient">;
