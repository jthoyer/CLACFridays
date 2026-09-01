# Style guide

Design system for the **NSW Little Athletics — U10 Boys Age Manager Guide** web app.

The audience is a volunteer parent standing pitch-side, in daylight, holding a
phone in one hand. Every decision below is downstream of that: large-ish body
text, high contrast, big tap targets, no webfonts.

Light mode only. No CSS framework, no build step.

> **This document is the source of truth. `styleguide.html` is derived from
> it and must never drift.** A change to either — a token value, a type-scale
> row, a new component — requires the *same* change in the other, in the same
> edit. Checklist when you touch this file:
> - Edited the **tokens table** below (a colour, added/removed a token)? →
>   `styleguide.html`'s swatches read live from `css/tokens.css` custom
>   properties, so a token *value* change updates itself; a token being
>   **added or removed** still needs a swatch added/removed by hand.
> - Edited the **type scale** table? → update the matching live sample in
>   `styleguide.html`'s type section (token name + px value must match).
> - Edited or added a section under **## Components**? → add or update the
>   matching live example in `styleguide.html`, built by calling the same
>   `js/ui.js` helper the app uses (not hand-written markup), so the example
>   cannot silently diverge from what the app actually renders.

---

## Where things live

| File | Contains |
| --- | --- |
| `css/tokens.css` | **Single source of truth** for every colour, size, radius, shadow. |
| `css/base.css` | Reset, document shell, landmarks, focus, typography defaults. |
| `css/components.css` | Every reusable UI pattern. |
| `js/ui.js` | The render helper for each pattern — one implementation each. |
| `js/content.js` | Every word of guide copy. |
| `styleguide.html` | **Derived, browsable rendering** of everything below — real swatches, real type samples, real component examples. Not a route in the app (see "Living styleguide page" below). |

**Rule: components reference tokens, never literal hex values, with zero
exceptions.** (The previous one deliberate exception, `--cta__sub`, no longer
exists — `.cta` and its children were removed along with the archived Home
view; see "Design system: Stripe-derived, AA-preserving" below and
`archive/README.md`.)

**Rule: before adding a render helper, grep `js/ui.js` for one that already
exists.** If it nearly fits, extend or compose it. Two implementations of "the
resource card" will drift and the two surfaces will silently disagree.

---

## Colour

All ratios below are **measured on the composited rendered page** (not on the
raw token against an assumed white), using WCAG 2.1 relative luminance. If you
change a colour, re-measure — a recorded number is only true of the background
it was measured against. These figures match the comments in `css/tokens.css`
exactly; if the two ever disagree, both are wrong until re-measured together.

The palette below is **Stripe-derived** (item 8 of the rebuild brief): source
values are Stripe's public brand palette, corroborated across independent
sources — `#635BFF` blurple, `#0A2540` dark navy, `#425466` body slate,
`#F6F9FC` light surface, `#E6EBF1` hairline, `#00D4FF` cyan, `#24B47E`
success, `#CD3D64` error. See "Deviations from Stripe" below for the three of
those eight values this app does **not** use as given, and why.

### Neutral / text ramp

| Token | Hex | Use | Measured |
| --- | --- | --- | --- |
| `--color-white` | `#FFFFFF` | Card surface | — |
| `--color-neutral-50` | `#F6F9FC` | App canvas (Stripe "surface") | — |
| `--color-neutral-100` | `#EEF2F6` | `<code>` background | Body text 6.94:1 on it |
| `--color-neutral-200` | `#E6EBF1` | `--color-border-subtle` (Stripe "hairline") | 1.20:1 on white — decorative only, never a control boundary |
| `--color-neutral-400` | `#7C8695` | `--color-border-interactive` | 3.68:1 white, 3.49:1 canvas, 3.17:1 tint, 3.40:1 warn-surface |
| `--color-neutral-600` | `#5F6F87` | Captions (`--color-text-caption`) | 5.11:1 white, 4.84:1 canvas, 4.40:1 tint (fails — never used on tint) |
| `--color-neutral-700` | `#4E5C70` | Muted body text (`--color-text-muted`) | 6.80:1 white, 6.43:1 canvas, 5.85:1 tint (`.picker__label:hover`) |
| `--color-neutral-800` | `#425466` | Body default (`--color-text`) — Stripe's own "body" hex | 7.80:1 white, 7.38:1 canvas |
| `--color-neutral-900` | `#0A2540` | Headings (`--color-heading`) — Stripe's own "heading" hex | 15.54:1 white, 14.70:1 canvas |

Two border tokens exist on purpose:

- `--color-border-interactive` (`#7C8695`) — anything that bounds a **control**
  (event cards, tab bar, out-links, table and fact-list containers). Clears the
  3:1 required by SC 1.4.11 on *every* surface it can land on: white 3.68:1,
  canvas 3.49:1, accent tint 3.17:1, warn surface 3.40:1. This value survived
  the Stripe rewrite unchanged in hex, but every ratio was **re-measured**
  against the new surfaces (the accent tint changed colour family, from blue
  to lavender) — it still clears 3:1 on all four, which is why it was kept
  rather than replaced.
- `--color-border-subtle` (`#E6EBF1`) — **decorative** hairlines only (dividers
  between rows inside a card). 1.20:1 on white. SC 1.4.11 does not apply because
  these do not identify a component; do not use this on a control boundary.

### Brand blurple — decorative only

| Token | Hex | Use | Measured |
| --- | --- | --- | --- |
| `--color-brand` | `#635BFF` | The one decorative gradient (`.app-bar::after`), nothing else | 4.70:1 white / 4.45:1 canvas — fails AA as text, so it never carries text |
| `--color-brand-cyan` | `#00D4FF` | Second stop of that same gradient, nothing else | 1.77:1 on white — fails AA, no text ever sits on it |

### Accent (darkened blurple) — four steps

