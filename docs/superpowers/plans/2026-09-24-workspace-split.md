# Workspace Split (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single-package svbase repo into a bun-first pnpm-workspace monorepo — `packages/svbase` (the publishable library) + `docs` (the SvelteKit showcase app) — with a private orchestrator root, every task ending in green gates.

**Architecture:** The library moves verbatim into `packages/svbase/src/lib` and keeps its existing relative-import rule; the showcase site content moves into `docs/` and starts importing the library through the `svbase` workspace package (`workspace:*`, dist-first via package `exports`); the root keeps all lint/format tooling configs (`oxfmt`/`oxlint`/`eslint`/`shared-ignore`) and becomes a thin script orchestrator. Tests travel with the library (own `vite.config.ts` with unit + browser vitest projects).

**Tech Stack:** bun (primary) / pnpm (CI, `packageManager` pin) / npm (lockfile parity), Svelte 5 runes, SvelteKit 2 (docs), `@sveltejs/package` + `publint` (lib build), Vitest 5 browser-playwright (tests), oxfmt / oxlint / eslint-plugin-svelte (root tooling).

**Spec:** Phase 0 (pnpm-ready workspace, committed as `add61d7`) and the Phase 1 master-plan agreements in `session-handoff.md` / `progress.md`: root `docs/` + `packages/*` layout, bun primary + pnpm CI + committed lockfiles, oxfmt/oxlint maximal, `cn`/`shiki`/Tailwind/tw-animate docs-only, aliases only in apps (relative imports mandatory in the library), docs components are thin wrappers over the `svbase` workspace package, library keeps `@floating-ui/dom` as its sole runtime dep.

## Global Constraints

- **Git discipline:** commit after every task step batch, on the existing branch (repo has no PR flow). Keep each commit's gates green.
- **Lockfiles:** after any dependency change run `bun install` then `bun run sync:lockfiles` and commit `bun.lock`, `pnpm-lock.yaml`, and `package-lock.json` together.
- **Windows pnpm note:** full `pnpm install` needs Developer Mode (symlink privilege). Gates below run with **bun** (`bun run <script>`), which is the primary PM and works today.
- **Package name conflict:** only ONE package may be named `svbase` per workspace. Root renames to `svbase-workspace` the moment `packages/svbase` exists.
- **Library boundary:** `packages/svbase` ships zero CSS, zero runtime deps except `@floating-ui/dom`, uses only relative imports internally, and never imports `cn`, `shiki`, `tailwindcss`, or `tw-animate-css`.
- **Docs boundary:** `docs/` may use aliases (`@/*`), `$lib`, and the ui deps; all primitives come from `import { ... } from 'svbase'`.
- **Version floors (copy verbatim from current manifests):** svelte `^5.56.1`, @sveltejs/package `^2.5.8`, publint `^0.3.21`, vitest `^5.0.1`, @vitest/browser-playwright `^5.0.1`, vitest-browser-svelte `^3.1.0`, playwright `^1.63.0`, axe-core `^4.13.0`, mdsvex `^0.12.7`, vite `^8.0.16`.
- **Gate standard (Definition of Done):** `check` 0 errors 0 warnings, `format` clean, `lint` 0, `test` 127/127, `prepack` + `publint` "All good!".

---

### Task 1: Relocate library into `packages/svbase`, repoint root pages to the package

**Files:**

- Create: `packages/svbase/package.json`, `packages/svbase/tsconfig.json`, `packages/svbase/vite.config.ts`
- Move: `src/lib/` → `packages/svbase/src/lib/` (whole tree, via `git mv`)
- Modify: `package.json` (root — rename, private, prune publish/test fields, delegate scripts)
- Modify: `src/routes/**/*.svelte` (20 files — `$lib/index.js` → `svbase`)

**Interfaces:**

- Consumes: existing `src/lib/index.ts` public exports (unchanged — moved as-is).
- Produces: `packages/svbase` package whose `exports["."]` → `./dist/index.js` + `./dist/index.d.ts` (built by `svelte-package`); requires `bun run prepack` (root) before any consumer type-check/build.

- [ ] **Step 1: Create the package skeleton and move the library**

```powershell
New-Item -ItemType Directory -Path packages\svbase\src -Force | Out-Null
git mv src/lib packages/svbase/src/lib
```

Verify: `git status` shows `src/lib/*` staged as renames into `packages/svbase/src/lib/`.

