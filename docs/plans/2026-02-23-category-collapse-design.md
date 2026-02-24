# Category Collapse (451 → ~25–30) — Design

**Date:** 2026-02-23  
**Linear:** KAT-75

## Goal

Reduce the browser UI category filter from 451 derived categories to 20–35 usable groups. The build will use an explicit `category` field from `registry.json` when present, otherwise derive a segment from the component name and map it via a curated collapse file. No single category may contain more than 15% of components.

## Data model and file layout

**Derivation (when no explicit category):** First segment of `name` (substring before the first `-`), with trailing digits stripped. Examples: `alert-dialog-destructive` → `alert`; `form-input-1` → `form`; `hero1` → `hero`.

**Collapse file:** `lib/category-collapse.json`. Format: single object, keys = derived segments, values = final category labels (human-readable, e.g. "About", "Hero", "Forms"). Unmapped segments fall back to the segment as category.

**Build:** For each item, `category = item.category ?? collapseMap[deriveSegment(item.name)] ?? deriveSegment(item.name)`. Load the collapse file once at script start. Optional `"category"` on `registry.json` items wins and is used to split oversized buckets.

## Bootstrap and 15% cap

**Bootstrap script:** One-time `scripts/bootstrap-category-collapse.ts` (or `.mjs`). Reads `registry.json`, derives segments, counts per segment, outputs suggested `lib/category-collapse.json`. We hand-edit to reach 20–35 categories and fix names. Not part of `pnpm registry:build` or `pnpm build`.

**15% cap:** After resolving categories, build warns (console.warn) if any category has count > 15% of total; does not fail. Bootstrap script prints counts and warns on overflows; fix by explicit `category` in registry or by refining the collapse map.

**Readability:** Final category labels are short and readable for filter chips; no compound slugs.

## Error handling

- Missing `lib/category-collapse.json`: build fails with clear message (run bootstrap or add file).
- Invalid JSON or non–string-to-string object: build fails.
- Bootstrap: exit on missing/unreadable `registry.json` or write failure.

## Testing

- **Unit tests:** Extend build-registry tests to assert: distinct category count between 20 and 35; no category > 15% of total. Optionally fixture test for explicit `category` and lookup. Keep existing assertions (scope, non-empty index).
- **Bootstrap:** No automated tests; manual run and edit is sufficient.
- **Coverage:** New branches in build script covered by above tests. Error paths (missing/invalid collapse file) are tested via child-process runs; branch threshold set to 65% (see package.json c8) until in-process coverage for those paths is added.

## Implementation plan

See `docs/plans/2026-02-23-category-collapse.md` for the implementation plan.
