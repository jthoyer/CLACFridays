import { getGameItem, getResource, games } from '../content.js';
import { esc, articleLink, bulletList, pageHeader, resourceCard } from '../ui.js';

/**
 * One game's own page — introduced by the Games-tab redesign so a game's
 * full instructions and any technique video no longer have to live inline
 * on the Games list (see js/views/games.js's gameListItem()).
 *
 * The <h1> is deliberately --color-accent (via pageHeader's `titleAccent`),
 * not the default --color-heading navy every other view uses — an explicit
 * product decision, not an oversight; see STYLEGUIDE.md.
 *
 * "What to do" reuses bulletList() (js/ui.js) for `item.bullets` rather than
 * inventing new list markup, per the "grep ui.js first" rule.
 *
 * "Watch & Learn" only renders when the item has one or more
 * `videoResources` — a game with none (Baton Down the Line, Freeze Tag)
 * gets no video section at all, which is deliberate (content.js's
 * assertContentLinkage() enforces every game item declares its linkage, so
 * "no video" here is provably "none exists", not "someone forgot"). Each
 * video is rendered via the existing resourceCard()/videoEmbed() helpers —
 * the same real youtube-nocookie embed used on event pages — so it is
 * embedded exactly once, only here.
 */
export function gameDetailView(slug) {
  const found = getGameItem(slug);
  if (!found) return null;
  const { item, category } = found;

  const source = item.resource
    ? (() => {
        const r = getResource(item.resource);
        return `
          <p class="game__source">
            ${item.sourcePrefix ? esc(item.sourcePrefix) + ' ' : ''}<em>${esc(r.title)}</em>
          </p>
          ${articleLink(r, 'Open the source game')}`;
      })()
    : '';

  const videoResources = Array.isArray(item.videoResources) ? item.videoResources : [];
  const watchLearnSection = videoResources.length
    ? `
      <section class="section section--spaced" aria-labelledby="watch-learn">
        <h2 class="section__title" id="watch-learn">Watch &amp; Learn</h2>
        <p class="section__kicker">${esc(games.videoBlockCopy.heading)}</p>
        <p class="note">${esc(games.videoBlockCopy.clarifier)}</p>
        ${videoResources
          .map((vr) => resourceCard(getResource(vr.key), { context: item.name, prefix: vr.prefix }))
          .join('')}
      </section>`
    : '';

  return {
    title: item.name,
    html: `
      <a class="back-link" href="#/games">
        <span class="back-link__chev" aria-hidden="true">←</span>
        <span>All games</span>
      </a>

      ${pageHeader({
        kicker: category.name,
        title: item.name,
        lead: item.summary,
        titleAccent: true
      })}

      <section class="section section--spaced" aria-labelledby="what-to-do">
        <h2 class="section__title" id="what-to-do">What to do</h2>
        ${bulletList(item.bullets)}
        ${source}
      </section>

      ${watchLearnSection}`
  };
}
