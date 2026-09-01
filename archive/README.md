# archive/

This directory preserves files removed from the live app during the four-tab
rebuild (2026-08-31), rather than deleting them — nothing in this project is
under version control and this is the only copy, so deletion would be
irreversible for zero benefit once nothing imports or routes to a file.

## What's here

### `index-prev.html`
Byte-for-byte copy of the pre-rebuild `ROOT/index.html` — the five-tab shell
(Home, Events, Games, Rules, Tonight) that existed before the Home tab was
removed and the tab bar was cut down to four (Tonight, Events, Games, Rules).

**Deliberately named `index-prev.html`, not `index.html`.** An `index.html`
inside `archive/` would be served automatically at `<site>/archive/` on
GitHub Pages (directory-index resolution) and would render as a broken page
there, because its `css/` and `js/` references are relative and would resolve
against `archive/`, which contains neither directory. Renaming avoids that
without losing the file. If you're tempted to rename this back to
`index.html` "for consistency", don't — that's the exact failure this
filename choice exists to prevent.

### `js/views/home.js`
Byte-for-byte copy of the pre-rebuild `ROOT/js/views/home.js` (the Home tab's
view module).

## Not loaded by the app

Neither file is imported, routed to, or otherwise referenced from anywhere
under the live `ROOT/js/`, `ROOT/index.html`, or `ROOT/css/`. `js/router.js`
no longer imports `./views/home.js` and no route resolves to it.

## Broken relative paths from this location — expected, not a bug

Both files' relative `import`/`href` paths assume they sit at `ROOT/`, not
`ROOT/archive/`. From their archived location:
- `index-prev.html`'s `<link>`/`<script>` tags (`css/tokens.css`,
  `js/app.js`, etc.) resolve to `ROOT/archive/css/...` and
  `ROOT/archive/js/...`, which do not exist — opening this file directly will
  not render a styled page or load its script.
- `js/views/home.js`'s `import` statements (`../content.js`, `../ui.js`)
  resolve one level up from where this file now sits and will not resolve
  either.

Neither is a defect to fix: these files are kept for reference/history only,
not to be run from this location.

## CSS: `.cta*` / `.pill*` — removed

The Home view was the only consumer of `.cta`, `.cta__text`, `.cta__title`,
`.cta__sub`, `.cta__chev`, `.pill` and `.pill-row` in `ROOT/css/components.css`.
With Home archived, those rules became dead code (unreachable from any live
view or route). **They were removed** from `css/components.css` as part of
the Stripe-derived design-system pass, along with the matching `--cta__sub`
"one deliberate hex exception" paragraph in `STYLEGUIDE.md` — that exception
no longer exists; the project's "components reference tokens, never literal
hex values" rule now holds with zero exceptions. Nothing that referenced
these classes remains anywhere in the live app, so no visual regression
results from their removal.

## Date archived

2026-08-31.
