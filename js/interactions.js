/**
 * interactions.js — the ONE place that binds interactive behaviour for
 * Tonight mode (mode switch, picker open/close/save).
 *
 * The router replaces `outlet.innerHTML` on every render, which destroys any
 * listener attached to an element inside it. Rather than re-attaching
 * listeners inside each view function (easy to forget, silently drops on the
 * next route change), every listener here is bound ONCE, on `outlet` itself
 * — which the router never replaces, only its children — and dispatches by
 * inspecting `event.target` for `data-action` attributes.
 */

import * as tonight from './tonight.js';
import * as gamesFilter from './gamesFilter.js';
import { tonightCopy, weeklyProgram, getRunningOrder, games } from './content.js';
import { openPicker, closePicker, pickerSaved } from './views/tonight.js';

/** Force a repaint of the current route without navigating (no hash change). */
function repaint() {
  window.dispatchEvent(new CustomEvent('tonight:change'));
}

/** Screen-reader announcement, written to the live region in index.html
 *  (`#tonight-status`, outside #view so the router's repaint never destroys
 *  it — see index.html). A live region only reliably announces on a DOM
 *  *mutation* after it is already in the accessibility tree, so the text is
 *  cleared and re-set on the next tick rather than set once. */
function announce(message) {
  const el = document.getElementById('tonight-status');
  if (!el) return;
  el.textContent = '';
  window.setTimeout(() => {
    el.textContent = message;
  }, 30);
}

function focusHeading() {
  const heading = document.getElementById('page-title');
  if (heading) heading.focus();
  window.scrollTo(0, 0);
}

function focusPickerLegend() {
  const legend = document.getElementById('picker-legend');
  if (legend) legend.focus();
}

function focusById(id, fallback = focusHeading) {
  const el = document.getElementById(id);
  if (el) {
    // preventScroll: true — this is a state-only repaint (mode switch,
    // per-card toggle), not a real navigation, so refocusing must never
    // jump the viewport (AC31). focusHeading()'s explicit window.scrollTo
    // is the one deliberate exception, for real navigations only.
    el.focus({ preventScroll: true });
  } else {
    fallback();
  }
}

function handleClick(event) {
  const modeBtn = event.target.closest('[data-action="set-mode"]');
  if (modeBtn) {
    const mode = modeBtn.dataset.mode;
    const focusId = modeBtn.id;
    tonight.setMode(mode); // synchronously repaints via the router's listener
    // Keep the coach's place: re-focus the equivalent button in the freshly
    // painted DOM rather than letting focus fall back to <body> (WCAG 2.4.3).
    focusById(focusId, () => {});
    return;
  }

  const openBtn = event.target.closest('[data-action="open-picker"]');
  if (openBtn) {
    openPicker();
    repaint();
    focusPickerLegend();
    return;
  }

  // Cancel (editing an existing selection) and Skip (first-run, nothing
  // saved yet) are the same action with a conditional label only — both
  // discard the in-progress form and return focus to the same place. See
  // views/tonight.js's picker__actions button for the label logic.
  const dismissBtn = event.target.closest('[data-action="dismiss-picker"]');
  if (dismissBtn) {
    closePicker();
    repaint();
    focusById('open-picker-btn');
    return;
  }

  // Games tab category filter's "Show all categories" recovery action
  // (js/views/games.js's empty-state block) — the always-correct fix when a
  // chosen category renders nothing, whatever the reason.
  const clearCategoryBtn = event.target.closest('[data-action="clear-game-category"]');
  if (clearCategoryBtn) {
    gamesFilter.setCategoryFilter(null); // synchronously repaints via the router's listener
    focusById('game-category-select');
    announce('Showing all categories.');
    return;
  }

  // Per-card Tonight toggle (Events list). See tonight.js's
  // toggleTonightEvent() for why this deliberately never calls setMode() —
  // mode is pinned to whatever it already was, so this control can never
  // silently re-filter the page the coach is looking at (AC28).
  const toggleBtn = event.target.closest('[data-action="toggle-tonight"]');
  if (toggleBtn) {
    const slug = toggleBtn.dataset.slug;
    const name = toggleBtn.dataset.eventName;
    const toggleId = toggleBtn.id;
    const wasSelected = tonight.isTonightEvent(slug);

    tonight.toggleTonightEvent(slug); // synchronously repaints via the router's listener

    // AC31 focus fallback chain — never scrolls (this is a state-only
    // re-render, not a real navigation; see router.js's "Two render paths").
    // 1. The same toggle button, re-found by its stable slug-derived id, in
    //    the freshly painted DOM.
    // 2. If Tonight-mode filtering just removed that event's card entirely,
    //    the top mode switch's Tonight button.
    // 3. The page heading, if even that isn't present.
    // Never falls all the way through to <body> — the last link in the
    // chain is a no-op only reachable if #page-title itself is missing,
    // which no view allows.
    focusById(toggleId, () =>
      focusById('mode-switch-tonight', () => focusById('page-title', () => {}))
    );

    announce(
      wasSelected
        ? tonightCopy.events.toggleOffAnnouncement(name, tonight.getSelection().length)
        : tonightCopy.events.toggleOnAnnouncement(name, tonight.getSelection().length)
    );
    return;
  }
}

