#!/bin/bash
set -e

echo "=== svbase Harness Initialization & Verification ==="

echo ">> Checking dependencies..."
bun install

echo ">> Running typecheck (svelte-check)..."
bun run check

echo ">> Running linter and format check..."
bun run lint

echo ">> Testing library packaging (prepack)..."
bun run prepack

echo "=== All Checks Passed Successfully ==="
echo ""
echo "Next steps for agent:"
echo "1. Read AGENTS.md and .agents/rules/*.md"
echo "2. Check feature_list.json for the next unfinished primitive"
echo "3. Follow Svelte 5 Runes & Base UI architecture guidelines"
echo "4. Update progress.md and feature_list.json upon completion"
