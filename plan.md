# Harbor Tides — Build Plan & Status

Living document. Update as work progresses. Referenced from `CLAUDE.md`.

Last updated: 2026-07-18

---

## Current goal

Ship v1 of the Harbor Tides PWA: single-page tide dashboard for Eatons Neck, NY
(station 8515786) — hero "now" state, 3-day strip, calendar through Dec 2027 —
installable on phones and deployed to Cloudflare Workers.

**Current phase:** core UI complete → next is PWA support, then deploy.

---

## What's done

Confidence legend:
**High** = verified by tests and/or real data/output.
**Medium** = code reviewed + compiles + SSR-verified, but not exercised in a real browser.

| Work | How it was done | Confidence |
|---|---|---|
| Tailwind fully removed | `pnpm remove` of 3 packages; purged vite plugin, CSS import, utility classes, README section, `.cta.json` flag. Verified via repo-wide grep + clean build (CSS output dropped to 0.07 kB) | High |
| NOAA data layer (`src/lib/noaa.ts`) | String/regex XML parser (no DOMParser — runs in Workers, SSR, browser). Typed `TideEntry`, descriptive parse errors. Verified against the real 285 kB 2026 response: 1,410 entries, spot-checked against live clock | High |
| Tide utilities (`src/lib/tides.ts`) | `mergeTideYears` (dedupe + sort), `entriesForDate`, `findTideState` (direction, minutes-to-next, half-cosine height estimate), `stationNow()`. Unit tested | High |
| Query layer | `tideKeys` factory; QueryClient with 4-week staleTime (`gcTime: Infinity` — see setTimeout-overflow decision); localStorage persistence via `PersistQueryClientProvider` in `router.Wrap` (SSR-safe: persister storage is `undefined` server-side). `useTideData` hook: current year + selected year via lazy `enabled` query, merged transparently, hydration-gated | High (cold/warm/stale/lazy-year flows browser-verified 2026-07-18) |
| Vitest setup fix | Scaffold had none; Cloudflare Vite plugin breaks Vitest, so tests run via a separate `vitest.config.ts` | High |
| Design tokens | `design/tokens.md` + `src/styles/` (reset → tokens → global). Palette from mockup HTML + inspiration PNG: navy/seafoam/amber, warm sand bg. Amber reserved for NOW marker only | High |
| TideNow hero + TideTimeline SVG | Live clock (30 s tick), rising/falling + est. height + time-to-next, bezier tide curve with NOW marker (logic ported from `design_resources/harbortides_design_TidesNow_timeline.html`), 2–3 chips with near-tide window expansion | Medium (SSR output verified correct; no browser click-through) |
| TideStrip + TideCalendar | 3-day table (morning/afternoon split, H/L badges); calendar min = current month, hard cap Dec 2027, past dates disabled, selected-day tide list, loading state for lazy 2027 | Medium |
| Page wiring | Selected date is local state (no URL param); no route loader — tide data is client-only so NOAA is hit at most once per 4 weeks per device; header/footer; unmounted `AdCard` ready for sponsors | High |
| Timezone correctness | All "now"/"today" math via `stationNow()` pinned to `America/New_York` because Workers run UTC — server and client agree at date boundaries | High for logic; Medium overall (no dedicated unit test yet) |
| Tests / static checks | 15 Vitest tests green; `pnpm check` clean; `pnpm build` passes | High |
| UI revision round (branch `v2-theme2`, 2026-07-13) | Dropped `?date=` URL param (selected date is local state; panel animates in via `@starting-style`, no scroll jump); TideStrip chronological (AM/PM split removed); calendar day list vertical + chronological; hero photo banner below header (EatonsNeck.JPG resized 2.1 MB → 316/85 KB srcset pair, SVG logo removed); timeline overlap fixed (HIGH/LOW moved to left gutter, NOW pill in its own band, labels clamped + text halo); desktop layout ≥64rem (TideNow two-panel via container query, Upcoming + Calendar side by side); footer now lists Eatons Neck; fixed hover-beats-selected specificity bug on calendar days | High (verified in browser at 390px and 1280px, console clean) |

---

## What's remaining (in order)

1. **Manual browser pass** — hydration and calendar interaction verified via
   Playwright on 2026-07-13 (console clean at 390px/1280px). Full persistence
   flow verified 2026-07-18 with a mocked NOAA route (real endpoint still
   down): cold load = 1 fetch, warm reloads = 0 fetches, >4-week-old data
   refetches, calendar → Jan 2027 lazily fetches 2027 exactly once. Rolling
   18-month cap verified: next-month disables at Jan 2028. Still unverified:
   the same flows against live NOAA (blocked on the outage ending).
2. **PWA support** — `vite-plugin-pwa` (⚠ not installed; needs package
   approval), manifest (name, icons, theme `#003B5C`), client-side-only SW
   registration, offline behavior for cached tide data.
