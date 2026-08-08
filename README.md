# Harbor Tides

Nautical-themed tide dashboard for **Eatons Neck, NY** (NOAA station 8515786) and the surrounding boating community of Northport, Centerport, and Huntington Harbor.

Live at **[harbortides.app](https://harbortides.app)**.

- **Now** — current tide state, rising or falling, height, time until next high or low, with a bezier tide curve
- **Next 4 days** — today plus a 3-day lookahead of high/low tides
- **18-month calendar** — pick any future date within a rolling window to see that day's schedule
- **Offline-friendly** — NOAA is fetched at most once per 4 weeks per device; every reload in between is served from localStorage
- **Installable** — manifest + icons for Add-to-Home-Screen on iOS and Android

## Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React on Vite
- React 19, TypeScript (strict), CSS Modules — no Tailwind, no CSS-in-JS
- [Biome](https://biomejs.dev/) for lint + format, [Vitest](https://vitest.dev/) for tests
- Deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/) via the Cloudflare Vite plugin

## Getting started

```bash
pnpm install
pnpm dev              # localhost:3000
```

Common scripts:

```bash
pnpm build            # production build
pnpm preview          # build + preview
pnpm test             # Vitest
pnpm check            # Biome lint + format
pnpm deploy           # build + wrangler deploy
pnpm generate-routes  # regenerate TanStack Router route tree
```

Use `pnpm` exclusively — never `npm` or `yarn`.

## Project layout

```
src/
├── routes/                # file-based routes (routeTree.gen.ts is auto-generated — don't edit)
│   ├── __root.tsx         # root layout: meta, manifest link, icons, dev panel
│   └── index.tsx          # / — the single dashboard page
├── components/            # UI components, one folder each with .tsx + .module.css
│   ├── SiteHeader/        # sticky navy header with anchor logo + location badge
│   ├── HeroBanner/        # Eatons Neck harbor photo
│   ├── WaveDivider/       # two-tone scalloped SVG mask, drifting sailboat animation
│   ├── TideNow/           # hero card: live clock + rising/falling + chips
│   ├── TideTimeline/      # SVG tide-curve chart with NOW marker
│   ├── TideStrip/         # 4-day upcoming rows with Today badge
│   ├── TideCalendar/      # month calendar + selected-day tide list
│   ├── SiteFooter/        # wordmark, locations, NOAA credit
│   └── AdCard/            # unmounted sponsor slot component (v2)
├── hooks/
│   └── useTideData.ts     # merges current + selected-year queries, hydration-gated
├── lib/
│   ├── noaa.ts            # NOAA URL builder + XML → TideEntry parser (regex-based, Workers-safe)
│   ├── tides.ts           # merge/sort, entriesForDate, findTideState (half-cosine height)
│   ├── queryKeys.ts       # tide query key factory
│   └── format.ts          # time/height formatters
├── integrations/
│   └── tanstack-query/    # QueryClient + persist options + devtools
├── styles/
│   ├── reset.css
│   ├── tokens.css         # colors, fluid type scale, spacing, radius, shadows
│   ├── global.css
│   └── index.css
├── router.tsx             # TanStack Router setup + PersistQueryClientProvider wrap
└── main.tsx
public/
├── manifest.json          # PWA manifest (Harbor Tides, navy theme, portrait, maskable)
├── icon.svg               # anchor logo, source of truth for all icons
├── logo192.png            # Android A2HS + apple-touch-icon
├── logo512.png            # Android A2HS high-DPI
├── favicon-32.png         # tab favicon
└── favicon-48.png
```

## Data

Tide predictions come from the **NOAA CO-OPS Predictions API**, station 8515786 (Eatons Neck)

The browser calls NOAA directly. A full year (~1,400 entries) is cached in `localStorage` with a 4-week freshness window; the selected year is fetched lazily if the user browses into it via the calendar.

## Credits

Tide data © NOAA CO-OPS.
