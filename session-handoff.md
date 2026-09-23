# Session Handoff — svbase

## Current State

- `feat-001`–`feat-005` complete and verified (harness, utils + `mergeProps`, Button/Toggle, Checkbox/Switch, RadioGroup) plus committed test stack (Vitest unit + Chromium browser + axe, 30/30) and single-repo docs-site layout.
- `src/lib/primitives/radio-group/` (Root/Item/Indicator): roving tabindex, arrows+Home/End with wrap/RTL/disabled-skip, per-item native inputs, `RadioGroup.*` export.
- Verification is green: `test` 30/30, `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` exit 0.

## Immediate Next Task

- Pick `feat-006` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Collapsible & Accordion primitives (`src/lib/primitives/collapsible/`, `src/lib/primitives/accordion/`): expand/collapse, single/multiple modes, header/trigger/content parts, arrow navigation — reuse getter context, `$bindable` open state, `data-state`, and the radio-group roving/registration pattern for accordion keyboard nav.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
