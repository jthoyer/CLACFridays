import { events, eventsAtAGlance, games, tonightCopy } from '../content.js';
import * as tonight from '../tonight.js';
import { esc, pageHeader, tonightEmptyState } from '../ui.js';

/**
 * Every game item across every category whose item-level `eventSlugs`
 * includes this event's slug (AC15) — a flat scan, not the category-level
 * `eventSlugs` (that's a separate join that only drives Games-tab category
 * visibility; see the comment on relay-baton's eventSlugs in content.js). A
 * game with `eventSlugs: []` (Freeze Tag) can never match any slug here, so
 * it never appears on this tab (AC17).
 */
function gamesForEvent(slug) {
  const items = [];
  games.categories.forEach((cat) => {
    (cat.items || []).forEach((item) => {
      if ((item.eventSlugs || []).includes(slug)) items.push(item);
    });
  });
  return items;
}

/**
 * The "Key U10 Rule" cell (index 2) for one event, read from
 * `eventsAtAGlance.rows` in content.js by matching `slug` — not duplicated
 * here. `assertContentLinkage()` guarantees exactly one row per event slug
 * across all 10 events, so every selected event has a match.
 */
function keyRuleFor(slug) {
  const row = eventsAtAGlance.rows.find((r) => r.slug === slug);
  return row.cells[2];
}

/*
 * Ephemeral, in-memory-only UI state — NOT persisted, and deliberately not
 * owned by tonight.js (which owns only the persisted selection + mode).
 * Module-level `let` survives router re-renders because ES modules are
 * singletons: the router calls tonightView() again, it doesn't reload this
 * module.
 *
 * `pickerDismissed` is the ONE flag all three picker exits — Save, Cancel,
 * Skip — set. Earlier this was two flags (`skippedOnboarding`, set only by
 * Cancel/Skip) so a zero-selection Save left neither flag set: the picker
 * would immediately reopen on the very next paint, because showPicker's
 * `!tonight.hasSelection() && !skippedOnboarding` was still true. A single
 * flag set by every exit path means "the picker has been resolved at least
 * once" and it only ever auto-opens again if it genuinely never has been.
 */
let pickerOpen = false;
let pickerDismissed = false;

/** Reopen the picker (the Tonight tab's "Edit selection" / "Choose tonight's
 *  events" action). Exported for interactions.js. */
export function openPicker() {
  pickerOpen = true;
}

/** Close the picker without saving (Cancel, or first-run Skip). */
export function closePicker() {
  pickerOpen = false;
  pickerDismissed = true;
}

/** Close the picker after a successful save (including saving zero events —
 *  that must not immediately reopen the picker either). */
export function pickerSaved() {
  pickerOpen = false;
  pickerDismissed = true;
}

function eventPickerItem(event, selected) {
  const id = `picker-${event.slug}`;
  return `
    <li class="picker__item">
      <label class="picker__label" for="${esc(id)}">
        <input
          class="picker__checkbox"
          type="checkbox"
          id="${esc(id)}"
          name="event"
          value="${esc(event.slug)}"
          ${selected ? 'checked' : ''}>
        <span class="picker__text">
          <span class="picker__name">${esc(event.name)}</span>
          <span class="picker__tag">${esc(event.tagline)}</span>
        </span>
      </label>
    </li>`;
}

function renderPicker() {
  const selected = new Set(tonight.getSelection());
  const items = events.map((e) => eventPickerItem(e, selected.has(e.slug))).join('');
  const hasExisting = tonight.hasSelection();

  return `
    <form class="picker" data-tonight-picker novalidate>
      <fieldset class="picker__fieldset">
        <legend class="picker__legend" id="picker-legend" tabindex="-1">
          ${esc(tonightCopy.picker.legend)}
        </legend>
        <p class="note">
          ${esc(tonightCopy.picker.note)}
        </p>
        <ul class="picker__list">${items}</ul>
      </fieldset>
      <div class="picker__actions">
        <button class="btn btn--primary" type="submit">${esc(tonightCopy.picker.saveLabel)}</button>
        <button
          class="btn btn--ghost"
          type="button"
          id="picker-cancel-btn"
          data-action="dismiss-picker">
          ${hasExisting ? esc(tonightCopy.picker.cancelLabel) : esc(tonightCopy.picker.skipLabel)}
        </button>
      </div>
    </form>`;
}