- [ ] **Step 2: Write `packages/svbase/package.json`**

```json
{
	"name": "svbase",
	"version": "0.0.1",
	"private": false,
	"type": "module",
	"files": ["dist", "!dist/**/*.test.*", "!dist/**/*.spec.*", "!dist/**/*.fixture.*"],
	"sideEffects": ["**/*.css"],
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js"
		}
	},
	"svelte": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"scripts": {
		"check": "svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
		"prepack": "svelte-package && publint",
		"test": "vitest run"
	},
	"peerDependencies": {
		"svelte": "^5.0.0"
	},
	"dependencies": {
		"@floating-ui/dom": "^1.8.0"
	},
	"devDependencies": {
		"@sveltejs/package": "^2.5.8",
		"@sveltejs/vite-plugin-svelte": "^7.1.2",
		"@types/node": "^26",
		"@vitest/browser-playwright": "^5.0.1",
		"axe-core": "^4.13.0",
		"playwright": "^1.63.0",
		"publint": "^0.3.21",
		"svelte": "^5.56.1",
		"svelte-check": "^4.6.0",
		"typescript": "^6.0.3",
		"vite": "^8.0.16",
		"vitest": "^5.0.1",
		"vitest-browser-svelte": "^3.1.0"
	},
	"keywords": ["svelte"]
}
```

- [ ] **Step 3: Write `packages/svbase/tsconfig.json`**

Standalone (no `.svelte-kit` extend). Options copied verbatim from the current root tsconfig so the lib check is unchanged:

```json
{
	"compilerOptions": {
		"rewriteRelativeImportExtensions": true,
		"allowJs": true,
		"checkJs": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"module": "NodeNext",
		"moduleResolution": "NodeNext",
		"moduleDetection": "force",
		"erasableSyntaxOnly": true,
		"noFallthroughCasesInSwitch": true,
		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true,
		"noImplicitOverride": true,
		"noUnusedParameters": true,
		"noUnusedLocals": false
	},
	"include": ["src"]
}
```

- [ ] **Step 4: Write `packages/svbase/vite.config.ts`**

Vitest (unit + browser) now runs inside the package. Same test projects as the old root `vite.config.ts`, but with the plain svelte plugin instead of the kit plugin:

```ts
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	],
	test: {
		projects: [
			{
				test: {
					name: 'unit',
					include: ['src/**/*.test.ts'],
					exclude: ['src/**/*.browser.test.ts']
				}
			},
			{
				test: {
					name: 'browser',
					include: ['src/**/*.browser.test.ts'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }]
					}
				}
			}
		]
	}
});
```

- [ ] **Step 5: Rewrite the root `package.json`**

Rename root to `svbase-workspace` (required to avoid the duplicate `svbase` name), mark private, drop the publish fields (`files`, `sideEffects`, `svelte`, `types`, `exports`, `peerDependencies`, `dependencies`), prune test/packaging devDeps moved into the package, and delegate `prepack`/`test` to the package:

```json
{
	"name": "svbase-workspace",
	"version": "0.0.1",
	"private": true,
	"packageManager": "pnpm@12.5.1",
	"workspaces": ["docs", "packages/*"],
	"scripts": {
		"dev": "vite dev",
		"build": "vite build && bun run prepack",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"prepack": "bun run --cwd packages/svbase prepack",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "oxlint && eslint src --ext .svelte --cache",
		"lint:fix": "oxlint --fix && eslint src --fix --cache",
		"format": "oxfmt --check",
		"format:fix": "oxfmt",
		"test": "bun run --cwd packages/svbase test",
		"sync:lockfiles": "pnpm install --lockfile-only && npm install --package-lock-only --ignore-scripts"
	},
	"devDependencies": {
		"@sveltejs/adapter-auto": "^7.0.1",
		"@sveltejs/kit": "^2.63.0",
		"@sveltejs/vite-plugin-svelte": "^7.1.2",
		"@tailwindcss/vite": "^4.3.3",
		"cn": "^0.4.0",
		"eslint": "^10.4.1",
		"eslint-plugin-perfectionist": "^5.12.0",
		"eslint-plugin-svelte": "^3.19.0",
		"globals": "^17.6.0",
		"oxfmt": "^0.70.0",
		"oxlint": "^1.85.0",
		"oxlint-tsgolint": "^7.0.2002",
		"shiki": "^4.4.3",
		"svelte": "^5.56.1",
		"svelte-check": "^4.6.0",
		"tailwindcss": "^4.3.3",
		"tw-animate-css": "^1.4.0",
		"typescript": "^6.0.3",
		"typescript-eslint": "^8.60.1",
		"vite": "^8.0.16"
	}
}
```

