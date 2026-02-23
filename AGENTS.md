# Repository Guidelines

Guidance for Claude Code (claude.ai/code), Cursor agents, and humans working in this repository.

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
pnpm test:e2e             # E2E tests (Playwright): browser UI component cards
```

**Tests:** Unit test in `scripts/build-registry.test.mjs` (Node `--test`) asserts `lib/component-index.json` is non-empty, every `installCommand` uses `@kata-shadcn` scope, and no entry contains the legacy `@ourorg` scope. E2E in `tests/e2e/` (Playwright) assert the browser UI shows correct install commands.

**CI:** Two jobs: `lint-build-test` (lint, unit tests, Next build) and `e2e` (depends on `lint-build-test`; runs `pnpm build` then Playwright Chromium E2E tests against the production server). Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm and GitHub Actions updates.

## Architecture

**Build pipeline:** `registry.json` → `scripts/build-registry.ts` → `public/r/{name}.json` (shadcn CLI-ready format) + `lib/component-index.json` (browser UI index) + `public/r/index.json` (agent discovery).

**Source of truth:** `registry/` directory. `registry.json` is the manifest. Each component lives in `registry/blocks/{name}/{name}.tsx`. Shared helpers in `registry/components/`. Generated output in `public/r/` is gitignored.

**Path mapping at build time:** `registry/blocks/about1/about1.tsx` → `block/about1.tsx` in the consumer-facing JSON. `registry/components/foo.tsx` → `components/foo.tsx`. Nested paths are preserved: `registry/components/shared/logo.tsx` → `components/shared/logo.tsx`.

**Auth (middleware.ts):** All `/r/*` requests require `x-registry-token` header matching `REGISTRY_TOKEN` env var. Public passthroughs (no token): `/r/styles/*`, `/r/colors/*`, `/r/icons/*`. If `REGISTRY_TOKEN` is unset, all requests are allowed (local dev mode).

**Browser UI:** `app/page.tsx` renders a client-side searchable component index loaded from `lib/component-index.json`.

**Compatibility routes:** `app/styles/*`, `app/r/styles/*`, `app/r/colors/*`, and `app/r/icons/*` all proxy to the upstream shadcn registry. The middleware also skips token validation for `/r/styles/*`, `/r/colors/*`, and `/r/icons/*`.

## Project structure

- `app/`: Next.js App Router UI and compatibility routes under `app/r/*` and `app/styles/*`.
- `components/`: shared UI components used by the browser interface.
- `registry/blocks/` and `registry/components/`: source-of-truth component files for registry items.
- `scripts/build-registry.ts`: generates registry payloads in `public/r/` and search data in `lib/component-index.json`.
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
- Before opening a PR, run `pnpm lint`, `pnpm test`, `pnpm build`, and optionally `pnpm test:e2e`.
- For registry or auth changes, manually verify endpoints, e.g. `curl -H "x-registry-token: $REGISTRY_TOKEN" http://localhost:3000/r/index.json`.
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
