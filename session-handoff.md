# Session Handoff — svbase

## Current State

- `feat-001` (harness), `feat-002` (core internal utilities + `mergeProps`), and `feat-003` (Button & Toggle) are complete and verified.
- `src/lib/button/` and `src/lib/toggle/` provide native-button primitives with element delegation, `bind:ref`, and veto-by-`preventDefault` composition. Public exports in `src/lib/index.ts`.
- Verification is green: `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass.

## Immediate Next Task

- Pick `feat-004` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Checkbox & Switch primitives (`src/lib/checkbox/`, `src/lib/switch/`) built on feat-002/003 patterns:
    - Uncontrolled/controlled state via `$bindable` (see Toggle), `aria-checked` + hidden input for forms, `data-state="checked|unchecked|indeterminate"`.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
