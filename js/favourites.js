/**
 * favourites.js — the ONE place that owns which games are favourited.
 *
 * Same module-singleton shape as tonight.js and gamesFilter.js: seeded once
 * from localStorage at load, every read/write wrapped in try/catch (Safari
 * Private Mode, a full quota, or a locked-down embed can all throw on
 * storage access — none of that may propagate past this module), and a
 * `games:favouritechange` event so the router can repaint without a real
 * navigation.
 *
 * Persisted — unlike gamesFilter.js's search query, a coach's favourited
 * games are a deliberate, durable shortlist worth remembering across visits,
 * the same reasoning that already justifies persisting the category filter.
 */

const FAVOURITES_KEY = 'clac.games.favourites.v1';

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

/** Parses the stored JSON array into a Set, tolerating anything malformed —
 *  corrupted or hand-edited storage must never throw past this module. */
function parseStored(raw) {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((slug) => typeof slug === 'string'))
      : new Set();
  } catch {
    return new Set();
  }
}

let favourites = parseStored(safeGet(FAVOURITES_KEY));

function persist() {
  safeSet(FAVOURITES_KEY, JSON.stringify(Array.from(favourites)));
}

function notify() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('games:favouritechange'));
  }
}

/** Whether this game slug is currently in the coach's favourites. */
export function isFavourite(slug) {
  return favourites.has(slug);
}

/** Flip one game's favourited state. Returns the new state. */
export function toggleFavourite(slug) {
  if (favourites.has(slug)) {
    favourites.delete(slug);
  } else {
    favourites.add(slug);
  }
  persist();
  notify();
  return favourites.has(slug);
}
