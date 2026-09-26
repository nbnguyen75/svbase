# svbase (workspace)

Root orchestrator for two packages:

- `packages/svbase/` — the publishable Svelte 5 headless-primitive library. All project harness lives here: read its `AGENTS.md`, then `.agents/rules/`, and run `init.ps1`/`init.sh` from that directory.
- `docs/` — Astro Starlight docs site consuming the library as the `svbase` workspace package.

Root scripts delegate to the packages (`bun run dev/check/test/lint/format/prepack/build`). bun is the primary package manager; pnpm handles CI/CD lockfiles.