| Token | Hex | Use | Measured |
| --- | --- | --- | --- |
| `--color-accent-tint` | `#EEECFF` | Tinted surface, hover backgrounds | — |
| `--color-accent` | `#4B44D9` | Links, active tab, focus ring, control borders, badge text | 6.71:1 white, 6.35:1 canvas, 5.78:1 tint, 6.19:1 warn-surface |
| `--color-accent-strong` | `#372C96` | Numerals, kickers, hover/pressed | 10.70:1 white, 10.12:1 canvas, 9.21:1 tint, 9.86:1 warn-surface |
| `--color-accent-deep` | `#0A2540` | App bar fill (reuses the heading navy as a dark shell surface) | white on it = 15.54:1 |

`--color-accent` is a **darkened** blurple, not Stripe's raw `#635BFF` — see
"Deviations from Stripe" for why, and the headroom note below the table.

### Success (green) — per-card Tonight toggle, Event Detail CTA

Project-specific, not part of Stripe's palette — Stripe's own `#24B47E` is
2.66:1 on white and fails AA (see "Deviations from Stripe" below). Chosen the
same way `--color-accent` was: darkened until it clears AA with headroom on
every surface it lands on, not merely scraping 4.5:1.

| Token | Hex | Use | Measured |
| --- | --- | --- | --- |
| `--color-success-tint` | `#E6F4EC` | Tinted surface — `.btn--ghost-success` hover | — |
| `--color-success` | `#0E6B3A` | Active per-card Tonight toggle fill; Event Detail "in tonight" CTA border/text | 6.60:1 white, 6.24:1 canvas, 5.82:1 success-tint |
| `--color-success-on` | `#FFFFFF` | Check glyph/text on `--color-success` fill | 6.60:1 |

### Safety / warning

Unchanged by the Stripe rewrite — this is a project-specific safety palette,
not part of Stripe's system, and its surfaces (`--color-warn-surface` etc.)
didn't change, so its ratios didn't either. Re-verified, not carried forward
unchecked.

| Token | Hex | Measured |
| --- | --- | --- |
| `--color-warn-surface` | `#FFF4E8` | — |
| `--color-warn-surface-alt` | `#FFEAD8` | Video badge background |
| `--color-warn-border` | `#C2410C` | 5.18:1 on white, 4.77:1 on warn surface |
| `--color-warn-text` | `#7A2E0B` | 8.71:1 on warn surface, 8.10:1 on warn surface alt (`.badge--video`) |
| `--color-warn-label` | `#8A3308` | 7.57:1 on warn surface |

### Measured floor

Across all **eight** routes (`#/` and `#/tonight` render the same Tonight
view, counted once each as distinct hash targets — `#/`, `#/tonight`,
`#/events`, `#/events/:slug`, `#/games`, `#/games/:slug`, `#/rules`,
not-found), the lowest text contrast anywhere in the app is **4.84:1** (`--color-text-caption` on
the app canvas, `#F6F9FC` — e.g. a `.section__kicker` on the Games tab),
against a 4.5:1 requirement.

This number was re-derived, not copied forward: every text-colour token was
paired against every background it is actually declared on in
`css/components.css` (not every background it could theoretically sit on),
and the resulting set was swept for its minimum. That sweep is what caught
`--color-text-caption` also landing on `--color-accent-tint` via the old
Events-list card's meta line's hover state at **4.40:1 — below the 4.5:1
floor**; the fix was to move that one rule to `--color-text-muted` (5.85:1 on
tint, still demonstrated today by `.picker__label:hover` + `.picker__tag`),
which is why `--color-text-caption` no longer appears in the "on tint" column
anywhere below and 4.84:1 (its lowest *surviving* pairing, on canvas) is the
true floor, not merely the previously-recorded one. (The Events-list card
that originally forced this fix, `.event-card__meta`, no longer exists — the
row-shape redesign covered further down this document dropped the meta line
from the list entirely — but the token choice it forced remains correct and
is re-verified below, not merely carried forward.)

4.84:1 against a 4.5:1 requirement is the WCAG 2.1 AA bar itself, not a
self-imposed ceiling: the pre-Stripe palette happened to clear AA by more
(5.18:1) because its specific colour choices left more headroom, but
"without regressing the AA bar" means the AA bar — see the product decision
closing this question. Where headroom was free at no cost, it was still
taken: `--color-accent` measures 6.71:1 / 6.35:1, well clear of the 4.5:1
floor it only strictly needs to hit.

The Events/Games redesign's new pairings were checked against this same
floor rather than assumed clean: `--color-success` measures 6.60:1/6.24:1
(above), `--color-accent` reused unchanged for the new Game Detail `<h1>`
and the Games-list link name (6.71:1/6.35:1, already an existing pairing —
see "Accent" above), and `--color-text-muted` reused unchanged for the
Games-list summary line (already measured on white/canvas/tint). None of
these introduces a new low; 4.84:1 remains the floor.

### Deviations from Stripe, and why

Every deviation below exists because the literal Stripe value fails this
project's accessibility rules on a surface the app actually uses. Each is
forced by a measured number, not a stylistic preference.

| Stripe gave us | This app does instead | Forced by |
| --- | --- | --- |
| `#635BFF` blurple as the general brand/UI colour | Blurple restricted to one decorative gradient (`--color-brand`); every text/focus-ring/control-border role uses a **darkened** blurple, `--color-accent` (`#4B44D9`) | `#635BFF` measures 4.70:1 on white and **4.45:1 on `#F6F9FC` — fails AA** (4.5:1 floor) |
| `#E6EBF1` hairline as a general-purpose border | Restricted to `--color-border-subtle` (decorative dividers only); a separate `--color-border-interactive` (`#7C8695`) carries every control boundary | `#E6EBF1` measures **1.20:1 on white — fails** the project's >=3:1 control-boundary rule (SC 1.4.11) |
| `#00D4FF` cyan / `#24B47E` success / `#CD3D64` error as UI accent colours | None of the three is ever used as text, a control boundary, or the sole indicator of a state. Cyan appears once, as a gradient stop with no text on it | 1.77:1 / 2.66:1 / 4.72:1 on white — cyan and success **fail** 4.5:1; `#CD3D64` actually **clears** 4.5:1 but is barred anyway, because a colour-only state indicator fails SC 1.4.1 regardless of its contrast ratio |
| Stripe's weight-300 body text ("elegant" thin type) | `--fw-regular` stays **400**; no rule anywhere sets `font-weight` below 400 | Not a contrast failure but a legibility one: this app is read outdoors, one-handed, pitch-side — thin type is the wrong trade to make for that reader |

