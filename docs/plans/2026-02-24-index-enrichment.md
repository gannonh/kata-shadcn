# Index Enrichment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add tags, complexity, contentHash, lastModified, and peerComponents to `lib/component-index.json` and `public/r/index.json` at build time; keep `index-compact.json` unchanged and build under 60s.

**Architecture:** Upfront single git log batch → path→date map. In main loop: build component JSON, compute contentHash (canonical JSON + SHA-256), complexity (files/lines/deps), tags (name segment + description tokens), lastModified from map; push enriched entry. Post-pass: group by category, set peerComponents (3–5 same-category names, sorted, wrap). Write enriched index to both outputs; compact stays name/category/url only.

**Tech Stack:** Node `scripts/build-registry.ts`, `crypto` for SHA-256, existing `scripts/build-registry.test.mjs`. No new deps. Design: `docs/plans/2026-02-24-index-enrichment-design.md`.

---

## Task 1: Failing test for enriched fields and compact unchanged

**Files:**
- Modify: `scripts/build-registry.test.mjs`

**Step 1: Add test that index entries have enriched shape**

In the describe block that runs after `registry:build` and reads `component-index.json`, add a new test:

```javascript
it("enriches component-index and index.json with tags, complexity, contentHash, lastModified, peerComponents", () => {
  assert.ok(fs.existsSync(componentIndexPath))
  const index = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
  assert.ok(index.length > 0)
  const entry = index[0]
  assert.ok(Array.isArray(entry.tags), "entry must have tags array")
  assert.ok(
    entry.complexity && typeof entry.complexity.files === "number" && typeof entry.complexity.lines === "number" && typeof entry.complexity.dependencies === "number",
    "entry must have complexity.files, .lines, .dependencies"
  )
  assert.strictEqual(typeof entry.contentHash, "string", "entry must have contentHash string")
  assert.ok(/^[a-f0-9]{64}$/.test(entry.contentHash), "contentHash must be 64-char hex")
  // lastModified optional (omit when not in git)
  if (entry.lastModified != null) {
    assert.ok(/^\d{4}-\d{2}-\d{2}T/.test(entry.lastModified), "lastModified must be ISO 8601")
  }
  assert.ok(Array.isArray(entry.peerComponents), "entry must have peerComponents array")
  assert.ok(entry.peerComponents.length <= 5, "peerComponents at most 5")
  // Same for public/r/index.json items
  const agentIndexPath = path.join(root, "public", "r", "index.json")
  const agent = JSON.parse(fs.readFileSync(agentIndexPath, "utf-8"))
  const agentEntry = agent.items[0]
  assert.ok(Array.isArray(agentEntry.tags))
  assert.ok(agentEntry.complexity && typeof agentEntry.complexity.files === "number")
  assert.strictEqual(typeof agentEntry.contentHash, "string")
  assert.ok(Array.isArray(agentEntry.peerComponents))
})
```

**Step 2: Add test that compact index is unchanged**

In the existing test that reads `index-compact.json`, ensure it asserts that each item has only `name`, `category`, `url` (no tags, complexity, contentHash, lastModified, peerComponents). If not already strict, add:

```javascript
for (const item of compact.items) {
  const keys = Object.keys(item)
  assert.deepStrictEqual(keys.sort(), ["category", "name", "url"].sort(), "compact item must only have name, category, url")
}
```

**Step 3: Run test to verify it fails**

Run: `pnpm test`

Expected: New enrichment test fails (e.g. "entry must have tags array" or missing contentHash). Compact test may already pass; if it currently allows extra keys, tighten so it fails if we accidentally add fields to compact later.

**Step 4: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: assert enriched fields and compact index unchanged (KAT-80)"
```

---

## Task 2: Extend ComponentIndexEntry and add stub enrichment

**Files:**
- Modify: `scripts/build-registry.ts`

**Step 1: Extend interface and types**

Add to the top of `scripts/build-registry.ts` (after existing interfaces):

```ts
interface Complexity {
  files: number
  lines: number
  dependencies: number
}

