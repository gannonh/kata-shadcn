# Category Collapse Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Collapse 451 derived categories to 20–35 usable groups via a curated `lib/category-collapse.json` and optional explicit `category` in `registry.json`; enforce 15% cap and readable filter chips.

**Architecture:** Build loads collapse map once; for each item, category = `item.category ?? collapseMap[deriveSegment(item.name)] ?? deriveSegment(item.name)`. Derivation = first segment before first hyphen, trailing digits stripped. A one-time bootstrap script generates a suggested collapse file for hand-editing.

**Tech Stack:** Node (build script), existing `scripts/build-registry.ts` and `scripts/build-registry.test.mjs`, no new runtime deps.

---

### Task 1: Failing tests for category count and 15% cap

**Files:**
- Modify: `scripts/build-registry.test.mjs` (build-registry describe block)

**Step 1: Add assertions and relax old category assertion**

In the existing test that reads `component-index.json`, add a new test case that asserts:
- The number of distinct `category` values in the index is between 20 and 35 (inclusive).
- No single category has more than 15% of total entries (count per category, assert each count <= Math.ceil(total * 0.15)).

In the same file, remove or relax the per-item category assertion that currently expects `item.category === expectedCategory` (derived with the old formula). The design replaces that derivation with collapse-map lookup, so we cannot assert the old derived value. Options: (a) remove the strict equality check for category in the "index-compact.json" test and rely on the new global assertions; or (b) keep a weaker check (e.g. category is non-empty string). Recommended: remove the per-item `expectedCategory` assertion (lines that compare `item.category` to `expectedCategory`) and add a new `it("produces 20–35 categories with no category over 15%")` that loads `component-index.json`, counts by category, and asserts 20 <= distinct count <= 35 and max count <= ceil(total * 0.15).

**Exact test code to add (new it block inside describe("build-registry")):**

```javascript
  it("produces 20–35 categories with no category over 15%", () => {
    assert.ok(fs.existsSync(componentIndexPath))
    const index = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
    const total = index.length
    assert.ok(total > 0, "component-index must be non-empty")
    const byCategory = {}
    for (const entry of index) {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1
    }
    const distinctCount = Object.keys(byCategory).length
    assert.ok(
      distinctCount >= 20 && distinctCount <= 35,
      `distinct categories must be 20–35; got ${distinctCount}`
    )
    const cap = Math.ceil(total * 0.15)
    for (const [cat, count] of Object.entries(byCategory)) {
      assert.ok(
        count <= cap,
        `category "${cat}" has ${count} components (max ${cap} = 15% of ${total})`
      )
    }
  })
```

**Remove** from the "writes index-compact.json..." test the block that asserts each item's category equals `expectedCategory` (the old derivation). Delete the loop that does `const expectedCategory = item.name.replace(...)` and `assert.strictEqual(item.category, expectedCategory, ...)`. Keep all other assertions in that test (total, keys, url, size, minified).

**Step 2: Run test to verify it fails**

Run: `pnpm test` (or `node --test scripts/build-registry.test.mjs` from repo root).

Expected: The new test fails (current build has 412 categories and/or some category over 15%). The "index-compact.json" test may also fail if we removed the category equality check but the build still uses the old derivation (category will still match old formula until we change build) — so if you only added the new test and did not yet remove the old assertion, the new test fails. If you removed the old assertion, the compact test might still pass (category is still a string). Prefer: add the new test first without removing the old assertion; run tests; see new test fail. Then in a later task we change the build and remove the old assertion together.

**Step 3: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: assert category count 20–35 and 15% cap (KAT-75)"
```

---

### Task 2: Add derivation and collapse map load in build script

**Files:**
- Modify: `scripts/build-registry.ts` (top: add path, load collapse map; loop: resolve category)
- Create: `lib/category-collapse.json` (minimal stub so build can run)

**Step 1: Add deriveSegment and load collapse map**

At the top of `scripts/build-registry.ts`, after existing constants, add:

- `const CATEGORY_COLLAPSE_PATH = path.join(process.cwd(), "lib", "category-collapse.json")`
- Function:

```ts
function deriveSegment(name: string): string {
  const beforeHyphen = name.split("-")[0] ?? name
  return beforeHyphen.replace(/\d+$/, "").replace(/-+$/, "") || beforeHyphen
}
```

- Load collapse map: read `CATEGORY_COLLAPSE_PATH`; if file missing, `console.error("...")` and `process.exit(1)`. Parse JSON; if not a plain object or any value not a string, exit with error. Type as `Record<string, string>`.

**Step 2: Resolve category per item**

In the loop where you currently have `const category = item.name.replace(/\d.*$/, "").replace(/-+$/, "")`, replace with:

```ts
const rawCategory =
  typeof item.category === "string" && item.category
    ? item.category
    : (collapseMap[deriveSegment(item.name)] ?? deriveSegment(item.name))