---

## Type

System font stack — no webfont downloads, because this loads on track-side
mobile data. (Stripe's real typefaces are proprietary and were not sourced or
approximated; this stays the system stack.)

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
"Helvetica Neue", Arial, "Noto Sans", sans-serif
```

Modular scale, ratio **1.2**, 16px root:

| Token | Size | Use |
| --- | --- | --- |
| `--fs-100` | 0.75rem / 12px | Badges, footnotes, tab labels, `dt` labels |
| `--fs-200` | 0.875rem / 14px | Captions, meta, notes, kickers |
| `--fs-300` | 1rem / 16px | Secondary body — list items, card copy |
| `--fs-400` | 1.125rem / 18px | **Body default** — deliberately larger than 16px for outdoor legibility |
| `--fs-500` | 1.35rem / 21.6px | `h2` |
| `--fs-600` | 1.625rem / 26px | `h1`, narrow |
| `--fs-700` | 1.95rem / 31.2px | `h1`, from 40em |

Line heights: `--lh-tight` 1.25 (headings), `--lh-snug` 1.4 (dense card copy),
`--lh-body` 1.6 (prose).
Weights: 400 / 500 / 600 / 700. **400 is the floor** — see "Deviations from
Stripe" above.

---

## Spacing

4px base. Use the scale; do not invent intermediate values.

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24
· `--space-6` 32 · `--space-7` 48 · `--space-8` 64

Layout: `--measure` 42rem max content width, `--gutter` 16px.

## Radii

`--radius-sm` 6px (badges, code) · `--radius-md` 10px (out-links, quote,
steps) · `--radius-lg` 16px (cards, callouts, tables) · `--radius-pill` 999px
(pills, numerals).

## Elevation

Three levels, used consistently — never mix an arbitrary shadow.

| Token | Use |
| --- | --- |
| `--shadow-1` | Resting cards: event cards, steps, fact lists, tables, games |
| `--shadow-2` | Raised / emphasis: resource cards, card hover |
| `--shadow-3` | Fixed furniture above content: the tab bar |

---

## Components

### Bottom tab bar
Fixed, **four equal columns (Tonight, Events, Games, Rules, in that DOM
order)**, 56px tall plus `env(safe-area-inset-bottom)` for notched iPhones.
`.app-main` reserves matching bottom padding so nothing hides under it. Home
was removed from the guide and the tab bar cut from five columns to four; see
`archive/README.md` for what happened to the Home view.

**The active state is driven by `aria-current="page"`, not a CSS class** —
`.tab[aria-current='page']`. The accessible property and the visual state come
from one source and cannot drift. Active is signalled three ways (colour, bold
weight, 3px inset top rule), never colour alone.

At four columns, 320px gives each tab an 80px column (90px at 360px) —
comfortably clear of the 44px tap-target floor in both dimensions, and the
56px `--tabbar-height` already covers the height axis regardless of column
count. Re-measured with headless Chrome at both 320px and 360px after
dropping to four columns: every label (including the longest, "Tonight")
renders on a single line with no clipping at the default `--fs-100` (12px),
so **no font-size step-down is needed** — the narrow-viewport media query
(`max-width: 22.5em`) only tightens horizontal padding slightly, as extra
margin rather than a fix for an actual overflow. If a 5th tab is ever added,
re-measure before assuming the same holds.

### Event row (`.event-group` / `.event-row`)
Each discipline category renders as ONE bordered/rounded `.event-group`
container (`border`, `--radius-lg`, `--shadow-1`, `overflow: hidden`) holding
a list of single-line `.event-row`s, each divided from the next by a 1px
`--color-border-subtle` hairline — not each event as its own separate
bordered card (that was the pre-redesign shape; see the design mockup this
was matched against). Each row: a `--size-numeral-sm` (28px) circular numeral
badge, then a body column with the event name styled as a link
(`--color-accent`, with a trailing `→` appended directly inside the name text
— see `js/views/events.js`) and the tagline underneath in a smaller muted
line, then the per-card Tonight toggle (below) at the row's end. The old
`.event-card__meta` "2 videos"/"1 article" summary line is no longer rendered
in this list — dropped from the row design only; `resourceSummary()` and the
underlying resource data are unchanged and still render on the Event Detail
page (`js/views/eventDetail.js`).

Tapping anywhere in a row (other than the toggle) opens the event's detail
page: `.event-row__link` (the `<a>`) fills the row except for the toggle's
own tap area, exactly as the old `.event-card` link did — this is a visual
restyle of the same click target, not new navigation wiring.
`.event-row__link` keeps `min-height: var(--tap-min)` even though the row no
longer has its own visible card border.

### Events tab: grouped by discipline (`eventCategories` in `content.js`)
The Events list is no longer one flat list of 10 rows — it's four
`<section>`/`<h2>` groups, in a fixed order: **Track** (sprints,
middle-distance, hurdles, relay, race-walk), **Jumps** (long-jump,
high-jump), **Throws** (shot-put, discus), **Bonus** (turbo-javelin). The
category heading itself is a small uppercase caption
(`.event-category-kicker`: 12px, bold, letter-spaced, `--color-text-caption`,
`--space-6` top margin / `--space-2` bottom, `--space-6`-`.event-category-kicker--first`
zeroes the top margin on the first rendered category) rather than a large
`.section__title`-style heading — it is still a real `<h2>` (the page's
heading hierarchy stays h1 "Events" → h2 per category; only the visual
treatment changed, not the level or the document structure). At 12px bold
this text does not meet WCAG's "large text" threshold (14pt/18.66px bold), so
it needs the full 4.5:1 floor, not 3:1 — `--color-text-caption` clears 4.84:1
on the app canvas it renders on here, the same pairing used by every other
kicker/caption in this app. `js/views/events.js`'s `eventCardList()` is the
one row-rendering function, called once per category rather than
duplicated — grouping is a filter applied before that call, not a second
implementation of the row. A category left with zero visible events under
Tonight-mode filtering renders nothing at all (no empty section, no orphaned
heading), the same "don't render a heading over nothing" rule
`tonightEmptyState()` already follows for the page as a whole — the "first"
category for margin purposes is therefore the first one actually rendered
after that filtering, not simply `eventCategories[0]`. `content.js`'s
`assertContentLinkage()` guard extends to `eventCategories`: every slug it
references must be real, and it must partition all 10 events exactly — one
category each, no more, no fewer, no duplicates — so a typo or a forgotten
event fails loudly at load instead of silently vanishing from the Events tab.

### Per-card Tonight toggle (`tonightToggleButton()` in `ui.js`)
Each event card on the Events tab carries exactly one toggle control, letting
a coach add or remove that single event from tonight's selection without
opening the picker or leaving the list.

**Control choice (rule 8 justification):** a real `<button type="button">`
with `aria-pressed="true"`/`"false"` — not `role="switch"`, not
`<input type="checkbox">`, not a styled `<div>`. No native HTML element
expresses a two-state toggle button; `aria-pressed` on a real button is the
minimum ARIA that does the job, and it's the same pattern already established
by `modeSwitch()` on this same page. It is **not** a descendant of the card's
`<a>` — a `<button>` cannot legally sit inside an `<a>` (the browser silently
reparents it out, which breaks in exactly the browser-dependent way you'd
expect), so the `<li>` renders the link and the toggle as siblings.

**Constant accessible name.** The button's `aria-label` identifies the event
(e.g. `"Tonight: Hurdles"`) and is **byte-identical in both states** — it
never flips to "Off". A name that changed to "Off" while
`aria-pressed="false"` would read as a double negative ("Off, not pressed").
The on/off state is carried by `aria-pressed` plus the visible signal below,
not by the name.

**Two non-colour state signals (SC 1.4.1).** Pressed state changes: (1) the
border style, dashed → solid, and (2) the glyph, `+` → `✓`, and additionally
font-weight goes bold and the border/text colour change — colour is never the
only difference between the two states.

**Mode is pinned across a per-card toggle.** Toggling a card never changes
`tonight.getMode()`. Without this, a coach in Everything mode who taps one
card's toggle would watch the visible 10-item list silently collapse to 1 — a
WCAG 3.2.2 On Input failure, since nothing requested or warned about that
context change. The subtler case: a coach who has never set an explicit mode
gets a *derived* default (`hasSelection() ? 'tonight' : 'everything'`), so
even a first-ever toggle could flip the derived default to `'tonight'`
without ever calling `setMode()`. The per-card API in `tonight.js` guards
against both by reading `getMode()` **before** the mutation and pinning
`explicitMode` to that pre-mutation value — it deliberately does *not* force
`'tonight'` the way `setSelection()`'s Save path does (see that function's
doc comment; the picker's Save is an explicit "I'm done choosing" gesture,
this is a different one, "add/remove this one").

**Post-toggle focus is never lost.** In order of preference: (1) the same
toggle button, re-found by a stable id derived from the event slug, in the
freshly painted DOM; (2) if Tonight-mode filtering removed that card from the
list, `#mode-switch-tonight` on the Events page; (3) `#page-title`. Options 1
and 2 do not scroll the page — this is a state-only re-render, not a
navigation (see "Two render paths" below).