function renderSummary() {
  const selection = tonight.getSelection();
  const selectedEvents = events.filter((e) => selection.includes(e.slug));

  if (selectedEvents.length === 0) {
    return tonightEmptyState(
      tonightCopy.emptyState,
      `<button
          class="btn btn--primary"
          type="button"
          id="open-picker-btn"
          data-action="open-picker">
          ${esc(tonightCopy.chooseEventsCta)}
        </button>`
    );
  }

  // AC14–AC18: each selected event gets its own bordered card — a dark
  // name-link header strip (no numeral), a tagline subhead, a "Key rule"
  // section, then — only when the event has at least one linked game
  // (js/content.js) — a "Games
  // tonight (N)" section. An event with zero linked games renders with no
  // games section at all — deliberate, not forgotten (see
  // assertContentLinkage()'s comments on this same distinction) —
  // gamesSection is the empty string, not an empty section or a "no game"
  // placeholder. Each section is a dark header band naming it
  // (reversed white text) over a lighter body band in the same colour, so
  // the games no longer need a caption repeated per item — they render as
  // their own bordered/shadowed cards (`.tonight-card__game`) instead.
  //
  // The event name keeps its <h3> (unchanged heading level from before this
  // restyle); the per-game name link is not its own heading (it used to be
  // an <h4> via gameItem()) because it is no longer sub-content of the event
  // the way a full game write-up was — it is one line inside a "Games
  // tonight" card, so a heading here would outrank content it no longer
  // actually introduces.
  const groups = selectedEvents
    .map((e) => {
      const linkedGames = gamesForEvent(e.slug);
      const gameCards = linkedGames
        .map(
          (item) => `
            <li class="tonight-card__game">
              <div class="tonight-card__game-head">
                <a class="tonight-card__game-link" href="#/games/${esc(item.slug)}">${esc(
                  item.name
                )} →</a>
                ${item.gear ? `<span class="tonight-card__game-tag">${esc(item.gear)}</span>` : ''}
              </div>
              <p class="tonight-card__game-summary">${esc(item.summary)}</p>
            </li>`
        )
        .join('');

      const gamesSection = linkedGames.length
        ? `
            <p class="tonight-card__section-head tonight-card__section-head--games">Games tonight (${linkedGames.length})</p>
            <div class="tonight-card__section-body tonight-card__section-body--games">
              <ul class="tonight-card__game-list">${gameCards}</ul>
            </div>`
        : '';

      return `
        <li class="tonight-group">
          <article class="tonight-card">
            <div class="tonight-card__head">
              <h3 class="tonight-card__title">
                <a class="tonight-card__name" href="#/events/${esc(e.slug)}">${esc(
                  e.name
                )} →</a>
              </h3>
            </div>
            <div class="tonight-card__subhead">
              <p class="tonight-card__tag">${esc(e.tagline)}</p>
            </div>
            <p class="tonight-card__section-head tonight-card__section-head--rule">Key rule</p>
            <div class="tonight-card__section-body tonight-card__section-body--rule">
              <p class="tonight-card__rule-value">${esc(keyRuleFor(e.slug))}</p>
            </div>
            ${gamesSection}
          </article>
        </li>`;
    })
    .join('');

  return `
    <section class="section" aria-labelledby="tonight-selection">
      <div class="section__head">
        <h2 class="section__title" id="tonight-selection">
          Tonight's events (${selectedEvents.length})
        </h2>
      </div>
      <ul class="tonight-groups">${groups}</ul>
      <button
        class="btn btn--ghost tonight-edit-btn"
        type="button"
        id="open-picker-btn"
        data-action="open-picker">
        ${esc(tonightCopy.editSelectionCta)}
      </button>
    </section>`;
}

export function tonightView() {
  const showPicker = pickerOpen || (!tonight.hasSelection() && !pickerDismissed);

  return {
    title: 'Tonight',
    html: `
      ${pageHeader({
        kicker: 'Under 10 Boys',
        title: 'Tonight',
        lead: showPicker ? tonightCopy.view.pickerLead : tonightCopy.view.summaryLead
      })}
      ${showPicker ? renderPicker() : renderSummary()}`
  };
}
