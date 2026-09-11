/**
 * ui.js — shared render helpers.
 *
 * Every repeated visual pattern lives here exactly once. Views compose these;
 * they do not re-implement them. If you need a card/table/callout that is
 * *nearly* one of these, extend the helper rather than writing a second one —
 * two implementations drift and the two surfaces silently disagree.
 */

import { tonightCopy, weeklyProgram, getResource, getEvent } from './content.js';

/** Escape text for safe interpolation into HTML (also covers attribute values). */
export function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only http(s) URLs are ever emitted as hrefs. Guards against a javascript:
 * URL sneaking in through a content typo.
 */
export function safeUrl(url) {
  const s = String(url || '').trim();
  return /^https?:\/\//i.test(s) ? s : '#';
}

/**
 * "Pairs with <Event>[, <Event> and <Event>]" note for a game — resolves a
 * game item's item-level `eventSlugs` (js/content.js) to real event names via
 * `getEvent()`, so it can never drift from the events list. Used on both the
 * Games list (`js/views/games.js`) and the Game Detail page
 * (`js/views/gameDetail.js`) — one implementation, since a category can
 * bundle games for several events (e.g. "Jump Games" covers both Long Jump
 * and High Jump) and the category name/kicker alone doesn't say which one a
 * given game goes with. Returns the empty string for a game with no linked
 * event (e.g. Freeze Tag) — deliberate, not forgotten, same distinction
 * `assertContentLinkage()` already draws elsewhere.
 */
export function pairsWithNote(eventSlugs, className = 'game-pairs') {
  const names = (eventSlugs || [])
    .map((slug) => getEvent(slug))
    .filter(Boolean)
    .map((e) => esc(e.name));
  if (!names.length) return '';
  const joined =
    names.length > 1
      ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
      : names[0];
  return `<p class="${esc(className)}">Pairs with ${joined}</p>`;
}

/** <dl> of {label, value} pairs — the Quick Facts / at-a-glance pattern. */
export function factList(facts, className = 'fact-list') {
  const rows = facts
    .map(
      (f) => `
        <div class="fact-list__row">
          <dt class="fact-list__label">${esc(f.label)}</dt>
          <dd class="fact-list__value">${esc(f.value)}</dd>
        </div>`
    )
    .join('');
  return `<dl class="${esc(className)}">${rows}</dl>`;
}

/** Numbered teaching progression. */
export function orderedSteps(items, className = 'steps') {
  return `<ol class="${esc(className)}">${items
    .map((i) => `<li>${esc(i)}</li>`)
    .join('')}</ol>`;
}

/** Bulleted list (common faults). */
export function bulletList(items, className = 'bullets') {
  return `<ul class="${esc(className)}">${items
    .map((i) => `<li>${esc(i)}</li>`)
    .join('')}</ul>`;
}

/**
 * Safety callout. Importance is carried by the visible "SAFETY" word and the
 * warning glyph, not by the amber colour alone (WCAG 1.4.1 Use of Colour).
 */
export function safetyCallout(text) {
  return `
    <aside class="callout callout--safety" aria-labelledby="safety-heading">
      <p class="callout__label" id="safety-heading">
        <span class="callout__glyph" aria-hidden="true">!</span>
        Safety
      </p>
      <p class="callout__body">${esc(text)}</p>
    </aside>`;
}

/**
 * Responsive data table.
 *
 * Renders a real <table>. Below 40em the CSS restacks each row as a card; that
 * restack strips the implicit table semantics in most browsers, so the ARIA
 * roles below re-declare them (Roselli, "Tables, CSS Display Properties, and
 * ARIA"). Each cell carries data-label so the column name stays visible once
 * the <thead> is out of the layout.
 */
export function responsiveTable({ columns, rows, caption, footnote }) {
  const head = columns
    .map((c) => `<th role="columnheader" scope="col">${esc(c)}</th>`)
    .join('');

  const body = rows
    .map((row) => {
      const cells = row
        .map((cell, i) =>
          i === 0
            ? `<th role="rowheader" scope="row" class="rtable__rowhead">${esc(
                cell
              )}</th>`
            : `<td role="cell" data-label="${esc(columns[i])}">${esc(cell)}</td>`
        )
        .join('');
      return `<tr role="row">${cells}</tr>`;
    })
    .join('');

  return `
    <div class="rtable-wrap">
      <table class="rtable" role="table">
        ${caption ? `<caption class="visually-hidden">${esc(caption)}</caption>` : ''}
        <thead role="rowgroup"><tr role="row">${head}</tr></thead>
        <tbody role="rowgroup">${body}</tbody>
      </table>
    </div>
    ${footnote ? `<p class="rtable__footnote">${esc(footnote)}</p>` : ''}`;
}

