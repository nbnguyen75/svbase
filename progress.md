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
