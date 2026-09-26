# AGENTS.md — docs

Astro Starlight docs site for **svbase**. Consumes the library as the `svbase`
workspace package (resolves to `packages/svbase/dist` — run `bun run prepack`
in `packages/svbase` before `build`/`dev` picks up library changes).

## Commands (run from `docs/`)

| Command           | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `bun run dev`     | Dev server on `:4321`                                                  |
| `bun run build`   | Static build (prerenders all pages — the SSR gate)                     |
| `bun run preview` | Serve the last build                                                   |
| `bun run check`   | `astro sync` (content + types; `@astrojs/check` intentionally skipped) |
| `bun run lint`    | `oxlint && eslint` (Svelte rules via `eslint-plugin-svelte`)           |
| `bun run format`  | `oxfmt --check` (`:fix` variants exist for both)                       |

Root orchestrates both packages (`bun run dev/check/test/lint/format/prepack/build`, plus `changeset`/`version`/`release` for the npm flow).
bun is primary for dev; pnpm handles CI/CD lockfiles. Dependencies live in
`docs/package.json` only — never root, never shared.

## Layout

- `src/content/docs/*.mdx` — one page per primitive (+ `index.mdx`). Sidebar order lives in `astro.config.mjs`.
- `src/components/islands/*.svelte` — live demos, embedded with `client:visible`. One island per page (plus `UtilitiesPlayground` on index).
- `src/components/ApiTable.svelte` — props table used by every page.
- `src/styles/custom.css` — design tokens. Tailwind-only chrome, Inter Variable, orange brand.
- `src/content.config.ts` — content collections. `astro.config.mjs` — Starlight, Vercel adapter, sidebar.

## Page convention

1. Frontmatter `title` + `description`.
2. One-line intro, then the live island inside the bordered demo card (`mt-4 rounded-xl border bg-card p-6 text-card-foreground`).
3. `## Anatomy` — fenced `svelte` block with `title="App.svelte"`, minimal usage.
4. `## API reference` — `### <Namespace>.<Part>` headings with `<ApiTable props={[...]} />` (`name`, `type`, `defaultValue`, `description`).
5. `## Keyboard interactions` — plain `` `Key` `` literals (no `Kbd` component in MDX).
6. Prose before/after parts as needed; never invent props — copy names verbatim from the `.svx` source or the library.

## SSR rule (load-bearing)

`bun run build` prerenders every page, and Svelte's server renderer **executes
`onDestroy` callbacks** during prerender. Islands must not touch browser APIs at
component init or in `onDestroy` — `onMount`, `$effect`, and event handlers are
safe. Library-side violations are fixed with a `typeof window === 'undefined'`
guard, never by switching islands to `client:only` (that would silently drop
prerender coverage of the bug).

## Full documentation

- [Astro routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Svelte framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
