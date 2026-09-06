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
  pageHeader,
  programEmptyState,
  programPicker,
  runningOrder,
  tonightEmptyState
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
 * still read as the same kind of thing. No numeral badge — the name alone
 * identifies the event. The `resourceSummary()` line ("2 videos", "1
 * article") is deliberately NOT rendered here — it isn't part of this
 * card's design — but the data/helper is untouched and still renders on the
 * Event Detail page (js/views/eventDetail.js).
 *
 * No per-card Tonight control here (removed along with this tab's mode
 * switch — see eventsView() below): with it gone, this list had no
 * remaining non-colour signal for "this one's in tonight's selection", so
 * `.event-card--selected`'s tint went with it rather than becoming the exact
 * colour-only distinction this app's own accessibility rules elsewhere
 * forbid (SC 1.4.1). Which events are tonight's now shows on the Tonight
 * tab itself, or as this same list already filtered down when Tonight-mode
 * filtering is active (`disciplineSections()` below) — filtering the list
 * to fewer cards is a content change, not a colour-only one, so that part
 * is unaffected. `tonightToggleButton()` (ui.js) and `.tonight-toggle*`
 * (css/components.css) are unused by any current view now, not deleted —
 * kept in case a future page wants a per-item toggle again.
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
    .map(
      (e) => `
        <li class="event-card">
          <a class="event-card__link" href="#/events/${esc(e.slug)}">
            <span class="event-card__strip">
              <span class="event-card__name">${esc(e.name)} →</span>
            </span>
          </a>
          <span class="event-card__body">
            <span class="event-card__tag">${esc(e.tagline)}</span>
          </span>
        </li>`
    )
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
 * Reached only when a program is chosen AND tonight.getMode() says Tonight —
 * see eventsView() below for why that condition is not `tonight.isFiltering()`.
 * There is no mode switch on this tab any more (see eventsView()'s doc
 * comment); mode is still 'tonight' | 'everything' underneath, just set via
 * the Program and Age Group picker above, or the Rules tab's switch, or a
 * choice saved from an earlier visit. Any status other than 'ok' hands over
 * to programEmptyState(), which explains the specific reason rather than
 * showing an empty night that looks like a real one. No status other than
 * 'ok' is reachable from the picker today — every grid A–F is transcribed —
 * but a stale saved choice or a program the club adds before we have its
 * grid both land there.
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

/**
 * No `modeSwitch()` on this tab any more — the Program and Age Group picker
 * (js/views/tonight.js has its own copy) already drives the same underlying
 * `tonight.getMode()`/selection, and the per-card Tonight toggle above it is
 * gone with it (see eventCardList()'s doc comment). `mode` itself is still
 * read below — it still governs which branch renders (running order vs. the
 * discipline list vs. the empty state) — only the on-page control to flip it
 * is gone from here; Rules keeps its own switch.
 */
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
   * (same existing rule as everywhere else), so the full list still shows
   * with no visible explanation of why: this tab no longer has a mode
   * switch of its own to read "Tonight" next to (a coach reaches this state
   * via the Rules tab's switch, or a choice saved from an earlier visit).
   * This note closes that gap. Suppressed when a program is chosen, because
   * runningOrderSection() is already saying what tonight is.
   */
  const showEmptySelectionNote =
    mode === 'tonight' && !tonight.hasSelection() && !hasProgram;

  /*
   * `runningOrderLead` and `filteredLead` used to close with "Switch to
   * Everything to see the full list/guide" — accurate while this tab had its
   * own mode switch, false now that it doesn't (see eventsView()'s doc
   * comment). Both were trimmed to drop that sentence rather than left
   * pointing at a control no longer on the page; `everythingLead` needed no
   * change, it never mentioned the switch.
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
      ${
        showEmptySelectionNote
          ? `<p class="note">${esc(tonightCopy.events.emptySelectionNote)}</p>`
          : ''
      }
      ${body}`
  };
}
