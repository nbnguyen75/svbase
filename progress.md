# svbase Development Progress Log

## Status Overview

- **Active Goal**: Porting headless accessible primitives (inspired by Base UI) to Svelte 5 runes.
- **Current Milestone**: Harness setup and `.gemini` -> `.agents` migration complete.
- **Next Primitive to Implement**: `feat-002` (Core Primitive Utilities & Actions: context helpers, ID generator, Portal, event composition).

---

## Session History

### 2026-09-22: Project Setup & Agent Harness Migration (feat-001)

- [x] **Migrated old `.gemini` folder**: Removed legacy `.gemini` folder from `sv create`; created modern `.agents/` workspace directory with `rules/`, `skills/`, and `agents/`.
- [x] **Configured Svelte 5 MCP & Skills**: Preserved `svelte-core-bestpractices` and `svelte-code-writer` in `.agents/skills/`; migrated `svelte-file-editor.md` to `.agents/agents/`.
- [x] **Ported high-value skills & rules from Synapse**:
  - Skills: `modern-javascript-patterns`, `typescript-advanced-types`, `better-ui`, `code-review-and-quality`, `codebase-design`, `diagnosing-bugs`, `frontend-design`, `improve`, `refactor`, `research`, `writing-for-agents`.
  - Rules: `typescript.md`, `ponytail.md`, `phase-gate.md`, `improve.md`, and new `primitives-architecture.md` (Base UI port guidelines).
- [x] **Harness Verification Subsystem**: Created `init.sh` and `init.ps1` verifying `bun install`, `bun run check`, `bun run lint`, and `bun run prepack`.
- [x] **Prettier & Linter Configuration**: Fixed `.prettierignore` to exclude agent/AI tooling directories.
- [x] **Verification**: All commands pass cleanly with 0 errors and 0 warnings.

---

## Session History

### 2026-09-23: Core Primitive Utilities & Actions (feat-002)

- [x] **Analyzed Base UI reference** (`D:\Personal\Project\base-ui`): `generateId`, `useId`, `mergeProps` event semantics, `FloatingPortalLite`, dismiss-on-escape/outside-press. Marked React-only patterns (`useForkRef`, `useEventCallback`, `preventBaseUIHandler`) as skip; Svelte uses `defaultPrevented` + `{@attach}` instead.
- [x] **Implemented `src/lib/internal/`** (5 files, zero runtime deps):
  - `context.ts` — `createPrimitiveContext(name)` wrapping Svelte `createContext` with named missing-provider error.
  - `id.ts` — `generateId(prefix)` (counter + random suffix, mirrors Base UI) and `createId(prefix, idOverride)` (Svelte `useId` equivalent).
  - `compose-handlers.ts` — `composeHandlers(...handlers)` running in order, short-circuiting on `event.defaultPrevented`.
  - `actions.ts` — `clickOutside` / `escapeKey` `{@attach}` factories listening on `document` (capture pointerdown, keydown).
  - `Portal.svelte` — teleports `children` snippet to `target` (default `document.body`) with comment-marker restore; `disabled` renders in place.
- [x] **Public API**: barrel `src/lib/internal/index.ts`, re-exported from `src/lib/index.ts`.
- [x] **Demo page** (`src/routes/+page.svelte`): Portal toggle, clickOutside/escapeKey dismissal box, composeHandlers order log, generateId keyed list.
- [x] **Verification**: `check` 0/0, `format` clean, `lint` exit 0, `prepack` builds dist + `publint All good!`. Runtime smoke test: 500 unique ids, override passthrough, handler order + cancel chain, context throws with primitive name.
- [ ] **Known quirk (follow-up)**: root `tsconfig.json` uses `moduleResolution: NodeNext`, so bare `$lib` directory imports fail typecheck in routes — demo page imports `$lib/index.js`. Consider aligning tsconfig with SvelteKit `bundler` default or adding `svelte.config.js` (repo currently has none).

