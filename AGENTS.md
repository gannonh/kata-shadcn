# Repository Guidelines

Guidance for Claude Code (claude.ai/code), Cursor agents, and humans working in this repository.

## Using agent skills

When following an agent skill (e.g. pull-requests, kata-linear):

- **Paths are skill-relative.** References (e.g. `./references/reviewing-workflow.md`) and scripts (e.g. `scripts/fetch_comments.py`) live under the skill’s directory, not the current workspace.
- Resolve and run scripts from the skill root (by full path or by running the command from the skill directory). Do not look for those files only in the workspace or assume they are in the repo—you will miss them.

## What this is

Private component registry optimized for AI agent discovery (~2500 components; see `lib/component-index.json` for current count). Deployed at https://shadcn-registry-eight.vercel.app (auto-deploys on push to main).

## Commands

```bash
pnpm install              # install dependencies
pnpm dev                  # Next.js dev server (Turbopack)
pnpm build                # registry:build + next build
pnpm start                # production server
pnpm lint                 # ESLint (next/core-web-vitals + TypeScript)
pnpm registry:build       # Regenerate public/r/ and lib/component-index.json from registry/ sources
pnpm test                 # Unit tests (Node test runner): build-registry output / install commands
pnpm test:coverage        # Same plus c8 coverage report; enforces lines ≥80%, functions ≥80%, branches ≥65%
pnpm test:e2e             # E2E tests (Playwright): browser UI component cards
```

**Tests:** Unit test in `scripts/build-registry.test.mjs` (Node `--test`) asserts `lib/component-index.json` is non-empty, every `installCommand` uses `@kata-shadcn` scope, and no entry contains the legacy `@ourorg` scope. E2E in `tests/e2e/` (Playwright) assert the browser UI shows correct install commands. **Coverage:** `pnpm test:coverage` runs unit tests with c8; coverage targets (package.json `c8`) are lines ≥80%, functions ≥80%, branches ≥65% for `scripts/build-registry.ts`.

**CI:** Two jobs: `lint-build-test` (lint, unit tests, coverage, Next build) and `e2e` (depends on `lint-build-test`; runs `pnpm build` then Playwright Chromium E2E tests against the production server). Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm and GitHub Actions updates.

## Architecture

**Build pipeline:** `registry.json` → `scripts/build-registry.ts` → `public/r/{name}.json` (shadcn CLI-ready format) + `lib/component-index.json` (browser UI index) + `public/r/index.json` (full agent discovery) + `public/r/index-compact.json` (compact agent index: name, category, url only).

**Source of truth:** `registry/` directory. `registry.json` is the manifest. Each component lives in `registry/blocks/{name}/{name}.tsx`. Shared helpers in `registry/components/`. Generated output in `public/r/` is gitignored.

**Path mapping at build time:** `registry/blocks/about1/about1.tsx` → `block/about1.tsx` in the consumer-facing JSON. `registry/components/foo.tsx` → `components/foo.tsx`. Nested paths are preserved: `registry/components/shared/logo.tsx` → `components/shared/logo.tsx`.

**Auth (middleware.ts):** All `/r/*` requests require `x-registry-token` header matching `REGISTRY_TOKEN` env var. Public passthroughs (no token): `/r/styles/*`, `/r/colors/*`, `/r/icons/*`. If `REGISTRY_TOKEN` is unset, all requests are allowed (local dev mode).

**Browser UI:** `app/page.tsx` renders a client-side searchable component index loaded from `lib/component-index.json`.

**Compatibility routes:** `app/styles/*`, `app/r/styles/*`, `app/r/colors/*`, and `app/r/icons/*` all proxy to the upstream shadcn registry. The middleware also skips token validation for `/r/styles/*`, `/r/colors/*`, and `/r/icons/*`.

## Registry API for agents

Agents can discover and install components via HTTP. All registry endpoints live under `/r/`. Use the compact index for discovery to keep payloads small (~80–100KB); fetch full component JSON only when needed.

### Base URL and authentication

- **Base URL:** Deployed registry root (e.g. `https://shadcn-registry-eight.vercel.app`) or `http://localhost:3000` for local dev.
- **Header:** `x-registry-token: <token>` — must match the server’s `REGISTRY_TOKEN` environment variable.
- **When token is required:** In production, `REGISTRY_TOKEN` is set; every request to `/r/*` (except `/r/styles/*`, `/r/colors/*`, `/r/icons/*`) must include a valid `x-registry-token` or the server returns `401 Unauthorized`.
- **Local dev mode:** If `REGISTRY_TOKEN` is not set, the server allows all requests without a token (for local development only).

### Endpoints and response shapes

| Endpoint | Description | Response shape |
|----------|-------------|----------------|
| `GET /r/index-compact.json` | Compact list for discovery (~80–100KB). Filter by `name` or `category` client-side. | `{ total: number, items: Array<{ name: string, category: string, url: string }> }` — `url` is the path to the component JSON, e.g. `/r/hero1.json`. |
| `GET /r/index.json` | Full agent index with titles, descriptions, and enriched metadata. Heavier than compact. | `{ total: number, items: Array<{ name: string, title: string, description: string, category: string, url: string, tags: string[], complexity: { files: number, lines: number, dependencies: number }, contentHash: string, lastModified?: string, peerComponents: string[] }> }`. `lastModified` is optional and omitted when not in a git repo. |
| `GET /r/{name}.json` | Single component in shadcn CLI format. Use `name` from an index entry. | `{ $schema: string, name: string, type: string, title: string, description: string, files: Array<{ path: string, content: string, type: string }>, dependencies?: string[], registryDependencies?: string[] }`. `files` contain path and source content for the CLI to write. |

### Categories

