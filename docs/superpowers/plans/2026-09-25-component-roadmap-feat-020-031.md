# Component roadmap — feat-020 to feat-031 (plan only, not implemented)

Base UI parity gap after feat-019. Each feat is an independent build following
`packages/svbase/AGENTS.md` (one feature at a time, verification required).
Build in numeric order — dependencies chain forward.

## Shared Definition of Done (every feat)

- [ ] Implementation under `packages/svbase/src/lib/primitives/<name>/` (`context.ts`,
      parts, `index.ts` barrel): runes-only, zero `any`, relative imports, compound
      parts via namespaces, `data-*` states, WAI-ARIA roles + keyboard model.
- [ ] Unit tests for pure logic + browser tests (real Chromium: interaction,
      keyboard, axe with the three harness-owned rules disabled) in
      `<name>.browser.test.ts` + `<name>.fixture.svelte`.
- [ ] Docs page `docs/src/routes/<route>/+page.svx` (lead, live demo, Anatomy,
      API reference, keyboard notes) + sidebar link in `+layout.svelte`.
- [ ] Root barrel export + `package.json` `exports` subpath (`types` + `svelte` +
      `default`).
- [ ] Gates from repo root: `check` 0/0, `test` all passing, `lint` 0, `format`
      clean, `build` OK, `prepack` + publint "All good!".
- [ ] Commit `feat: <name>`; mark the entry `done` with evidence in
      `feature_list.json`; append a tight `progress.md` entry.
- [ ] No new runtime dependencies (only `@floating-ui/dom` stands). No CSS in
      the library. Test-env rules from feat-019 stand: programmatic value sets never
      trip `minlength`; settle validation state before clicks under test; clear
      `node_modules/.vite` when behavior contradicts source.

## feat-020 — Combobox + autocomplete (`combobox`, `autocomplete`)

- Sources: Base UI `packages/react/src/combobox/`, `autocomplete/`, plus our
  `popover/` positioning and `field/` input integration.
- Parts: Root (filter text state), Input, Trigger (optional), Portal, Positioner,
  Popup/List, Item, Group, Empty. Modes: single-select listbox + free-text
  autocomplete with suggestion commit.
- Port decisions: reuse `FloatingPosition` + `trackOutsidePress`; filtering is
  consumer-provided (`filter` prop) with a default substring matcher; async
  item lists deferred (sync arrays v1); virtualization skipped.
- Tests: open/filter/commit keyboard flows (arrows, Enter, Escape, Tab),
  typeahead highlight, form value sync, axe.

## feat-021 — Context menu + menubar (`context-menu`, `menubar`)

- Sources: Base UI `packages/react/src/menu/` (shared engine), `menubar/`;
  our `dropdown-menu/` item registry, typeahead, submenu layering.
- Parts: context-menu Trigger (contextmenu event, anchor positioning at cursor),
  Menubar Root + Menu units with cross-menu arrow traversal.
- Port decisions: extract shared menu-content logic where duplication appears;
  no new positioning code (floating engine covers cursor anchoring via
  virtual-element reference — extend `FloatingPosition` if needed).
- Tests: right-click opens at point, menubar arrows move across menus,
  submenu parity with dropdown-menu, axe.

## feat-022 — Drawer / sheet (`drawer`)

- Sources: Base UI `packages/react/src/drawer/`; our `dialog/` controller.
- Parts: Root, Trigger, Portal, Overlay, Content (placement prop:
  left/right/top/bottom), Title, Description, Close.
- Port decisions: reuse dialog focus trap + scroll lock + Escape verbatim;
  swipe-to-dismiss deferred to a follow-up (touch gesture complexity);
  viewport-sized content via consumer CSS.
- Tests: open/linkage/focus, Escape+return, placement classes, axe.

## feat-023 — Navigation menu (`navigation-menu`)

- Sources: Base UI `packages/react/src/navigation-menu/`; our menu + popover
  positioning.
- Parts: Root, List, Item, Trigger, Content, Viewport, Link.
- Port decisions: hover-intent with open/close delays (tooltip timing reuse);
  viewport-positioned content; keyboard traverses triggers, Enter/Space opens,
  Escape closes; no scroll-viewport virtualization.
