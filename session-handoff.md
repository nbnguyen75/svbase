# Session Handoff — svbase

## Current State

- `feat-001`–`feat-007` complete and verified. Test suite at 54/54 (unit + Chromium browser + axe).
- `src/lib/primitives/dialog/` (Root/Trigger/Portal/Overlay/Content/Title/Description/Close) with centralized focus-trap/scroll-lock/Escape controller; `src/lib/primitives/alert-dialog/` thin wrapper. `Dialog.*` / `AlertDialog.*` exports.
- Verification is green: `test` 54/54, `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` exit 0.

## Immediate Next Task

- Pick `feat-008` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Popover & Tooltip (`src/lib/primitives/popover/`, `src/lib/primitives/tooltip/`): anchor positioning (needs a positioning decision — floating-ui `@floating-ui/dom` vs hand-rolled; dialog's modal controller does NOT apply — modeless, focus stays, light dismiss), hover/focus triggers with delay, skip-delay across items for tooltip.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
