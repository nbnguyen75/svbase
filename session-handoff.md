# Session Handoff — svbase

## Current State

- `feat-001`–`feat-004` complete and verified (harness, internal utils + `mergeProps`, Button/Toggle, Checkbox/Switch).
- `src/lib/checkbox/` (Root/Indicator) and `src/lib/switch/` (Root/Thumb) expose namespaced compound APIs over a shared internal `HiddenInput` + checkable data attrs. Public via `Checkbox.*` / `Switch.*` in `src/lib/index.ts`.
- Verification is green: `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass.

## Immediate Next Task

- Pick `feat-005` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Radio Group primitive (`src/lib/radio-group/` with Root, Item, Indicator): roving tabindex, arrow navigation (horizontal/vertical), form value sync — reuse `HiddenInput`, `$bindable` group value, getter context, veto-by-`preventDefault`.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