Components are organized into 31 curated categories (collapsed from raw name derivation via `lib/category-collapse.json`). Filter `items` client-side on the `category` field. Valid values:

About, Alert & Dialog, Avatar, Blog, Button, Card, Chart, Contact, Content, CTA, Data & Table, Feature, Footer, Forms - Input & Text, Forms - Select & Controls, Gallery, Hero, Navigation, Other, Pricing, Product, Progress & Skeleton, Projects, Services, Settings, Sidebar, Tabs & Accordion, Testimonial, Timeline, Tooltip & Popover, Trust & Logos

### Example workflow: find a component and install it

1. **Discover:** `GET /r/index-compact.json` with header `x-registry-token: <token>`. Parse `items` and filter by `name` or `category` (e.g. `category === "hero"`).
2. **Choose:** Pick an entry and note `name` and `url` (e.g. `name: "hero1"`, `url: "/r/hero1.json"`).
3. **Fetch details (optional):** `GET /r/hero1.json` with the same header to get full metadata and file list. The CLI can also resolve the component by name.
4. **Install in consumer app:** In the consumer project (with `components.json` configured for this registry and `REGISTRY_TOKEN` in env), run: `npx shadcn add @kata-shadcn/hero1`.

### Consumer setup

- **Registry config:** In the consuming app’s `components.json`, add this registry (or merge with existing `registries`): `{ "name": "Kata Shadcn", "url": "<REGISTRY_BASE_URL>", "scope": "kata-shadcn" }`. Use the same base URL as above (e.g. `https://shadcn-registry-eight.vercel.app`).
- **Token:** Set `REGISTRY_TOKEN` in the environment (e.g. in `.env.local`) to the same secret the registry server expects. The shadcn CLI uses it when fetching from the registry.

## Project structure

- `app/`: Next.js App Router UI and compatibility routes under `app/r/*` and `app/styles/*`.
- `components/`: shared UI components used by the browser interface.
- `registry/blocks/` and `registry/components/`: source-of-truth component files for registry items.
- `scripts/build-registry.ts`: generates registry payloads in `public/r/` (per-component JSON, `index.json`, `index-compact.json`) and browser UI search data in `lib/component-index.json`.
- `scripts/generate-manifest.ts`: regenerates `registry.json` from built `public/r/` output; run after `registry:build` to sync the manifest.
- `docs/`: plans and references. `public/`: static assets and generated registry JSON output.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4, pnpm. Path alias: `@/*` → `./`.

`registry/blocks/` and `registry/components/` are excluded from tsconfig (they're raw component sources, not part of the app build).

## Environment variables

- `REGISTRY_TOKEN` — secret for `/r/*` auth (required in production)
- `REGISTRY_URL` — deployed base URL
- `SHADCN_FALLBACK_REGISTRY_URL` — override for unscoped dependency proxy (defaults to `https://ui.shadcn.com/r`)

## Component workflow

**Edit:** modify files in `registry/blocks/{name}/` or `registry/components/`, run `pnpm registry:build`, deploy.

**Add:** create `registry/blocks/{name}/{name}.tsx`, add entry to `registry.json`, run `pnpm registry:build`, deploy.

Consumers install with: `npx shadcn add @kata-shadcn/{name}` (requires `components.json` registry config and `REGISTRY_TOKEN` in env).

## Coding style & naming

- Stack: TypeScript, React 19, Next.js 15.
- Follow existing code style: 2-space indentation, double quotes, no semicolons, functional components.
- Keep types strict (`tsconfig.json` has `"strict": true`); avoid `any` except when unavoidable.
- Prefer internal imports via alias `@/*`.
- Use existing registry naming patterns (example: `registry/blocks/hero1/hero1.tsx`).

## Testing

- Unit: `scripts/build-registry.test.mjs` (Node `--test`) checks registry build output uses `@kata-shadcn` scope.
- E2E: `tests/e2e/` (Playwright) checks the browser UI shows correct install commands on component cards.
- Before opening a PR, run `pnpm run check` (runs lint, unit tests, coverage, and build — same as CI) and optionally `pnpm test:e2e`.
- For registry or auth changes, manually verify endpoints, e.g. `curl -H "x-registry-token: $REGISTRY_TOKEN" http://localhost:3000/r/index.json`. Also verify `curl http://localhost:3000/r/index-compact.json` returns a minified JSON object with `total` and `items` keys.
- Include clear reproduction and verification steps in PR descriptions.

## Commit & pull request guidelines

- Follow conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`.
- Keep commits scoped to one change.
- If `registry/` or `registry.json` changes, commit the regenerated `lib/component-index.json`. (`public/r/` is gitignored and not committed.)
- PRs should include: summary, impacted paths, verification commands/results, linked issue, and UI screenshots when relevant.

## Security & configuration

- Never commit real secrets. Use `.env.local` for `REGISTRY_TOKEN`.
- `/r/*` is token-protected by middleware, except passthrough dependency routes under `/r/styles/*`, `/r/colors/*`, and `/r/icons/*`.

## Project management

Linear project: [Kata Shadcn Registry](https://linear.app/kata-sh/project/kata-shadcn-registry-4b3fcae34eed) in team Kata-sh.

When starting work on an issue, use `/kata-linear start KAT-N` to create a branch and move the issue to In Progress. When done, use `/kata-linear end KAT-N` to wrap up.

**Milestones (in execution order):**
1. **Quick Wins** — bug fixes, category cleanup, compact agent index, usage logging
2. **Analytics & Metadata** — usage dashboard, index enrichment (tags, complexity, hashes)
3. **Visual Catalog** — render audit, Playwright screenshot harness, preview thumbnails
4. **Curation & Bundles** — page recipes, page builder bundles with layout scaffolding
5. **Discovery & Growth** — semantic search with LLM-enriched descriptions, OSS template
