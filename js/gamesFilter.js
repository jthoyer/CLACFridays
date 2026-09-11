/**
 * gamesFilter.js — the ONE place that owns the Games tab's category filter,
 * free-text search, and "starred only" toggle.
 *
 * Same shape as tonight.js: a module-singleton, every read/write wrapped in
 * try/catch (Safari Private Mode, a full quota, or a locked-down embed can
 * all throw on storage access — none of that may propagate past this
 * module), and a `games:filterchange` event so the router can repaint
 * without a real navigation. Kept as its own module rather than folded into
 * tonight.js because it is a different concern — narrowing which of the
 * Games tab's own categories/items are visible, not which events are on
 * tonight's program — and tonight.js's file banner already claims ownership
 * of Tonight-mode storage specifically. Also kept distinct from
 * favourites.js: that module owns WHICH games are starred (identity, shared
 * with the per-card toggle), this module only owns whether the Games tab is
 * currently narrowed to them (a view preference) — the two would tangle two
 * different concerns into one module if merged.
 *
 * The category filter and "starred only" toggle are both seeded from
 * localStorage (standing preferences — "just show me Throwing Games" or
 * "just show me my starred games" are both worth remembering across
 * visits). The search query deliberately is NOT persisted: it starts empty
 * on every load, same as any other site's search box — a leftover query
 * from last session silently narrowing tonight's list, with no visible
 * reminder beyond the box itself, would read as a bug ("where did all the
 * games go?"), not a saved preference.
 */

import { games } from './content.js';

const FILTER_KEY = 'clac.games.categoryFilter.v1';

const KNOWN_CATEGORY_IDS = new Set(games.categories.map((c) => c.id));

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** A stored or requested category id is only ever valid if it is still a
 *  real category — content.js could rename or drop one between sessions. */
function cleanCategoryId(id) {
  return typeof id === 'string' && KNOWN_CATEGORY_IDS.has(id) ? id : null;
}

let categoryFilter = cleanCategoryId(safeGet(FILTER_KEY));

function notify() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('games:filterchange'));
  }
}

/** The selected category id, or null for "All categories". */
export function getCategoryFilter() {
  return categoryFilter;
}

/** Choose a category to show alone, or pass null/'' to clear back to all. */
export function setCategoryFilter(id) {
  const clean = cleanCategoryId(id);
  categoryFilter = clean;
  if (clean) {
    safeSet(FILTER_KEY, clean);
  } else {
    // No safeRemove() wrapper exists yet elsewhere in the app; removeItem
    // needs the same try/catch guard as get/set for the same reasons.
    try {
      window.localStorage.removeItem(FILTER_KEY);
    } catch {
      // Best-effort — an in-memory clear still happened above.
    }
  }
  notify();
}

// In-memory only — see the file banner above for why this is never seeded
// from, or written to, localStorage.
let searchQuery = '';

/** The current free-text search query, or '' for "no search". */
export function getSearchQuery() {
  return searchQuery;
}

/** Narrow the Games tab to items matching this text, or pass '' to clear. */
export function setSearchQuery(value) {
  searchQuery = typeof value === 'string' ? value : '';
  notify();
}

const STARRED_ONLY_KEY = 'clac.games.starredOnly.v1';

let starredOnly = safeGet(STARRED_ONLY_KEY) === '1';

/** Whether the Games tab is currently narrowed to starred games only. */
export function getStarredOnly() {
  return starredOnly;
}

/** Flip the "starred only" toggle. Returns the new state. */
export function toggleStarredOnly() {
  starredOnly = !starredOnly;
  if (starredOnly) {
    safeSet(STARRED_ONLY_KEY, '1');
  } else {
    try {
      window.localStorage.removeItem(STARRED_ONLY_KEY);
    } catch {
      // Best-effort — an in-memory clear still happened above.
    }
  }
  notify();
  return starredOnly;
}
