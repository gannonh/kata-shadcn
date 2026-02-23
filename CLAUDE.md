# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Private self-hosted shadcn component registry with 2555 components. Deployed at https://shadcn-registry-eight.vercel.app (auto-deploys on push to main).

## Commands

```bash
pnpm dev                # Next.js dev server (Turbopack)
pnpm build              # registry:build + next build
pnpm lint               # ESLint
pnpm registry:build     # Regenerate public/r/ and lib/component-index.json from registry/ sources
pnpm test              # Unit tests (Node test runner): build-registry output / install commands
pnpm test:e2e          # E2E tests (Playwright): browser UI component cards
```

**Tests:** Unit test in `scripts/build-registry.test.mjs` (Node `--test`) asserts `lib/component-index.json` uses `@kata-shadcn` scope. E2E in `tests/e2e/` (Playwright) assert the browser UI shows correct install commands.

## Architecture

**Build pipeline:** `registry.json` → `scripts/build-registry.ts` → `public/r/{name}.json` (shadcn CLI-ready format) + `lib/component-index.json` (browser UI index) + `public/r/index.json` (agent discovery).

**Source of truth:** `registry/` directory. `registry.json` is the manifest. Each component lives in `registry/blocks/{name}/{name}.tsx`. Shared helpers in `registry/components/`. Generated output in `public/r/` is gitignored.

**Path mapping at build time:** `registry/blocks/about1/about1.tsx` → `block/about1.tsx` in the consumer-facing JSON. `registry/components/foo.tsx` → `components/foo.tsx`.

**Auth (middleware.ts):** All `/r/*` requests require `x-registry-token` header matching `REGISTRY_TOKEN` env var. Public passthroughs (no token): `/r/styles/*`, `/r/colors/*`, `/r/icons/*`. If `REGISTRY_TOKEN` is unset, all requests are allowed (local dev mode).

**Browser UI:** `app/page.tsx` renders a client-side searchable component index loaded from `lib/component-index.json`.

**Compatibility routes:** `app/styles/*` and `app/r/styles/*` proxy to upstream shadcn registry for unscoped dependencies. `app/r/colors/*` and `app/r/icons/*` pass through to upstream.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript 5.9, Tailwind CSS 4, pnpm. Path alias: `@/*` → `./`.

`registry/blocks/` and `registry/components/` are excluded from tsconfig (they're raw component sources, not part of the app build).

## Environment variables

- `REGISTRY_TOKEN` — secret for `/r/*` auth (required in production)
- `REGISTRY_URL` — deployed base URL
- `SHADCNBLOCKS_API_KEY` — shadcnblocks.com API key (download scripts only)
- `SHADCN_FALLBACK_REGISTRY_URL` — override for unscoped dependency proxy (defaults to `https://ui.shadcn.com/r`)

## Component workflow

Edit: modify files in `registry/blocks/{name}/` or `registry/components/`, run `pnpm registry:build`, deploy.

Add: create `registry/blocks/{name}/{name}.tsx`, add entry to `registry.json`, run `pnpm registry:build`, deploy.

Consumers install with: `npx shadcn add @kata-shadcn/{name}` (requires `components.json` registry config and `REGISTRY_TOKEN` in env).

## Project management

Linear project: [Kata Shadcn Registry](https://linear.app/kata-sh/project/kata-shadcn-registry-4b3fcae34eed) in team Kata-sh.

When starting work on an issue, use `/kata-linear start KAT-N` to create a branch and move the issue to In Progress. When done, use `/kata-linear end KAT-N` to wrap up.

Milestones (in execution order):
1. **Quick Wins** — bug fixes, category cleanup, compact agent index, usage logging, AGENTS.md
2. **Analytics & Metadata** — usage dashboard, index enrichment (tags, complexity, hashes)
3. **Visual Catalog** — render audit, Playwright screenshot harness, preview thumbnails
4. **Curation & Bundles** — page recipes, page builder bundles with layout scaffolding
5. **Discovery & Growth** — semantic search with LLM-enriched descriptions, OSS template
