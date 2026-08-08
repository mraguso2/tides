# Harbor Tides — Design Tokens

Source of truth for the palette and typography. CSS values live in
`src/styles/tokens.css`; keep the two in sync.

Derived from `design_resources/harbortides_mobile_mockup.html` (structure,
navy/seafoam/amber values) and
`Harbor_tides_one_design_Inspiration_option.png` (warm sand background,
cream cards).

## Color palette

### Navy — brand, headers, high tide
| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#002840` | darkest accents |
| `--navy-700` | `#003B5C` | header, footer, high-tide color, logo |
| `--navy-500` | `#1D6FA8` | interactive accents, links |
| `--navy-100` | `#E0EEF8` | high-tide badge background |

### Seafoam — low tide, water accents
| Token | Value | Use |
|---|---|---|
| `--seafoam-700` | `#0A6644` | low-tide badge text |
| `--seafoam-500` | `#1D9E75` | low-tide color, calendar dots |
| `--seafoam-300` | `#5DCAA5` | decorative wave accents |
| `--seafoam-100` | `#E0F5EC` | low-tide badge background |

### Amber — "now" marker only
| Token | Value | Use |
|---|---|---|
| `--amber-500` | `#EF9F27` | NOW marker on the tide timeline |

### Sand — warm neutrals (backgrounds)
| Token | Value | Use |
|---|---|---|
| `--sand-50` | `#FBFAF7` | lightest surface |
| `--sand-100` | `#F6F3EC` | page background |
| `--sand-200` | `#F0EBE0` | sunken surfaces (chips, list items) |
| `--sand-300` | `#E4DECF` | hover states on sand |

### Ink — text
| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#111827` | primary text |
| `--ink-600` | `#4B5563` | secondary text |
| `--ink-400` | `#9CA3AF` | tertiary text, captions |

Cards are pure white (`#FFFFFF`) on the sand background. Borders are
hairline navy at 12% opacity: `rgb(0 59 92 / 0.12)`.

## Typography

- **Display / logo:** Georgia, "Times New Roman", serif — maritime,
  ship's-log feel. Logo and footer wordmark only.
- **Everything else:** system UI sans stack. This is a glance-and-go
  utility app; native type renders fastest and feels at home on phones.

Scale (rem, 16px root): 2xs 10 · xs 11 · sm 12 · md 13 · base 15 ·
lg 16 · xl 18 · 2xl 24 · 3xl 34.

## Shape & depth

- Radius: cards 14px (`--radius-md`), chips/inputs 8px (`--radius-sm`),
  pills `--radius-full`.
- Shadows: barely-there (`--shadow-card`) — hairline borders do the
  separation work, matching the mockup.

## Semantics

High tide is always navy, low tide always seafoam, and amber is reserved
exclusively for the current moment (NOW marker). Don't reuse amber for
anything else.