Visually: a 44×44 (`--tap-min`) icon-only **circle**, not a pill with a
visible label — `2px dashed --color-border-interactive` showing a `+` glyph
when off; `2px solid --color-success` + solid `--color-success` fill + bold
white (`--color-success-on`) `✓` glyph when on. The active fill changed from
the accent-purple tint (`--color-accent-tint` + `--color-accent-strong` text)
to a solid green fill as part of the Events/Games redesign, so "on" reads as
a positive confirmation distinct from the app's link/brand colour — solid
rather than tinted specifically so the white glyph has enough contrast
(6.60:1 white / 6.24:1 canvas, see "Success" under Colour above), which a
light tint background couldn't guarantee at the same weight.

The visible "Add"/"On" text label present in the pill shape was **dropped**
as part of the row-shape redesign (matching the design mockup's icon-only
toggle), but the two non-colour state signals SC 1.4.1 requires are
unchanged: (1) border style, dashed → solid, and (2) the glyph, `+` → `✓`.
`aria-pressed` and the constant `aria-label="Tonight: <event name>"` (which
already carries the accessible name/state to screen readers) are untouched —
dropping the *visible* text does not touch the *accessible* name, which was
never that visible text to begin with. Font-weight is no longer one of the
two required signals (a circle this small has no room for a bold/regular
distinction to read clearly), so the border-style + glyph pair alone carries
the non-colour requirement, same as it always could. This toggle is only
used on the Events list (`tonightToggleButton()` has exactly one call site,
`js/views/events.js`); no other view shares this exact control, so this
shape change has no effect anywhere else in the app.