/**
 * Responsive 16:9 YouTube embed.
 *
 * youtube-nocookie, lazy-loaded (track-side mobile data), and given a unique,
 * descriptive title. `context` disambiguates the one video that legitimately
 * appears on two different event pages.
 */
/**
 * Canonical "open this video in YouTube" URL.
 *
 * Must be youtu.be (as transcribed in the guide), NOT youtube-nocookie.com —
 * the nocookie host only serves /embed/; its /watch path returns 404.
 * The nocookie host is used for the inline embed only, see videoEmbed().
 */
export function videoWatchUrl(resource) {
  return `https://youtu.be/${encodeURIComponent(resource.youtubeId)}`;
}

export function videoEmbed(resource, context) {
  const title = context
    ? `${resource.title} — video (${context})`
    : `${resource.title} — video`;
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    resource.youtubeId
  )}`;
  return `
    <div class="embed">
      <iframe
        class="embed__frame"
        src="${esc(src)}"
        title="${esc(title)}"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>`;
}

/**
 * Out-link to an article. Opens in a new tab, with the fact announced to
 * screen readers and shown visually via the arrow glyph + label.
 */
export function articleLink(resource, label = 'Read the full article') {
  return `
    <a class="out-link" href="${esc(safeUrl(resource.url))}"
       target="_blank" rel="noopener noreferrer">
      <span class="out-link__text">${esc(label)}</span>
      <span class="out-link__icon" aria-hidden="true">↗</span>
      <span class="visually-hidden">(opens in a new tab)</span>
    </a>`;
}

/**
 * "Watch & Learn" resource card — the single implementation used by event
 * pages, the games list and the resource library.
 *
 * @param {object}  resource  a resource record from content.js
 * @param {object}  opts
 * @param {string}  opts.context   disambiguates a reused video's iframe title
 * @param {string}  opts.note      overrides resource.note for this placement
 * @param {boolean} opts.compact   library rows: no embed, no note
 * @param {string}  opts.prefix    e.g. "Long Jump" shown before the title
 */
export function resourceCard(resource, opts = {}) {
  const isVideo = resource.kind === 'video';
  const note = opts.note != null ? opts.note : resource.note;

  const badge = `<span class="badge badge--${isVideo ? 'video' : 'article'}">${
    isVideo ? 'Video' : 'Article'
  }</span>`;

  const heading = `
    <p class="resource__title">
      ${opts.prefix ? `<span class="resource__prefix">${esc(opts.prefix)} — </span>` : ''}
      ${esc(resource.title)}
    </p>
    <p class="resource__source">${esc(resource.source)}</p>`;

  if (opts.compact) {
    const body = isVideo
      ? `<a class="out-link" href="${esc(safeUrl(videoWatchUrl(resource)))}"
           target="_blank" rel="noopener noreferrer">
          <span class="out-link__text">Watch on YouTube</span>
          <span class="out-link__icon" aria-hidden="true">↗</span>
          <span class="visually-hidden">(opens in a new tab)</span>
        </a>`
      : articleLink(resource, 'Open article');
    return `
      <li class="resource resource--compact">
        <div class="resource__head">${badge}${heading}</div>
        ${body}
      </li>`;
  }

  const media = isVideo
    ? videoEmbed(resource, opts.context)
    : articleLink(resource);

  return `
    <article class="resource">
      <div class="resource__head">${badge}${heading}</div>
      ${note ? `<p class="resource__note">${esc(note)}</p>` : ''}
      ${media}
    </article>`;
}

/**
 * A single waiting-period game entry, nested under the event it rehearses on
 * the Tonight tab (js/views/tonight.js) — name, one-sentence summary, its
 * full step-by-step bullets, and a source-game citation where one exists.
 *
 * This used to also be the Games list page's full-detail card (including an
 * inline reference-video block); the Games-tab redesign moved that role to
 * each game's own detail page (js/views/gameDetail.js, which renders
 * `item.bullets` and any `item.videoResources` directly via
 * bulletList()/resourceCard() rather than through this helper), so a game's
 * video now appears in exactly one place. This helper's only remaining
 * consumer is the Tonight tab, which still wants the full instructions
 * (not just the one-sentence summary) so a coach can run the game without
 * leaving the page — hence rendering `summary` + `bullets` both, not the
 * list page's one-line link pattern.
 *
 * @param {object}  item
 * @param {object}  [opts]
 * @param {number}  [opts.headingLevel=3]  heading level wrapping the game's name
 */
export function gameItem(item, opts = {}) {
  const level = opts.headingLevel || 3;

  const source = item.resource
    ? (() => {
        const r = getResource(item.resource);
        return `
          <p class="game__source">
            ${item.sourcePrefix ? esc(item.sourcePrefix) + ' ' : ''}<em>${esc(
              r.title
            )}</em>
          </p>
          ${articleLink(r, 'Open the source game')}`;
      })()
    : '';

  return `
    <article class="game">
      <h${level} class="game__name">${esc(item.name)}</h${level}>
      <p class="game__desc">${esc(item.summary)}</p>
      ${bulletList(item.bullets)}
      ${source}
    </article>`;
}

/**
 * "2 videos · 1 article" summary for a list of resolved resource records.
 *
 * Used by both the events list and the event detail page so the two never
 * disagree, and so an article-only event (4 x 100m Relay) reads as a
 * deliberate "1 article" rather than a missing video.
 */
export function resourceSummary(resourceList) {
  const videos = resourceList.filter((r) => r.kind === 'video').length;
  const articles = resourceList.length - videos;
  const parts = [];
  if (videos) parts.push(`${videos} video${videos > 1 ? 's' : ''}`);
  if (articles) parts.push(`${articles} article${articles > 1 ? 's' : ''}`);
  return parts.join(' · ');
}

/**
 * Page header block shared by every view: the single <h1> plus optional
 * kicker/lead.
 *
 * @param {object}  opts
 * @param {string}  [opts.kicker]
 * @param {string}  opts.title
 * @param {string}  [opts.lead]
 * @param {boolean} [opts.titleAccent]  colour the <h1> --color-accent instead
 *   of the default --color-heading navy — used only by the Game Detail page
 *   (js/views/gameDetail.js) as a deliberate visual distinction from every
 *   other view's heading. Large bold text only needs 3:1; --color-accent
 *   clears that with the same headroom already measured elsewhere in the app
 *   (6.71:1 white / 6.35:1 canvas — see STYLEGUIDE.md's Colour section).
 */
export function pageHeader({ kicker, title, lead, titleAccent }) {
  return `
    <header class="page-head">
      ${kicker ? `<p class="page-head__kicker">${esc(kicker)}</p>` : ''}
      <h1 class="page-head__title${
        titleAccent ? ' page-head__title--accent' : ''
      }" id="page-title" tabindex="-1">${esc(title)}</h1>
      ${lead ? `<p class="page-head__lead">${esc(lead)}</p>` : ''}
    </header>`;
}

/**
 * Tonight / Everything mode switch — the one implementation used on Events,
 * Games and Rules so the three pages can never disagree on what "Tonight
 * mode" looks like.
 *
 * Two real <button>s with aria-pressed, grouped with role="group" and an
 * accessible group label — not a bare styled <div>, and not a single toggle
 * button (a labelled two-state group reads its current state to a screen
 * reader without relying on "on/off" language attached to one control).
 * `id`s are stable across re-renders of the same view (fixed strings), which
 * lets interactions.js re-focus the just-pressed button after the outlet is
 * repainted following a mode change.
 *
 * The active button is never distinguished by colour alone (SC 1.4.1): it
 * also carries aria-pressed="true", bold weight and a leading check glyph.
 */
export function modeSwitch(mode) {
  const isTonight = mode === 'tonight';
  const btn = (value, label, pressed) => `
    <button
      type="button"
      class="mode-switch__btn${pressed ? ' mode-switch__btn--active' : ''}"
      id="mode-switch-${value}"
      data-action="set-mode"
      data-mode="${value}"
      aria-pressed="${pressed}">
      <span class="mode-switch__glyph" aria-hidden="true">${pressed ? '✓' : ''}</span>
      <span>${esc(label)}</span>
    </button>`;

  return `
    <div class="mode-switch" role="group" aria-label="Show">
      ${btn('tonight', 'Tonight', isTonight)}
      ${btn('everything', 'Everything', !isTonight)}
    </div>`;
}

/**
 * Shared Tonight status strip — Events, Games and Rules. Not shown on the
 * Tonight tab; its own summary heading already says this.
 *
 * Added because Games and Events dropped their own `modeSwitch()` (the
 * Program and Age Group picker on Events/Tonight can set Tonight mode on
 * its own now), which left Rules as the only page with any on-page way back
 * to Everything — a coach on Events or Games had no control on the page in
 * front of them. This strip closes that gap with one line of state plus one
 * action, not a second full mode switch on every tab (that's exactly the
 * redundancy the last two passes correctly removed).
 *
 * Two states, chosen by `isFiltering` (the same `tonight.isFiltering()`
 * every other view already calls — this function stays state-free like the
 * rest of ui.js, so it's passed in rather than re-derived here):
 *
 *   - Filtering: a <button data-action="set-mode" data-mode="everything">,
 *     reusing the exact contract `modeSwitch()` already dispatches — no new
 *     listener in interactions.js, this is a second element firing an event
 *     the app already handles.
 *   - Not filtering (Everything, or Tonight mode with nothing picked — both
 *     read the same to a coach: nothing is currently filtered): a real
 *     `<a href="#/tonight">`, because this is a navigation to a different
 *     tab, not a state change on the current one — same distinction the
 *     rest of this app already draws between links and action buttons.
 *
 * `choice` is `tonight.getProgramChoice()` — only its `programId`/`ageId`
 * are used, resolved against `weeklyProgram` here (the same module
 * `programPicker()` already reads), so a caller never has to resolve names
 * itself. `count` is `tonight.getSelection().length`, always the true
 * selection size — deliberately NOT whatever subset the calling page itself
 * happens to be showing (Games filters by category, not by raw count; using
 * that number here would describe this page's list, not tonight's actual
 * selection).
 *
 * No `role="status"`/`aria-live` on this element: it lives inside the
 * repainted `#view` outlet and is destroyed/recreated on every mode change,
 * which is exactly the announcement race `index.html`'s persistent
 * `#tonight-status` region exists to avoid (see its own comment) — adding a
 * live region here would reintroduce that same bug. Instead this follows
 * `modeSwitch()`'s own precedent: interactions.js moves focus back onto the
 * control after the repaint, and the control's own new accessible name
 * ("Show everything" button → "Set tonight" link, or vice versa) is what a
 * screen reader announces, the same way `modeSwitch()`'s buttons already
 * rely on focus landing back on a control whose state just changed.
 */