// Extend ComponentIndexEntry with optional lastModified (omit when not in git)
interface ComponentIndexEntry {
  name: string
  title: string
  description: string
  category: string
  installCommand: string
  tags: string[]
  complexity: Complexity
  contentHash: string
  lastModified?: string
  peerComponents: string[]
}
```

**Step 2: Stub enrichment in the loop**

Where you currently push to `index`:

```ts
index.push({
  name: item.name,
  title: item.title ?? "",
  description: item.description ?? "",
  category,
  installCommand: `npx shadcn add ${REGISTRY_SCOPE}/${item.name}`,
})
```

Replace with the same object plus stub fields:

```ts
const lineCount = builtFiles.reduce((sum, f) => sum + (f.content.split(/\n/).length), 0)
index.push({
  name: item.name,
  title: item.title ?? "",
  description: item.description ?? "",
  category,
  installCommand: `npx shadcn add ${REGISTRY_SCOPE}/${item.name}`,
  tags: [],
  complexity: { files: builtFiles.length, lines: lineCount, dependencies: (item.dependencies?.length ?? 0) + (item.registryDependencies?.length ?? 0) },
  contentHash: "0".repeat(64),
  peerComponents: [],
  // lastModified added in a later task
})
```

Add `lastModified` only when we have the git map (Task 6); for now omit it so the test that checks optional lastModified still passes.

**Step 3: Ensure agent index and compact use same index**

In the block that builds `agentIndex.items`, use the same `index` array and map to include the new fields (name, title, description, category, url, tags, complexity, contentHash, lastModified, peerComponents). Compact index remains: `index.map((c) => ({ name: c.name, category: c.category, url: `/r/${c.name}.json` }))` — no new fields.

**Step 4: Run registry:build and test**

Run: `pnpm registry:build` then `pnpm test`

Expected: Enrichment test passes (shape and types); contentHash is placeholder. Compact test passes.

**Step 5: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: add stub enrichment fields to index (KAT-80)"
```

---

## Task 3: Implement contentHash (canonical JSON + SHA-256)

**Files:**
- Modify: `scripts/build-registry.ts`

**Step 1: Add crypto import**

At top: `import crypto from "crypto"`

**Step 2: Canonical serialization and hash**

After building `registryItem` (the object written to `public/r/{name}.json`), before writing the file, add a helper (or inline) to serialize with sorted keys and hash:

```ts
function canonicalString(obj: Record<string, unknown>): string {
  const keys = Object.keys(obj).sort()
  const pieces = keys.map((k) => JSON.stringify(k) + ":" + (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k]) ? canonicalString(obj[k] as Record<string, unknown>) : JSON.stringify(obj[k])))
  return "{" + pieces.join(",") + "}"
}

function contentHash(registryItem: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(canonicalString(registryItem), "utf8").digest("hex")
}
```

For nested objects (e.g. `files` array with objects), use a simple recursive approach: if value is plain object, recurse; if array, JSON.stringify the array (order is fixed). Simplest: `JSON.stringify(registryItem, Object.keys(registryItem).sort())` does not sort keys recursively. So implement canonicalString to recursively sort object keys and stringify; arrays can be stringified in order. Example minimal implementation that handles the actual shape (one level of nesting: files array of { path, content, type }):

```ts
function canonicalString(val: unknown): string {
  if (val === null || typeof val !== "object") return JSON.stringify(val)
  if (Array.isArray(val)) return "[" + val.map(canonicalString).join(",") + "]"
  const obj = val as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  const parts = keys.map((k) => JSON.stringify(k) + ":" + canonicalString(obj[k]))
  return "{" + parts.join(",") + "}"
}
```

Then `contentHash(registryItem)` and use that when pushing to index.

**Step 3: Use real contentHash in index push**

Replace the placeholder `contentHash: "0".repeat(64)` with `contentHash: contentHash(registryItem)` (call after registryItem is fully built).

**Step 4: Add determinism test**

In `build-registry.test.mjs`, add:

```javascript
it("produces deterministic contentHash across two builds", () => {
  execSync("pnpm registry:build", { cwd: root, stdio: "pipe" })
  const index1 = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
  execSync("pnpm registry:build", { cwd: root, stdio: "pipe" })
  const index2 = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
  assert.strictEqual(index1.length, index2.length)
  for (let i = 0; i < index1.length; i++) {
    assert.strictEqual(index1[i].contentHash, index2[i].contentHash, `entry ${index1[i].name} hash must match`)
  }
})
```

Run: `pnpm test`. Expected: PASS.

**Step 5: Commit**

```bash
git add scripts/build-registry.ts scripts/build-registry.test.mjs
git commit -m "feat: add deterministic contentHash (canonical JSON + SHA-256) (KAT-80)"
```

---

## Task 4: Implement tag derivation

**Files:**
- Modify: `scripts/build-registry.ts`

**Step 1: Add deriveTags helper**

Reuse the same segment logic as category (deriveSegment from category-collapse-loader, or inline: first segment before `-`, trailing digits stripped). Stopwords: small set e.g. `new Set(["a","an","the","and","or","with","for","to","in","on","of","section","component","block"])`. Description: split on non-alpha, lowercase, filter length >= 2, filter stopwords, unique, take first 8.