### Event Detail "Add to tonight" CTA (`tonightCtaButton()` in `ui.js`)
A full-width primary button on the Event Detail page, placed after "Watch &
Learn", controlling the exact same per-event Tonight state as the per-card
toggle above — via the same `data-action="toggle-tonight"` +
`data-slug`/`data-event-name` dataset shape `interactions.js`'s single
generic click handler already reads, so this button needed **zero** new
wiring: no second state mechanism, no second announcement path. Toggling it
announces through the same `#tonight-status` region with the same
`tonightCopy.events.toggleOnAnnouncement`/`toggleOffAnnouncement` copy the
per-card toggle uses.

States: not-in-tonight → `.btn.btn--primary.btn--block`, "Add to tonight".
In-tonight → `.btn.btn--ghost-success.btn--block` (green border/text,
6.60:1 on white — see "Success" under Colour), labelled "✓ Added to
tonight — tap to remove". The checkmark is baked into the visible/accessible
label text itself (rather than a separate `aria-hidden` glyph, as the
per-card toggle uses) since this is one full-width text label, not an
icon-plus-caption control — state is still never colour-only (SC 1.4.1): the
label wording and `aria-pressed` both change together with the colour.
`id` is `tonight-cta-<slug>`, distinct from the per-card toggle's
`tonight-toggle-<slug>` (the two never render in the same DOM — different
routes — but the distinct scheme avoids confusion reading the two side by
side).

### Fact list (`factList`)
`<dl>` of label/value rows. Used for Quick Facts and the age-group rules — the
same helper for both, so they cannot diverge. Same full-bleed colour-section
language as the Tonight tab's `.tonight-card` (see that section above): each
fact is its own dark header band (`.fact-list__label`: `--color-accent-strong`
fill, `--color-accent-on` white text, 10.70:1) directly over a lighter body
band (`.fact-list__value`: `--color-accent-tint` fill, `--color-accent-strong`
text, 9.21:1) holding the value, both full-bleed edge to edge with
`.fact-list`'s own `overflow: hidden` clipping them to the list's rounded
corners. Unlike the Tonight card (rule vs. games), every fact reuses the same
one colour — a fact list has no second category to distinguish, so the
recurring dark band alone is what announces each new fact.

### Responsive table (`responsiveTable`)
Renders a real `<table>`. Below 40em each row restacks as a card and each cell
re-states its column name from `data-label`, so a 320px phone never scrolls
sideways. Because `display: block` strips implicit table semantics in most
browsers, explicit `role="table|row|columnheader|rowheader|cell"` are re-declared
(the Roselli technique). First column is a `<th scope="row">` and stays visible.

### Safety callout (`safetyCallout`)
Amber surface, 6px left border, uppercase "Safety" label and a filled `!` glyph.
**Importance is never carried by colour alone** (SC 1.4.1) — the word "Safety"
and the glyph both convey it. Reproduce the guide's safety text verbatim; never
soften it.

### Resource card (`resourceCard`)
One helper serves event pages, the games list, the Rules tab's rule-video
section and the resource library.
- `kind: 'video'` → inline responsive 16:9 `youtube-nocookie` iframe,
  `loading="lazy"`, `allowfullscreen`, and a **unique descriptive `title`**.
  The `context` option disambiguates a video that legitimately appears on
  more than one page (e.g. an event page and a rule-video card, or two
  different games that reference the same standing-start video on the Games
  tab — see `js/content.js`'s games video mapping).
- `kind: 'article'` → a "read more" out-link, `target="_blank"` +
  `rel="noopener noreferrer"`, with a visible ↗ and a visually-hidden
  "(opens in a new tab)".
- `compact: true` → library rows: no embed, no note.

### Buttons (`.btn`, `.btn--primary`, `.btn--ghost`, `.btn--ghost-success`, `.btn--block`)
Generic action buttons — distinct from `.out-link` (bordered external-link
chip). `.btn--primary` (solid `--color-accent` fill) for the one primary
action on a screen, `.btn--ghost` (bordered, transparent, neutral text) for a
secondary/dismiss action. Both carry `min-height: var(--tap-min)`.
`.btn--ghost-success` is a third variant added for the Event Detail "in
tonight" CTA only: the same recessed/bordered shape as `.btn--ghost`, but
using `--color-success` for border/text (green) instead of neutral, so an
"already done" state reads as a positive confirmation rather than a plain
secondary action — see the Event Detail CTA section above. `.btn--block` is
a layout modifier (`width: 100%`), for the one full-width button on a
screen. Use these for any new action button rather than inventing a fourth
variant.

### Tonight / Everything mode switch (`modeSwitch()` in `ui.js`)
One implementation, used identically on Events, Games and Rules — the three
pages can never disagree on what the switch looks like or how it behaves.
Two real `<button>`s in a `<div role="group" aria-label="Show">`, each with
`aria-pressed`. Not a bare styled `<div>`, and not a single on/off toggle
button — a labelled two-state group reads its current state to a screen
reader without relying on on/off language baked into one control's label.

The active button is never distinguished by colour alone (SC 1.4.1): it also
carries `aria-pressed="true"`, bold weight and a leading check glyph
(`✓`, reserved width via `.mode-switch__glyph` so the button doesn't reflow
width when it flips state). Measured contrast: active button 6.71:1 (white on
`--color-accent`), inactive button text 6.80:1 (`--color-text-muted` on
white), inactive button border 3.68:1 — all reused, already-measured token
pairings, no new colours introduced.

State-change behaviour: clicking a mode-switch button re-renders the page
(events/games/rows are filtered in place) **without** scrolling to top or
moving focus to the page heading — see "Two render paths" below. Focus stays
on the just-pressed button.

The **per-card Tonight toggle** (above) is a separate control with a separate
rule: it never touches mode at all.

### Onboarding / edit picker (`js/views/tonight.js`)
Multi-select over the 10 events, rendered as an ordinary in-page view (a
`<form>` inside the Tonight tab), not a modal dialog. This was a deliberate
choice: a modal needs correct focus-trap, Escape-to-dismiss and
return-focus-on-close to be accessible, and getting that wrong is worse than
not having a dialog at all. An in-page view sidesteps all of it — Tab simply
moves through the page in document order, nothing traps focus, and there is
nothing to get wrong.

Structure: a real `<fieldset>` with a `<legend>` (not a styled div standing in
for either), one `<label>` per event wrapping a real `<input
type="checkbox">` — the whole label is the tap target (`min-height:
var(--tap-min)`), not just the small visual checkbox square. Submitting calls
`tonight.setSelection()` and announces the resulting count through a truly
persistent `role="status" aria-live="polite"` region (`#tonight-status`),
so screen-reader users hear "N events selected for tonight" without it
depending on where focus lands. This region lives in `index.html`, **outside**
`#view`, and is written to by `interactions.js` — the router's `outlet.innerHTML`
repaint never touches it, so it is never torn down and recreated. (It used to
be re-emitted inside the Tonight view's own template on every render, which
meant a screen reader had to register a freshly-inserted node in the
accessibility tree at the same moment `focusHeading()` was moving focus
elsewhere — a race that is a known source of dropped announcements. Owning it
outside the repainted subtree removes the race entirely.) The **per-card
toggle** writes to the same `#tonight-status` region, with its own message
templates in `content.js`'s `tonightCopy` (naming the event, the new state,
and the resulting selection count).