export function tonightStatusStrip({ isFiltering, choice, count }) {
  const id = 'tonight-status-action';

  if (!isFiltering) {
    return `
      <div class="tonight-status">
        <p class="tonight-status__text">${esc(tonightCopy.status.everything)}</p>
        <a class="tonight-status__action" id="${id}" href="#/tonight">
          ${esc(tonightCopy.status.setTonightCta)}
        </a>
      </div>`;
  }

  const program = choice.programId
    ? weeklyProgram.programs.find((p) => p.id === choice.programId)
    : null;
  const ageGroup = weeklyProgram.ageGroups.find((a) => a.id === choice.ageId);
  const countText = tonightCopy.status.eventCount(count);

  const text = program
    ? `Showing <strong>${esc(program.name)}${
        ageGroup ? ' · ' + esc(ageGroup.name) : ''
      }</strong> — ${esc(countText)}`
    : esc(tonightCopy.status.manualSelection(countText));

  return `
    <div class="tonight-status">
      <p class="tonight-status__text">${text}</p>
      <button
        type="button"
        class="tonight-status__action"
        id="${id}"
        data-action="set-mode"
        data-mode="everything">
        ${esc(tonightCopy.status.showEverythingCta)}
      </button>
    </div>`;
}

/**
 * Per-card Tonight toggle — the small in-card control on the Events list
 * (js/views/events.js) that adds/removes ONE event from tonight's selection
 * via js/tonight.js's toggleTonightEvent(), without touching the top mode
 * switch above (see that function's doc comment for why).
 *
 * A real <button type="button"> carrying aria-pressed — not role="switch",
 * not <input type="checkbox">, not a styled <div>. No native HTML element
 * expresses a two-state toggle button, and aria-pressed on a real <button>
 * is the minimum ARIA that does the job — the same control choice already
 * established by modeSwitch() above (STYLEGUIDE rule 8).
 *
 * State-first redesign (Option A): the toggle is now a labelled pill sitting
 * inline in the card's body row next to the tagline, not a floating
 * icon-only circle over the card's corner — pairing the visible "Add"/
 * "Added" text with the card-level `.event-card--selected` treatment
 * (events.js) is what lets a selected card read as selected at a glance,
 * rather than only from a small badge easy to miss on a fast scan. See
 * STYLEGUIDE.md's "Per-card Tonight toggle" section for the full rationale
 * and the history of this control's shape.
 *
 * **Accessible name contains the visible label (SC 2.5.3 Label in Name).**
 * The visible label is just "Add"/"Added"; `aria-label` leads with that same
 * word ("Add to tonight" / "Added to tonight") before naming the event, so a
 * voice-control user saying "click added" still matches. The full
 * `aria-label` differs between states (unlike the old icon-only circle's
 * constant label) specifically so it can lead with the visible word; the
 * event name is still present in both, and `aria-pressed` remains the
 * canonical state carrier either way.
 *
 * **Two non-colour state signals (SC 1.4.1) unchanged:** the glyph flips
 * `+` -> `✓` and the border flips dashed -> solid, on top of the fill/text
 * colour and label-word change.
 *
 * MUST be rendered as a SIBLING of the event card's <a>, never nested inside
 * it — a <button> cannot be a descendant of <a>; the browser silently
 * reparents it out, breaking the control in a way invisible in the source
 * template (see events.js).
 *
 * `id` is a stable, slug-derived string (not a random/incrementing one) so
 * interactions.js can re-find and re-focus this exact button after the
 * outlet repaints post-toggle.
 *
 * @param {object}  event    an event record from content.js
 * @param {boolean} pressed  whether this event is in tonight's selection
 */
