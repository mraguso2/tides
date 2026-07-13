# Harbor Tides — Build Plan & Status

Living document. Update as work progresses. Referenced from `CLAUDE.md`.

Last updated: 2026-07-11

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
| Query layer | `tideKeys` factory; QueryClient with 2-week staleTime/gcTime; localStorage persistence via `persistQueryClient` guarded by `typeof window` (SSR-safe). `useTideData` hook: current year via `useSuspenseQuery`, 2027 via lazy `enabled` query, merged transparently | Medium (persistence restore not browser-verified) |
| Vitest setup fix | Scaffold had none; Cloudflare Vite plugin breaks Vitest, so tests run via a separate `vitest.config.ts` | High |
| Design tokens | `design/tokens.md` + `src/styles/` (reset → tokens → global). Palette from mockup HTML + inspiration PNG: navy/seafoam/amber, warm sand bg. Amber reserved for NOW marker only | High |
| TideNow hero + TideTimeline SVG | Live clock (30 s tick), rising/falling + est. height + time-to-next, bezier tide curve with NOW marker (logic ported from `design_resources/harbortides_design_TidesNow_timeline.html`), 2–3 chips with near-tide window expansion | Medium (SSR output verified correct; no browser click-through) |
| TideStrip + TideCalendar | 3-day table (morning/afternoon split, H/L badges); calendar min = current month, hard cap Dec 2027, past dates disabled, selected-day tide list, loading state for lazy 2027 | Medium |
| Page wiring | Selected date in URL (`?date=YYYY-MM-DD`, validated, invalid → 307 to `/`); route loader prefetches current year via `ensureQueryData` (no loader return → no double dehydration); header/footer; unmounted `AdCard` ready for sponsors | Medium–High (SSR + redirect verified via curl) |
| Timezone correctness | All "now"/"today" math via `stationNow()` pinned to `America/New_York` because Workers run UTC — server and client agree at date boundaries | High for logic; Medium overall (no dedicated unit test yet) |
| Tests / static checks | 16 Vitest tests green; `pnpm check` clean; `pnpm build` passes | High |

---

## What's remaining (in order)

1. **Manual browser pass** — hydration warnings, calendar interaction, 2027
   lazy fetch, localStorage persistence across reloads. No browser automation
   was available during the build; this is the top gap.
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
- **Selected date in URL search param, not state** — per project state rules;
  makes dates shareable/bookmarkable and drives the lazy 2027 query from one
  source of truth.
- **Loader uses `ensureQueryData` without returning data** — returning would
  dehydrate the payload twice (loader data + query cache).
- **Separate `vitest.config.ts`** — the Cloudflare Vite plugin rejects
  Vitest's `resolve.external` injection; tests don't need Worker emulation.
- **Warm sand background (PNG inspiration) over the mockup's cool gray** —
  brief calls for "sandy/warm neutrals"; mockup kept for structure, PNG for
  mood.
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
