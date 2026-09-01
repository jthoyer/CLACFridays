import { getEvent, getResource, tonightCopy } from '../content.js';
import * as tonight from '../tonight.js';
import {
  esc,
  bulletList,
  factList,
  orderedSteps,
  pageHeader,
  resourceCard,
  resourceSummary,
  safetyCallout,
  tonightCtaButton
} from '../ui.js';

export function eventDetailView(slug) {
  const event = getEvent(slug);
  if (!event) return null;

  const resolved = event.resources.map(getResource);

  // Deep links must keep working even when this event isn't in tonight's
  // selection — never block navigation, just flag it. Cheap enough to add:
  // one conditional line, no extra complexity.
  const notTonight = tonight.isFiltering() && !tonight.isTonightEvent(event.slug);

  const cards = event.resources
    .map((key) => {
      const r = getResource(key);
      // A shared resource can carry a different framing on each event page.
      const override = event.resourceNotes && event.resourceNotes[key];
      return resourceCard(r, {
        context: event.name,
        note: override != null ? override : r.note
      });
    })
    .join('');

  return {
    title: event.name,
    html: `
      <a class="back-link" href="#/events">
        <span class="back-link__chev" aria-hidden="true">←</span>
        <span>All events</span>
      </a>

      ${pageHeader({
        title: event.name,
        lead: event.tagline
      })}

      ${
        notTonight
          ? `<p class="note note--flag">${esc(tonightCopy.eventDetail.notTonightFlag)} <a href="#/tonight">${esc(tonightCopy.editSelectionCta)}</a></p>`
          : ''
      }

      <section class="section" aria-labelledby="quick-facts">
        <h2 class="section__title" id="quick-facts">Quick facts</h2>
        ${factList(event.quickFacts)}
      </section>

      <section class="section" aria-labelledby="prog-beginner">
        <h2 class="section__title" id="prog-beginner">
          Teaching progression — Beginner
        </h2>
        ${orderedSteps(event.beginner)}
      </section>

      <section class="section" aria-labelledby="prog-intermediate">
        <h2 class="section__title" id="prog-intermediate">
          Teaching progression — Intermediate
        </h2>
        ${orderedSteps(event.intermediate)}
      </section>

      <section class="section" aria-labelledby="faults">
        <h2 class="section__title" id="faults">Common faults to watch for</h2>
        ${bulletList(event.faults)}
      </section>

      ${safetyCallout(event.safety)}

      <section class="section" aria-labelledby="watch-learn">
        <h2 class="section__title" id="watch-learn">Watch &amp; Learn</h2>
        <p class="section__meta">${esc(resourceSummary(resolved))} for this event</p>
        ${cards}
      </section>

      <div class="event-cta">
        ${tonightCtaButton(event, tonight.isTonightEvent(event.slug))}
      </div>`
  };
}
