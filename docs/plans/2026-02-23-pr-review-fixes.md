# PR Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Address all critical and important issues from PR #10 review, plus agreed suggestions.

**Architecture:** Seven focused changes across four files — error handling in two scripts, test strengthening in the test file, a tsconfig revert, and doc updates in AGENTS.md. No new files needed. Each task has a commit.

**Tech Stack:** TypeScript, Node.js fs module, Node test runner (`node:test`), c8 coverage.

---

## Issues Being Addressed

| Priority | Issue | File |
|----------|-------|------|
| Critical | New `writeFileSync` for `index-compact.json` has no error handling | `build-registry.ts:131-135` |
| Critical | `readdirSync(PUBLIC_R)` has no error handling | `generate-manifest.ts:25` |
| Critical | `item.name` cast without validation, silent corrupt manifest | `generate-manifest.ts:32` |
| Important | `jsx` changed to `"react-jsx"` — revert to `"preserve"` | `tsconfig.json:18` |
| Important | `compact.total` compared to `component-index.json`, not `registry.json` | `build-registry.test.mjs:56-61` |
| Important | `category` derivation regex untested | `build-registry.ts:84` |
| Important | `generate-manifest.ts` has zero test coverage | `build-registry.test.mjs` |
| Suggestion | Non-atomic overwrite of `registry.json` | `generate-manifest.ts:69-73` |
| Suggestion | Size test doesn't assert minified format | `build-registry.test.mjs:77` |
| Suggestion | `AGENTS.md` project structure entry outdated | `AGENTS.md:46` |
| Suggestion | Verification example doesn't cover `index-compact.json` | `AGENTS.md:82` |

---

## Task 1: Fix build-registry.ts — error handling for index-compact.json write

**Files:**
- Modify: `scripts/build-registry.ts:131-135`

**Context:** The write at lines 131-135 is the only new code in this PR. If it fails (e.g., disk full between writing `index.json` and `index-compact.json`), the process exits with a raw Node stack trace and no summary line or exit code from the `missing > 0` guard. Wrapping in try-catch with a contextual message fixes this without over-engineering.

**Step 1: Wrap the new writeFileSync in try-catch**

Replace lines 131-135 in `scripts/build-registry.ts`:

```typescript
// Before:
fs.writeFileSync(
  path.join(PUBLIC_R, "index-compact.json"),
  JSON.stringify(compactIndex) + "\n",
  "utf8"
)

// After:
try {
  fs.writeFileSync(
    path.join(PUBLIC_R, "index-compact.json"),
    JSON.stringify(compactIndex) + "\n",
    "utf8"
  )
} catch (err) {
  console.error(`Error writing index-compact.json: ${(err as NodeJS.ErrnoException).message}`)
  process.exit(1)
}
```

**Step 2: Run tests to verify nothing broken**

```bash
pnpm test
```

Expected: all tests pass.

**Step 3: Commit**

```bash
git add scripts/build-registry.ts
git commit -m "fix: add error handling for index-compact.json write"
```

---

## Task 2: Fix generate-manifest.ts — guard missing PUBLIC_R + validate item.name

**Files:**
- Modify: `scripts/generate-manifest.ts`

**Context:**
- Line 25: `readdirSync(PUBLIC_R)` throws `ENOENT` if `public/r/` doesn't exist (e.g., `registry:build` not run first). A clear error message prevents confusion.
- Line 32: `item.name as string` — if a file in `public/r/` lacks a `name` field, `undefined` propagates silently into `registry.json`. Need an explicit check.

**Step 1: Add PUBLIC_R existence guard before line 25 and validate item.name in the loop**

```typescript
// Add before: const files = fs.readdirSync(PUBLIC_R)...
if (!fs.existsSync(PUBLIC_R)) {
  console.error(`Error: ${PUBLIC_R} does not exist. Run 'pnpm registry:build' first.`)
  process.exit(1)
}

// In the loop, replace:
//   const name = item.name as string
// with:
if (!item.name || typeof item.name !== "string") {
  console.warn(`  Skipping ${file}: missing or invalid name field`)
  continue
}
const name = item.name
```

**Step 2: Run registry:build then generate-manifest to verify it works**

```bash
pnpm registry:build
npx tsx scripts/generate-manifest.ts
```

Expected: exits 0, prints summary line.

**Step 3: Commit**

```bash
git add scripts/generate-manifest.ts
git commit -m "fix: guard missing public/r dir and validate item.name in generate-manifest"
```

