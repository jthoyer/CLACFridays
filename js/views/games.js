import { games, tonightCopy } from '../content.js';
import * as tonight from '../tonight.js';
import * as gamesFilter from '../gamesFilter.js';
import {
  categoryFilterPicker,
  esc,
  pageHeader,
  pairsWithNote,
  tonightEmptyState,
  tonightStatusStrip
} from '../ui.js';

/**
 * One game's list-page entry: a card whose name renders as a black strip —
 * white text reversed out of `--color-heading` (the app's darkest token,
 * effectively black; see the design-token banner at the top of tokens.css
 * on why this never hard-codes a raw hex) — over a lighter body band
 * holding the gear pill, one-sentence summary and "Pairs with" note, and
 * linking to the game's own detail page (js/views/gameDetail.js). Same
 * full-bleed-colour-section language as `.tonight-card` (js/views/tonight.js)
 * and `.fact-list` (js/ui.js's factList()) — a dark header band directly
 * over a lighter body band, clipped to the card's rounded corners by the
 * card's own `overflow: hidden`.
 *
 * A category can bundle games for more than one event (e.g. "Jump Games"
 * covers both Long Jump and High Jump — see content.js), so the category
 * heading alone doesn't say which event a given game pairs with;
 * `pairsWithNote()` (js/ui.js) adds that per item, resolved from the game's
 * own `eventSlugs` rather than the category's.
 */
function gameListItem(item) {
  return `
    <li>
      <a class="game-list__link" href="#/games/${esc(item.slug)}">
        <span class="game-list__strip">
          <span class="game-list__name">${esc(item.name)} <span aria-hidden="true">→</span></span>
        </span>
        <span class="game-list__body">
          ${item.gear ? `<span class="gear-pill">${esc(item.gear)}</span>` : ''}
          ${item.teachTime ? `<span class="estimate-pill">Teach: ${esc(item.teachTime)}</span>` : ''}
          ${item.minPlayers ? `<span class="estimate-pill">Players: ${esc(String(item.minPlayers))}</span>` : ''}
          <span class="game-list__summary">${esc(item.summary)}</span>
          ${pairsWithNote(item.eventSlugs, 'game-list__pairs')}
        </span>
      </a>
    </li>`;
}

/**
 * Category colour, cycled across the app's three non-neutral palette
 * families (accent purple / success green / warn amber — tokens.css has no
 * others) so each `.game-category-card` on the Games tab reads as its own
 * full-bleed colour section, the same visual language as the Tonight tab's
 * per-event `.tonight-card` (js/views/tonight.js) — a dark header band
 * (category name, reversed white text) directly over a lighter body band
 * holding that category's games.
 *
 * Keyed by each category's fixed position in `games.categories` (content.js),
 * NOT by its position in whatever subset is currently visible — Tonight-mode
 * filtering and the category filter below both shrink that subset, and a
 * category's colour must stay the same whether it's shown alongside six
 * others or alone, or the same category would visibly repaint a different
 * colour every time the filters change.
 */
const CATEGORY_COLORS = ['accent', 'success', 'warn'];
const CATEGORY_COLOR_BY_ID = new Map(
  games.categories.map((cat, i) => [cat.id, CATEGORY_COLORS[i % CATEGORY_COLORS.length]])
);
function categoryColor(id) {
  return CATEGORY_COLOR_BY_ID.get(id);
}

export function gamesView() {
  // No visible Tonight/Everything toggle on this tab (superseded by the
  // Program and Age Group picker on the Tonight tab, which drives the same
  // underlying selection) — filtering still runs off it, just with no
  // on-page control to flip it here. tonight.isFiltering() is unchanged.
  const isTonight = tonight.isFiltering();
  const choice = tonight.getProgramChoice();

  const tonightFilteredCategories = isTonight
    ? games.categories.filter(
        (cat) =>
          cat.alwaysShow ||
          (cat.eventSlugs || []).some((slug) => tonight.isTonightEvent(slug))
      )
    : games.categories;

  // A second, independent narrowing on top of Tonight-mode's: which ONE
  // category (or all of them) the coach has chosen to browse. Composed with
  // AND, not OR/replace — picking a category that isn't part of tonight's
  // program is a real, explainable empty state (see the "Show all
  // categories" recovery action below), not a filter that silently
  // overrides the other.
  const categoryFilterId = gamesFilter.getCategoryFilter();
  const visibleCategories = categoryFilterId
    ? tonightFilteredCategories.filter((cat) => cat.id === categoryFilterId)
    : tonightFilteredCategories;

  const categories = visibleCategories
    .map(
      (cat) => `
        <section
          class="section section--spaced game-category-card game-category-card--${categoryColor(cat.id)}"
          aria-labelledby="cat-${esc(cat.id)}">
          <div class="game-category-card__head">
            <h2 class="game-category-card__name" id="cat-${esc(cat.id)}">${esc(cat.name)}</h2>
            <p class="game-category-card__kicker">${esc(cat.kicker)}</p>
            ${cat.note ? `<p class="game-category-card__note">${esc(cat.note)}</p>` : ''}
          </div>
          <div class="game-category-card__body">
            <ul class="game-list">
              ${cat.items.map(gameListItem).join('')}
            </ul>
          </div>
        </section>`
    )
    .join('');

  // Two distinct empty states, not one generic one: a category filter that
  // excludes everything has an exact, always-correct fix (clear it), which
  // "no program/age selected yet" (the pre-existing Tonight-mode case below)
  // does not — that one's fix is picking events on the Tonight tab instead.
  let categoriesBlock;
  if (visibleCategories.length) {
    categoriesBlock = categories;
  } else if (categoryFilterId) {
    categoriesBlock = tonightEmptyState(
      'No games in this category match tonight’s selection yet.',
      '<button type="button" class="btn btn--primary" data-action="clear-game-category">Show all categories</button>'
    );
  } else {
    // The "Just for Fun" category has no event linkage and is always shown,
    // so this only fires when even that category was filtered out — i.e.
    // never in practice, but a real empty list must still read as
    // deliberate, not broken.
    categoriesBlock = tonightEmptyState('No games match tonight’s selection yet.');
  }

  return {
    title: 'Games',
    html: `
      ${pageHeader({
        title: games.heading
      })}

      ${tonightStatusStrip({ isFiltering: isTonight, choice, count: tonight.getSelection().length })}
      ${
        isTonight
          ? `<p class="note">${esc(tonightCopy.games.filteredNote)}</p>`
          : ''
      }
      <p class="note">${esc(games.estimateNote)}</p>

      ${categoryFilterPicker(categoryFilterId, games.categories)}

      ${categoriesBlock}`
  };
}
