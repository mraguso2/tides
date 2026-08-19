import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles/index.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Harbor Tides — Eatons Neck, NY",
			},
			{
				name: "description",
				content:
					"High and low tide times for Eatons Neck, Northport, Centerport, and Huntington Harbor, NY. NOAA tide predictions for boaters and fishermen.",
			},
			{
				name: "theme-color",
				content: "#003b5c",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/icon.svg",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "48x48",
				href: "/favicon-48.png",
			},
			{
				rel: "apple-touch-icon",
				href: "/logo192.png",
			},
		],
		scripts: [
			{
				src: "https://cloud.umami.is/script.js",
				defer: true,
				"data-website-id": "286470b2-3bd6-4ae0-be16-abfd4294b61b",
				// Tracker no-ops unless the hostname matches, so dev, `pnpm preview`,
				// and *.workers.dev preview deploys stay out of the analytics.
				"data-domains": "harbortides.app",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