(`cn`, `shiki`, Tailwind, tw-animate stay at root in Task 1 because the showcase still lives in `src/routes`; they move to `docs` in Task 2.)

- [ ] **Step 6: Repoint the 20 page imports from `$lib/index.js` to the `svbase` package**

```powershell
Get-ChildItem src\routes -Recurse -Filter *.svelte | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  $c = $c -replace "from '\$lib/index\.js'", "from 'svbase'"
  Set-Content $_.FullName $c -NoNewline
}
```

Verify: `Select-String -Path src\routes -Recurse -Pattern "from '\$lib"` returns nothing; `git diff --stat` shows only import-line changes.

- [ ] **Step 7: Reinstall (resolves the workspace), build the package, run all gates**

```powershell
bun install
bun run prepack          # builds packages/svbase/dist (needed before check/build below)
bun run check            # routes now type-check against dist types
bun run test             # 127/127 from packages/svbase
bun run build            # showcase consumes the built package
bun run lint
bun run format
```

Expected: check 0/0, test 127/127, build OK, lint 0, format clean. If `svelte-check` in the package alone (no `.svelte-kit`) flags missing a11y/kit ambient types, add `"types": []` to `packages/svbase/tsconfig.json` `compilerOptions` and re-run.

- [ ] **Step 8: Regenerate lockfiles and commit**

```powershell
bun run sync:lockfiles
git add -A
git commit -m "refactor(lib): move library into packages/svbase workspace package"
```

Commit must include: `packages/svbase/**`, updated `package.json`, `bun.lock`, `pnpm-lock.yaml`, `package-lock.json` (new), and the 20 page edits.

---

### Task 2: Relocate the showcase into `docs/`, collapse root to orchestrator

**Files:**

**Amendment (user directive — supersedes the original Task 2 plan):** everything that belongs to the svbase project — harness, tooling configs, agent config — moves INTO `packages/svbase`. Docs becomes a self-contained SvelteKit app (own tooling configs). Root becomes a thin delegating orchestrator with zero devDeps.

**Files:**

- Remove: `docs/src/routes/**` (placeholders), `docs/src/lib/**` (placeholder + favicon), `docs/src/app.html`; empty root `src/`, `static/` dirs (after moves)
- Move (showcase → docs): `src/routes/**` → `docs/src/routes/`, `src/assets/app.css` → `docs/src/assets/app.css`, `src/app.html` → `docs/src/app.html`, `static/favicon.svg` → `docs/static/favicon.svg`
- Move (svbase project → `packages/svbase/`): `AGENTS.md`, `CLAUDE.md`, `feature_list.json`, `progress.md`, `session-handoff.md`, `init.sh`, `init.ps1`, `eslint.config.js`, `oxfmt.config.ts`, `oxlint.config.ts`, `shared-ignore.config.js`, `.npmrc`, `.npmignore`, `.agents/`, `.claude/`, `.opencode/`
- Create: `docs/src/assets/` (dir), `packages/svbase/.gitignore` (clean rewrite), `docs/eslint.config.js`, `docs/shared-ignore.config.js`, `docs/oxfmt.config.ts`, `docs/oxlint.config.ts`, root `AGENTS.md` (thin workspace stub)
- Modify: `docs/package.json`, `docs/vite.config.ts`, `packages/svbase/package.json`, root `package.json`
- Delete: root `vite.config.ts`, root `tsconfig.json`

**Interfaces:**

- Consumes: `svbase` package from Task 1 (dist build via `bun run prepack` before docs check/build).
- Produces: root scripts `dev`/`build`/`preview`/`check`/`test`/`prepack`/`lint`/`format` that delegate to `docs` + `packages/svbase` via `bun run --cwd <pkg>`.

**Hard facts (controller-verified empirically; must not be violated):**

