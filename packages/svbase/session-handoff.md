# Session Handoff — svbase

## Current State

- Full roadmap complete: all 32 items done (`feat-001`–`feat-031`, `phase-001`). Test suite at 204/204 across 44 files.
- `packages/svbase/` holds the library (30+ primitives, utils, actions) + its self-contained harness (this file, `AGENTS.md`, `.agents/`, `init.*`, `feature_list.json`, lint/format configs); `docs/` is the mdsvex showcase (33 routes) consuming `svbase` from `dist`; root is a thin delegating orchestrator.
- Verification is green at root: `check` 0/0 (lib then docs), `test` 204/204, `format` clean, `lint` exit 0, `prepack` + publint pass, docs `build` exit 0.
- Parked: `package-lock.json` not generated on bun-managed trees (see `progress.md`); full `pnpm install` needs Windows Developer Mode.

## Immediate Next Task

- Publish path: `package-lock.json` regen on non-bun tree, version bump from 0.0.1, first npm publish, `svbase.dev` deploy cadence.
- Deferred product work: drawer swipe gestures, combobox async collections, hold-to-repeat steppers, shared floating viewport, dark-mode toggle, sidebar/search nav, `llms.txt`.
- Remember the `ponytail:` dev-DX note: run `bun run prepack` after lib edits so docs sees them.

## How to Resume

1. Read `packages/svbase/AGENTS.md`, then `packages/svbase/.agents/rules/`.
2. Run `packages/svbase/init.ps1` (or `init.sh`) to verify package health; run docs gates from `docs/`.
3. Pick the next work from above; record it in `feature_list.json` and `progress.md`.
