# svbase Harness Initialization & Verification (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "=== svbase Harness Initialization & Verification ===" -ForegroundColor Cyan

Write-Host ">> Checking dependencies..." -ForegroundColor Yellow
bun install

Write-Host ">> Running typecheck (svelte-check)..." -ForegroundColor Yellow
bun run check

Write-Host ">> Running format check (oxfmt)..." -ForegroundColor Yellow
bun run format

Write-Host ">> Running linter (oxlint & eslint)..." -ForegroundColor Yellow
bun run lint

Write-Host ">> Testing library packaging (prepack)..." -ForegroundColor Yellow
bun run prepack

Write-Host "=== All Checks Passed Successfully ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps for agent:"
Write-Host "1. Read AGENTS.md and .agents/rules/*.md"
Write-Host "2. Check feature_list.json for the next unfinished primitive"
Write-Host "3. Follow Svelte 5 Runes & Base UI architecture guidelines"
Write-Host "4. Update progress.md and feature_list.json upon completion"
