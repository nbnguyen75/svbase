#!/bin/bash
set -e

echo "=== svbase Harness Initialization & Verification ==="

echo ">> Checking dependencies..."
bun install

echo ">> Running typecheck (svelte-check)..."
bun run check

echo ">> Running format check (oxfmt)..."
bun run format

echo ">> Running linter (oxlint & eslint)..."
bun run lint

echo ">> Testing library packaging (prepack)..."
bun run prepack

echo "=== All Checks Passed Successfully ==="
echo ""
echo "Next steps for agent:"
echo "1. Read this AGENTS.md and .agents/rules/*.md (package harness lives here)"
echo "2. Check feature_list.json for the next unfinished primitive"
echo "3. Follow Svelte 5 Runes & Base UI architecture guidelines"
echo "4. Update progress.md and feature_list.json upon completion"
echo "5. Docs gates (check/lint/format) run from the docs/ directory"