export function tonightToggleButton(event, pressed) {
  const id = `tonight-toggle-${esc(event.slug)}`;
  const label = pressed ? 'Added' : 'Add';
  return `
    <button
      type="button"
      class="tonight-toggle${pressed ? ' tonight-toggle--active' : ''}"
      id="${id}"
      data-action="toggle-tonight"
      data-slug="${esc(event.slug)}"
      data-event-name="${esc(event.name)}"
      aria-pressed="${pressed}"
      aria-label="${label} to tonight — ${esc(event.name)}">
      <span class="tonight-toggle__glyph" aria-hidden="true">${pressed ? '✓' : '+'}</span>
      <span class="tonight-toggle__label">${label}</span>
    </button>`;
}

/**
 * Per-card favourite toggle on the Games list (js/views/games.js) — the
 * coach's own shortlist, via js/favourites.js's toggleFavourite().
 *
 * A star icon-only `<button>` overlaid on the top-right corner of the
 * card's name strip, positioned by CSS (`.favourite-toggle`). MUST be
 * rendered as a SIBLING of `.game-list__link`, never nested inside it — a
 * `<button>` cannot be a descendant of `<a>` (the browser silently
 * reparents it out) — the same constraint documented on
 * `tonightToggleButton()` above and on `.event-card__body` in
 * components.css. `.game-list__strip` reserves extra right padding
 * (components.css) so a long game name wraps before it ever runs under
 * this button rather than sitting behind it.
 *
 * No visible text label, so SC 2.5.3 (Label in Name) doesn't constrain the
 * wording the way it does the "Add"/"Added" pill above — `aria-label` just
 * states the action plainly. `aria-pressed` carries the canonical state;
 * the star glyph itself flips outline -> filled (not just colour) as the
 * non-colour signal SC 1.4.1 requires, the same principle as
 * tonightToggleButton()'s +/✓ glyph swap.
 *
 * `id` is slug-derived and stable so interactions.js can re-find and
 * re-focus this exact button after the outlet repaints post-toggle.
 *
 * @param {{slug: string, name: string}} item
 * @param {boolean} pressed  whether this game is currently favourited
 */
