/**
 * app.js — bootstrap. Wires the DOM shell in index.html to the router.
 * No build step: this is loaded directly as <script type="module">.
 */

import { startRouter } from './router.js';
import { bindInteractions } from './interactions.js';

const outlet = document.getElementById('view');
const tabs = document.querySelectorAll('[data-tab]');
const skipLink = document.querySelector('.skip-link');

if (!outlet) {
  throw new Error('app.js: missing #view outlet in index.html');
}

/**
 * The skip link points at #view for the no-JS/right-click case, but letting
 * the browser follow it would rewrite location.hash to "#view" and the router
 * would resolve that as an unknown route. Intercept it: focus the main
 * landmark directly and leave the route hash untouched.
 */
if (skipLink) {
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    outlet.focus();
  });
}

bindInteractions(outlet);
startRouter({ outlet, tabs });
