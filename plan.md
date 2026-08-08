# Harbor Tides — Build Plan & Status

Living document. Update as work progresses. Referenced from `CLAUDE.md`.

Last updated: 2026-08-02

---

## Current status

**v1 is live at [harbortides.app](https://harbortides.app)** (Cloudflare Workers, custom domain, TanStack Start SSR + client hydration). The tide dashboard is fully functional: NOAA-backed hero/strip/calendar for Eatons Neck (station 8515786), cached in localStorage for 4 weeks per device.

Next phase is v2 — see [v2 wishlist](#v2-wishlist) below.

---

## Shipped in v1

Confidence legend:
**High** = verified by tests and/or real data/output.
**Medium** = code reviewed + compiles + SSR-verified, but not exercised in a real browser.

| Work | How it was done | Confidence |
|---|---|---|
| Tailwind fully removed | `pnpm remove` of 3 packages; purged vite plugin, CSS import, utility classes, README section, `.cta.json` flag. Verified via repo-wide grep + clean build (CSS output dropped to 0.07 kB) | High |
| NOAA data layer (`src/lib/noaa.ts`) | String/regex XML parser (no DOMParser — runs in Workers, SSR, browser). Typed `TideEntry`, descriptive parse errors. Verified against the real 285 kB 2026 response: 1,410 entries, spot-checked against live clock | High |
| Tide utilities (`src/lib/tides.ts`) | `mergeTideYears` (dedupe + sort), `entriesForDate`, `findTideState` (direction, minutes-to-next, half-cosine height estimate), `stationNow()`. Unit tested | High |
| Query layer | `tideKeys` factory; QueryClient with 4-week staleTime (`gcTime: Infinity` — see setTimeout-overflow decision); localStorage persistence via `PersistQueryClientProvider` in `router.Wrap`. `useTideData` hook: current year + selected year via lazy `enabled` query, merged transparently, hydration-gated | High (cold/warm/stale/lazy-year flows browser-verified against live NOAA 2026-07-25) |
| Vitest setup | Cloudflare Vite plugin breaks Vitest, so tests run via a separate `vitest.config.ts`. 15 tests green | High |
| Design tokens | `design/tokens.md` + `src/styles/` (reset → tokens → global). Palette: navy + amber + sand + ink. Amber reserved for NOW marker. Seafoam palette removed 2026-07-31 (no more green — see color-unification decision) | High |
| Fluid typography | `--text-*` tokens use `clamp()` so type scales smoothly from ~24rem to ~80rem viewport; no font-size media queries | High |
| TideNow hero + TideTimeline SVG | Live clock (30 s tick), rising/falling + est. height + time-to-next, bezier tide curve with NOW marker, 2–3 chips with near-tide window expansion. Direction indicator color unified to navy (arrow icon shape still signals direction) | High |
| TideStrip | 4-row layout: today + next 3 days, chronological. Today row carries a sand-colored "Today" pill in the top-right corner | High |
| TideCalendar | Rolling 18-month cap (current month + 18), past dates disabled, selected-day tide list with @starting-style animate-in. Hover styles gated by `@media (hover: hover)` so mobile doesn't get stuck hover states when scroll starts on a day | High |
| Page wiring | Selected date is local state (no URL param); no route loader — tide data is client-only so NOAA is hit at most once per 4 weeks per device; sticky header; footer; unmounted `<AdCard />` component ready for sponsors | High |
| Wave dividers | Three-layer scalloped SVG masks between hero↔main and main↔footer (`WaveDivider` component with `variant="hero"|"footer"`). Sailboat drifts across each via rAF-driven `transform: translate() rotate()` with sine bob/tilt; hero boat drifts right, footer boat drifts left (with `scaleX(-1)` on the sail) | High |
| Layout | `.page` uses `grid-template-rows: auto auto auto 1fr auto auto` — the `1fr` slot is `<main>` so viewport-height leftover expands the content area, not a decorative wave divider. Site-wide `max-inline-size: 90rem` cap on the page container so ultrawide screens don't stretch content | High |
| Mobile hardening | `touch-action: manipulation` on all buttons (kills 300 ms tap delay); calendar day/nav hover rules wrapped in `@media (hover: hover)` (no sticky-hover on touch scroll); `overscroll-behavior-y` (currently commented out — see decision below) | High |
| Timezone correctness | All "now"/"today" math via `stationNow()` pinned to `America/New_York` because Workers run UTC — server and client agree at date boundaries | High for logic; Medium overall (no dedicated DST unit test yet) |
| Manifest + icons | Custom `manifest.json` (Harbor Tides, `theme_color: #003b5c`, `background_color: #f6f3ec`, standalone, portrait, `purpose: any maskable`). Anchor icon (lucide) rendered via Playwright at 32/48/192/512 PNG plus `icon.svg` vector. Scaffold React-logo `.ico` deleted. `<link rel="icon">` + `<link rel="apple-touch-icon">` wired in `__root.tsx` | High |
| Deploy | `pnpm deploy` → Cloudflare Workers under `harbortides.app`, custom domain via `routes: [{ pattern: "harbortides.app", custom_domain: true }]` in `wrangler.jsonc`. Cloudflare provisions DNS + SSL automatically. `pnpm build` produces ~109 KB gzipped client JS, ~3 KB gzipped CSS | High |

---

## v2 wishlist

In rough priority order — nothing scheduled, nothing committed:

1. **Multi-page routing** — expand from a single-page dashboard to multiple routes. Candidates: dedicated day-detail page, station selector (other Long Island Sound stations), about/credits page.
2. **Harbor Hopper game** — a small nautical-themed browser game to embed. Concept TBD; would live on its own route.
3. **`<AdCard />` sponsor slots** — component skeleton already exists but is unmounted. Wire real sponsor content into TideNow / TideStrip / TideCalendar surrounding areas. Design for a small number of local businesses.
4. **Analytics** — need traffic + engagement numbers to show worth to prospective advertisers. Requires picking an analytics provider (Cloudflare Web Analytics is free/privacy-friendly and lives in the same account; Plausible/Fathom are alternatives). Package/dependency approval before installing anything.
5. **PWA service worker** — `vite-plugin-pwa` for true offline-first (assets precached, install prompts). Basic PWA (manifest + A2HS) is already in place; SW would upgrade repeat-load performance and offline-first-load behavior. Needs package approval.
6. **`stationNow()` DST unit test** — mockable clock, DST spring/fall boundary cases.
7. **Dark mode** — tokens are structured to allow it, timeline design file hints at it. Scope was cut from v1.

**Explicitly NOT doing (per user 2026-08-02):**
- Calendar month-swipe gesture — tested and didn't feel right. Nav buttons stay as the only way to change months.

---

## Decisions made and why

- **String/regex XML parsing over DOMParser or an XML package** — DOMParser
  doesn't exist in Workers/SSR; a package needs approval and adds weight. The
  NOAA XML is flat and regular, so a small typed parser is safe. Throws loudly
  on malformed input.
- **Browser fetches NOAA directly; no server proxy** — endpoint sends
  `access-control-allow-origin: *` (verified via curl). Keeps the Worker out
  of the data path and helps the offline story.
- **`@tanstack/react-query-persist-client` + `@tanstack/query-sync-storage-persister`**
  — the originally specified `@tanstack/localstorage-persister` doesn't exist;
  these are the real official packages (approved 2026-07-11).
- **`stationNow()` pinned to America/New_York** — Cloudflare Workers run UTC;
  computing "today" from the runtime clock would show tomorrow's tides to NY
  users after ~7–8 PM. All tide times are station-local, so wall-clock math is
  done in station time everywhere.
- **Selected date is local state, not a URL search param** (reversed
  2026-07-13) — the param caused a navigation + scroll-to-top on every
  calendar tap, and shareable day links aren't a real use case for this
  audience. The lazy year-boundary query is driven from the same `useState`.
- **Loader removed entirely (2026-07-18)** — earlier iterations prefetched via
  `ensureQueryData`; any SSR prefetch means a NOAA hit per server request,
  which defeats the once-per-4-weeks-per-device budget. Tide data is now
  fetched client-side only.
- **Separate `vitest.config.ts`** — the Cloudflare Vite plugin rejects
  Vitest's `resolve.external` injection; tests don't need Worker emulation.
- **`PersistQueryClientProvider` + no SSR loader prefetch (2026-07-18)** —
  `PersistQueryClientProvider` in `router.Wrap` pauses all queries until the
  localStorage restore resolves, so a warm cache serves reloads with **zero**
  NOAA requests; only an empty or >4-week-old cache triggers a fetch. Two
  bugs found on the way:
  1. `gcTime: FOUR_WEEKS_MS` overflowed the 32-bit `setTimeout` limit
     (~24.8 days), firing GC immediately and deleting the restored query
     2 ms after hydration → refetch every reload. Fix: `gcTime: Infinity`
     (persister `maxAge` still expires stored data).
  2. The code-split route hydrates after the synchronous restore completes,
     so its first client render had data while server HTML had the loading
     shell → hydration mismatch. Fix: `useSyncExternalStore` hydration gate
     in `useTideData` (returns `[]` for the hydration render).
- **Rolling 18-month calendar cap** — replaced the earlier static Dec 2027
  cap; last browsable month is current month + 18. `useTideData` lazily
  fetches the selected date's year (window can cross up to two year
  boundaries).
- **Half-cosine interpolation for current height** — tide height between
  extremes is approximately sinusoidal; linear would overstate mid-window
  change rate.
- **Color unification, seafoam palette removed (2026-07-31)** — high/low
  tide text is now the same dark navy across TideTimeline, TideStrip pills,
  TideCalendar tide list, and TideNow chips. Differentiation moves to icons
  (Sailboat vs Minus), backgrounds (cool navy vs warm sand), and the
  gradient on the calendar's high-tide row. Green (seafoam) was dropped
  because it read as "positive" — the user's audience cares more about high
  tide than low. Six unused tokens and the entire seafoam palette were
  removed as a side effect.
- **rAF-driven boat animation with `cqw` units (2026-07-31)** — earlier
  attempts used CSS `offset-path` with a hardcoded pixel wave; that path
  extended past the viewport and created a horizontal scrollbar, and mobile
  needed the boat visible immediately at load. Replaced with a
  `requestAnimationFrame` loop in `WaveDivider.tsx` that computes
  `transform: translate() rotate()` with constant `px/sec` speed and a sine
  bob. `.boatTrack` has `overflow: hidden` so the boat can't push page
  width. Hero boat drifts right; footer boat drifts left with `scaleX(-1)`.
  All GPU-composited, ~1 µs per frame, honors `prefers-reduced-motion`.
- **`.page` grid template fix (2026-08-01)** — `grid-template-rows: auto auto 1fr auto`
  originally targeted a 4-child layout; after HeroBanner and two
  WaveDividers were added, the `1fr` landed on the hero wave divider,
  causing it to balloon on tall viewports and leave phantom scroll space
  past the footer. Fixed to `auto auto auto 1fr auto auto` — `1fr` is now
  on `<main>`, so extra viewport height stretches the content area.
- **Custom domain via `custom_domain: true`** — `wrangler.jsonc` `routes`
  entry `{ pattern: "harbortides.app", custom_domain: true }` makes
  Cloudflare create the DNS record and provision the SSL cert on deploy.
  Requires the zone to be on the same Cloudflare account (it is — domain
  bought through Cloudflare).
- **`overscroll-behavior-y` currently commented out (2026-08-02)** — was
  added on `html` + `body` to prevent elastic bounce past the footer, but
  the user commented it out (see `src/styles/global.css`). Might have been
  interfering with expected browser behavior; leaving disabled unless a
  concrete scroll problem returns.
- **No dark mode in v1** — timeline design file hints at it, but scope was
  cut. Tokens are structured so a dark block can be added later.

---

## Known issues / caveats

- **Dehydrated SSR payload includes the full year** (~1,400 entries, ~15–20
  kB gzipped). Acceptable for now; could trim to a window around today if
  page-weight becomes a concern.
- **`package.json` warning** — pnpm 11 ignores `pnpm.onlyBuiltDependencies`
  (wants it in `pnpm-workspace.yaml`). Harmless noise on every command;
  needs approval to touch `package.json`.
- **Height estimate is an approximation** — half-cosine between extremes,
  not NOAA's harmonic model. Fine for "roughly how much water," not for
  navigation-grade precision (footer credits NOAA as the prediction source).
- **`design_resources/logo.svg`** — a 179 KB custom logo the user tried; not
  wired up in v1 (header uses the lucide `<Anchor>` icon). Can be revisited
  when a proper logo is designed.
