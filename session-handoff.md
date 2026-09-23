# Session Handoff — svbase

## Current State

- `feat-001` (harness) and `feat-002` (core internal utilities) are complete and verified.
- `src/lib/internal/` provides: `createPrimitiveContext`, `generateId`/`createId`, `composeHandlers`, `clickOutside`/`escapeKey` attachments, `Portal`.
- Verification is green: `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass.

## Immediate Next Task

- Pick `feat-003` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Button & Toggle primitives (`src/lib/button/`, `src/lib/toggle/`) built on feat-002 utils:
    - `createId` for aria labelling, `composeHandlers` for internal + consumer `onclick`, `createPrimitiveContext` if compound parts are needed.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
