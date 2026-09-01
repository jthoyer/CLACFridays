/**
 * ui.js — shared render helpers.
 *
 * Every repeated visual pattern lives here exactly once. Views compose these;
 * they do not re-implement them. If you need a card/table/callout that is
 * *nearly* one of these, extend the helper rather than writing a second one —
 * two implementations drift and the two surfaces silently disagree.
 */

import { tonightCopy, getResource } from './content.js';

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
 * The accessible name (`aria-label`) is byte-identical in both states: it
 * names the event but never itself flips to a word like "Off", which read
 * next to aria-pressed="false" would be a double negative ("Off, not
 * pressed"). The on/off state is instead carried by aria-pressed PLUS at
 * least two visual signals that are not colour — a glyph (+ / ✓), a border
 * style (dashed / solid) and font weight all differ between states here.
 * Colour is never the only signal (SC 1.4.1).
 *
 * Icon-only circle (Events-list compact-row redesign): the visible "Add"/"On"
 * text label was dropped, but the two required non-colour signals (SC 1.4.1)
 * are unchanged — border style still flips dashed -> solid and the glyph
 * still flips + -> ✓ — and `aria-pressed` plus the constant `aria-label`
 * above are untouched, so the accessible name/state read by a screen reader
 * is identical to before this restyle. See STYLEGUIDE.md's "Per-card Tonight
 * toggle" section for the full accessibility rationale.
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
  return `
    <button
      type="button"
      class="tonight-toggle${pressed ? ' tonight-toggle--active' : ''}"
      id="${id}"
      data-action="toggle-tonight"
      data-slug="${esc(event.slug)}"
      data-event-name="${esc(event.name)}"
      aria-pressed="${pressed}"
      aria-label="Tonight: ${esc(event.name)}">
      <span class="tonight-toggle__glyph" aria-hidden="true">${pressed ? '✓' : '+'}</span>
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