export function favouriteToggleButton(item, pressed) {
  const id = `favourite-toggle-${esc(item.slug)}`;
  const label = pressed ? 'Remove from favourites' : 'Add to favourites';
  return `
    <button
      type="button"
      class="favourite-toggle${pressed ? ' favourite-toggle--active' : ''}"
      id="${id}"
      data-action="toggle-favourite"
      data-slug="${esc(item.slug)}"
      data-game-name="${esc(item.name)}"
      aria-pressed="${pressed}"
      aria-label="${label} — ${esc(item.name)}">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
    </button>`;
}

/**
 * Full-width "Add to tonight" CTA on the Event Detail page
 * (js/views/eventDetail.js). Controls the SAME per-event Tonight state as
 * tonightToggleButton() above, via the identical `data-action="toggle-tonight"`
 * + `data-slug` + `data-event-name` dataset shape — interactions.js's single
 * generic click handler for that action already reads exactly those three
 * things, so this button is wired up for free: no second state mechanism,
 * no second announcement path. Toggling it announces through the same
 * `#tonight-status` region with the same
 * toggleOnAnnouncement/toggleOffAnnouncement copy the per-card toggle uses.
 *
 * Not-in-tonight: solid `.btn--primary`, "Add to tonight". In-tonight: the
 * recessed `.btn--ghost-success` variant (green border/text, 6.60:1 on
 * white — see tokens.css), with a leading check glyph baked into the label
 * itself so the state is never colour-only (SC 1.4.1) — same principle as
 * tonightToggleButton()'s glyph swap, just carried in the visible/accessible
 * text here since this is a single full-width label rather than a small
 * icon-plus-caption control. `aria-pressed` carries the state for assistive
 * tech, same control choice as every other two-state button in this app
 * (STYLEGUIDE rule 8).
 *
 * `id` is slug-derived but namespaced distinctly from the per-card toggle's
 * `tonight-toggle-<slug>` (this is `tonight-cta-<slug>`) — the two controls
 * never render in the same DOM (different routes), but distinct ids avoid
 * any confusion when reading the two schemes side by side.
 *
 * @param {object}  event    an event record from content.js
 * @param {boolean} pressed  whether this event is in tonight's selection
 */
