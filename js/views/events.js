import { events, eventCategories, tonightCopy } from '../content.js';
import * as tonight from '../tonight.js';
import {
  esc,
  modeSwitch,
  pageHeader,
  tonightEmptyState,
  tonightToggleButton
} from '../ui.js';

/**
 * The event-card <ul> for one discipline category (or, in principle, any
 * event list) — the single piece of card-rendering markup, called once per
 * category below rather than duplicated per section. Refactored out of what
 * used to be eventsView()'s only list when the Events tab was a single flat
 * list; grouping by discipline (Track/Jumps/Throws/Bonus) reuses this
 * unchanged.
 *
 * Visual shape: each event is its own bordered/rounded `.event-card`, its
 * name reversed white-on-dark in a `.event-card__strip` header band above a
 * lighter `.event-card__body` band holding the tagline — same header-band-
 * over-body-band language as `.game-list__link` (js/views/games.js), so an
 * event card and a game card read as the same kind of thing. No numeral
 * badge — the name alone identifies the event. The `resourceSummary()` line
 * ("2 videos", "1 article") is deliberately NOT rendered here — it isn't
 * part of this card's design — but the data/helper is untouched and still
 * renders on the Event Detail page (js/views/eventDetail.js).
 */
function eventCardList(list) {
  const cards = list
    .map((e) => {
      const pressed = tonight.isTonightEvent(e.slug);
      return `
        <li class="event-card">
          <a class="event-card__link" href="#/events/${esc(e.slug)}">
            <span class="event-card__strip">
              <span class="event-card__name">${esc(e.name)} →</span>
            </span>
            <span class="event-card__body">
              <span class="event-card__tag">${esc(e.tagline)}</span>
            </span>
          </a>
          ${tonightToggleButton(e, pressed)}
        </li>`;
    })
    .join('');
  return `<ul class="event-cards">${cards}</ul>`;
}

export function eventsView() {
  const mode = tonight.getMode();
  const hasSelection = tonight.hasSelection();
  const isTonight = tonight.isFiltering();
  const shown = isTonight ? events.filter((e) => tonight.isTonightEvent(e.slug)) : events;
  const shownSlugs = new Set(shown.map((e) => e.slug));

  // AC34: mode === 'tonight' but nothing picked yet — isFiltering() is false
  // (same existing rule as everywhere else) so the full list still shows,
  // but the mode switch would otherwise read "Tonight" beside an unexplained
  // full list. This note closes that gap.
  const showEmptySelectionNote = mode === 'tonight' && !hasSelection;

  // Events tab, grouped by discipline (content.js's eventCategories, in its
  // fixed order: Track, Jumps, Throws, Bonus). Each category is its own
  // <section>/<h2> containing only the events Tonight-mode filtering has
  // left visible; a category left with zero visible events renders nothing
  // at all — no empty section with a heading and nothing under it, same
  // spirit as tonightEmptyState() below for the page as a whole.
  let renderedFirst = false;
  const sections = eventCategories
    .map((cat) => {
      const catEvents = events.filter((e) => cat.slugs.includes(e.slug) && shownSlugs.has(e.slug));
      if (!catEvents.length) return '';
      const isFirst = !renderedFirst;
      renderedFirst = true;
      return `
        <section class="section" aria-labelledby="cat-${esc(cat.id)}">
          <h2 class="event-category-kicker${
            isFirst ? ' event-category-kicker--first' : ''
          }" id="cat-${esc(cat.id)}">${esc(cat.name)}</h2>
          ${eventCardList(catEvents)}
        </section>`;
    })
    .join('');

  const body = shown.length ? sections : tonightEmptyState(tonightCopy.emptyState);

  return {
    title: 'Events',
    html: `
      ${pageHeader({
        kicker: 'Under 10 Boys',
        title: 'Events',
        lead: isTonight ? tonightCopy.events.filteredLead : tonightCopy.events.everythingLead
      })}
      ${modeSwitch(mode)}
      ${
        showEmptySelectionNote
          ? `<p class="note">${esc(tonightCopy.events.emptySelectionNote)}</p>`
          : ''
      }
      ${body}`
  };
}
