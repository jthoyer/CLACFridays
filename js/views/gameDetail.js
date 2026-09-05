import { getGameItem, getResource, games } from '../content.js';
import { esc, articleLink, bulletList, pageHeader, pairsWithNote, resourceCard } from '../ui.js';

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
 * The "Pairs with" note (pairsWithNote(), js/ui.js) resolves the item's own
 * `eventSlugs` rather than the category's — a category can bundle games for
 * more than one event (e.g. "Jump Games"), so `category.name` in the kicker
 * above isn't specific enough on its own.
 *
 * "Watch & Learn" only renders when the item has one or more
 * `videoResources` — a game with none (Baton Down the Line, Freeze Tag)
 * gets no video section at all, which is deliberate (content.js's
 * assertContentLinkage() enforces every game item declares its linkage, so
 * "no video" here is provably "none exists", not "someone forgot"). Each
 * video is rendered via the existing resourceCard()/videoEmbed() helpers —
 * the same real youtube-nocookie embed used on event pages — so it is
 * embedded exactly once, only here.
 *
 * Within that section, each video renders under one of the two
 * `games.videoBlockCopy` variants, chosen per entry from the videoResource's
 * own `isGameFootage` flag — never from the game or its category, because a
 * single game can carry both kinds. Real footage of the game gets no
 * "not footage of this game" clarifier, since on those videos that sentence
 * would be false; the pinned event-technique clarifier (§7.7 / AC49) is
 * still rendered verbatim on every technique video.
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

  // One game can carry BOTH kinds of video at once — real footage of the game
  // itself and the official event-technique videos it rehearses — so this
  // partitions the list rather than picking one framing for the whole game.
  // Each group renders under its own heading and its own clarifier; a group is
  // never shown under the other variant's copy, which is precisely the false
  // statement the two variants in `games.videoBlockCopy` exist to prevent.
  //
  // Game footage leads, because "here is the game" is what a parent helper
  // came to the page for; the technique video is the follow-up. Games with
  // only technique videos are unaffected — they render exactly as before.
  const isGameFootage = (vr) => Boolean(vr && vr.isGameFootage);
  const videoGroups = [
    ['gameFootage', videoResources.filter(isGameFootage)],
    ['technique', videoResources.filter((vr) => !isGameFootage(vr))]
  ];

  // `clarifier` is null on the gameFootage variant, so the <p class="note">
  // is conditional rather than always-rendered — an empty note box would read
  // as a missing string, not as a deliberate absence.
  const videoBlock = ([variant, group]) => {
    if (!group.length) return '';
    const copy = games.videoBlockCopy[variant];
    return `
        <p class="section__kicker">${esc(copy.heading)}</p>
        ${copy.clarifier ? `<p class="note">${esc(copy.clarifier)}</p>` : ''}
        ${group
          .map((vr) => resourceCard(getResource(vr.key), { context: item.name, prefix: vr.prefix }))
          .join('')}`;
  };

  const watchLearnSection = videoResources.length
    ? `
      <section class="section section--spaced" aria-labelledby="watch-learn">
        <h2 class="section__title" id="watch-learn">Watch &amp; Learn</h2>
        ${videoGroups.map(videoBlock).join('')}
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

      ${pairsWithNote(item.eventSlugs, 'game__pairs')}
      ${item.gear ? `<p class="gear-pill">${esc(item.gear)}</p>` : ''}

      <section class="section section--spaced" aria-labelledby="what-to-do">
        <h2 class="section__title" id="what-to-do">What to do</h2>
        ${bulletList(item.bullets)}
        ${source}
      </section>

      ${watchLearnSection}`
  };
}
