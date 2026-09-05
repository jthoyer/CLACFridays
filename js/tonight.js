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

import { events, weeklyProgram, getProgramEventSlugs } from './content.js';

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
  // Saving from the picker is a hand-edit: it drops any program choice, so
  // the Events tab stops rendering a running order that no longer matches
  // this list. See clearProgramForManualEdit()'s banner at the end of this
  // file. Called before the writes below so the single notify() at the end
  // of this function covers both state changes.
  clearProgramForManualEdit();

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

  // A per-card toggle is a hand-edit too — same rule as setSelection() above.
  clearProgramForManualEdit();

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

/* ==================================================================== */
/* Weekly-program choice (Program A–F + age group)                      */
/*                                                                      */
/* The club publishes what every age group does on a given Friday       */
/* (content.js's `weeklyProgram`). Choosing a program + age group is a  */
/* second, DERIVED way to fill tonight's selection — two taps a week    */
/* instead of hand-ticking ten checkboxes — and it carries two facts    */
/* the hand-ticked list never could: the time each event runs, and the  */
/* field position it runs at.                                           */
/*                                                                      */
/* ONE RULE governs how the two ways coexist, and it is enforced in     */
/* exactly one place (clearProgramForManualEdit(), called from the two  */
/* manual write paths below): HAND-EDITING TONIGHT'S EVENTS TURNS THE   */
/* PROGRAM PICKER OFF. Save from the picker, or tap a per-card toggle,  */
/* and the program choice is dropped — the coach has taken over, so the */
/* Events tab goes back to rendering their list rather than a running   */
/* order that no longer matches it. Without that rule the two would     */
/* silently diverge: the Events tab would keep showing the club's six   */
/* blocks while Games and Rules filtered against an edited selection.   */
/*                                                                      */
/* The age group is persisted even when no program is chosen, so the    */
/* picker doesn't forget it between visits.                             */
/* ==================================================================== */

const PROGRAM_KEY = 'clac.program.v1';

/** Normalise an arbitrary value to a real program id, or null. */
function cleanProgramId(id) {
  return weeklyProgram.programs.some((p) => p.id === id) ? id : null;
}

/** Normalise an arbitrary value to a real age-group id, falling back to the
 *  guide's own age group rather than to nothing — an age is always set. */
function cleanAgeId(id) {
  return weeklyProgram.ageGroups.some((a) => a.id === id) ? id : weeklyProgram.defaultAgeId;
}

/**
 * Parse the persisted choice. Same defensive posture as
 * readSelectionFromStorage() above: corrupt JSON, an older schema, or ids
 * that no longer exist in content.js (a program renamed, an age group
 * dropped) must all degrade to "no program, default age", never throw.
 */
function readProgramFromStorage() {
  const raw = safeGet(PROGRAM_KEY);
  if (!raw) return { programId: null, ageId: weeklyProgram.defaultAgeId };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { programId: null, ageId: weeklyProgram.defaultAgeId };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { programId: null, ageId: weeklyProgram.defaultAgeId };
  }
  return {
    programId: cleanProgramId(parsed.programId),
    ageId: cleanAgeId(parsed.ageId)
  };
}

let programChoice = readProgramFromStorage();

function persistProgramChoice() {
  safeSet(PROGRAM_KEY, JSON.stringify(programChoice));
}

/**
 * The current program/age choice. `programId` is null when no program is
 * chosen (never chosen, explicitly cleared, or dropped by a manual edit);
 * `ageId` is always a valid age-group id. Returned as a fresh object so a
 * caller can't mutate the module's state by holding onto it.
 */
export function getProgramChoice() {
  return { programId: programChoice.programId, ageId: programChoice.ageId };
}

/** Is a program currently driving tonight's selection? */
export function hasProgramChoice() {
  return programChoice.programId != null;
}

/**
 * Choose a program and/or age group. Both arguments are normalised, so an
 * unknown id can never be persisted.
 *
 * Choosing a PROGRAM is a deliberate "this is tonight" gesture, so it does
 * what pressing Tonight on the mode switch does — sets and persists
 * explicitMode = 'tonight' — and replaces the selection with the events that
 * program runs for that age group. That includes replacing it with an EMPTY
 * list when the program's grid hasn't been transcribed yet (Programs B–F, see
 * weeklyProgram's PROVENANCE note): an empty night the views can explain is
 * better than silently leaving the previous program's events filtering the
 * Games and Rules tabs under a program name that never produced them.
 *
 * Clearing the program (programId null — the picker's "Not set" option)
 * deliberately does NOT touch the selection or the mode. The coach is opting
 * out of the derived list, not throwing away tonight's events; what's already
 * selected stays selected and becomes theirs to hand-edit.
 *
 * Notifies exactly once, at the end, however many pieces of state moved.
 */
export function setProgramChoice(programId, ageId) {
  programChoice = {
    programId: cleanProgramId(programId),
    ageId: cleanAgeId(ageId)
  };
  persistProgramChoice();

  if (programChoice.programId) {
    const slugs = cleanSlugs(
      getProgramEventSlugs(programChoice.programId, programChoice.ageId)
    );
    selection = slugs;
    safeSet(SELECTION_KEY, JSON.stringify(slugs));
    explicitMode = 'tonight';
    safeSet(MODE_KEY, 'tonight');
  }

  notify();
}

/**
 * Drop the program choice because the coach hand-edited tonight's events —
 * the ONE rule described in this section's banner. Keeps the age group (the
 * picker shouldn't forget it) and never notifies: both callers notify once
 * themselves, and a second event here would repaint the outlet twice and
 * destroy the element interactions.js is about to re-focus.
 */
function clearProgramForManualEdit() {
  if (programChoice.programId == null) return;
  programChoice = { programId: null, ageId: programChoice.ageId };
  persistProgramChoice();
}
