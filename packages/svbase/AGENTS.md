# AGENTS.md

Project harness for reliable agent-assisted development on **svbase**
(TypeScript + Svelte 5 library package, Bun-managed).

svbase is an unstyled, headless UI component primitives library for Svelte 5,
bringing the design patterns and accessibility of **Base UI** to the Svelte ecosystem.

---

## Repository Layout

- `packages/svbase/` — the publishable library (`src/lib`, tests, `prepack`/`publint`) and its self-contained harness (this AGENTS.md, `.agents/`, `init.*`, `feature_list.json`, `eslint`/`oxfmt`/`oxlint` configs). Relative imports only.
- `docs/` — Astro Starlight docs site consuming the library as the `svbase` workspace package, with its own copy of the lint/format configs. Demos live as Svelte islands under `docs/src/components/islands/` (see `docs/AGENTS.md`).
- Root — thin orchestrator: `bun run <script>` delegates to each package; zero devDeps.

---

## Startup Workflow

Before writing any code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read project rules** in `.agents/rules/`:
   - `primitives-architecture.md` — unstyled design, runes reactivity, ARIA patterns, compound components
   - `typescript.md` — strict TypeScript rules, props/snippet exports, zero `any`
   - `ponytail.md` — simplification ladder, zero bloat, YAGNI, standard DOM before custom JS
   - `phase-gate.md` — done criteria: implementation + verification + evidence
   - `improve.md` — quality and architecture standards
4. **Run `./init.sh`** (or `.\init.ps1` on Windows PowerShell) to verify environment health
5. **Read `feature_list.json`** to see current roadmap status and identify the single next feature
6. **Review recent commits** with `git log --oneline -5`

If baseline verification fails, repair it before adding new scope.

---

## Standard Package Commands

Always use the standard npm/bun scripts configured in `package.json` for validation and formatting:

| Command                    | Action                         | Underlying Tool                            |
| -------------------------- | ------------------------------ | ------------------------------------------ |
| `bun run check`            | Typecheck components & modules | `svelte-check`                             |
| `bun run check:watch`      | Watch mode typecheck           | `svelte-check --watch`                     |
| `bun run format`           | Verify formatting compliance   | `oxfmt --check`                            |
| `bun run format:fix`       | Format codebase automatically  | `oxfmt`                                    |
| `bun run lint`             | Lint codebase for errors       | `oxlint && eslint src --ext .svelte`       |
| `bun run lint:fix`         | Autofix lint issues            | `oxlint --fix`                             |
| `bun run prepack`          | Package verification & build   | `svelte-package && publint`                |
| `bun run test`             | Unit + browser tests           | `vitest` (node + chromium projects)        |
| `bun run sync:lockfiles`   | Regen pnpm + npm lockfiles     | `pnpm` / `npm` lockfile-only installs      |
| `./init.sh` / `.\init.ps1` | Full baseline environment run  | Dependencies, check, format, lint, prepack |

> Package managers: **bun is primary** for daily dev (all commands above). **pnpm** (`packageManager` pin) serves CI/CD — full `pnpm install` needs Windows Developer Mode (symlink privilege). After any dependency change, run `bun run sync:lockfiles` and commit all lockfiles.

---

## Working Rules

- **One feature at a time**: Pick exactly one unfinished feature from `feature_list.json`.
- **Svelte 5 Runes Only**: Use `$state`, `$derived`, `$props`, `$bindable`. Avoid legacy Svelte 4 syntax (`let:`, `<slot>`, `export let`, `on:click`).
- **Unstyled & Headless**: No embedded CSS or styling opinions. Use `data-*` attributes (`data-state`, `data-disabled`, `data-orientation`) for consumer styling.
- **WAI-ARIA & Keyboard First**: Every primitive must implement appropriate ARIA roles, states, and keyboard navigation (Enter, Space, Arrows, Escape, Tab focus trapping).
- **Compound Components**: Export compound parts using namespaces (e.g. `export * as Dialog from './dialog'`).
- **Formatting & Linting First**: Use `bun run format:fix` and `bun run lint:fix` during editing.
- **Verification Required**: Never claim a task is complete without running `./init.sh` (or `bun run check && bun run format && bun run lint && bun run prepack`).
- **Update Artifacts**: Update `feature_list.json` and `progress.md` at each milestone.
- **Stay in Scope**: Do not touch files unrelated to the active feature.

---

## Svelte MCP Tools & Available Agents

When working with Svelte code, use the Svelte MCP tools:

1. `list-sections`: Discover available Svelte 5 / SvelteKit documentation sections.
2. `get-documentation`: Fetch full documentation for runes and patterns (`$state`, `$derived`, `$props`, `snippets`, etc.).
3. `svelte-autofixer`: Analyze Svelte component code to detect issues before finalizing.

---

## Skill Routing

Load the most specific skill for the task:

| Task / Domain                 | Skill                                                     |
| ----------------------------- | --------------------------------------------------------- |
| React/Base UI Logic Analysis  | `react-to-svelte-analyze`                                 |
| React to Svelte 5 Porting     | `react-to-svelte-port`                                    |
| Svelte 5 Reactivity & Runes   | `svelte-core-bestpractices`, `svelte-code-writer`         |
| Primitive UI & Accessibility  | `better-ui`, `frontend-design`                            |
| Modern JS / TypeScript Types  | `modern-javascript-patterns`, `typescript-advanced-types` |
| Codebase Modularity & Design  | `codebase-design`                                         |
| Simplification & Minimal Code | `ponytail` (always active)                                |
| Quality & Architecture        | `improve` (always active)                                 |
| Systematic Bug Fixing         | `diagnosing-bugs`                                         |
| Code Review & Polish          | `code-review-and-quality`                                 |
| Refactoring & Code Smells     | `refactor`                                                |
| Research & Documentation      | `research`, `writing-for-agents`                          |

---

## Required Artifacts

- `feature_list.json` — Source of truth for roadmap and feature completion
- `progress.md` — Session log with verifiable checkmarks and status
- `init.sh` / `init.ps1` — Standard baseline verification scripts
- `session-handoff.md` — Context handoff for next agent session

---

## Definition of Done

A primitive or feature is done only when:

- [ ] Primitive implementation is complete and conforms to Base UI accessibility patterns
- [ ] Proper `data-*` attributes and ARIA attributes are exposed
- [ ] Keyboard navigation and focus management work correctly
- [ ] Public types are exported from `src/lib/index.ts`
- [ ] `bun run check` passes with 0 errors and 0 warnings
- [ ] `bun run format` passes with 0 errors
- [ ] `bun run lint` passes with 0 errors
- [ ] `bun run prepack` builds dist and passes `publint` with 0 errors
- [ ] Mounted as a Svelte island under `docs/src/components/islands/` and embedded in its `.mdx` page for visual & functional verification
- [ ] Evidence recorded in `feature_list.json` and `progress.md`

---

## End of Session Routine

1. Run verification (`./init.sh` or `.\init.ps1`).
2. Mark completed features in `feature_list.json`.
3. Log changes and remaining questions in `progress.md`.
4. Update `session-handoff.md` with immediate next steps.