export function tonightCtaButton(event, pressed) {
  const id = `tonight-cta-${esc(event.slug)}`;
  const label = pressed ? '✓ Added to tonight — tap to remove' : 'Add to tonight';
  return `
    <button
      type="button"
      class="btn btn--block ${pressed ? 'btn--ghost-success' : 'btn--primary'}"
      id="${id}"
      data-action="toggle-tonight"
      data-slug="${esc(event.slug)}"
      data-event-name="${esc(event.name)}"
      aria-pressed="${pressed}">
      ${esc(label)}
    </button>`;
}

/**
 * Empty/near-empty Tonight-mode state — shown instead of a bare, confusing
 * blank list when the current selection filters a page down to nothing.
 * Always offers a way out, so it reads as a deliberate state, not a broken
 * page. The single implementation, reused everywhere a filter can produce an
 * empty result — including the Tonight tab's own summary, which needs an
 * `<button data-action="open-picker">` in place of the link every other page
 * uses (linking to `#/tonight` from the Tonight page itself is a no-op), so
 * the action element is a parameter rather than a second copy of this
 * function.
 *
 * @param {string} message   the empty-state copy (from content.js)
 * @param {string} [action]  action element HTML; defaults to the "Choose
 *                           tonight's events" link to the Tonight tab.
 */
export function tonightEmptyState(message, action) {
  const actionHtml =
    action ||
    `<a class="btn btn--primary" href="#/tonight">${esc(tonightCopy.chooseEventsCta)}</a>`;
  return `
    <div class="empty-state">
      <p>${esc(message)}</p>
      ${actionHtml}
    </div>`;
}

/**
 * Weekly-program picker — the two <select>s at the top of the Events tab
 * (js/views/events.js) that choose which of the club's rotating programs is
 * on tonight and which age group to read off it.
 *
 * REAL <select>s, not a custom listbox or a row of chips. Six programs times
 * ten age groups is too many for chips at a 320px width, and a native select
 * opens the platform's own wheel/dropdown — big touch targets, keyboard and
 * screen-reader support for free, and it works one-handed in the dark on the
 * side of a track, which no hand-rolled listbox of ours would. `appearance:
 * none` restyles the closed control only; the open picker stays native.
 *
 * Each select has a real <label for>, so the control is named without
 * relying on the visible text beside it. Selection state is expressed with
 * the `selected` ATTRIBUTE rather than set on the live node, because the
 * router replaces the outlet's innerHTML on every repaint — there is no
 * surviving DOM state to set (see router.js's "Two render paths").
 *
 * `data-action="set-program"` / `"set-age"` are dispatched by the ONE
 * delegated `change` listener in interactions.js, matching how every other
 * control in this app is wired (see that file's banner).
 *
 * The program select carries an explicit "Not set" option because clearing
 * the choice has to be reachable: hand-editing tonight's events drops the
 * program (see tonight.js's clearProgramForManualEdit()), and the coach
 * needs the same exit by hand.
 *
 * @param {{programId: (string|null), ageId: string}} choice
 */