- Tests: hover intent timing, keyboard traversal, viewport linkage, axe.

## feat-024 — Avatar (`avatar`)

- Sources: Base UI `packages/react/src/avatar/`.
- Parts: Root, Image, Fallback. Image load/error state machine with fallback
  delay prop.
- Port decisions: native `<img>` with `onload`/`onerror`; no fetch logic;
  initials rendering is consumer content.
- Tests: fallback on error, image on load, delay prop, axe.

## feat-025 — Number field (`number-field`)

- Sources: Base UI `packages/react/src/number-field/`; our `field/` + `input/`.
- Parts: Root, Input, Increment, Decrement, ScrubArea (optional v1: include only
  if trivial, else defer).
- Port decisions: Field-integrated (name/required/disabled/validation via
  context); clamp + step + min/max with keyboard stepping; scrub-area deferred
  unless it falls out of the pointer work.
- Tests: stepping keys, clamp/round behavior, increment/decrement clicks, form
  sync, axe.

## feat-026 — OTP field (`otp-field`)

- Sources: Base UI `packages/react/src/otp-field/`; our `field/` integration.
- Parts: Root, Input (segmented, `length` prop).
- Port decisions: auto-advance, backspace navigation, paste-to-distribute
  (clipboard read on paste event, no permissions API); hidden-input form sync
  per segment or joined value (joined single hidden input).
- Tests: typing advance, backspace backtrack, paste distribution, form value,
  axe.

## feat-027 — Toggle group + checkbox group (`toggle-group`, `checkbox-group`)

- Sources: Base UI toggle-group + checkbox-group dirs; our `toggle/`,
  `checkbox/`, roving util.
- Parts: group Root (single/multiple value, roving focus), Item parts reusing
  Toggle/Checkbox visuals; checkbox-group "select all" with mixed state.
- Port decisions: reuse existing part components inside group context; group
  owns value + orientation + disabled; form sync via one hidden input per group.
- Tests: single/multiple selection, roving, select-all mixed, form values, axe.

## feat-028 — Toolbar (`toolbar`)

- Sources: Base UI `packages/react/src/toolbar/`; our roving util + toggle-group.
- Parts: Root, Group, Button, Link, Input (thin wrappers wiring roving +
  orientation).
- Port decisions: orientation-gated arrows, disabled skip, wrap; no composite
  abstraction (shared `nextRovingTarget` covers it, radio precedent).
- Tests: roving across mixed controls, orientation gating, disabled skip, axe.

## feat-029 — Preview card (`preview-card`)

- Sources: Base UI `packages/react/src/preview-card/`; our popover + tooltip.
- Parts: Root, Trigger, Portal, Positioner, Popup.
- Port decisions: hover open with delay + close delay (tooltip timing reuse),
  focus support, Escape/outside dismiss (popover machinery).
- Tests: hover timing, focus open, delayed close, axe.

## feat-030 — Meter (`meter`)

- Sources: Base UI `packages/react/src/meter/`; sibling to our `progress/`.
- Parts: Root, Indicator, Label, Value.
- Port decisions: `role="meter"`, min/max/value/low/high/optimum bands via
  `data-*` states; share value-formatting approach with progress.
- Tests: aria-valuenow contract, band states, axe.

## feat-031 — Direction provider (`direction-provider`)

- Sources: Base UI direction-provider; our roving util + `FloatingPosition`.
- Parts: DirectionProvider (ltr/rtl value) consumed by roving navigation and
  floating placement instead of per-component direction props.
- Port decisions: context-only part, no DOM output; migrate existing
  components' direction handling onto it; document per-component override path.
- Tests: unit (roving direction flip), browser (arrow keys mirrored under rtl),
  axe unaffected.

## Execution order

020 → 021 → 022 → 023 → 024 → 025 → 026 → 027 → 028 → 029 → 030 → 031.
Each feat commits independently; update `feature_list.json` status + evidence
and `progress.md` as it lands. Stop and ask when a Base UI behavior has no
clean Svelte mapping — do not invent APIs.