```ts
const STOPWORDS = new Set(["a","an","the","and","or","with","for","to","in","on","of","section","component","block"])
function deriveTags(name: string, description: string, deriveSegment: (n: string) => string): string[] {
  const seg = deriveSegment(name)
  const fromName = seg ? [seg] : []
  const words = (description ?? "").toLowerCase().split(/\W+/).filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  const seen = new Set<string>(fromName)
  const fromDesc: string[] = []
  for (const w of words) {
    if (seen.has(w)) continue
    seen.add(w)
    fromDesc.push(w)
    if (fromDesc.length >= 8) break
  }
  return [...fromName, ...fromDesc]
}
```

**Step 2: Call deriveTags when pushing to index**

When building the index entry, set `tags: deriveTags(item.name, item.description ?? "", deriveSegment)`.

**Step 3: Run tests**

Run: `pnpm test`. Optionally add a test that a sample of entries have non-empty tags (e.g. at least one entry has tags.length >= 1). No strict 90% assertion per design (best-effort).

**Step 4: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: derive tags from name and description (KAT-80)"
```

---

## Task 5: Git batch and lastModified

**Files:**
- Modify: `scripts/build-registry.ts`

**Step 1: Collect paths and run git log**

Before the main loop, collect all paths from `manifest.items` (each `item.files[].path`). Dedupe into an array `allPaths`. If `allPaths.length === 0`, set `lastModifiedMap = new Map<string, string>()` and skip git.

Otherwise, check git: run `git rev-parse --is-inside-work-tree` (or spawn `git log` and catch); if not in repo or git fails, set `lastModifiedMap = new Map()`, `console.warn("lastModified skipped: not a git repo or git failed")`, and continue.

**Step 2: Single git log invocation**

Run one command from `process.cwd()`:

`git log -5000 -z --format=%cI%x00 --name-only -z -- registry/`

(Adjust to the actual registry path if different; paths in manifest are like `registry/blocks/...`.) Parse stdout: split on null; each record is a commit date followed by one or more path lines. Walk from start (newest commit); for each path, if not yet in map, set map[path] = date. Normalize path to match manifest (e.g. strip leading `./` if any). Cap at 5000 commits so output is bounded.

**Step 3: Set lastModified per entry in loop**

When pushing to index, for the current item get the list of source paths (fileEntry.path for each file in item.files). Look up each in lastModifiedMap; take max date. If max exists, set `lastModified: maxDate` on the entry; otherwise omit.

**Step 4: Run tests**

Run: `pnpm test`. In a real git repo, entries should have lastModified when their paths are in history. Determinism test still passes.

**Step 5: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: add lastModified from batched git log (KAT-80)"
```

---

## Task 6: Post-pass peer components

**Files:**
- Modify: `scripts/build-registry.ts`

**Step 1: Group by category**

After the main loop (index is full), build `Map<string, ComponentIndexEntry[]>` by category: for each entry, push to `byCategory.get(entry.category) ??= []`.

**Step 2: Sort each group by name**

For each category list, sort by `entry.name`.

**Step 3: Assign peerComponents**

For each entry in index, get its category list; find index of self in sorted list. Take the next 5 indices (wrapping: selfIndex+1, selfIndex+2, ... selfIndex+5 modulo length), exclude self, collect names. Set `entry.peerComponents = names`.

**Step 4: Run tests**

Run: `pnpm test`. Assert peerComponents length 0–5 and all names in same category (optional extra assertion).

**Step 5: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: add peerComponents post-pass (KAT-80)"
```

---

## Task 7: Final tests and build time check

**Files:**
- Modify: `scripts/build-registry.test.mjs`

**Step 1: Optional tag coverage assertion**

Add a soft assertion: count entries with `entry.tags.length > 0`; assert it's >= some threshold (e.g. 0.5 * total) or skip if design says best-effort only. Design said "accept if close to 90%"; optional to assert >= 50% so we don't ship empty tags everywhere.

**Step 2: Assert build completes in under 60s**

Optional: wrap `execSync("pnpm registry:build", ...)` in a timer and assert duration < 60000 ms in one test. Or document manual check.

**Step 3: Run full test suite and build**

Run: `pnpm test` and `pnpm build`. All pass. Run `pnpm registry:build` manually and confirm it finishes in < 60s.

**Step 4: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: optional tag coverage and build time note (KAT-80)"
```

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-02-24-index-enrichment.md`. Two execution options:

**1. Subagent-Driven (this session)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Parallel Session (separate)** — Open a new session with executing-plans, batch execution with checkpoints.

Which approach?