export function programPicker(choice) {
  // `id` is a stable, fixed string (not generated) so interactions.js can
  // re-find and re-focus this exact select after the outlet repaints — the
  // same arrangement modeSwitch()'s buttons use.
  const field = ({ id, action, label, options }) => `
    <div class="program-picker__field">
      <label class="program-picker__label" for="${esc(id)}">${esc(label)}</label>
      <div class="program-picker__control">
        <select class="program-picker__select" id="${esc(id)}" data-action="${esc(action)}">
          ${options}
        </select>
        <span class="program-picker__chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>
    </div>`;

  const option = (value, label, selected) =>
    `<option value="${esc(value)}"${selected ? ' selected' : ''}>${esc(label)}</option>`;

  const programOptions = [
    option('', 'Not set', choice.programId == null),
    ...weeklyProgram.programs.map((p) =>
      option(p.id, p.name, p.id === choice.programId)
    )
  ].join('');

  const ageOptions = weeklyProgram.ageGroups
    .map((a) => option(a.id, a.name, a.id === choice.ageId))
    .join('');

  return `
    <div class="program-picker">
      ${field({
        id: 'program-select',
        action: 'set-program',
        label: weeklyProgram.copy.programLabel,
        options: programOptions
      })}
      ${field({
        id: 'age-select',
        action: 'set-age',
        label: weeklyProgram.copy.ageLabel,
        options: ageOptions
      })}
    </div>`;
}

/**
 * Games tab category filter — a single native <select> that narrows the
 * list to one category at a time (js/gamesFilter.js owns the state).
 *
 * Same "real <select>, not chips or a custom listbox" reasoning as
 * programPicker() above: seven categories is too many for a chip row at
 * 320px, and a native select gets big touch targets and platform
 * keyboard/screen-reader support for free. Deliberately its own
 * `.category-filter` component rather than reusing `.program-picker`'s BEM
 * classes — visually similar, but a different control with different state,
 * and giving it its own name keeps the two from silently coupling later.
 *
 * `data-action="set-game-category"` is dispatched by the one delegated
 * `change` listener in interactions.js, same wiring as every other control.
 *
 * @param {string|null} selectedId the current category filter, or null for
 *   "All categories"
 * @param {{id: string, name: string}[]} categories
 */
export function categoryFilterPicker(selectedId, categories) {
  const option = (value, label, selected) =>
    `<option value="${esc(value)}"${selected ? ' selected' : ''}>${esc(label)}</option>`;

  const options = [
    option('', 'All categories', selectedId == null),
    ...categories.map((c) => option(c.id, c.name, c.id === selectedId))
  ].join('');

  return `
    <div class="category-filter">
      <label class="category-filter__label" for="game-category-select">Filter by category</label>
      <div class="category-filter__control">
        <select
          class="category-filter__select"
          id="game-category-select"
          data-action="set-game-category">
          ${options}
        </select>
        <span class="category-filter__chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>
    </div>`;
}

/**
 * Games tab free-text search — narrows every visible category to the items
 * whose name, summary or gear match, as the coach types (js/gamesFilter.js
 * owns the state; js/views/games.js does the actual matching).
 *
 * `type="search"` for the platform semantics (keyboard "search" affordance,
 * VoiceOver announces it as a search field), but native cancel/clear
 * decorations are suppressed in CSS in favour of one clear button that works
 * the same way in every browser — rendered here only once there is a query
 * to clear, same conditional-pill pattern as the gear/teach-time pills in
 * gameListItem() (js/views/games.js).
 *
 * `data-action="search-games"` is read on the 'input' event, not 'change'
 * like every other control here — see interactions.js's bindInteractions()
 * for why a search box needs live-as-you-type filtering rather than
 * waiting for blur.
 *
 * @param {string} value the current search query, '' for "no search"
 */
export function gamesSearchInput(value) {
  return `
    <div class="games-search">
      <label class="games-search__label" for="game-search-input">Search games</label>
      <div class="games-search__control">
        <svg class="games-search__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          class="games-search__input"
          type="search"
          id="game-search-input"
          data-action="search-games"
          placeholder="Search by name…"
          autocomplete="off"
          spellcheck="false"
          value="${esc(value)}">
        ${
          value
            ? `<button type="button" class="games-search__clear" data-action="clear-game-search" aria-label="Clear search">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"></path></svg>
              </button>`
            : ''
        }
      </div>
    </div>`;
}

