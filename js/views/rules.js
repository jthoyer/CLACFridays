import {
  ageGroupFacts,
  eventsAtAGlance,
  library,
  getResource,
  tonightCopy
} from '../content.js';
import * as tonight from '../tonight.js';
import {
  esc,
  factList,
  modeSwitch,
  pageHeader,
  resourceCard,
  responsiveTable,
  tonightEmptyState
} from '../ui.js';

export function rulesView() {
  const mode = tonight.getMode();
  const isTonight = tonight.isFiltering();

  // ageGroupFacts is ALWAYS shown unfiltered — only eventsAtAGlance rows are
  // filtered by tonight's selection, per spec.
  const rows = isTonight
    ? eventsAtAGlance.rows.filter((row) => tonight.isTonightEvent(row.slug))
    : eventsAtAGlance.rows;

  const glanceBlock = rows.length
    ? responsiveTable({
        columns: eventsAtAGlance.columns,
        rows: rows.map((row) => row.cells),
        caption:
          'Events at a glance: event, distance or implement, and key rule.',
        footnote: eventsAtAGlance.footnote
      })
    : tonightEmptyState(tonightCopy.emptyState);

  /*
   * Rule-videos section (AC53–AC57) — entirely data-driven from the optional
   * `resource` key on ageGroupFacts.facts[] entries and eventsAtAGlance
   * rows[] entries, not a hard-coded list here. Each card's heading is the
   * fact's `label` or the glance row's event name (via resourceCard's
   * `prefix`) — the rule text itself is never restated, so no copy is
   * duplicated on the page (AC55). `context` mirrors `prefix` so each of the
   * (currently four) embeds gets a distinct, descriptive iframe title
   * (AC57), even though none of these four happen to share a resource key.
   *
   * ageGroupFacts is never filtered by Tonight mode (matching the existing
   * rule for the facts list above it), so its videos always show. The
   * eventsAtAGlance-sourced video is filtered exactly like the table above
   * it — reusing the already-filtered `rows` array — so it disappears when
   * its event isn't part of a non-empty tonight selection (AC56).
   */
  const factVideoCards = ageGroupFacts.facts
    .filter((f) => f.resource)
    .map((f) => resourceCard(getResource(f.resource), { prefix: f.label, context: f.label }))
    .join('');

  const rowVideoCards = rows
    .filter((row) => row.resource)
    .map((row) =>
      resourceCard(getResource(row.resource), { prefix: row.cells[0], context: row.cells[0] })
    )
    .join('');

  const ruleVideoCards = factVideoCards + rowVideoCards;

  const ruleVideosBlock = ruleVideoCards
    ? `
      <section class="section" aria-labelledby="rule-videos">
        <h2 class="section__title" id="rule-videos">Rules clarified on video</h2>
        ${ruleVideoCards}
      </section>`
    : '';

  const libraryRows = library.entries
    .map(([key, prefix]) =>
      resourceCard(getResource(key), { compact: true, prefix })
    )
    .join('');

  return {
    title: 'Rules',
    html: `
      ${pageHeader({
        title: 'Rules & reference',
        lead:
          'The age-group rules that shape every session, the full event list, and ' +
          'every resource used in this guide.'
      })}

      <section class="section" aria-labelledby="age-glance">
        <h2 class="section__title" id="age-glance">${esc(ageGroupFacts.heading)}</h2>
        ${factList(ageGroupFacts.facts)}
        <p class="note">${esc(ageGroupFacts.source)}</p>
      </section>

      <section class="section" aria-labelledby="events-glance">
        <div class="section__head">
          <h2 class="section__title" id="events-glance">${esc(
            eventsAtAGlance.heading
          )}</h2>
        </div>
        ${modeSwitch(mode)}
        ${glanceBlock}
      </section>

      ${ruleVideosBlock}

      <section class="section" aria-labelledby="library">
        <h2 class="section__title" id="library">${esc(library.heading)}</h2>
        <p>${esc(library.intro)}</p>
        <ul class="resource-list">${libraryRows}</ul>
      </section>`
  };
}