Cancel and Skip are the same action (`data-action="dismiss-picker"`) with only
the visible label conditional on whether a selection already existed — see
`js/interactions.js`. Save, Cancel and Skip all set the same `pickerDismissed`
flag (`js/views/tonight.js`) so the picker only ever auto-opens when it has
genuinely never been resolved; a Save with zero boxes ticked counts as
resolved too, and does not immediately reopen the form.

All picker copy (legend, note, button labels, empty-state text) is sourced
from `content.js`'s `tonightCopy` object, same rule as every other view.

### Tonight tab: event card (event + key rule + games tonight)
Each selected event renders as one bordered/rounded `.tonight-card`
(`css/components.css`) built by `js/views/tonight.js`'s `renderSummary()` —
the same card language as `.event-group`/`.event-row` (Events tab) and
`.game-list__link` (Games tab): `--color-surface` fill,
`--color-border-interactive` hairline, `--radius-lg` corners, `--shadow-1`.
Below the header, the card is two full-bleed **colour sections** — "Key
rule" and "Games tonight" — rather than a stack of hairline-divided rows:
each is a dark header band naming the section in reversed (white) type
directly above a lighter body band in the same colour family, so the
section boundary is carried by the colour change itself, edge to edge, not
by a line. `.tonight-card`'s own `overflow: hidden` clips both bands to the
card's rounded corners, so neither band declares its own radius.

- **Header** (`.tonight-card__head`) — the event's numeral badge and name
  link plus tagline, reusing `.event-row__num` / `.event-row__body` /
  `.event-row__name` / `.event-row__tag` **verbatim** from the Events tab
  (not a scoped copy) so an event's identity can never read differently
  between the two tabs. The name link carries the same trailing "→" baked
  into its text as `.event-row__name` does on the Events tab.
- **"Key rule" section** — a `KEY RULE` head band
  (`.tonight-card__section-head--rule`: `--color-accent-strong` fill,
  `--color-accent-on` white text, 10.70:1) over a body band
  (`.tonight-card__section-body--rule`: `--color-accent-tint` fill) holding
  the rule's plain-text value (`.tonight-card__rule-value`,
  `--color-accent-strong` text, 9.21:1 on tint — both pairings already
  measured under "Accent" in the Colour section above, reused unchanged
  here), read from `eventsAtAGlance.rows` in `content.js` (row matched by
  `slug`, third cell — "Key U10 Rule") rather than duplicated.
  `assertContentLinkage()` guarantees one row per event slug across all 10
  events, so every selected event has a match.
