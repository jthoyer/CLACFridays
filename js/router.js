/**
 * router.js — hash routing.
 *
 * Hash-based so deep links and Back work on GitHub Pages with no server
 * config. Routes:
 *   (empty hash), #, #/  → Tonight  (rendered directly — no redirect, no
 *                                    location.replace, no hash rewrite; see
 *                                    resolve() below)
 *   #/tonight            → Tonight mode: picker / tonight's selection
 *   #/events              → Events list
 *   #/events/:slug         → Event detail
 *   #/games                → Games
 *   #/games/:slug           → Game detail
 *   #/rules                → Rules + full resource library
 *   anything else         → Not found (URL preserved, so Back still works)
 *
 * There is no Home route. The former Home view was archived, not deleted
 * (see archive/README.md) — nothing in this file imports or references it.
 */

import { eventsView } from './views/events.js';
import { eventDetailView } from './views/eventDetail.js';
import { gamesView } from './views/games.js';
import { gameDetailView } from './views/gameDetail.js';
import { rulesView } from './views/rules.js';
import { tonightView } from './views/tonight.js';
import { notFoundView } from './views/notFound.js';

const SITE_NAME = 'Age Manager Guide';

/** Parse `#/events/long-jump` → ['events', 'long-jump']. */
export function parseHash(hash) {
  return String(hash || '')
    .replace(/^#/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .split('/')
    .filter(Boolean)
    .map((part) => {
      // A malformed escape (e.g. "#/%") makes decodeURIComponent throw, which
      // would blank the page. Fall back to the raw segment; it just won't match
      // a route and will land on the not-found view.
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
}

/**
 * Resolve a hash to a rendered view.
 * @returns {{title:string, html:string, tab:string}}
 */
export function resolve(hash) {
  const parts = parseHash(hash);
  const [section, param] = parts;

  // Empty hash renders Tonight directly (tab: 'tonight') rather than
  // redirecting to #/tonight. A location.hash write here would risk a
  // hashchange racing firstRender and stealing focus on first load
  // (STYLEGUIDE rule 6), and would make resolve() no longer a pure function
  // of the hash. Two URLs rendering one view is harmless — aria-current is
  // driven by the returned `tab`, so exactly one tab highlights either way.
  if (parts.length === 0) return { ...tonightView(), tab: 'tonight' };

  if (section === 'events' && parts.length === 1) {
    return { ...eventsView(), tab: 'events' };
  }

  if (section === 'events' && parts.length === 2) {
    const view = eventDetailView(param);
    // Unknown slug falls through to Not found rather than a blank page.
    return view ? { ...view, tab: 'events' } : { ...notFoundView(hash), tab: 'events' };
  }

  if (section === 'games' && parts.length === 1) {
    return { ...gamesView(), tab: 'games' };
  }

  if (section === 'games' && parts.length === 2) {
    const view = gameDetailView(param);
    // Unknown slug falls through to Not found rather than a blank page —
    // same treatment as an unknown event slug above.
    return view ? { ...view, tab: 'games' } : { ...notFoundView(hash), tab: 'games' };
  }

  if (section === 'rules' && parts.length === 1) {
    return { ...rulesView(), tab: 'rules' };
  }

  if (section === 'tonight' && parts.length === 1) {
    return { ...tonightView(), tab: 'tonight' };
  }

  return { ...notFoundView(hash), tab: null };
}

/**
 * Start routing.
 *
 * @param {object} opts
 * @param {HTMLElement} opts.outlet   element the view HTML is written into
 * @param {NodeList}    opts.tabs     bottom-tab anchors carrying data-tab
 */
export function startRouter({ outlet, tabs }) {
  let firstRender = true;

  /** Resolve the current hash and paint it. No scrolling, no focus changes —
   *  callers decide what, if anything, should happen to focus. */
  function paint() {
    let view;
    try {
      view = resolve(window.location.hash);
    } catch (err) {
      // A bad content reference must not leave the coach staring at a blank
      // screen mid-session. Log loudly, show the fallback view.
      console.error('Failed to render route', window.location.hash, err);
      view = { ...notFoundView(window.location.hash), tab: null };
    }

    document.title = `${view.title} · ${SITE_NAME}`;
    outlet.innerHTML = view.html;

    // aria-current marks the active tab for assistive tech, and drives the
    // active styling (no separate class needed — one source of truth).
    tabs.forEach((tab) => {
      if (tab.dataset.tab === view.tab) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });

    return view;
  }

  /** Real navigation: hash changed (link click, Back/Forward, first load). */
  function render() {
    paint();

    if (firstRender) {
      // Don't steal focus on initial load — the user hasn't navigated yet.
      firstRender = false;
      return;
    }

    window.scrollTo(0, 0);

    // Move focus to the new page's <h1> so screen-reader and keyboard users
    // land at the top of the new content instead of being stranded.
    const heading = outlet.querySelector('#page-title');
    if (heading) heading.focus();
  }

  window.addEventListener('hashchange', render);

  /**
   * State-only re-render: the Tonight/Everything mode or the tonight
   * selection changed, but the route (hash) didn't. Unlike a real
   * navigation this must NOT jump scroll position or steal focus onto the
   * page heading — the user is mid-interaction with a control (the mode
   * switch, the picker form) and an unannounced context change would be
   * disorienting (WCAG 3.2.2). Repainting the outlet still destroys that
   * control's DOM node, so the caller in interactions.js is responsible for
   * re-focusing the equivalent element after this returns; this function
   * only repaints.
   */
  window.addEventListener('tonight:change', paint);

  render();
}
