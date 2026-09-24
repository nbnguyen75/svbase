# svbase (workspace)

Svelte 5 headless-primitive library + SvelteKit showcase, in one bun-managed monorepo.

- `packages/svbase/` — the publishable library (`src/lib`, tests, `prepack`/`publint`) with its self-contained harness. Read its `AGENTS.md` first.
- `docs/` — SvelteKit showcase app consuming the library as the `svbase` workspace package.

## Quickstart

```sh
bun install
bun run dev # docs showcase at :5173
```

## Gates (run at root, delegate to packages)

```sh
bun run check # lib check → prepack dist → docs check
bun run test # 127/127 vitest (unit + browser)
bun run prepack # svelte-package + publint
bun run lint # oxlint + eslint, both packages
bun run format # oxfmt --check, both packages
```

bun is primary; pnpm (`packageManager` pin) handles CI/CD lockfiles via `bun run sync:lockfiles`.