- **"Games tonight (N)" section** — rendered only when at least one game's
  **item-level** `eventSlugs` includes this event (`gamesForEvent()`,
  unchanged); an event with zero linked games renders **no** games section
  at all — deliberate, not forgotten (same "deliberately-unlinked-vs-
  forgotten" distinction `assertContentLinkage()` enforces for Freeze Tag's
  empty `eventSlugs`) — `gamesSection` is the empty string, not an empty
  section or a placeholder. (Every one of the 10 events currently has at
  least one linked game, so this branch has no live example today; it stays
  because `content.js` doesn't guarantee that will always be true.) When
  present: a `GAMES TONIGHT (N)` head band
  (`.tonight-card__section-head--games`: `--color-success` fill,
  `--color-success-on` white text, 6.60:1) over a body band
  (`.tonight-card__section-body--games`: `--color-success-tint` fill)
  holding a `.tonight-card__game-list` of individually bordered/shadowed
  white `.tonight-card__game` cards (`--color-border-subtle` hairline,
  `--radius-md`, `--shadow-1`) — one per game, so games no longer need a
  caption repeated per item to read as separate from one another. Each
  card's head row (`.tonight-card__game-head`) puts the game's name link
  (`.tonight-card__game-link`, same accent-link-with-trailing-arrow
  treatment as `.event-row__name`, linking to its own `#/games/<slug>`
  detail route) and its equipment tag (`.tonight-card__game-tag`, same
  `--color-accent-tint`/`--color-accent-strong` pairing the old `.gear-pill`
  uses elsewhere, just inline instead of on its own line) on one row, with
  the game's one-sentence `summary` (`.tonight-card__game-summary`) below —
  **not** its full `bullets` and **not** an inline video; those stay on the
  game's own detail page only.

This replaced the previous shape, where each game was its own row with a
`GAME TONIGHT` caption repeated above every item and the equipment tag
sitting on its own line below the summary (easy to mistake for a fourth,
disconnected row). `gameItem()` itself is unchanged and still documented
above for anyone extending it, but the Tonight tab has never called it here
— a coach glancing at this list mid-session gets the one fact per section
(rule, or a set of game cards) the redesign called for, with the full
instructions and video one tap away on the event's/game's own detail page.

Heading level: the event name keeps its `<h3>` (unchanged from before the
original restyle — see `.tonight-card__title`). The per-game name link is
**not its own heading** (it used to be an `<h4>` via `gameItem()`): it is
one line inside a "Games tonight" card, not sub-content introducing a
nested article, so a heading there would outrank content it doesn't
introduce.

Both the event-name link and each game-name link get their own `>= 44px`
(`--tap-min`) tap-target height even though they sit inline within a
sentence/row rather than filling one — `.tonight-card__title
.event-row__name` and `.tonight-card__game-link` both apply `display:
inline-flex; align-items: center; min-height: var(--tap-min)`, the same fix
`.event-row__link` already uses to guarantee a full-row tap target on the
Events tab, just applied directly to the link since there is no full-row
wrapper here. Measured on a real render at 320px and 375px: both links'
bounding-box height is >=44px at both widths. Neither link suppresses the
app's global `:focus-visible` ring (`css/base.css`) — a real keyboard Tab
onto the event-name link renders the same 3px solid `--color-accent` ring,
2px offset, every other focusable control in the app uses.

### Games list link + Game Detail page (`js/views/games.js`, `js/views/gameDetail.js`)
The Games list no longer inlines each game's full instructions or its
technique video. Each game is now a disclosure-style link — an
accent-coloured name ending in a trailing `→` (`.game-list__name`, same
reading-as-a-link pattern as `.event-row__name`'s trailing `→`) plus its
one-sentence `summary` beneath it (`.game-list__summary`, muted text), then
a `pairsWithNote()` (`js/ui.js`) "Pairs with `<Event>`" line
(`.game-list__pairs`, muted caption) — plain text, not a link, since it sits
inside the same `<a>` as the rest of the card and an `<a>` cannot legally
contain another interactive element. This exists because a category can
bundle games for more than one event (e.g. "Jump Games" covers both Long
Jump and High Jump — see `content.js`), so the category name alone doesn't
say which specific event a given game goes with; `pairsWithNote()` resolves
the game's own item-level `eventSlugs` via `getEvent()` instead, so it can
never drift from the events list. A game with no linked event (Freeze Tag)
renders no note at all — deliberate, same distinction
`assertContentLinkage()` already draws elsewhere — not an empty "Pairs
with" line. The whole card links to `#/games/<slug>`. Card shape
(`.game-list__link`: bordered,
`--shadow-1`, hover → `--color-accent-tint` + `--shadow-2`) was originally
built to mirror the Events list's per-event card shape for visual
consistency between the two tabs' list pages. The Events list has since
moved to the `.event-group`/`.event-row` compact-row pattern (bordered
*group*, hairline-divided rows) as part of the Events/Games redesign's
row-shape pass; the Games list was **not** asked to follow and still uses
its original per-game bordered-card shape — the two lists' shapes are
allowed to diverge here, not a sign of drift.

Each game's own detail page (`gameDetailView()`) renders: a back-link to
`#/games`; its category name as a small kicker (`pageHeader`'s `kicker`);
an `<h1>` **coloured `--color-accent`, not the default `--color-heading`
navy** every other view's `<h1>` uses — a deliberate visual distinction (see
`pageHeader()`'s new `titleAccent` option and `.page-head__title--accent` in
`css/components.css`), not an oversight; the same `pairsWithNote()` "Pairs
with `<Event>`" line as the list (`.game__pairs`, same muted-caption
treatment, same reasoning — the kicker names the category, not necessarily
the one event this game pairs with), placed right under the header, before
the gear pill; a "What to do" section rendering
`item.bullets` via the existing `bulletList()` helper (not new bullet
markup); and — **only if the item has one or more `videoResources`** — a
"Watch & Learn" section using the existing `resourceCard()`/`videoEmbed()`
helpers, so every video is embedded exactly once, on the one game's detail
page that uses it, and nowhere else. A game with no video (Baton Down the
Line, Freeze Tag) renders no video section at all — deliberate, not
forgotten, same "deliberately absent vs forgotten" distinction
`assertContentLinkage()` already enforces elsewhere in this file. The
honesty-framing copy that used to sit above the Games-list video block
(`games.videoBlockCopy` — "Technique this game rehearses" + its clarifier
line) moved here verbatim, so a coach still can't mistake an official
event-technique video for footage of the specific game, now on the page
where the video itself actually lives.

`content.js`'s `games` items each carry a `summary` (one sentence, shown on
the list) and a `bullets` array (the full instructions, shown on this page)
instead of a single `description` string, plus a stable kebab-case `slug`
used as this page's route parameter. `assertContentLinkage()` was extended
to require every game item have a non-empty `summary`, a non-empty
`bullets` array, and a `slug` that is both present and unique across every
game — a missing or duplicate slug would otherwise silently break or
collide two different games' detail routes.

### Games/Rules/Tonight section spacing (`.section--spaced`)
The Games list and Game Detail pages use a roomier gap above each
`<section>` heading — `--space-7` (48px) instead of `.section`'s default
`--space-6` (32px) — via a `.section--spaced` modifier class, not a change
to `.section` itself. Scoped deliberately: `.section` is shared by Events,
Rules, Tonight and Event Detail too, and widening it there wasn't asked for
and hasn't been re-checked against those layouts, so a modifier keeps the
wider rhythm confined to the two views it was requested for.

### Empty / near-empty Tonight-mode state (`tonightEmptyState()` in `ui.js`)
Shown instead of a bare, confusing empty list whenever Tonight-mode filtering
leaves a page with nothing to show (e.g. Events tab with zero events
selected). Takes the empty-state message plus an optional `action` HTML
parameter — defaults to a link back to the Tonight tab, but the Tonight tab's
own summary passes an `open-picker` **button** instead (linking to `#/tonight`
from the Tonight page itself would be a no-op). One implementation, reused
everywhere a filter can produce an empty result, parameterised rather than
forked.

