# Compact Agent Discovery Index Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Emit `public/r/index-compact.json` from the registry build with only `name`, `category`, and `url` per entry (~80–100KB), so agents can discover components without fetching the full index.

**Architecture:** In `scripts/build-registry.ts`, after writing the full agent index to `public/r/index.json`, build a compact object `{ total, items }` from the same `index` array (items = `{ name, category, url }` only), serialize as minified JSON, and write to `public/r/index-compact.json`. No new routes; existing `/r/*` middleware protects the new file.

**Tech Stack:** Node.js, TypeScript, existing build script and middleware.

**Design doc:** `docs/plans/2026-02-23-compact-agent-index-design.md`

---

### Task 1: Emit compact index in build-registry.ts

**Files:**
- Modify: `scripts/build-registry.ts` (after the existing agent index write, ~line 118)

**Step 1: Add compact index object and write**

After the block that writes `path.join(PUBLIC_R, "index.json")`, add:

```ts
// Compact agent index (name, category, url only; minified)
const compactIndex = {
  total: index.length,
  items: index.map((c) => ({
    name: c.name,
    category: c.category,
    url: `/r/${c.name}.json`,
  })),
}
fs.writeFileSync(
  path.join(PUBLIC_R, "index-compact.json"),
  JSON.stringify(compactIndex) + "\n",
  "utf8"
)
```

**Step 2: Run registry build**

Run: `pnpm registry:build`  
Expected: No errors; `public/r/index-compact.json` exists (dir is gitignored; verify locally).

**Step 3: Verify size and shape**

Run: `node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('public/r/index-compact.json','utf8')); console.log('total', j.total, 'items', j.items.length, 'size KB', (fs.statSync('public/r/index-compact.json').size/1024).toFixed(1)); console.log('sample', JSON.stringify(j.items[0]))"`  
Expected: total and items.length match full index count; size < 150 (KB); sample has only `name`, `category`, `url`.

**Step 4: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: add compact agent index (index-compact.json)"
```

---

### Task 2: Assert compact index in unit test

**Files:**
- Modify: `scripts/build-registry.test.mjs` (or create if minimal assertions live elsewhere)

**Step 1: Add assertion for compact index**

In the existing test flow that runs the build and checks output, add (or extend):
- After build, read `public/r/index-compact.json` (path relative to cwd after build).
- Parse JSON; assert `items.length === total` and `total` matches expected index count (or matches length of full index entries).
- Assert first item has exactly keys `name`, `category`, `url`.
- Assert file size < 150 * 1024 bytes.

(If the current test does not run the full build, run `pnpm registry:build` in test setup and then perform the above assertions.)

**Step 2: Run tests**

Run: `pnpm test`  
Expected: All tests pass, including new compact-index assertions.

**Step 3: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: assert compact index output and size"
```

---

### Task 3: Final verification and docs

**Files:**
- Modify: none (optional: add one-line mention in CLAUDE.md or README that compact index exists)

**Step 1: Full build**

Run: `pnpm build`  
Expected: Success (registry:build + next build).

**Step 2: Optional doc mention**

If the repo documents registry endpoints, add a line that `/r/index-compact.json` is available for agent discovery (minimal payload). Skip if no such section exists.

**Step 3: Commit (if any doc change)**

```bash
git add <file>
git commit -m "docs: mention compact agent index endpoint"
```

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-02-23-compact-agent-index.md`.

**Two execution options:**

1. **Subagent-Driven (this session)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Parallel Session (separate)** — Open a new session with executing-plans for batch execution with checkpoints.

Which approach?
