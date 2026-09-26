# svbase (workspace)

Svelte 5 headless-primitive library + Astro Starlight docs, in one monorepo.

- `packages/svbase/` — the publishable library (`src/lib`, tests, `prepack`/`publint`) with its self-contained harness. Read its `AGENTS.md` first.
- `docs/` — Astro Starlight docs site consuming the library as the `svbase` workspace package.

## Quickstart

```sh
pnpm install
bun run dev # docs at :4321
```

## Gates (run at root, delegate to packages)

```sh
bun run check # lib check + prepack dist + docs check
bun run test # 204 vitest (unit + browser)
bun run prepack # svelte-package + publint
bun run lint # oxlint + eslint, both packages
bun run format # oxfmt --check, both packages
bun run build # prepack + docs static build
```

bun is primary for dev scripts; pnpm (`packageManager` pin) handles installs and CI/CD lockfiles via `bun run sync:lockfiles`.

## Release (tag-gated, changesets for versions)

```sh
bun run changeset # record a change
bun run version # bump + changelog locally
git tag svbase-vX.Y.Z && git push origin main --tags # publishes to npm
```

Pushes, branches, and PRs never publish — only `svbase-v*` tags do. Details in `packages/svbase/progress.md`. Requires `NPM_TOKEN` in repo secrets.
