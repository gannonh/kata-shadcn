# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router UI and compatibility routes under `app/r/*` and `app/styles/*`.
- `components/`: shared UI components used by the browser interface.
- `registry/blocks/` and `registry/components/`: source-of-truth component files for registry items.
- `scripts/build-registry.ts`: generates registry payloads in `public/r/` and search data in `lib/component-index.json`.
- `docs/`: plans and references. `public/`: static assets and generated registry JSON output.

## Build, Test, and Development Commands
- `pnpm install`: install dependencies.
- `pnpm dev`: run the app locally with Turbopack.
- `pnpm registry:build`: regenerate `public/r/*.json` and `lib/component-index.json` after registry source changes.
- `pnpm build`: run registry generation, then production Next.js build.
- `pnpm start`: run the production server.
- `pnpm lint`: run ESLint (`next/core-web-vitals` + TypeScript rules).

## Coding Style & Naming Conventions
- Stack: TypeScript, React 19, Next.js 15.
- Follow existing code style: 2-space indentation, double quotes, no semicolons, functional components.
- Keep types strict (`tsconfig.json` has `"strict": true`); avoid `any` except when unavoidable.
- Prefer internal imports via alias `@/*`.
- Use existing registry naming patterns (example: `registry/blocks/hero1/hero1.tsx`).

## Testing Guidelines
- There is currently no dedicated `*.test.*` / `*.spec.*` suite.
- Before opening a PR, run `pnpm lint` and `pnpm build`.
- For registry or auth changes, manually verify endpoints, for example:
  - `curl -H "x-registry-token: $REGISTRY_TOKEN" http://localhost:3000/r/index.json`
- Include clear reproduction and verification steps in PR descriptions.

## Commit & Pull Request Guidelines
- Follow conventional commit prefixes used in this repo: `feat:`, `fix:`, `docs:`, `chore:`.
- Keep commits scoped to one change.
- If `registry/` or `registry.json` changes, commit regenerated artifacts from `public/r/` and `lib/component-index.json`.
- PRs should include: summary, impacted paths, verification commands/results, linked issue, and UI screenshots when relevant.

## Security & Configuration Tips
- Never commit real secrets. Use `.env.local` for `REGISTRY_TOKEN`.
- `/r/*` is token-protected by middleware, except passthrough dependency routes under `/r/styles/*`, `/r/colors/*`, and `/r/icons/*`.
