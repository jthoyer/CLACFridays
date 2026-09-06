import {
  events,
  eventCategories,
  tonightCopy,
  weeklyProgram,
  getRunningOrder
} from '../content.js';
import * as tonight from '../tonight.js';
import {
  esc,
  modeSwitch,
  pageHeader,
  programEmptyState,
  programPicker,
  runningOrder,
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
 * Visual shape (state-first redesign, "Option A"): each event is its own
 * bordered/rounded `.event-card`, its name reversed white-on-dark in a
 * `.event-card__strip` header band — same header-band language as
 * `.game-list__link` (js/views/games.js), so an event card and a game card
 * still read as the same kind of thing. Below that, `.event-card__body` is a
 * row holding the tagline and the per-card Tonight toggle side by side. When
 * the event is in tonight's selection, `.event-card--selected` tints the
 * whole card (border + body wash), not just the toggle, so a coach can tell
 * what's already added from the card's silhouette alone, on top of the
 * toggle's own label/glyph/border signals — see `tonightToggleButton()` in
 * ui.js and STYLEGUIDE.md's "Event card" / "Per-card Tonight toggle"
 * sections. No numeral badge — the name alone identifies the event. The
 * `resourceSummary()` line ("2 videos", "1 article") is deliberately NOT
 * rendered here — it isn't part of this card's design — but the data/helper
 * is untouched and still renders on the Event Detail page
 * (js/views/eventDetail.js).
 *
 * The toggle button sits in `.event-card__body`, a sibling of `.event-card__link`
 * rather than a floating overlay — `.event-card__link` now wraps only the
 * name strip (still the event's own >= 44px tap target to its detail page);
 * a `<button>` still cannot legally be a descendant of `<a>` (see
 * `tonightToggleButton()`'s doc comment), so it lives in the body row
 * instead of the link.
 *
 * Exported for `styleguide.html`'s Event-card tile. That tile used to scrape
 * the first `.event-card` out of a full `eventsView()` render, which stopped
 * being reliable once this tab grew a second branch: with a weekly program
 * chosen, `eventsView()` renders a running order and contains no
 * `.event-card` at all, so the tile would silently render empty for any
 * visitor whose saved state happened to have one. Calling this function
 * directly is both deterministic and a truer demo — it is the exact markup
 * the tile documents.
 */
export function eventCardList(list) {
  const cards = list
    .map((e) => {
      const pressed = tonight.isTonightEvent(e.slug);
      return `
        <li class="event-card${pressed ? ' event-card--selected' : ''}">
          <a class="event-card__link" href="#/events/${esc(e.slug)}">
            <span class="event-card__strip">
              <span class="event-card__name">${esc(e.name)} →</span>
            </span>
          </a>
          <span class="event-card__body">
            <span class="event-card__tag">${esc(e.tagline)}</span>
            ${tonightToggleButton(e, pressed)}
          </span>
        </li>`;
    })
    .join('');
  return `<ul class="event-cards">${cards}</ul>`;
}

/**
 * The full guide, grouped by discipline — what this tab has always shown,
 * and still shows in Everything mode and in Tonight mode when the coach has
 * hand-picked their events rather than choosing a program.
 *
 * Each category is its own <section>/<h2> containing only the events
 * Tonight-mode filtering has left visible; a category left with zero visible
 * events renders nothing at all — no empty section with a heading and
 * nothing under it, same spirit as tonightEmptyState() for the page as a
 * whole.
 */
function disciplineSections(shownSlugs) {
  let renderedFirst = false;
  return eventCategories
    .map((cat) => {
      const catEvents = events.filter(
        (e) => cat.slugs.includes(e.slug) && shownSlugs.has(e.slug)
      );
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
}

/**
 * Tonight's running order, read off the club's published weekly program
 * (content.js's `weeklyProgram`) for the chosen program + age group.
 *
 * Reached only when a program is chosen AND the mode switch says Tonight —
 * see eventsView() below for why that condition is not `tonight.isFiltering()`.
 * Any status other than 'ok' hands over to programEmptyState(), which
 * explains the specific reason rather than showing an empty night that looks
 * like a real one. No status other than 'ok' is reachable from the picker
 * today — every grid A–F is transcribed — but a stale saved choice or a
 * program the club adds before we have its grid both land there.
 */
function runningOrderSection(choice) {
  const order = getRunningOrder(choice.programId, choice.ageId);
  const heading = order.program
    ? `${order.program.name} · ${order.ageGroup ? order.ageGroup.name : ''}`.trim()
    : 'Tonight';

  return `
    <section class="section" aria-labelledby="running-order">
      <h2 class="event-category-kicker event-category-kicker--first" id="running-order">
        ${esc(heading)}
      </h2>
      ${order.status === 'ok' ? runningOrder(order.blocks) : programEmptyState(order)}
      ${
        order.status === 'ok'
          ? `<p class="note run-source">${esc(weeklyProgram.source.note)}</p>`
          : ''
      }
    </section>`;
}

export function eventsView() {
  const mode = tonight.getMode();
  const choice = tonight.getProgramChoice();
  const hasProgram = choice.programId != null;

  /*
   * Deliberately `mode === 'tonight'`, NOT `tonight.isFiltering()`.
   * isFiltering() is false when the selection is empty, which is exactly the
   * state a not-yet-transcribed program (B–F) leaves behind — and falling
   * back to the full ten-event list there would silently ignore a choice the
   * coach just made. When a program is chosen, this tab answers for that
   * program, including when the answer is "that one isn't loaded".
   */
  const showRunningOrder = mode === 'tonight' && hasProgram;

  const isFiltering = tonight.isFiltering();
  const shown = isFiltering
    ? events.filter((e) => tonight.isTonightEvent(e.slug))
    : events;
  const shownSlugs = new Set(shown.map((e) => e.slug));

  /*
   * AC34: mode === 'tonight' but nothing picked yet — isFiltering() is false
   * (same existing rule as everywhere else) so the full list still shows,
   * but the mode switch would otherwise read "Tonight" beside an unexplained
   * full list. This note closes that gap. Suppressed when a program is
   * chosen, because runningOrderSection() is already saying what tonight is.
   */
  const showEmptySelectionNote =
    mode === 'tonight' && !tonight.hasSelection() && !hasProgram;

  /*
   * The two pre-existing leads are untouched: the picker explains itself
   * with its own labels plus the hint below it, so there was no reason to
   * rewrite copy that already reads correctly in those two states.
   */
  const lead = showRunningOrder
    ? weeklyProgram.copy.runningOrderLead
    : isFiltering
      ? tonightCopy.events.filteredLead
      : tonightCopy.events.everythingLead;

  let body;
  if (showRunningOrder) {
    body = runningOrderSection(choice);
  } else if (shown.length) {
    body = disciplineSections(shownSlugs);
  } else {
    body = tonightEmptyState(tonightCopy.emptyState);
  }

  return {
    title: 'Events',
    html: `
      ${pageHeader({
        title: 'Events',
        lead
      })}
      ${programPicker(choice)}
      ${
        hasProgram
          ? ''
          : `<p class="note program-picker__hint">${esc(weeklyProgram.copy.lead)}</p>`
      }
      ${modeSwitch(mode)}
      ${
        showEmptySelectionNote
          ? `<p class="note">${esc(tonightCopy.events.emptySelectionNote)}</p>`
          : ''
      }
      ${body}`
  };
}