- `node_modules` is NEVER copied or moved between directories — only (re)installed via `bun install`. bun workspace linking requires root `node_modules/.bun` (every package's symlinks point into it), so root `node_modules` must exist after install; it is gitignored and regenerable.
- Tooling configs resolve from the invoking cwd upward → every package with a `lint`/`format` script carries its own `eslint.config.js`, `oxlint.config.ts`, `oxfmt.config.ts`, `shared-ignore.config.js` in its own directory.

- [ ] **Step 1: Move the showcase content into `docs`**

```powershell
git rm -rf docs/src/routes docs/src/lib docs/src/app.html
git mv src/routes docs/src/routes
New-Item -ItemType Directory -Path docs\src\assets -Force | Out-Null
git mv src/assets/app.css docs/src/assets/app.css
git mv src/app.html docs/src/app.html
git mv static/favicon.svg docs/static/favicon.svg
Remove-Item src -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item static -Recurse -Force -ErrorAction SilentlyContinue
```

Verify: `git status` — nothing left under root `src/` or `static/`; `docs/src/routes/` contains the 24 real files (`+layout.svelte`, `+page.svelte`, `ApiTable.svelte`, `CodeBlock.svelte`, `docs.ts`, 19 primitive dirs).

- [ ] **Step 2: Write `docs/package.json`**

- [ ] **Step 2: Nest the svbase project files into `packages/svbase`**

```powershell
git mv AGENTS.md packages/svbase/AGENTS.md
git mv CLAUDE.md packages/svbase/CLAUDE.md
git mv feature_list.json packages/svbase/feature_list.json
git mv progress.md packages/svbase/progress.md
git mv session-handoff.md packages/svbase/session-handoff.md
git mv init.sh packages/svbase/init.sh
git mv init.ps1 packages/svbase/init.ps1
git mv eslint.config.js packages/svbase/eslint.config.js
git mv oxfmt.config.ts packages/svbase/oxfmt.config.ts
git mv oxlint.config.ts packages/svbase/oxlint.config.ts
git mv shared-ignore.config.js packages/svbase/shared-ignore.config.js
git mv .npmrc packages/svbase/.npmrc
git mv .npmignore packages/svbase/.npmignore
git mv .agents packages/svbase/.agents
git mv .claude packages/svbase/.claude
git mv .opencode packages/svbase/.opencode
```

Verify each with `Test-Path packages/svbase/<name>`. Then overwrite `packages/svbase/.gitignore` with a clean copy (the existing one has a corrupted `# Logs`/`=== logs ===` block):

```gitignore
# Dependencies
node_modules/
node_modules/.bin/

# Bun specific
bun.lockb
.bun/
*.bun-build

# Build and Outputs
dist
build
.svelte-kit
out

# Vite and Test specific
/.vite/
coverage/
.vitest
html/

# Logs
*.log

# Tooling cache & timestamps
.eslintcache
.cache
vite.config.ts.timestamp-*

# Environment Variables & Secrets
.env*
!.env.example

# Operating System Files
.DS_Store
Thumbs.db

# IDEs and Editors
.idea/
*.suo
```

- [ ] **Step 3: Write `docs/package.json`** (self-contained showcase: ui deps that moved from root, `svbase` workspace link, and its own lint/format tooling)

```json
{
	"name": "docs",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "oxlint && eslint src --ext .svelte --cache",
		"lint:fix": "oxlint --fix && eslint src --fix --cache",
		"format": "oxfmt --check",
		"format:fix": "oxfmt"
	},
	"devDependencies": {
		"@sveltejs/adapter-vercel": "^6.3.3",
		"@sveltejs/kit": "^2.63.0",
		"@sveltejs/vite-plugin-svelte": "^7.1.2",
		"@tailwindcss/vite": "^4.3.0",
		"@types/node": "^26",
		"cn": "^0.4.0",
		"eslint": "^10.4.1",
		"eslint-plugin-perfectionist": "^5.12.0",
		"eslint-plugin-svelte": "^3.19.0",
		"globals": "^17.6.0",
		"mdsvex": "^0.12.7",
		"oxfmt": "^0.70.0",
		"oxlint": "^1.85.0",
		"oxlint-tsgolint": "^7.0.2002",
		"shiki": "^4.4.3",
		"svelte": "^5.56.1",
		"svelte-check": "^4.6.0",
		"svbase": "workspace:*",
		"tailwindcss": "^4.3.0",
		"tw-animate-css": "^1.4.0",
		"typescript": "^6.0.3",
		"typescript-eslint": "^8.60.1",
		"vite": "^8.0.16"
	}
}
```

- [ ] **Step 4: Add the `@/*` alias to `docs/vite.config.ts`**

Full file (adds `alias: { '@/*': './src/*' }` to the `sveltekit()` call so `+layout.svelte`'s `import '@/assets/app.css'` resolves):

```ts
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md'],
			alias: {
				'@/*': './src/*'
			}
		})
	]
});
```

- [ ] **Step 5: Copy the lint/format configs into `docs`** (each package is self-contained)

```powershell
Copy-Item packages/svbase/eslint.config.js docs/eslint.config.js
Copy-Item packages/svbase/shared-ignore.config.js docs/shared-ignore.config.js
Copy-Item packages/svbase/oxfmt.config.ts docs/oxfmt.config.ts
Copy-Item packages/svbase/oxlint.config.ts docs/oxlint.config.ts
```

The copies reference `./shared-ignore.config.js` and the cwd `.gitignore` (docs/.gitignore already exists); both resolve inside `docs/`. The `perfectionist/sort-imports` `$lib/*` groups simply never match outside the library — harmless.

- [ ] **Step 6: Add tooling deps and scripts to `packages/svbase/package.json`**

The moved configs (`eslint.config.js`, `oxfmt.config.ts`, `oxlint.config.ts`) need their plugins available in the package, and the package needs its own lint/format orchestration:

```json
{
	"name": "svbase",
	"version": "0.0.1",
	"private": false,
	"type": "module",
	"files": [
		"dist",
		"!dist/**/*.test.*",
		"!dist/**/*.spec.*",
		"!dist/**/*.fixture.*"
	],
	"sideEffects": [
		"**/*.css"
	],
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js"
		}
	},
	"svelte": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"scripts": {
		"check": "svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
		"prepack": "svelte-package && publint",
		"test": "vitest run",
		"lint": "oxlint && eslint src --ext .svelte --cache",
		"lint:fix": "oxlint --fix && eslint src --fix --cache",
		"format": "oxfmt --check",
		"format:fix": "oxfmt"
	},
	"peerDependencies": {
		"svelte": "^5.0.0"
	},
	"dependencies": {
		"@floating-ui/dom": "^1.8.0"
	},
	"devDependencies": {
		"@sveltejs/package": "^2.5.8",
		"@sveltejs/vite-plugin-svelte": "^7.1.2",
		"@types/node": "^26",
		"@vitest/browser-playwright": "^5.0.1",
		"axe-core": "^4.13.0",
		"eslint": "^10.4.1",
		"eslint-plugin-perfectionist": "^5.12.0",
		"eslint-plugin-svelte": "^3.19.0",
		"globals": "^17.6.0",
		"oxfmt": "^0.70.0",
		"oxlint": "^1.85.0",
		"oxlint-tsgolint": "^7.0.2002",
		"playwright": "^1.63.0",
		"publint": "^0.3.21",
		"svelte": "^5.56.1",
		"svelte-check": "^4.6.0",
		"typescript": "^6.0.3",
		"typescript-eslint": "^8.60.1",
		"vite": "^8.0.16",
		"vitest": "^5.0.1",
		"vitest-browser-svelte": "^3.1.0"
	},
	"keywords": [
		"svelte"
	]
}
```

The eslint/oxfmt/oxlint configs' ignore patterns already cover `node_modules`, `dist`, `build`, `.svelte-kit`, `.agents/`, `.claude/`, `.opencode/` — the nested harness dirs are excluded from the package's own lint scan.

- [ ] **Step 7: Rewrite root `package.json` to a thin orchestrator with zero devDeps**

All project work (check, lint, format, test, build) now runs inside the packages; root only delegates and syncs lockfiles:

```json
{
	"name": "svbase-workspace",
	"version": "0.0.1",
	"private": true,
	"packageManager": "pnpm@12.5.1",
	"workspaces": [
		"docs",
		"packages/*"
	],
	"scripts": {
		"dev": "bun run --cwd docs dev",
		"build": "bun run prepack && bun run --cwd docs build",
		"preview": "bun run --cwd docs preview",
		"prepack": "bun run --cwd packages/svbase prepack",
		"check": "bun run --cwd packages/svbase check && bun run prepack && bun run --cwd docs check",
		"check:watch": "bun run --cwd packages/svbase check:watch",
		"lint": "bun run --cwd packages/svbase lint && bun run --cwd docs lint",
		"lint:fix": "bun run --cwd packages/svbase lint:fix && bun run --cwd docs lint:fix",
		"format": "bun run --cwd packages/svbase format && bun run --cwd docs format",
		"format:fix": "bun run --cwd packages/svbase format:fix && bun run --cwd docs format:fix",
		"test": "bun run --cwd packages/svbase test",
		"sync:lockfiles": "pnpm install --lockfile-only && npm install --package-lock-only --ignore-scripts"
	},
	"devDependencies": {}
}
```

`sync:lockfiles` runs at root (pnpm/npm workspace roots); npm's `package-lock.json` may still fail on the `.bun` store (see Plan review ledger Ruling 7) — commit what resolves and report the npm error verbatim. Then add a thin workspace `AGENTS.md` so root-level sessions stay oriented (the full harness now lives in the package):

```markdown
# svbase (workspace)

Root orchestrator for two packages:

- `packages/svbase/` — the publishable Svelte 5 headless-primitive library. All project harness lives here: read its `AGENTS.md`, then `.agents/rules/`, and run `init.ps1`/`init.sh` from that directory.
- `docs/` — SvelteKit showcase app consuming the library as the `svbase` workspace package.

Root scripts delegate to the packages (`bun run dev/check/test/lint/format/prepack/build`). bun is the primary package manager; pnpm handles CI/CD lockfiles.
```

- [ ] **Step 8: Delete dead root files**

```powershell
git rm vite.config.ts tsconfig.json
```

Root keeps only: `package.json`, `pnpm-workspace.yaml`, `AGENTS.md` (stub), `.gitignore`, `README.md`, lockfiles. Everything else that belongs to the svbase project now lives in `packages/svbase/`.

- [ ] **Step 9: Reinstall and run every gate from the root**

```powershell
bun install
bun run check
bun run test
bun run build
bun run lint
bun run format
bun run prepack
```

Expected: check 0/0 (lib then docs), test 127/127, docs production build OK, lint 0 (both packages), format clean (both packages), prepack + publint "All good!". `node_modules` is installed fresh — never copied or moved. If `docs` check reports unresolved `svbase` types, confirm the workspace link was created by re-running `bun install` and that `packages/svbase/dist` exists (from `bun run prepack`).

- [ ] **Step 10: Smoke-test the docs site**

```powershell
bun run --cwd docs dev
```

Expected: dev server starts; `/` renders the showcase home and the nav; one primitive page (e.g. `/dialog`) opens a dialog and `/button` renders. `Ctrl+C` to stop. If the server picks a non-default port, report the actual one.

- [ ] **Step 11: Regenerate lockfiles and commit**

```powershell
bun run sync:lockfiles
git add -A
git commit -m "refactor(workspace): relocate showcase docs, nest svbase harness in packages/svbase"
```

Commit must include: `docs/**` moved content, `packages/svbase/**` nested harness + configs + `package.json` + `.gitignore`, new `docs` configs, root `package.json` + `AGENTS.md`, removed root files, and the lockfiles that resolved (`bun.lock`, `pnpm-lock.yaml`; `package-lock.json` only if npm did not crash).

---

### Task 3: Update harness artifacts for the monorepo layout

**Files:**

- Move: `README.md` → `packages/svbase/README.md` (the library README belongs to the package — shows on npm)
- Create: root `README.md` (thin monorepo overview)
- Modify (all inside `packages/svbase/`): `AGENTS.md`, `init.ps1`, `init.sh`, `feature_list.json`, `progress.md`, `session-handoff.md`, `.agents/rules/*.md`, `CLAUDE.md` — path references only

**Interfaces:**

- Consumes: Task 2 final layout (`packages/svbase/` self-contained harness + tooling; `docs/` self-contained app; root thin).
- Produces: documentation that a fresh agent session can navigate both the workspace and the package without re-deriving the split.

- [ ] **Step 1: Move `README.md` into the package + write a thin root README**

```powershell
git mv README.md packages/svbase/README.md
```

New root `README.md`, ~15 lines workspace overview: what the repo is (`docs` showcase + `packages/svbase` library), quickstart (`bun install`, `bun run dev`), the gates (`bun run check`, `bun run test`, `bun run prepack`), and a harness pointer to `packages/svbase/AGENTS.md`.

- [ ] **Step 2: Update `packages/svbase/AGENTS.md`**

Add a `## Repository Layout` section describing the split:

```markdown
## Repository Layout

- `packages/svbase/` — the publishable library (`src/lib`, tests, `prepack`/`publint`) and its self-contained harness (this AGENTS.md, `.agents/`, `init.*`, `feature_list.json`, `eslint`/`oxfmt`/`oxlint` configs). Relative imports only.
- `docs/` — SvelteKit showcase app consuming the library as the `svbase` workspace package, with its own copy of the lint/format configs. Aliases/`$lib`/UI deps allowed there.
- Root — thin orchestrator: `bun run <script>` delegates to each package; zero devDeps.
```

Fix any stale path references in the existing content (e.g. "Mounted on demo page `src/routes/+page.svelte`" → `docs/src/routes/...`).

- [ ] **Step 3: Fix path references in `packages/svbase/.agents/rules/` + `CLAUDE.md`**

```powershell
Select-String -Path .agents\rules\*.md,CLAUDE.md -Pattern 'src[/\\]lib|src[/\\]routes'
```

Edit each match to `packages/svbase/src/lib` / `docs/src/routes`; do not touch rule content beyond the path strings.

- [ ] **Step 4: Refresh `packages/svbase/init.ps1` / `init.sh`**

Steps already run inside the package (same directory as before), so the local paths still hold; update the trailing "Next steps" hints to reference the split: (1) read this AGENTS.md + `.agents/rules/`, (2) pick a feature from the local `feature_list.json`, (3) run the package gates via local `bun run <script>` — docs gates run in `docs/`.

- [ ] **Step 5: Record the milestone in harness artifacts (in `packages/svbase/`)**

- `feature_list.json`: roadmap entry `monorepo workspace split` (Phase 1) with `"status": "done"` and the commit hashes from Tasks 1–2 (+ this task) in `"evidence"`.
- `progress.md`: dated Phase 1 entry (what moved, gate results, the `ponytail:` dev-DX note, the parked `package-lock.json` issue).
- `session-handoff.md`: next steps → Phase 2: mdsvex `.svx` conversion of docs pages, dark mode, deploy adapter cadence, first npm publish.

- [ ] **Step 6: Full final verification and commit**

```powershell
bun run check
bun run test
bun run lint
bun run format
bun run prepack
git add -A
git commit -m "docs: update harness artifacts for monorepo layout"
```

Expected: identical gate results to Task 2 Step 9; commit contains only docs/harness files.

---

## Self-Review

**Spec coverage:** Phase 0 agreements (layout `docs` + `packages/*`, lockfile sync, name collision, PM split) → Task 1 Steps 1/5 + Task 2 Steps 2/4/8. "Move library, manifest split" → Task 1. "Docs link `svbase: workspace:*`, move routes as-is, per-package gates" → Task 2. "cn/shiki/Tailwind docs-only" → Task 2 Step 2 (moved out of root/lib). "Aliases only where allowed, relative imports in lib" → untouched path, verified by gates. Harness artifacts → Task 3.

**Placeholder scan:** No TBD/"later". Every code step carries full file contents or exact commands. The one rule-edit step (Task 3 Step 3) is deliberately grep-driven because `.agents/rules/*.md` path mentions are few and line-specific — the executor's grep output is the content gate.

**Type / name consistency:** Package name `svbase` (Task 1) and root `svbase-workspace` (Task 1 Step 5) are the only such names and never co-exist as publishes. `exports`/`types`/`svelte` fields match between `packages/svbase/package.json` and the dist output produced by `svelte-package`. Root scripts reference `packages/svbase` and `docs` via the exact `package.json` `name` fields. `check` ordering (lib → prepack → docs) is specified identically in Task 2 Steps 7 and 9.

**Amendment (2026-09-24):** Task 2 was re-scoped by user directive — everything that belongs to the svbase project (harness, tooling configs, agent config) nests into `packages/svbase/`; `docs/` becomes self-contained (own eslint/oxfmt/oxlint configs); root becomes a thin delegating orchestrator with zero devDeps and a stub `AGENTS.md`. Hard facts recorded in the Task 2 section: `node_modules` is never copied/moved (only reinstalled), and bun workspace linking requires the root `node_modules/.bun` store.

---

## Execution Handoff

After Task 1 is committed, execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks.
2. **Inline Execution** — execute tasks in this session with checkpoints.
