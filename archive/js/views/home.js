import { meta, events } from '../content.js';
import { esc, pageHeader, runSheetSection } from '../ui.js';

export function homeView() {
  const pillars = meta.pillars
    .map((p) => `<li class="pill">${esc(p)}</li>`)
    .join('');

  return {
    title: 'Home',
    html: `
      ${pageHeader({
        kicker: meta.title,
        title: meta.subtitle,
        lead: meta.tagline
      })}

      <ul class="pill-row">${pillars}</ul>

      <a class="cta" href="#/events">
        <span class="cta__text">
          <span class="cta__title">Go to the 10 events</span>
          <span class="cta__sub">Progressions, faults, safety and videos</span>
        </span>
        <span class="cta__chev" aria-hidden="true">→</span>
      </a>

      <section class="section" aria-labelledby="how-to-use">
        <h2 class="section__title" id="how-to-use">How to use this guide</h2>
        <p>${esc(meta.howToUse)}</p>
        <p class="note">${esc(meta.provenance)}</p>
      </section>

      ${runSheetSection({ id: 'run-sheet' })}

      <section class="section" aria-labelledby="home-jump">
        <h2 class="section__title" id="home-jump">Jump straight in</h2>
        <ul class="link-list">
          <li><a href="#/events">All ${events.length} events</a></li>
          <li><a href="#/games">Waiting-period games</a></li>
          <li><a href="#/rules">Rules &amp; events at a glance</a></li>
          <li><a href="#/rules">Full resource library</a></li>
        </ul>
      </section>`
  };
}
