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
