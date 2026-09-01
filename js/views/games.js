import { games, tonightCopy } from '../content.js';
import * as tonight from '../tonight.js';
import { esc, modeSwitch, pageHeader, tonightEmptyState } from '../ui.js';

/**
 * One game's list-page entry: a disclosure-style link (accent-coloured name
 * ending in a trailing →, the same reading-as-a-link pattern the Events
 * list's .event-row__name uses) plus its one-sentence summary, linking to
 * the game's own detail page
 * (js/views/gameDetail.js). Replaces the old full-card body (description +
 * inline video) that used to render here via gameItem() — the list page no
 * longer inlines any video embed; every game's video, if it has one, lives
 * on its own detail page now (see gameDetail.js).
 */
function gameListItem(item) {
  return `
    <li>
      <a class="game-list__link" href="#/games/${esc(item.slug)}">
        <span class="game-list__name">${esc(item.name)} <span aria-hidden="true">→</span></span>
        ${item.gear ? `<span class="gear-pill">${esc(item.gear)}</span>` : ''}
        <span class="game-list__summary">${esc(item.summary)}</span>
      </a>
    </li>`;
}

export function gamesView() {
  const mode = tonight.getMode();
  const isTonight = tonight.isFiltering();

  const visibleCategories = isTonight
    ? games.categories.filter(
        (cat) =>
          cat.alwaysShow ||
          (cat.eventSlugs || []).some((slug) => tonight.isTonightEvent(slug))
      )
    : games.categories;

  const categories = visibleCategories
    .map(
      (cat) => `
        <section class="section section--spaced" aria-labelledby="cat-${esc(cat.id)}">
          <div class="section__head">
            <h2 class="section__title" id="cat-${esc(cat.id)}">${esc(cat.name)}</h2>
            <p class="section__kicker">${esc(cat.kicker)}</p>
          </div>
          <ul class="game-list">
            ${cat.items.map(gameListItem).join('')}
          </ul>
        </section>`
    )
    .join('');

  // The "Just for Fun" category has no event linkage and is always shown, so
  // this only fires when even that category was filtered out — i.e. never in
  // practice, but a real empty list must still read as deliberate, not broken.
  const categoriesBlock = visibleCategories.length
    ? categories
    : tonightEmptyState('No games match tonight’s selection yet.');

  return {
    title: 'Games',
    html: `
      ${pageHeader({
        kicker: 'Under 10 Boys',
        title: games.heading
      })}

      ${modeSwitch(mode)}
      ${
        isTonight
          ? `<p class="note">${esc(tonightCopy.games.filteredNote)}</p>`
          : ''
      }

      ${categoriesBlock}`
  };
}
