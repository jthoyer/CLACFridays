/**
 * gamesFilter.js — the ONE place that owns the Games tab's category filter.
 *
 * Same shape as tonight.js: a module-singleton, seeded once from
 * localStorage at load, every read/write wrapped in try/catch (Safari
 * Private Mode, a full quota, or a locked-down embed can all throw on
 * storage access — none of that may propagate past this module), and a
 * `games:filterchange` event so the router can repaint without a real
 * navigation. Kept as its own module rather than folded into tonight.js
 * because it is a different concern — narrowing which of the Games tab's
 * own categories are visible, not which events are on tonight's program —
 * and tonight.js's file banner already claims ownership of Tonight-mode
 * storage specifically.
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
