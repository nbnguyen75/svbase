# Session Handoff — svbase

## Current State

- Monorepo split complete (`phase-001` done): `packages/svbase/` holds the library + its self-contained harness (this file, `AGENTS.md`, `.agents/`, `init.*`, `feature_list.json`, lint/format configs); `docs/` is the showcase app consuming `svbase` from `dist`; root is a thin delegating orchestrator.
- All feats `feat-001`–`feat-015` complete and verified. Test suite at 127/127.
- Verification is green at root: `check` 0/0 (lib then docs), `test` 127/127, `format` clean, `lint` exit 0, `prepack` + publint pass, docs `build` exit 0.
- Parked: `package-lock.json` not generated on bun-managed trees (see `progress.md`); full `pnpm install` needs Windows Developer Mode.

## Immediate Next Task

- Phase 2 (pick any): mdsvex `.svx` conversion of docs pages, dark mode, deploy adapter cadence for `svbase.dev`, `llms.txt`, first npm publish.
- Remember the `ponytail:` dev-DX note: run `bun run prepack` after lib edits so docs sees them.

## How to Resume

1. Read `packages/svbase/AGENTS.md`, then `packages/svbase/.agents/rules/`.
2. Run `packages/svbase/init.ps1` (or `init.sh`) to verify package health; run docs gates from `docs/`.
3. Pick the next work from Phase 2 above; record it in `feature_list.json` and `progress.md`.
