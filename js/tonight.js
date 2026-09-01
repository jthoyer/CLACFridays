/**
 * tonight.js — the ONE place that touches localStorage and owns the
 * Tonight/Everything mode flag.
 *
 * Views never call localStorage directly; they call this module's API. That
 * keeps the storage schema, its versioning and its failure handling in one
 * place instead of scattered across views/interactions.js.
 *
 * Storage keys are namespaced and versioned (`.v1`) so a future format change
 * can migrate or discard old data deliberately instead of guessing.
 *
 * Every read/write is wrapped in try/catch. Safari Private Mode throws on
 * setItem, a full quota throws on setItem, and in some embedded/locked-down
 * contexts even the `localStorage` getter itself can throw. None of that may
 * propagate past this module — a storage failure degrades to in-memory state
 * only, it must never break the app. This is used pitch-side on a phone.
 */

import { events } from './content.js';

const SELECTION_KEY = 'clac.tonight.v1';
const MODE_KEY = 'clac.tonight.mode.v1';

const KNOWN_SLUGS = new Set(events.map((e) => e.slug));

/** Best-effort localStorage.getItem — never throws. */
function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Best-effort localStorage.setItem — never throws. Returns success bool. */
function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse the persisted selection. The stored value may be corrupt (not JSON),
 * from an older schema (not an array), or contain slugs that no longer exist
 * (an event was renamed/removed since it was saved). Any of that must
 * degrade to "no selection" rather than throwing past this module.
 */
function readSelectionFromStorage() {
  const raw = safeGet(SELECTION_KEY);
  if (!raw) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return [...new Set(parsed.filter((s) => typeof s === 'string' && KNOWN_SLUGS.has(s)))];
}

function readModeFromStorage() {
  const raw = safeGet(MODE_KEY);
  return raw === 'tonight' || raw === 'everything' ? raw : null;
}

// In-memory cache, seeded once from storage at module load (module singleton
// — this survives router re-renders, which only replace #view's children).
let selection = readSelectionFromStorage();
let explicitMode = readModeFromStorage();

/** Tell anything listening (the router) that state changed and a re-render is due. */
function notify() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('tonight:change'));
  }
}

/** Current selection, as a fresh array (never the live internal reference). */
export function getSelection() {
  return selection.slice();
}

/** Whether any events have been picked for tonight. */
export function hasSelection() {
  return selection.length > 0;
}

/** Is this event slug part of tonight's selection? */
export function isTonightEvent(slug) {
  return selection.includes(slug);
}

/**
 * Shared slug-validation path for every write to `selection` — filters to
 * known, unique string slugs. `setSelection()` and `toggleTonightEvent()`
 * both call this rather than each re-deriving their own filter, so a future
 * change to what counts as a valid slug can't accidentally diverge between
 * the two write paths.
 */
function cleanSlugs(slugs) {
  return Array.isArray(slugs)
    ? [...new Set(slugs.filter((s) => typeof s === 'string' && KNOWN_SLUGS.has(s)))]
    : [];
}

/**
 * Replace the selection. Unknown/invalid slugs are dropped silently (this is
 * the trusted write path — content.js's own guard already caught any typo in
 * a *content* slug; a stray value here would only come from a tampered
 * localStorage blob or a picker bug, and either way the safe behaviour is to
 * drop it, not crash the page).
 *
 * Saving a NON-EMPTY selection is itself an implicit "I want Tonight" and is
 * treated exactly like pressing the Tonight button on the mode switch: it
 * sets and persists explicitMode = 'tonight', overriding any earlier
 * explicit choice (including a prior "Everything" press) the same way a real
 * switch press would. Without this, an earlier "Everything" tap would keep
 * winning forever and a saved selection would silently do nothing (the
 * coach picks events, taps Save, and nothing on Events/Games/Rules changes).
 *
 * Saving an EMPTY selection deliberately does NOT touch explicitMode. Once
 * Tonight mode has been entered (explicitly or via this implicit path), it
 * stays until the coach explicitly flips the switch back to Everything —
 * emptying the selection shows an empty state within Tonight mode rather
 * than silently kicking the coach back out to Everything. If no explicit
 * choice has ever been made, the derived default in getMode() still applies:
 * Everything, since hasSelection() is now false.
 */