### 2026-09-23 (follow-up): Minimal `mergeProps` (feat-002 addon)

- [x] **Added `src/lib/internal/merge-props.ts`** — Svelte-native port of Base UI's `mergeProps`: later sources win; `class` strings concatenate (later first, Base UI order); `style` objects shallow-merge / strings join with `;`; `on*` function props chain via `composeHandlers` (newest first, `preventDefault` cancels); `undefined` never overwrites; non-string `class`/`style` and non-`on` function props fall back to overwrite. Deliberately omitted: `preventBaseUIHandler`, props-getter overloads, `ref` handling.
- [x] **Type-level catch fixed**: initial `T extends Record<string, unknown>` constraint rejected interfaces (the mandated props style) — relaxed to `T extends object` with `Object.entries` typed as `Array<[string, unknown]>`, zero `any`.
- [x] **Demo page**: merged button showing merged `class` (`consumer internal`) and chained call order.
- [x] **Verification**: `check` 0/0, `format` clean, `lint` exit 0 (no warnings), `prepack` + publint pass. Runtime smoke: overwrite, class/style merges, undefined-skip, falsy-source skip, handler order + cancel chain, interface-typed call.

### 2026-09-23: Button & Toggle Primitives (feat-003)

- [x] **Analyzed Base UI** `Button.tsx`, `Toggle.tsx`, `useButton.ts`: `useButton` keyboard/click suppression, `aria-pressed` + `data-pressed`/`data-disabled`, controlled `pressed` + `onPressedChange` veto. Skipped React-only: `forwardRef` merging, `useStableCallback`, render-prop/`useRenderElement`, composite/toolbar/group contexts (no such feats in roadmap).
- [x] **Implemented `src/lib/button/Button.svelte`**: native `<button>` default; `element` prop delegates tag via `<svelte:element>` (non-`button` gets `role="button"`, `tabindex`, Enter-keydown/Space-keyup activation); `disabled` attr vs `aria-disabled` + `focusableWhenDisabled`; `type="button"` default; `ref = $bindable()` element delegation; `data-disabled`; consumer-first handler composition with disabled guard first (veto via `preventDefault`).
- [x] **Implemented `src/lib/toggle/Toggle.svelte`** on top of Button (reuse over duplication): `pressed = $bindable(defaultPressed)` (Svelte-native controlled/uncontrolled), `onPressedChange` notification, `aria-pressed` + `data-pressed`, forced `type="button"`, consumer-click-first flip (veto via `preventDefault`, replacing Base UI's cancelable details). Group `value` skipped — no toggle-group feat exists.
- [x] **Typing note**: Svelte `EventHandler` uses contravariant `currentTarget` narrowing, so internal handlers adopt the exact `Parameters<NonNullable<Props['onclick']>>[0]` signatures — zero casts, check-clean. `<svelte:element>` rejects `type`/`disabled` as explicit attrs; they travel via a derived `{...nativeAttrs}` spread.
- [x] **Verification**: `check` 0/0, `format` clean, `lint` exit 0 (interface member order per `sort-interfaces`), `prepack` + publint pass, autofixer clean on both. SSR-render functional test (10 assertions: types, disabled/focusable states, div delegation + tabindex, aria-pressed/data-pressed) — all passed; scaffold removed afterwards.
- [x] **Demo page**: Button (click count, disabled, focusable-disabled, div-as-button) + Toggle (uncontrolled with change log, `bind:pressed` controlled, disabled) sections.

### 2026-09-23: Chore — lint tooling (human-authored, committed as `ab7f5fc`)

- Staged changes found in tree (not authored this session): `perfectionist/sort-named-imports|exports|enums` rules, named-import sorting, `lint:fix` extended with `eslint src --fix`. Verified green, committed as-is. (An earlier stray edit commenting out `sort-interfaces` was reverted in favor of complying via member reordering.)

### 2026-09-23: Checkbox & Switch Primitives (feat-004)

- [x] **Analyzed Base UI** `CheckboxRoot` (522 lines), `CheckboxIndicator`, `SwitchRoot`, `SwitchThumb`: span+hidden-input architecture, `aria-checked="mixed"`, Enter-does-not-toggle (form submit instead), label/input change path, `uncheckedValue` hidden input, context-shared state. Skipped: field/form/group/label contexts, transitions/`keepMounted`, composite integration (no such feats in roadmap).
- [x] **Shared `src/lib/internal/HiddenInput.svelte`**: visually-hidden (functional only) native input, `indeterminate` DOM-property sync via `$effect`, `name/value/uncheckedValue/form/required/id`, `bind:inputRef`, native-change forwarding with readOnly/disabled revert.
- [x] **Shared `src/lib/internal/state-attrs.ts`**: `getCheckableDataAttributes` — exactly one of `data-checked/data-unchecked/data-indeterminate` + flags.
- [x] **`src/lib/checkbox/` (Root/Indicator/context)**: Root reuses Button (`span`, `role=checkbox`); `checked = $bindable(defaultChecked)`; veto-by-`preventDefault`; Enter suppressed + `form.requestSubmit()`; label-driven native changes committed; Indicator renders iff checked/indeterminate; state shared via getter-based context (`createPrimitiveContext`).
- [x] **`src/lib/switch/` (Root/Thumb/context)**: same skeleton minus indeterminate/Enter-suppression (Enter toggles, Base UI parity); Thumb always rendered with mirrored data attrs. Namespaced exports `Checkbox.*` / `Switch.*`.
- [x] **Verification**: `check` 0/0, `format` clean, `lint` exit 0 (incl. new named-import rules via `lint:fix`), `prepack` + publint pass, autofixer clean. SSR functional test (14 assertions incl. real Root+Indicator/Thumb composition, mixed state, uncheckedValue gating, disabled) — all passed, scaffold removed.
- [x] **Demo page**: Checkbox variants (uncontrolled/indeterminate/disabled/readOnly), live form-submission proof (`agree`/`newsletter` values), Switch controlled + disabled.

### 2026-09-23: Structural reorg — single-repo docs site (user-requested)

- [x] **Moved `src/lib/` to `primitives/` + `utils/` + `actions/`** via `git mv` (history preserved): `button|toggle|checkbox|switch` → `primitives/`; `context|id|compose-handlers|merge-props|state-attrs` → `utils/`; `actions.ts` → `actions/dismiss.ts`; `Portal.svelte` → `primitives/portal/`; `HiddenInput.svelte` → `primitives/hidden-input/`; `internal/` deleted. This matches the `perfectionist` import groups already in `eslint.config.js`.
- [x] **Public API unchanged** (same names from `src/lib/index.ts`); new barrels `utils/index.ts`, `actions/index.ts`, `portal/index.ts`, `hidden-input/index.ts`.
- [x] **Docs site = `src/routes/`**: new `+layout.svelte` (nav shell, `resolve()`-based links per `svelte/no-navigation-without-resolve`); gallery split into `button|toggle|checkbox|switch/+page.svelte`; home keeps overview + utilities playground.
- [x] **Roadmap evidence paths** in `feature_list.json` updated to `src/lib/primitives/...` (feat-003..014) and `src/lib/utils|actions` (feat-002).
- [x] **Both build targets verified from one repo**: `bun run build` (site: `/`, `/button`, `/toggle`, `/checkbox`, `/switch` — adapter-auto notes no production env, expected until a deploy adapter is chosen) and `bun run prepack` (dist mirrors new layout, publint good). Plus `check` 0/0, `format` clean, `lint` exit 0.
- [ ] **Follow-up**: `feat-015` (showcase gallery) is now mostly structural groundwork done — remaining work is per-new-primitive pages as feats land, plus choosing a deploy adapter (replaces adapter-auto) when `svbase.dev` deployment is wanted.

### 2026-09-23: Test stack — Vitest Browser Mode (user-proposed, co-implemented)

- [x] **Deps** (user installed, committed here): `vitest@5`, `@vitest/browser-playwright@5`, `vitest-browser-svelte@3`, `playwright@1.63`, `axe-core@4` (direct `axe.run`, no page plumbing), `oxlint-tsgolint`; Chromium downloaded via `playwright install`.
- [x] **Config** (`vite.config.ts`): two `test.projects` — `unit` (node, `src/**/*.test.ts`) and `browser` (headless Chromium, `src/**/*.browser.test.ts`); `bun run test` script; `!dist/**/*.fixture.*` pack exclude; AGENTS.md command row.
- [x] **Unit tests** (4 files, 15 tests): `composeHandlers` order/cancel/empty, `mergeProps` overwrite/class/style/handlers/undefined-skip, id uniqueness/override, state-attrs mapping.
- [x] **Browser tests** (2 files, 8 tests): Button native click/type, disabled force-click suppression, div Enter/Space activation with real `document.activeElement` focus, Toggle click flip + aria, axe with zero violations.
- [x] **API corrections vs proposal**: v5 `Locator` has no `focus()`/`press()` — focus via `findElement()` + real `.focus()`, keyboard via real `KeyboardEvent` dispatch in Chromium; synthetic Space provably does NOT flip native buttons (trusted-event requirement), so that test locks the negative. Axe: 3 harness-owned document rules (`landmark-one-main`, `page-has-heading-one`, `region`) disabled with justification — zero component violations.
- [x] **Harness fix**: `FORMAT_IGNORE_PATTERNS` was missing build output (`.svelte-kit`, `dist`, `build`, `.vitest`, `coverage`) — first real `vite build` broke the format gate; fixed.
- [x] **Verification**: `test` 23/23, `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, tarball contains no test/fixture files.

### 2026-09-23: Radio Group Primitive (feat-005)

- [x] **Analyzed Base UI** `RadioGroup` + `RadioRoot`: composite roving, per-item native inputs, Enter-never-toggles, label/change path, group value projection. Skipped: field/form/fieldset/label contexts, transitions, composite abstraction (no such feats).
- [x] **`src/lib/primitives/radio-group/` (Root/Item/Indicator/context)**: `value = $bindable(defaultValue)` (string-only, form values are strings); per-item native radio inputs (browser-exact exclusivity + `required` validation, no group input); selection-follows-focus arrows with wrap + disabled-skip + RTL + Home/End (all four arrows per WAI-APG, `orientation` sets `aria-orientation`); single tab stop (checked else first enabled); Enter suppressed (no form submit, unlike checkbox); veto-by-`preventDefault`; item-level `disabled/readOnly/required` OR-ed with group.
- [x] **Generalized `HiddenInput`** with `type: 'checkbox' | 'radio'` (radio skips indeterminate/uncheckedValue).
- [x] **Real bug caught by browser tests**: `$effect` registry read/wrote shared state → `effect_update_depth_exceeded`. Fixed with single `onMount` registration using live getters (no re-runs possible, no stale entries).
- [x] **Test-environment lessons**: v5 `Locator` has no `focus()`/`press()` — focus via `findElement()` + real `.focus()` (asserted with real `activeElement`); keyboard via real `KeyboardEvent` dispatch; synthetic events must be `cancelable: true` for veto chains to engage (mirrors trusted-event behavior); accessible names include indicator content (use empty indicators + `data-testid`); `queryBy*` doesn't exist on screen (use `document.querySelector`); stale Vite optimizer cache once served old fixtures (cleared `node_modules/.vite`).
- [x] **Verification**: `test` 30/30 (7 new radio tests: roving, click+tab-stop, arrows+wrap+skip, Home/End, Enter veto, form identity, axe), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/radio-group`, autofixer clean.
- [x] **Demo route** `routes/radio-group/` (controlled + required form proof + vertical) linked in layout nav.

### 2026-09-23: Collapsible & Accordion Primitives (feat-006)

- [x] **Analyzed Base UI** collapsible root/trigger/panel + accordion root/item/header/trigger/panel: `useCollapsibleRoot` open state, trigger `aria-expanded/controls`, panel mount/transition machinery, accordion = per-item collapsible + composite focus moves (new APG: NO roving, focus-only arrows). Skipped: transitions/CSS vars/height measurement, `keepMounted` root-level, `hiddenUntilFound`, field contexts, deprecated orientation/loopFocus.
- [x] **`src/lib/primitives/collapsible/` (Root/Trigger/Panel)**: `open = $bindable(defaultOpen)`, generated `panelId` with override registration, `data-state="open|closed"` (svbase convention over Base UI's `data-open`), `keepMounted` via `hidden` attribute, veto-by-`preventDefault`.
- [x] **`src/lib/primitives/accordion/` (Root/Item/Header/Trigger/Panel)**: `value: string[]` `$bindable`, single (toggle) + `multiple` modes, per-item open derived from value, item `onOpenChange`, generated trigger/panel ids with override registration, panel `role="region"` + `aria-labelledby`, `Header` with `level` prop (default h3).
- [x] **Keyboard**: arrows/Home/End move focus only (never select — current APG), wrap + disabled-skip + RTL via shared `nextRovingTarget`; triggers stay normal Tab stops; Space/Enter toggle natively.
- [x] **Shared `src/lib/utils/roving.ts`** extracted (pure, DOM-free, unit-tested); radio `move` refactored onto it — radio browser tests prove equivalence. Unknown start now resolves to the nearest end in movement direction.
- [x] **Verification**: `test` 45/45 (6 roving unit + 3 collapsible + 6 accordion browser incl. single/multiple/arrows/linkage/axe), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/collapsible` + `/accordion`, autofixer clean.
- [x] **Known limitation (documented)**: generated `createId` fallbacks are monotonic globals — concurrent SSR requests get unique ids but hydration patches client values (dev warning). Pass explicit `id` props for SSR-critical markup.
- [x] **Demo routes** `routes/collapsible/` + `routes/accordion/` linked in layout nav.

### 2026-09-23: Dialog & Alert Dialog Primitives (feat-007)

- [x] **Analyzed Base UI** dialog store/floating-ui machinery + alert-dialog mode (forced modal + no pointer dismissal). Skipped: floating-ui positioning, nested dialogs/drawers, transitions, field contexts, non-modal mode (spec is modal-only).
- [x] **`src/lib/primitives/dialog/`**: renderless Root owning a centralized `$effect` controller (initial focus → first tabbable else popup, Tab trap with wrap, body scroll lock, Escape close, focus return to trigger-or-previous), `open = $bindable()`, generated title/description/content ids with override registration (mounted-only, never dangling), `data-state`.
- [x] **Parts**: Trigger (toggle, `aria-haspopup/expanded/controls`), Portal (re-exported primitive), Overlay (self-click dismiss unless opted out), Content (`role`, `aria-modal`, labelledby/describedby, `tabindex=-1`), Title (`level` prop), Description, Close.
- [x] **`src/lib/primitives/alert-dialog/`**: thin Root wrapper forcing `role="alertdialog"` + no pointer dismissal; all other parts re-exported from dialog (shared context shape).
- [x] **Two real bugs caught by browser tests**: (1) `bind:this` into `$bindable` props flushes after mount — element registration moved from `onMount` to `$effect` (writes to untracked fields, no loop); (2) Portal cleanup moved nodes back and unmount missed them — destroy now removes outright (idempotent). Both proven via probes, then probes deleted; Portal gained permanent teleport/unmount tests.
- [x] **Tooling notes**: Svelte comments are `{<!-- -->}` (`{!--` is a parse error); svelte-check and eslint disagree on dialog `tabindex` (kept justified `svelte-ignore` + file-level eslint disable — HTML disables aren't honored for that rule).
- [x] **Verification**: `test` 54/54 (5 dialog: open/linkage/focus, Escape+return, Tab trap, overlay, axe; 2 alert: role+no-overlay-dismiss, Escape; 2 portal), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/dialog` + `/alert-dialog`, autofixer clean.
- [x] **Demo routes** `routes/dialog/` + `routes/alert-dialog/` linked in layout nav.

### 2026-09-23: Popover & Tooltip Primitives (feat-008)

- [x] **Decision (user-confirmed)**: `@floating-ui/dom@1.8.0` as a runtime dependency — engine only, no Svelte wrapper lib; all behavior stays native. Ponytail rule amended with the standing exception. Same engine line Base UI uses (via `react-dom`).
- [x] **Shared `src/lib/utils/position.svelte.ts`**: `FloatingPosition` class — no `$effect` inside (attachments already run in effects; option changes via `update()`); plain fields in, `$state` out (x/y/placement/positioned/arrow), so no loops, SSR-safe, Node-constructible. Applies styles directly; arrow centering with stale-side clearing; stale-flight guard.
- [x] **Shared `src/lib/utils/outside.ts`**: `trackOutsidePress` for roots owning several nodes (trigger clicks ignored so toggle wins — the naive single-node race, solved architecturally).
- [x] **`src/lib/primitives/popover/` (Root/Trigger/Content/Arrow)**: click toggle, `aria-expanded/controls`, modeless, Escape + outside-press dismiss, `data-placement` (actual post-flip), hidden-until-positioned, generated content id.
- [x] **`src/lib/primitives/tooltip/` (Root/Trigger/Content)**: hover/focus triggers, `delay` 600 / `closeDelay` 0 (Base UI parity), `skipDelayDuration` 400 via module-shared timestamp (no provider needed), `role="tooltip"` + `aria-describedby`, Escape + outside dismiss, timer cleanup on destroy.
- [x] **Verification**: `test` 69/69 (position unit incl. Node-safety, delay skip unit, popover toggle/outside/Escape/REAL flip via rects, tooltip hover/focus/skip-timing, axe ×2), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/popover` + `/tooltip`.
- [x] **Tooling notes**: `{@attach}` flows through component prop spreads onto the element (verified by check); constructor-captured props warn (`state_referenced_locally`) — construct with defaults + sync effect instead.
- [x] **Demo routes** `routes/popover/` (arrow + offset variant) + `routes/tooltip/` linked in layout nav.

### 2026-09-23: Dropdown Menu Primitive (feat-009)

- [x] **Analyzed Base UI** menu root/item/checkbox/radio/submenu: `closeOnClick` true/false/false, submenu hover delays, `data-highlighted`, focus-only arrows (new APG, no roving). Skipped: Arrow/Backdrop/Group/LinkItem/Viewport parts, transitions, field contexts.
- [x] **`src/lib/primitives/dropdown-menu/`** (14 files): Root/Trigger/Portal/Content/Item/Separator/CheckboxItem+Indicator/RadioGroup/RadioItem+Indicator/SubRoot/SubTrigger.
- [x] **Per-content item registry** (not root-level): each Content provides its own entries/highlight/typeahead — submenu contents work with zero special-casing via context shadowing. Items register once via `onMount` + live getters (radio-proven, loop-free).
- [x] **Behaviors**: roving tabindex + focus-follows-highlight, cycling typeahead from current position (1s buffer), hover highlights+focuses, Tab/focusout dismisses without stealing focus, close+refocus on select/Escape, veto-by-`preventDefault`.
- [x] **Submenus via context layering**: SubRoot provides menu-root context (nested, own position/open) while parent content context shines through — same Item/Content parts reused unchanged. Hover open (150ms) with relatedTarget guards, click toggle, ArrowRight opens + focuses first item (pending-flag), ArrowLeft/Escape close one level (capture + stopPropagation), outside clicks ignore `[role="menu"]` subtrees.
- [x] **Shared `escapeKey`/`trackOutsidePress` extensions** (backward compatible): `{ capture }` option, `ignoreSelector` option.
- [x] **Real bug caught by tests**: SubTrigger missed its `position.reference` attach → submenu never positioned. Found via `hidden`-stuck assertion.
- [x] **Verification**: `test` 77/77 (8 menu tests: open/toggle/linkage, select+close+focus, arrows+highlight+wrap, typeahead, checkbox/radio stay-open, submenu hover + one-level Escape, axe), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/dropdown-menu`.
- [x] **Demo route** `routes/dropdown-menu/` linked in layout nav.

### 2026-09-24: Tabs Primitive (feat-010)

- [x] **Analyzed Base UI** tabs root/tab/list/panel: controlled value, `activateOnFocus` (default manual) on List, composite roving, right-click focus suppression, disabled-focusable nuance, panel mount semantics. Skipped: transitions, Indicator part, keepMounted, field contexts.
- [x] **`src/lib/primitives/tabs/` (Root/List/Trigger/Content)**: `value = $bindable()` with auto-select-first-enabled (`undefined` always resolves), `activation: 'automatic' | 'manual'` on List (manual default, Base UI parity), orientation-gated arrows (Left/Right vs Up/Down + Home/End), focus-tracked roving (focused tab holds the stop, falls back to selected), deterministic value-derived ids (SSR-stable, no registration subsystem).
- [x] **Right-click suppression**: non-primary pointerdown arms a one-shot flag consumed by the next focus — no document listeners.
- [x] **Verification**: `test` 88/88 (2 id-helper unit + 8 browser: auto-select/linkage, automatic arrows+wrap+skip, manual focus-only, click select, Home/End, vertical gating, synthetic-Enter negative lock, axe), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/tabs`.
- [x] **Demo route** `routes/tabs/` (automatic + manual + vertical) linked in layout nav.

### 2026-09-24: Slider & Progress Primitives (feat-011)

- [x] **Analyzed Base UI** slider root/thumb (610-line root with form/field/composite machinery) + progress root (indeterminate/progressing/complete states). Skipped: Control/Indicator/Value/Label parts, transitions, field/form contexts, active-thumb tracking.
- [x] **Shared `src/lib/utils/slider-math.ts`** (pure, unit-tested): clamp, step rounding without float dust, percent/ratio conversions, chained push-apart for `minStepsBetweenValues`.
- [x] **`src/lib/primitives/slider/` (Root/Track/Thumb)**: single value or array (`$bindable`), keyboard arrows/Home/End/PageUp-Down, track click-to-jump + pointer-capture drag with grab-offset preservation, thumb push cascades, `onValueChange` continuous + `onValueCommitted` on release, hidden form inputs per thumb, inline `inset-inline-start`/`bottom` positioning (auto-RTL), explicit `index` required past the first thumb.
- [x] **`src/lib/primitives/progress/` (Root/Indicator)**: `value === undefined` indeterminate (omits `aria-valuenow`), `data-state` indeterminate/progressing/complete, width% fill.
- [x] **Caught by tests**: sync DOM reads after dispatch need `await tick()` (Svelte flushes async); release must commit even when value settled; multi-thumb needs explicit indices (both thumbs defaulted to 0).
- [x] **Noted**: user's tsconfig commit enabled `noUncheckedIndexedAccess` — index access now needs `??` guards (applied in slider-math).
- [x] **Verification**: `test` 106/106 (11 slider-math unit + 5 slider browser incl. real drag geometry + 4 progress + axe ×2), `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` includes `/slider` + `/progress`.
- [x] **Demo routes** `routes/slider/` (single + range + vertical) + `routes/progress/` linked in layout nav.
