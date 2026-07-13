import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: TWO_WEEKS_MS,
				gcTime: TWO_WEEKS_MS,
			},
		},
	});

	// getContext also runs during SSR, where localStorage doesn't exist
	if (typeof window !== "undefined") {
		persistQueryClient({
			queryClient,
			persister: createSyncStoragePersister({ storage: window.localStorage }),
			maxAge: TWO_WEEKS_MS,
		});
	}

	return { queryClient };
}