export function setSelection(slugs) {
  const clean = cleanSlugs(slugs);
  selection = clean;
  safeSet(SELECTION_KEY, JSON.stringify(clean));
  if (clean.length > 0) {
    explicitMode = 'tonight';
    safeSet(MODE_KEY, 'tonight');
  }
  notify();
}

/**
 * Add or remove ONE event slug from tonight's selection — the per-card
 * Tonight toggle on the Events list (js/views/events.js). A different
 * gesture from setSelection()'s "I have finished choosing": Save is a
 * deliberate, one-shot commit from inside the picker, so it's allowed to
 * carry the side effect of switching the coach into Tonight mode (see
 * setSelection()'s doc comment above). A per-card toggle is a quick
 * "add/remove this one thing" tap from *within* whichever mode the coach
 * already has the page in — often Everything, while browsing the full list.
 *
 * This function deliberately does NOT force explicitMode = 'tonight' the way
 * setSelection() does. Forcing it here would silently collapse a visible
 * 10-item list down to 1 as a side effect of pressing an in-card control —
 * an unannounced change of context the coach never asked for (WCAG 3.2.2 On
 * Input). Instead, mode is PINNED: read with getMode() *before* the
 * selection mutates, then written back explicitly (both in memory and to
 * storage) after it does, so the mode is provably identical immediately
 * before and immediately after every call.
 *
 * Pinning — not merely "leaving explicitMode alone" — matters because of
 * getMode()'s *derived* default: when no explicit mode choice has ever been
 * made, it returns 'tonight' the instant hasSelection() becomes true. A
 * coach's very first-ever toggle (explicitMode still null) would flip that
 * derived default to Tonight the moment this function adds the first slug,
 * causing the exact same unannounced collapse this function exists to
 * prevent — even though no code path here ever calls setMode(). Persisting
 * the pinned value as an explicit choice closes that gap for good: once
 * pinned, the mode no longer depends on hasSelection() at all.
 *
 * Slug validation reuses cleanSlugs() — the same internal path setSelection()
 * uses — not a second copy. Calls notify() exactly once.
 */
export function toggleTonightEvent(slug) {
  const modeBeforeMutation = getMode();

  const next = selection.includes(slug)
    ? selection.filter((s) => s !== slug)
    : cleanSlugs([...selection, slug]);

  selection = next;
  safeSet(SELECTION_KEY, JSON.stringify(next));

  explicitMode = modeBeforeMutation;
  safeSet(MODE_KEY, modeBeforeMutation);

  notify();
}

/**
 * Current mode: 'tonight' | 'everything'.
 *
 * If the coach has ever explicitly chosen a mode (via the switch, or via
 * saving a non-empty selection — see setSelection()), that choice persists
 * and always wins — flipping to Everything and back must not lose anything,
 * and re-visiting later must not silently reset their choice. Only when no
 * explicit choice has ever been made do we derive a default: Tonight mode if
 * a selection exists, Everything if nothing has been picked. This is what
 * makes "save a first selection" land the coach straight in a filtered view
 * without a second, redundant tap, on a completely fresh install.
 */
export function getMode() {
  if (explicitMode === 'tonight' || explicitMode === 'everything') {
    return explicitMode;
  }
  return hasSelection() ? 'tonight' : 'everything';
}

/** Explicitly set and persist the mode. */
export function setMode(mode) {
  if (mode !== 'tonight' && mode !== 'everything') return;
  explicitMode = mode;
  safeSet(MODE_KEY, mode);
  notify();
}

/**
 * Is Tonight-mode filtering actually in effect? True only when the coach is
 * in Tonight mode AND has something selected — mode === 'tonight' with an
 * empty selection must not flag a page's content as "not tonight's", since
 * nothing has been chosen to filter against. The single home for this
 * predicate; events.js, games.js, rules.js and eventDetail.js all call this
 * instead of re-deriving it (eventDetail.js additionally checks the specific
 * event isn't in the selection).
 */
export function isFiltering() {
  return getMode() === 'tonight' && hasSelection();
}
