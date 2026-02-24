# Index Enrichment (tags, complexity, hashes, peers) — Design

**Date:** 2026-02-24  
**Linear:** KAT-80

## 1. Goal & scope

**Goal:** Add structured metadata to `index.json` and `component-index.json` at build time: `tags`, `complexity`, `contentHash`, `lastModified`, and `peerComponents`. All enrichment runs inside `scripts/build-registry.ts` as part of the existing pipeline. No new runtime dependencies; compact index (`index-compact.json`) is unchanged (name, category, url only).

**Scope:**
- **In:** Tags (best-effort from name + description), complexity (files, lines, dependencies total), contentHash (SHA-256 of built component JSON), lastModified (from git, batched), peer components (3–5 same-category, deterministic).
- **Out:** No embeddings, no vector DB, no new search endpoint; no manual tag curation in v1.

**Constraints:** Build completes in <60s; content hashes deterministic across runs; existing fields unchanged.

---

## 2. Data model

**Enriched entry shape** (shared by `component-index.json` and `index.json` items):

- **Existing:** `name`, `title`, `description`, `category`, `installCommand` (component-index) / `url` (index.json)
- **New:**
  - `tags`: `string[]` — at least one when derivable from name/description; best-effort toward 90% non-empty
  - `complexity`: `{ files: number, lines: number, dependencies: number }` — files = built file count, lines = total source line count, dependencies = `(item.dependencies?.length ?? 0) + (item.registryDependencies?.length ?? 0)`
  - `contentHash`: `string` — SHA-256 hex of the built component JSON (canonical key order for determinism)
  - `lastModified`: `string` — ISO 8601 date of the most recent git commit that touched any of the item’s source paths; omit if not in git
  - `peerComponents`: `string[]` — 3–5 component names from the same category (sorted by name, exclude self, wrap in small categories)

**Outputs:**
- **`lib/component-index.json`** — Array of enriched entries (all fields above; `installCommand` per entry).
- **`public/r/index.json`** — `{ _description, total, items }` with `items` = enriched entries with `url` instead of `installCommand` (same extra fields).
- **`public/r/index-compact.json`** — Unchanged: `{ total, items: [{ name, category, url }] }` only; no new fields.

**Determinism:** Same manifest and sources ⇒ same tags, complexity, contentHash, lastModified, and peerComponents (stable sort by name, fixed JSON key order for hashing).

---

## 3. Git batch and lastModified

**Path collection:** Before the main loop, collect all registry source paths from the manifest (each `fileEntry.path` from `item.files`). Dedupe. If the list is empty, skip the git step and leave `lastModified` unset for every entry.

**Git command:** Single invocation from repo root, only if path list is non-empty and we’re in a git repo. Use e.g. `git log -z --format=%cI%x00 --name-only -z -<N> -- <root>/registry/` with a cap N (e.g. 5000). Emit commit date then changed paths per commit, null-separated.

**Parsing:** Walk commits newest to oldest. For each path in the name-only list, if not yet seen, set path → date. Normalize paths to match how we store them. Result: `Map<string, string>` (path → last commit date).

**In the loop:** For each item, take max of dates for that item’s paths from the map; that max is `lastModified`. If none in map, omit `lastModified`.

**Edge cases:** Not a git repo or git fails → skip building the map; all entries have no `lastModified`; build still succeeds. Log a one-line warning.

---

## 4. Tags, complexity, contentHash (in-loop)

**Tags:** Derive `string[]` from:
- **Name:** Same segment used for category fallback (segment before first `-`, trailing digits stripped). Add as tag when present.
- **Description:** Tokenize `item.description` (split on non-alphas, lowercase), drop stopwords and very short tokens (< 2). Add unique tokens up to a small cap (e.g. 5–8).
- **Dedupe and order:** Merge name-derived tag(s) with description tokens, dedupe, stable order (segment first). If empty, leave `tags: []` (best-effort; no synthetic fallbacks).

**Complexity:** In the same loop:
- `files`: `builtFiles.length`
- `lines`: Sum of line counts of each file’s `content`
- `dependencies`: `(item.dependencies?.length ?? 0) + (item.registryDependencies?.length ?? 0)`

**contentHash:** After building `registryItem`, serialize it with canonical key order (e.g. alphabetical). SHA-256 of that string, hex digest. Use Node `crypto.createHash('sha256').update(canonicalJson).digest('hex')`.

**Order in loop:** Build `registryItem` → compute contentHash → write component JSON → compute tags, complexity, lastModified → push enriched index entry. Peer components filled in post-pass.

---

## 5. Peer components (post-pass)

**When:** After the main loop, before writing `component-index.json` and `index.json`.

**How:**
1. Group `index` by `category`.
2. For each entry: get sorted-by-name list for that category; find self index.
3. Take up to 5 other names (next 5 positions, wrap); exclude self. Set `peerComponents` (0–5 names). If alone in category, `peerComponents` is `[]`.
4. Write the same `index` to both outputs; compact index remains a map to `{ name, category, url }` only.

**Determinism:** Same category membership and sort order ⇒ same peer list every run.

---

## 6. Error handling & testing

**Error handling:**
- Git unavailable or batch fails: empty path→date map, omit `lastModified` for all; one-line `console.warn`.
- Hashing/serialization throws: fail build with clear message.
- Tags/complexity/peers: in-memory only; missing description → tags empty or name-only; existing “all sources missing” handling unchanged.

**Testing:**
- Unit: After `registry:build`, assert enriched fields on sample entries (tags, complexity, contentHash, lastModified, peerComponents). Determinism: two runs ⇒ identical contentHashes / index. Compact: no new fields, only name/category/url. Existing tests (scope, non-empty index) still pass. Optional: tag coverage ≥ ~90% or document best-effort.
- Coverage: New branches covered; maintain existing thresholds for `build-registry.ts`.
- Build time: `pnpm registry:build` completes in <60s (manual or CI; no new timer test required unless we add one).

---

## Implementation plan

See implementation plan (to be created via writing-plans skill).
