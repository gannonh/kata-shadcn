# Compact Agent Discovery Index — Design

**Date:** 2026-02-23  
**Linear:** KAT-76

## Goal

Provide a small (~80–100KB) machine-readable index at `/r/index-compact.json` so agents can discover components without downloading the full 766KB `index.json`. Discovery uses only name, category, and URL; full details remain in `/r/{name}.json`.

## Output format and location

- **File:** `public/r/index-compact.json` (same directory as `index.json`, under existing `/r/*`).
- **Shape:** `{ "total": <number>, "items": [ { "name": "<string>", "category": "<string>", "url": "/r/<name>.json" }, ... ] }`.
- **Serialization:** Single-line JSON (no pretty-print) to keep size under 150KB.
- **Source of truth:** Same `index` array used for the full agent index in `build-registry.ts`; compact payload is a derived view (map to `name`, `category`, `url` only).

## Build and auth

- **Build:** In `scripts/build-registry.ts`, after writing `public/r/index.json`, build the compact object from `index`, write to `path.join(PUBLIC_R, "index-compact.json")`. No new scripts or config.
- **Auth:** No change. `middleware.ts` already protects `/r/*`; `index-compact.json` is served like any other file under `public/r/` and requires the same `x-registry-token` header when `REGISTRY_TOKEN` is set.

## Acceptance and testing

- **Entry count:** `index-compact.json`’s `items.length` and `total` must equal the full index entry count.
- **Size:** File size < 150KB.
- **Verification:** After `pnpm registry:build`, assert file exists, parse JSON, check `total` and `items.length` match full index, and sample entries have only `name`, `category`, `url`.
- **Full index:** `index.json` and its generation remain unchanged.

## Implementation plan

See `docs/plans/2026-02-23-compact-agent-index.md` for the step-by-step implementation plan.