---

## Task 3: Fix generate-manifest.ts — atomic write for registry.json

**Files:**
- Modify: `scripts/generate-manifest.ts:69-73`

**Context:** `writeFileSync` is not atomic. A disk-full event mid-write truncates `registry.json` (the source-of-truth manifest), and the next `registry:build` run fails with an opaque SyntaxError. Write-then-rename (`tmpfile → rename`) is atomic on POSIX.

**Step 1: Replace the writeFileSync with write-then-rename**

```typescript
// Before:
fs.writeFileSync(
  path.join(process.cwd(), "registry.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
)

// After:
const registryJsonPath = path.join(process.cwd(), "registry.json")
const tmpPath = registryJsonPath + ".tmp"
try {
  fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2) + "\n", "utf8")
  fs.renameSync(tmpPath, registryJsonPath)
} catch (err) {
  // Clean up temp file if rename failed
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
  console.error(`Error writing registry.json: ${(err as NodeJS.ErrnoException).message}`)
  process.exit(1)
}
```

**Step 2: Run and verify**

```bash
npx tsx scripts/generate-manifest.ts
```

Expected: exits 0. `registry.json` is intact (check with `head -5 registry.json`).

**Step 3: Commit**

```bash
git add scripts/generate-manifest.ts
git commit -m "fix: use atomic write-then-rename for registry.json in generate-manifest"
```

---

## Task 4: Revert tsconfig.json jsx to "preserve"

**Files:**
- Modify: `tsconfig.json:18`

**Context:** `"preserve"` is the Next.js-recommended value. It signals to Next.js SWC to handle the JSX transform. `"react-jsx"` causes TypeScript itself to type-check the transform — with `noEmit: true` this has no effect on output, but it diverges from the framework baseline and may affect editor tooling. Revert to convention.

**Step 1: Change `jsx` back to `"preserve"`**

In `tsconfig.json` line 18:
```json
"jsx": "preserve",
```

**Step 2: Verify lint and build still pass**

```bash
pnpm lint
pnpm build
```

Expected: both pass with no new errors.

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "fix: revert tsconfig jsx to preserve (Next.js convention)"
```

---

## Task 5: Strengthen test assertions in build-registry.test.mjs

**Files:**
- Modify: `scripts/build-registry.test.mjs`

Three test improvements in one task:

1. **Compare `compact.total` against `registry.json` non-template count** — the current assertion compares both outputs of the same build run against each other, so a consistent undercounting (e.g. a missing-file skip) passes. Comparing against `registry.json` directly would catch this.

2. **Assert `category` derivation values** — the test only checks the key exists, not its value. Lock in the regex behavior with concrete examples.

3. **Assert minified format** — if the write accidentally changed to `JSON.stringify(compactIndex, null, 2)`, the size test would still pass. Add an explicit check.

**Step 1: Add imports and update the compact index test**

In `scripts/build-registry.test.mjs`, add `registryJsonPath` near the top:

```javascript
const registryJsonPath = path.join(root, "registry.json")
```

**Step 2: Replace the total consistency assertion (lines 56-61)**

```javascript
// Before:
const componentIndex = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
assert.strictEqual(
  compact.total,
  componentIndex.length,
  "compact index total must match component-index.json length"
)

