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
 * The event-row <ul> for one discipline category (or, in principle, any
 * event list) — the single piece of row-rendering markup, called once per
 * category below rather than duplicated per section. Refactored out of what
 * used to be eventsView()'s only list when the Events tab was a single flat
 * list; grouping by discipline (Track/Jumps/Throws/Bonus) reuses this
 * unchanged.
 *
 * Visual shape (compact-row redesign): one bordered/rounded `.event-group`
 * container per category holding single-line `.event-row`s, divided by a
 * hairline, rather than each event as its own separate bordered card. The
 * `resourceSummary()` line ("2 videos", "1 article") is deliberately NOT
 * rendered here any more — it isn't part of this row's design — but the
 * data/helper is untouched and still renders on the Event Detail page
 * (js/views/eventDetail.js).
 */
function eventCardList(list) {
  const rows = list
    .map((e) => {
      const pressed = tonight.isTonightEvent(e.slug);
      return `
        <li class="event-row">
          <a class="event-row__link" href="#/events/${esc(e.slug)}">
            <span class="event-row__num" aria-hidden="true">${e.number}</span>
            <span class="event-row__body">
              <span class="event-row__name">${esc(e.name)} →</span>
              <span class="event-row__tag">${esc(e.tagline)}</span>
            </span>
          </a>
          ${tonightToggleButton(e, pressed)}
        </li>`;
    })
    .join('');
  return `<ul class="event-group">${rows}</ul>`;
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