const category = rawCategory
```

Use `category` as today for index/compact output.

**Step 3: Create minimal lib/category-collapse.json**

Create `lib/category-collapse.json` with a small stub so the build runs and tests can be run (they will still fail until the stub is replaced with a full map). Stub example:

```json
{
  "about": "About",
  "hero": "Hero",
  "feature": "Feature"
}
```

This will yield many unmapped segments (fallback to segment as category), so category count will still be high. The next task will add the bootstrap script; then we replace this stub with the real file.

**Step 4: Run registry:build**

Run: `pnpm registry:build`

Expected: Succeeds. `lib/component-index.json` has categories from map where defined, else derived segment.

**Step 5: Commit**

```bash
git add scripts/build-registry.ts lib/category-collapse.json
git commit -m "feat: derive category from segment + collapse map; stub collapse file (KAT-75)"
```

---

### Task 3: Add 15% build-time warning

**Files:**
- Modify: `scripts/build-registry.ts` (after building index array, before writing files)

**Step 1: Add warning loop**

After the loop that fills `index` (and before writing `component-index.json`), compute counts by category. If any category has count > Math.ceil(index.length * 0.15), console.warn one line per offending category: e.g. `console.warn(\`Category "${cat}" has ${count} components (${pct}%); max 15% allowed.\`)`. Do not process.exit.

**Step 2: Run build**

Run: `pnpm registry:build`. With stub collapse file, some categories may exceed 15%; expect warnings.

**Step 3: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "feat: warn when any category exceeds 15% (KAT-75)"
```

---

### Task 4: Bootstrap script to generate suggested collapse map

**Files:**
- Create: `scripts/bootstrap-category-collapse.ts` (or `.mjs` if preferred)

**Step 1: Implement bootstrap script**

- Read `registry.json` from cwd; same template skip set as build (`hello-world`, etc.).
- For each item, compute segment = deriveSegment(item.name) (same logic: first segment before hyphen, strip trailing digits).
- Count by segment; sort segments by count descending.
- Build a suggested map: segment → human-readable label (e.g. capitalize first letter, or use segment as-is for now). For segments over 15% of total, optionally print a warning and suggest splitting (e.g. "form" → consider "Forms - Input", "Forms - Select").
- Write `lib/category-collapse.json` with JSON.stringify( suggestedMap, null, 2). Use same deriveSegment logic; either duplicate the function or extract to a small shared helper (e.g. in build-registry.ts export deriveSegment and require it from bootstrap, or copy one-liner into bootstrap). Simplest: inline the same derivation in the bootstrap script to avoid cross-file coupling.
- On missing registry.json or write error, process.exit(1) with message.

**Step 2: Run bootstrap**

Run: `node scripts/bootstrap-category-collapse.ts` (or `npx tsx scripts/bootstrap-category-collapse.ts` if needed). Expected: overwrites `lib/category-collapse.json` with one entry per derived segment (segment → segment or title-case). Check that segment count is ~100–150 range.

**Step 3: Commit**

```bash
git add scripts/bootstrap-category-collapse.ts
git commit -m "chore: add bootstrap script for category collapse map (KAT-75)"
```

---

### Task 5: Produce final collapse file (20–35 categories, no >15%)

**Files:**
- Modify: `lib/category-collapse.json` (hand-edit after bootstrap)

**Step 1: Run bootstrap and hand-edit**

Run the bootstrap script from Task 4. Open `lib/category-collapse.json`. Merge segments into 20–35 final categories (e.g. map "about", "about1" → "About"; "hero", "hero1" → "Hero"). For any segment whose count would push a category over 15%, split: either map some segments to a different category or add explicit `category` in registry.json for selected items (later). Goal: distinct category count between 20 and 35, and every category <= 15% of total. Use short, readable labels (e.g. "Forms", "Data table", "Alert & Dialog").

**Step 2: Run registry:build and tests**

Run: `pnpm registry:build` then `pnpm test`.

Expected: Build succeeds; new test "produces 20–35 categories with no category over 15%" passes; no 15% warnings (or only acceptable ones you chose to leave for follow-up). Fix any remaining assertion (e.g. scope, compact keys) if broken by earlier edits.

**Step 3: Commit**

```bash
git add lib/category-collapse.json
git commit -m "feat: add category collapse map (20–35 groups, under 15% cap) (KAT-75)"
```

---

### Task 6: Update compact-index test and remove legacy category assertion

**Files:**
- Modify: `scripts/build-registry.test.mjs`

**Step 1: Remove old per-item category derivation assertion**

In the test "writes index-compact.json with name, category, url only and size under limit", remove the loop that sets `expectedCategory` from `item.name.replace(/\d.*$/, "").replace(/-+$/, "")` and asserts `item.category === expectedCategory`. Keep all other assertions (total, keys, url, size, minified). Categories are now defined by collapse map + explicit registry field; the new test in Task 1 already enforces 20–35 and 15% cap.

**Step 2: Run tests and build**

Run: `pnpm test` and `pnpm build`.

Expected: All tests pass; build succeeds.

**Step 3: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: drop legacy per-item category derivation assertion (KAT-75)"
```

---

### Task 7: Link design doc to plan

**Files:**
- Modify: `docs/plans/2026-02-23-category-collapse-design.md` (bottom line)

**Step 1: Set implementation plan link**

In the design doc, replace "See implementation plan (to be created via writing-plans skill)." with: "See `docs/plans/2026-02-23-category-collapse.md` for the implementation plan."

**Step 2: Commit**

```bash
git add docs/plans/2026-02-23-category-collapse-design.md
git commit -m "docs: link category collapse design to implementation plan"
```

---

## Execution handoff

Plan is saved to `docs/plans/2026-02-23-category-collapse.md`.

**Two execution options:**

1. **Subagent-driven (this session)** — I run each task with a fresh subagent, review between tasks, fast iteration.
2. **Parallel session (separate)** — You open a new session with @executing-plans and run the plan task-by-task with checkpoints.

Which approach do you want?
