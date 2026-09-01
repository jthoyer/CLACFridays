import { esc, pageHeader } from '../ui.js';

export function notFoundView(rawHash) {
  return {
    title: 'Page not found',
    html: `
      ${pageHeader({
        kicker: 'Not found',
        title: 'That page doesn’t exist',
        lead:
          'The link may be out of date, or the address may have been mistyped. ' +
          'Everything in the guide is reachable from the four tabs below.'
      })}
      ${
        rawHash
          ? `<p class="note">Requested address: <code>${esc(rawHash)}</code></p>`
          : ''
      }
      <section class="section" aria-labelledby="nf-links">
        <h2 class="section__title" id="nf-links">Go to</h2>
        <ul class="link-list">
          <li><a href="#/tonight">Tonight’s program</a></li>
          <li><a href="#/events">All 10 events</a></li>
          <li><a href="#/games">Waiting-period games</a></li>
          <li><a href="#/rules">Rules &amp; resource library</a></li>
        </ul>
      </section>`
  };
}