/**
 * Tonight's running order — the Events tab's Tonight view once a program is
 * chosen (js/views/events.js). One card per block returned by content.js's
 * getRunningOrder(); see that function for how consecutive slots merge.
 *
 * An <ol>, not a <ul>: these are a sequence in time, and the order is the
 * information. `list-style: none` hides the markers — the time on each card
 * is the label that matters, and "1." beside "6.00pm" would be noise.
 *
 * Card anatomy reuses `.event-card`'s language deliberately (dark reversed
 * strip over a lighter body band) so a running-order card and an event card
 * read as the same kind of object — see STYLEGUIDE.md. The additions are the
 * time chip in the strip and the optional flag band under the body.
 *
 * Two shapes, decided by whether the block's code maps to a page in this
 * guide:
 *   - `slug` set    → the whole card is an <a> to that event's page.
 *   - `slug` null   → a non-interactive card carrying `noGuideFlag`. The
 *                     club runs Triple Jump and Javelin for older ages and
 *                     this U10 guide has no page for either; dropping those
 *                     blocks would show a coach reading another age group a
 *                     night with silent holes in it.
 *
 * The flag bands sit OUTSIDE the <a> (siblings inside the <li>) so they
 * never become part of the link's accessible name, while `.run-item`'s own
 * border and `overflow: hidden` still clip everything into one card — the
 * same "wrapper owns the frame" arrangement `.event-card` uses to keep its
 * toggle <button> out of its <a>.
 */
export function runningOrder(blocks) {
  const flag = (modifier, text) =>
    `<p class="run-flag run-flag--${modifier}">${esc(text)}</p>`;

  const inner = (block) => `
    <span class="run-card__strip">
      <span class="run-card__time">${esc(block.time)}</span>
      <span class="run-card__name">${esc(block.name)}${block.slug ? ' →' : ''}</span>
    </span>
    <span class="run-card__body">
      <span class="run-card__detail">${esc(block.detail)}</span>
      ${block.rule ? `<span class="run-card__rule">${esc(block.rule)}</span>` : ''}
    </span>`;

  const items = blocks
    .map((block) => {
      const card = block.slug
        ? `<a class="run-card" href="#/events/${esc(block.slug)}">${inner(block)}</a>`
        : `<div class="run-card run-card--static">${inner(block)}</div>`;
      return `
        <li class="run-item${block.slug ? ' run-item--link' : ''}">
          ${card}
          ${block.slug ? '' : flag('no-guide', weeklyProgram.copy.noGuideFlag)}
          ${block.packUp ? flag('pack-up', weeklyProgram.copy.packUpFlag) : ''}
        </li>`;
    })
    .join('');

  return `<ol class="run-list">${items}</ol>`;
}

/**
 * The Events tab's message when a program IS chosen but has no running order
 * to show. Distinct from tonightEmptyState() above, which covers "nothing is
 * selected": here something was chosen and the guide has to say why it can't
 * honour it, which is a different sentence and a different way out (change
 * the picker, or read the club's own page).
 *
 * Not reachable from the picker today — every grid A–F is transcribed — but
 * it stays because the club adds programs before we have their grids, and a
 * saved choice can outlive a program that is renamed or dropped. Saying which
 * of those happened, with a link to the source, beats an empty list.
 *
 * @param {{status: string, program: object|null, ageGroup: object|null}} order
 */
export function programEmptyState(order) {
  const copy = weeklyProgram.copy;
  const programName = order.program ? order.program.name : 'That program';
  const ageName = order.ageGroup ? order.ageGroup.name : 'that age group';

  const heading =
    order.status === 'age-not-listed'
      ? copy.missingAge(programName, ageName)
      : copy.missingProgram(programName);

  const note = order.status === 'age-not-listed' ? '' : copy.missingProgramNote;

  return `
    <div class="empty-state">
      <p class="empty-state__title">${esc(heading)}</p>
      ${note ? `<p>${esc(note)}</p>` : ''}
      <a class="btn btn--ghost" href="${safeUrl(weeklyProgram.source.url)}"
         target="_blank" rel="noopener noreferrer">
        ${esc(copy.sourceLink)}
        <span class="visually-hidden"> (opens in a new tab)</span>
      </a>
    </div>`;
}