// After:
const componentIndex = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
assert.strictEqual(
  compact.total,
  componentIndex.length,
  "compact index total must match component-index.json length"
)
// Also verify against registry.json non-template count as ground truth
const manifest = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"))
const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])
const expectedCount = manifest.items.filter((i) => !templateNames.has(i.name)).length
assert.strictEqual(
  compact.total,
  expectedCount,
  `compact total (${compact.total}) must equal non-template registry.json item count (${expectedCount})`
)
```

**Step 3: Add category derivation assertions inside the items loop (after the existing key-shape assertion)**

```javascript
// Inside: for (const item of compact.items) { ... }
// Add after the url assertion:
const expectedCategory = item.name.replace(/\d.*$/, "").replace(/-+$/, "")
assert.strictEqual(
  item.category,
  expectedCategory,
  `item ${item.name}: category "${item.category}" must match derived value "${expectedCategory}"`
)
```

**Step 4: Add minified format assertion (after the size check)**

```javascript
// After the sizeBytes assertion:
assert.ok(
  !raw.startsWith("{\n"),
  "index-compact.json must be minified (no leading whitespace after opening brace)"
)
```

**Step 5: Run tests**

```bash
pnpm test
```

Expected: all tests pass.

**Step 6: Commit**

```bash
git add scripts/build-registry.test.mjs
git commit -m "test: strengthen compact index assertions (ground truth count, category values, minified format)"
```

---

## Task 6: Add generate-manifest.ts smoke test

**Files:**
- Modify: `scripts/build-registry.test.mjs`
- Modify: `package.json` (add `generate-manifest` script)

**Context:** `generate-manifest.ts` has zero tests. The most important behavior to test: it does not re-ingest `index-compact.json` back into `registry.json` (the SKIP set added in this PR). Strategy: save `registry.json`, run `generate-manifest`, assert no `index-compact` entry, restore `registry.json`.

**Step 1: Add `generate-manifest` script to package.json**

In `package.json`, add to the `"scripts"` block:
```json
"generate-manifest": "npx tsx scripts/generate-manifest.ts",
```

**Step 2: Add a new describe block to `build-registry.test.mjs`**

Add after the closing `})` of the existing `describe("build-registry")` block:

```javascript
describe("generate-manifest", () => {
  const registryJsonPath = path.join(root, "registry.json")
  let originalRegistryJson

  before(() => {
    // Save registry.json so we can restore it after the test run
    originalRegistryJson = fs.readFileSync(registryJsonPath, "utf-8")
    try {
      execSync("pnpm generate-manifest", { encoding: "utf-8", cwd: root, stdio: "pipe" })
    } catch (err) {
      throw new Error(`generate-manifest failed (exit ${err.status}):\nSTDOUT: ${err.stdout}\nSTDERR: ${err.stderr}`)
    }
  })

  after(() => {
    // Restore original registry.json
    fs.writeFileSync(registryJsonPath, originalRegistryJson)
  })

  it("does not add index-compact or index entries to registry.json", () => {
    const manifest = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"))
    const names = manifest.items.map((i) => i.name)
    assert.ok(
      !names.includes("index-compact"),
      "generate-manifest must not add 'index-compact' to registry.json items"
    )
    assert.ok(
      !names.includes("index"),
      "generate-manifest must not add 'index' to registry.json items"
    )
  })

  it("preserves template items in registry.json", () => {
    const manifest = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"))
    const names = manifest.items.map((i) => i.name)
    assert.ok(names.includes("hello-world"), "template hello-world must be preserved")
    assert.ok(names.includes("example-form"), "template example-form must be preserved")
  })
})
```

**Step 3: Run tests**

```bash
pnpm test
```

Expected: all tests pass including the new `generate-manifest` suite.

**Step 4: Commit**

```bash
git add scripts/build-registry.test.mjs package.json
git commit -m "test: add generate-manifest smoke tests (SKIP protection, template preservation)"
```

---

## Task 7: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md:46`
- Modify: `AGENTS.md:82`

**Step 1: Fix project structure entry for build-registry.ts**

At line 46, change:
```markdown
- `scripts/build-registry.ts`: generates registry payloads in `public/r/` and search data in `lib/component-index.json`.
```
To:
```markdown
- `scripts/build-registry.ts`: generates registry payloads in `public/r/` (per-component JSON, `index.json`, `index-compact.json`) and browser UI search data in `lib/component-index.json`.
- `scripts/generate-manifest.ts`: regenerates `registry.json` from built `public/r/` output; run after `registry:build` to sync the manifest.
```

**Step 2: Fix verification example to include index-compact.json**

At line 82, change:
```markdown
- For registry or auth changes, manually verify endpoints, e.g. `curl -H "x-registry-token: $REGISTRY_TOKEN" http://localhost:3000/r/index.json`.
```
To:
```markdown
- For registry or auth changes, manually verify endpoints, e.g. `curl -H "x-registry-token: $REGISTRY_TOKEN" http://localhost:3000/r/index.json`. Also verify `curl http://localhost:3000/r/index-compact.json` returns a minified JSON object with `total` and `items` keys.
```

**Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md project structure and verification examples for compact index"
```

---

## Verification Checklist

After all tasks complete:

```bash
pnpm lint           # no new lint errors
pnpm test           # all unit tests pass (including new generate-manifest suite)
pnpm test:coverage  # coverage still meets targets (lines ≥80%, functions ≥80%, branches ≥70%)
pnpm build          # build succeeds end-to-end
```
