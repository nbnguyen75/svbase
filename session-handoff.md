# Session Handoff — svbase

## Current State

- `feat-001`–`feat-012` complete and verified. Test suite at 113/113 (unit + Chromium browser + axe).
- `src/lib/primitives/select/` (Root/Trigger/Value/Portal/Content/Viewport/Item/Group/Label) with WAI-APG keyboard model. `Select.*` export.
- Verification is green: `test` 113/113, `check` 0/0, `format` clean, `lint` exit 0, `prepack` + publint pass, `build` exit 0.

## Immediate Next Task

- Pick `feat-013` from [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json):
  - Separator & Scroll Area (`src/lib/primitives/separator/`, `src/lib/primitives/scroll-area/`): semantic divider (single tiny part) + scroll container with custom thumb/track over native scrolling — smallest remaining feat, good cooldown after select.

## How to Resume

1. Run `./init.sh` (or `.\init.ps1` in PowerShell) to verify workspace health.
2. Read [.agents/rules/primitives-architecture.md](file:///D:/Personal/Project/svbase/.agents/rules/primitives-architecture.md) and [.agents/rules/typescript.md](file:///D:/Personal/Project/svbase/.agents/rules/typescript.md).
3. Implement `feat-002` strictly in scope.
4. Run `./init.sh`, update [feature_list.json](file:///D:/Personal/Project/svbase/feature_list.json) and [progress.md](file:///D:/Personal/Project/svbase/progress.md).
