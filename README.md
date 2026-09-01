# NSW Little Athletics — U10 Boys Age Manager Guide

A mobile-first web app version of the *NSW Little Athletics Under 10 Boys Age
Manager's Coaching Guide*, built for a volunteer parent standing pitch-side at
a track with a phone in one hand.

It covers all ten events (quick facts, beginner → intermediate progressions,
common faults, safety notes and the official coaching videos/articles), the
waiting-period games bank (each with a reference video of the technique it
rehearses), the age-group rules (four of which are clarified with an inline
video), the sample session run-sheet and the full resource library.

**Tonight mode**: pick tonight's events and filter the guide down to just
those — see the [Tonight mode](#tonight-mode) section below for details.

## Running it locally

No build step, no dependencies, no package manager. Serve the folder over HTTP —
ES modules will not load from `file://`.

```sh
cd "path/to/CLACFridays"
python3 -m http.server 8000
```

Then open **<http://localhost:8000/>**.

Deep links work directly, e.g. <http://localhost:8000/#/events/long-jump>.

## Structure

```
index.html           app shell: landmarks, skip link, bottom tab bar
styleguide.html       living, rendered design system — see STYLEGUIDE.md
css/tokens.css        design tokens — every colour, size, radius, shadow
css/base.css          reset, shell, focus, typography defaults
css/components.css    every reusable UI pattern
js/app.js             bootstrap
js/router.js          hash routing
js/content.js          ALL guide copy — the single source of truth
js/ui.js               shared render helpers (cards, tables, callouts, embeds)
js/tonight.js          Tonight-mode state: localStorage, selection, mode flag
js/interactions.js     delegated listeners for Tonight-mode UI (survives repaint)
js/views/*.js          one module per view (tonight, events, games, rules,
                        eventDetail, notFound)
archive/               pre-rebuild files kept for reference, not loaded by
                        the app — see archive/README.md
STYLEGUIDE.md          the design system + this project's accessibility rules
```

### Architecture

- **Single page, vanilla ES modules.** No framework, no bundler, no npm.
- **All content lives in `js/content.js`.** Views render from that object, so a
  typo is fixable in exactly one place and the resource URLs exist once each.
- **Hash routing** (`#/events/long-jump`) so deep links and the browser Back
  button work on GitHub Pages with no server config. Unknown routes render a
  not-found view and keep the URL, so Back still works.
- **Relative asset paths only** — no leading `/` — so it works unchanged under a
  GitHub Pages project subpath.

### `archive/`

The app used to have a fifth tab, Home, which was removed when the guide was
rebuilt around four tabs (Tonight, Events, Games, Rules) with Tonight as the
default route. Nothing in this project is under version control and this is
the only copy, so the pre-rebuild `index.html` and the Home view module were
**moved**, not deleted, into `archive/` — see `archive/README.md` for exactly
what's there and when it was archived.

The archived shell is named **`archive/index-prev.html`, deliberately not
`archive/index.html`.** GitHub Pages serves `index.html` automatically as the
directory index for whatever folder it sits in — an `archive/index.html`
would be silently, publicly reachable at `<site>/archive/`, and it would
render broken there, because its relative `css/`/`js/` references resolve
against `archive/`, which has no such subfolders. Renaming it avoids that
without losing the file. **Do not rename it back to `index.html` "for
consistency"** — that would re-create the exact broken public page this
filename choice exists to prevent.

## Routes

| Route | View |
| --- | --- |
| `#/` (or empty) | Tonight — pick tonight's events, see them grouped with the games that rehearse each one, edit the selection |
| `#/tonight` | Same view as `#/` (no redirect either way — both resolve directly to Tonight) |
| `#/events` | The 10 events, each with a per-card toggle to add/remove it from tonight's selection |
| `#/events/:slug` | Event detail with quick facts, progressions, faults, safety, videos |
| `#/games` | Waiting-period games, grouped by category, each with an inline reference video of the technique it rehearses |
| `#/rules` | Age-group rules, events at a glance (four entries have an inline clarifying video), full resource library |

Event slugs: `sprints`, `middle-distance`, `hurdles`, `relay`, `race-walk`,
`long-jump`, `high-jump`, `shot-put`, `discus`, `turbo-javelin`.

## Tonight mode

The age manager picks which of the 10 events are on tonight's program from
the Tonight tab; Events, Games and Rules each filter themselves down to just
those (a switch on each page flips back to the full guide, "Everything",
without losing the selection). Deep links to any event always work, even to
one not in tonight's selection — filtering only affects what's *listed*, it
never blocks a direct link.

**Two independent ways to change the selection:**
- The **picker** (Tonight tab): a multi-select form over all 10 events. Save
  commits the selection and switches the app into Tonight mode — an explicit
  "I'm done choosing" gesture.
- The **per-card toggle** (one on every Events-tab card): adds or removes
  just that one event. **This never changes the current mode.** A coach
  browsing in Everything mode who toggles a card stays in Everything mode
  and the visible list of 10 does not collapse to 1 — the toggle only ever
  edits *what's selected*, never *what's currently shown*. The two controls
  intentionally do different things: Save is "I'm finished, filter the
  guide now"; the per-card toggle is "add/remove this one event", full stop.

The selection and the current mode persist in `localStorage`
(`clac.tonight.v1` and `clac.tonight.mode.v1`) so a phone lock/reload during a
session doesn't lose it. All storage access is isolated to `js/tonight.js`,
wrapped so a full quota or Safari Private Mode degrades to in-memory state
for that session rather than breaking the app. Nothing is required to use the
guide as before — skipping the picker on first run leaves Tonight mode never
engaged (Everything mode, i.e. today's behaviour, unchanged).

## Editing content

Everything a coach reads is in `js/content.js`. Videos and articles are declared
once in the `resources` map and referenced by key from events, games, facts and
the library, so a URL can never disagree with itself between two screens.

Adding a video: add a `resources` entry with `kind: 'video'` and its YouTube ID,
then reference the key from the event's/game's/fact's `resources`
array/property. The responsive iframe, lazy loading and accessible title are
generated for you.

## Design system

The visual design is Stripe-derived (colour palette, decorative gradient),
adapted to keep this project's own accessibility bar — see
[STYLEGUIDE.md](STYLEGUIDE.md) for the full token table and every deviation
from Stripe's literal values, each with the measured number that forced it.
[**`styleguide.html`**](styleguide.html) is a living, rendered version of that
document — real colour swatches, real type samples, real component examples
— kept in sync with `STYLEGUIDE.md` by hand (see the sync note at the top of
that file) and, for components, by calling the same `js/ui.js` helpers the
app itself uses.

## Accessibility

Targets WCAG 2.1 AA. See the "Accessibility rules for this project" section of
[STYLEGUIDE.md](STYLEGUIDE.md) for the specific requirements and the measured
contrast figures.

## Source

Content transcribed from the guide PDF in this folder, which was compiled from
official Little Athletics Australia coaching resources and Coaching Young
Athletes (Darren Wensor). Always check the current NSW/LAA Rules of Competition
and your own centre's program — event offerings vary by centre.

The PDF's QR codes are intentionally not reproduced: they exist so a *printed*
page can be scanned, and in the app every link is already tappable.