/**
 * Weekly-program picker (`programPicker()` in ui.js) — the Program and Age
 * group <select>s at the top of the Events tab. One handler for both,
 * dispatched by `data-action` exactly like every click above; bound on the
 * outlet in bindInteractions() so it survives the router's repaints.
 *
 * Each select carries only ITS OWN half of the choice, so the other half is
 * read back from tonight.js rather than from a second DOM node — the two
 * controls never have to agree about who holds the state.
 *
 * Changing a select rewrites the whole list beneath it. That is a
 * substantial change of context, and WCAG 3.2.2 (On Input) allows it only
 * because it is the control's advertised purpose: the labels name it, the
 * hint under the picker spells it out, and it is announced through the same
 * live region every other Tonight-mode change uses. Focus is returned to the
 * select the coach just used (never scrolled — this is a state-only
 * repaint, see router.js's "Two render paths"), so they are not thrown to
 * the top of a page that just changed under them.
 */
function handleProgramChange(select) {
  const choice = tonight.getProgramChoice();
  const isProgram = select.dataset.action === 'set-program';
  // An empty value is the picker's explicit "Not set" option, which
  // setProgramChoice() normalises to null (no program).
  const programId = isProgram ? select.value || null : choice.programId;
  const ageId = isProgram ? choice.ageId : select.value;
  const focusId = select.id;

  tonight.setProgramChoice(programId, ageId); // synchronously repaints

  focusById(focusId, () => focusById('page-title', () => {}));

  const next = tonight.getProgramChoice();
  if (next.programId == null) {
    announce(weeklyProgram.copy.clearedAnnouncement);
    return;
  }

  const order = getRunningOrder(next.programId, next.ageId);
  const programName = order.program ? order.program.name : '';
  const ageName = order.ageGroup ? order.ageGroup.name : '';
  announce(
    order.status === 'ok'
      ? weeklyProgram.copy.changedAnnouncement(programName, ageName, order.blocks.length)
      : weeklyProgram.copy.unavailableAnnouncement(programName, ageName)
  );
}

/**
 * Games tab category filter — a single <select> (js/ui.js's
 * categoryFilterPicker()). Same "focus stays on the control that changed"
 * treatment as handleProgramChange() below, and the same live-region
 * announcement pattern the rest of this file uses (see handleSubmit()'s
 * plain inline strings — no content.js copy exists for this yet either).
 */
function handleGameCategoryChange(select) {
  const focusId = select.id;
  const category = games.categories.find((c) => c.id === select.value);

  gamesFilter.setCategoryFilter(select.value || null); // synchronously repaints

  focusById(focusId, () => focusById('page-title', () => {}));
  announce(category ? `Showing ${category.name} only.` : 'Showing all categories.');
}

function handleChange(event) {
  const programSelect = event.target.closest(
    '[data-action="set-program"], [data-action="set-age"]'
  );
  if (programSelect) {
    handleProgramChange(programSelect);
    return;
  }

  const categorySelect = event.target.closest('[data-action="set-game-category"]');
  if (categorySelect) handleGameCategoryChange(categorySelect);
}

function handleSubmit(event) {
  const form = event.target.closest('[data-tonight-picker]');
  if (!form) return;
  event.preventDefault();

  const checked = Array.from(
    form.querySelectorAll('input[type="checkbox"]:checked')
  ).map((input) => input.value);

  // Close the picker BEFORE writing the selection: setSelection() notifies
  // synchronously, and the resulting repaint must already see pickerOpen
  // false so it paints the summary, not the form it was just submitted from.
  pickerSaved();
  tonight.setSelection(checked);

  focusHeading();
  announce(
    checked.length === 0
      ? 'No events selected for tonight.'
      : `${checked.length} event${checked.length === 1 ? '' : 's'} selected for tonight.`
  );
}

/**
 * @param {HTMLElement} outlet the router's stable outlet element
 */
export function bindInteractions(outlet) {
  outlet.addEventListener('click', handleClick);
  outlet.addEventListener('submit', handleSubmit);
  // 'change', not 'input': a native <select> fires both, and acting on
  // 'input' would repaint the outlet mid-interaction on platforms that fire
  // it while the picker is still open.
  outlet.addEventListener('change', handleChange);
}