3. **App icons / Add-to-Home-Screen assets** — none exist yet.
4. **Deploy** — `pnpm deploy` to Cloudflare Workers; verify `wrangler.jsonc`,
   custom domain if any.
5. **stationNow() unit test** — mockable clock, DST boundary cases.
6. **Later (v2+)** — mount `<AdCard />` slots with real sponsors; local
   notifications via the SW; possible expansion to 2–3 routes.

---

## Decisions made and why

- **String/regex XML parsing over DOMParser or an XML package** — DOMParser
  doesn't exist in Workers/SSR; a package needs approval and adds weight. The
  NOAA XML is flat and regular, so a small typed parser is safe. Throws loudly
  on malformed input.
- **Browser fetches NOAA directly; no server proxy** — endpoint sends
  `access-control-allow-origin: *` (verified via curl). Keeps the Worker out
  of the data path and helps the offline/PWA story.
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
  audience. The lazy 2027 query is driven from the same `useState`.
- **Loader removed entirely (2026-07-18)** — earlier iterations prefetched via
  `ensureQueryData`; any SSR prefetch means a NOAA hit per server request,
  which defeats the once-per-4-weeks-per-device budget. Tide data is now
  fetched client-side only.
- **Separate `vitest.config.ts`** — the Cloudflare Vite plugin rejects
  Vitest's `resolve.external` injection; tests don't need Worker emulation.
- **Warm sand background (PNG inspiration) over the mockup's cool gray** —
  brief calls for "sandy/warm neutrals"; mockup kept for structure, PNG for
  mood.
- **NOAA fetches are non-fatal (2026-07-17)** — a live NOAA outage (station
  page shows a known error) exposed that the SSR loader's `ensureQueryData`
  crashed the whole page, blocking clients that had valid localStorage data.
  Loader prefetch is now best-effort; components use plain `useQuery` (not
  suspense) so the client serves persisted data during outages and shows a
  notice only when the cache is truly empty.
- **`PersistQueryClientProvider` + no SSR loader prefetch (2026-07-18)** —
  replaced the earlier deferred-restore effect, which fetched NOAA on every
  reload (queries mounted against an empty cache before the restore ran) and
  let the loader hit NOAA per SSR request. Now: no route loader at all (tide
  data is client-only), and `PersistQueryClientProvider` in `router.Wrap`
  pauses all queries until the localStorage restore resolves — so a warm
  cache serves reloads with **zero** NOAA requests, and only an empty or
  >4-week-old cache triggers a fetch. Two bugs found on the way:
  1. `gcTime: FOUR_WEEKS_MS` overflowed the 32-bit `setTimeout` limit
     (~24.8 days), firing GC immediately and deleting the restored query
     2 ms after hydration → refetch every reload. Fix: `gcTime: Infinity`
     (persister `maxAge` still expires stored data); `staleTime` stays
     4 weeks (staleness checks are arithmetic, not timers).
  2. The code-split route hydrates after the synchronous restore completes,
     so its first client render had data while server HTML had the loading
     shell → hydration mismatch. Fix: `useSyncExternalStore` hydration gate
     in `useTideData` (returns `[]` for the hydration render).
  Browser-verified: cold load = exactly 1 fetch + persist; warm reloads = 0
  requests, data renders, console clean; calendar into Jan 2027 = one lazy
  2027 fetch, revisits cached; data aged >4 weeks = refetch on reload.
- **Rolling 18-month calendar cap (2026-07-17)** — replaced the static Dec
  2027 cap; last browsable month is current month + 18. `useTideData` now
  lazily fetches the selected date's year (window can cross up to two year
  boundaries).
- **Half-cosine interpolation for current height** — tide height between
  extremes is approximately sinusoidal; linear would overstate mid-window
  change rate.
- **No dark mode in v1** — timeline design file hints at it, but scope was cut
  to keep v1 focused. Tokens are structured so a dark block can be added later.

---

## Known issues / blockers

- **No real-browser verification yet** (see Remaining #1). SSR HTML is
  verified correct; hydration and interactions are not.
- **PWA blocked on package approval** — `vite-plugin-pwa` may not be added
  without explicit user sign-off (project rule).
- **Dehydrated SSR payload includes the full year** (~1,400 entries, ~150 kB
  raw / ~15–20 kB gzipped). Acceptable for now; could trim to a window around
  today if it becomes a problem.
- **`package.json` warning** — pnpm 11 ignores `pnpm.onlyBuiltDependencies`
  (wants it in `pnpm-workspace.yaml`). Harmless noise on every command;
  needs approval to touch `package.json`.
- **Height estimate is an approximation** — half-cosine between extremes, not
  NOAA's harmonic model. Fine for "roughly how much water," not for
  navigation-grade precision (footer credits NOAA as the prediction source).