### "Is Tonight-mode filtering active?" (`tonight.isFiltering()`)
`getMode() === 'tonight' && hasSelection()` — the single home for this
predicate. Events, Games, Rules and Event Detail all call it rather than
re-deriving it; Event Detail additionally checks the specific event isn't in
the selection. The `hasSelection()` half matters: if the mode is explicitly
"Tonight" but nothing has been picked yet, nothing should be flagged as
excluded, since there is nothing to filter against.

### Two render paths (router.js)
The router exposes two distinct repaint behaviours, and picking the right one
matters for accessibility:
- **Real navigation** (hash changed — a link click, Back/Forward, first
  load): scrolls to top and moves focus to the new `#page-title`. This is the
  existing, unchanged behaviour.
- **State-only re-render** (`tonight:change` event — the mode switch, the
  per-card toggle, the picker opening/closing/saving): repaints the outlet
  but does **not** touch scroll position or focus automatically. The route
  hasn't changed and the user is mid-interaction with a specific control;
  unconditionally moving focus would be an unannounced context change (SC
  3.2.2). `interactions.js` is responsible for placing focus deliberately
  after this kind of re-render — back on the control just used (mode switch,
  per-card toggle), into the newly revealed form (opening the picker), onto
  the page heading after a **save** (`focusHeading()`), or onto
  `#open-picker-btn` after a **Cancel/Skip** dismissal
  (`focusById('open-picker-btn')`) — dismissing returns to the
  summary/empty-state view the coach was already on, not to a bigger
  transition, so it does not move focus all the way to the heading.

---

## Design system: Stripe-derived, AA-preserving

The colour palette in this document and in `css/tokens.css` was rewritten
against Stripe's public brand identity as part of the four-tab rebuild.
**Where Stripe's system conflicts with this project's accessibility rules,
accessibility wins and the deviation is documented** — see "Deviations from
Stripe" under Colour, above, and the per-token rationale in `css/tokens.css`'s
own comments. No animation or transition was added by this pass; the existing
`prefers-reduced-motion: reduce` gate in `css/base.css` is unchanged.

`.cta`, `.cta__text`, `.cta__title`, `.cta__sub`, `.cta__chev`, `.pill` and
`.pill-row` were removed from `css/components.css` as part of this pass —
they had exactly one consumer, the archived Home view, and were dead code
once it was removed. See `archive/README.md` for the record of that removal.

## Living styleguide page

`styleguide.html`, at the project root, is a standalone page (not a router
route — a fifth tab-bar entry would breach the exactly-four-tabs rule) that
**renders** this document rather than reprinting it as text: real colour
swatches (reading live from `css/tokens.css` custom properties, so a token
value change updates the swatch automatically), real type-scale samples at
their actual rendered size, and live component examples built by calling the
same `js/ui.js` helpers the app itself calls. See the note at the very top of
this file for the two-way sync rule, and `styleguide.html`'s own visible
banner naming this file as its source of truth.

Its own chrome (not part of the app, so not bound by the four-tab rule or
`--measure`'s 42rem prose column) is a sticky top nav with scroll-spy
section links, a short hero, four numbered sections (01 Colour · 02 Type ·
03 Spacing, radii & elevation · 04 Components) matching this file's own
section order, and — for Components — a two-column tile gallery (full-width
tiles for anything that needs the room: the tab bar, the responsive table,
the picker form, the Tonight-tab card pair, the Games-list/Game-Detail
pair). Every colour swatch is click-to-copy (writes the hex to the
clipboard; the visible "Copied" flash is real feedback either way, since
the clipboard write itself is best-effort). None of this chrome touches the
"no webfonts, system stack only" or "light mode only" rules above — it's
plain CSS using the app's own tokens, same as everything else on the page.

---

## Accessibility rules for this project

These are requirements, not preferences.

1. **Tap targets ≥ 44×44 CSS px** for every interactive element. Use
   `min-height: var(--tap-min)`. Verified at both 320px and 360px.
2. **Contrast**: ≥4.5:1 body, ≥3:1 large text and control boundaries. Measure
   against the *composited* background, not the token's assumed backdrop.
3. **Focus is never removed.** `:focus-visible` gives a 3px solid
   `--color-accent` ring at `2px` offset — measured 5.78–6.71:1 against the
   surfaces behind it. If you suppress a ring anywhere, replace it.
4. **One `<h1>` per view**, no skipped heading levels.
5. **Landmarks**: `<header>`, `<main id="view">`, `<nav aria-label="Main">`,
   plus a skip link.
6. **Routing**: on hash change, `document.title` updates and focus moves to the
   new `#page-title`. No focus steal on first load.
7. **Iframes** each carry a unique, non-empty, descriptive `title` —
   including on the Games tab, which now embeds technique videos inline
   alongside the Rules tab and event pages.
8. **ARIA only where semantic HTML can't do the job** — currently the
   restacked-table roles, `aria-current`, the mode switch's `role="group"` +
   `aria-pressed` (two real buttons, not a native HTML control for
   "either/or pressed state"), and the per-card Tonight toggle's
   `aria-pressed` on a single real `<button>` (no native HTML element
   expresses a two-state toggle button either).
9. **Interactive elements added after the initial render must survive a
   repaint.** The router replaces `outlet.innerHTML` on every render, which
   silently drops any listener attached to an element inside it. Bind once,
   on `outlet` itself (never replaced, only its children), and dispatch by
   inspecting `event.target` for a `data-action` attribute — see
   `js/interactions.js`. Don't attach a listener inside a view function; it
   will work once and vanish on the next route change.

### Known limitation
When Tab moves focus into the YouTube iframe, the focus indicator is owned by
YouTube's document. Chrome does not propagate `:focus`/`:focus-within` across a
cross-origin frame boundary (verified with real Tab presses), so
`.embed:focus-within` is a progressive enhancement rather than a fix.
