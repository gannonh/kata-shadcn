import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const componentIndexPath = path.join(root, "lib", "component-index.json")
const compactIndexPath = path.join(root, "public", "r", "index-compact.json")
const registryJsonPath = path.join(root, "registry.json")
const categoryCollapsePath = path.join(root, "lib", "category-collapse.json")
// 300KB cap; design target is ~80–100KB — test allows headroom for growth
const MAX_COMPACT_INDEX_BYTES = 300 * 1024

import { deriveSegment, loadCollapseMap } from "./category-collapse-loader.mjs"

describe("deriveSegment", () => {
  it("takes first segment before hyphen", () => {
    assert.strictEqual(deriveSegment("foo-bar-baz"), "foo")
    assert.strictEqual(deriveSegment("hero1"), "hero")
  })
  it("strips trailing digits from segment", () => {
    assert.strictEqual(deriveSegment("hero1"), "hero")
    assert.strictEqual(deriveSegment("card42"), "card")
    assert.strictEqual(deriveSegment("feature-1"), "feature")
  })
  it("strips trailing hyphens from segment", () => {
    assert.strictEqual(deriveSegment("foo---"), "foo")
  })
  it("returns name when no hyphen", () => {
    assert.strictEqual(deriveSegment("about"), "about")
    assert.strictEqual(deriveSegment("single"), "single")
  })
  it("handles empty string and single segment", () => {
    assert.strictEqual(deriveSegment(""), "")
    assert.strictEqual(deriveSegment("only"), "only")
  })
})

describe("category-collapse-loader (in-process coverage)", () => {
  it("loadCollapseMap throws when file is missing", () => {
    assert.throws(
      () => loadCollapseMap(path.join(root, "lib", "nonexistent-collapse.json")),
      /not found/
    )
  })

  it("loadCollapseMap throws when file is not a JSON object", () => {
    const badPath = path.join(root, "lib", "category-collapse-bad.json")
    try {
      fs.writeFileSync(badPath, "[]", "utf-8")
      assert.throws(() => loadCollapseMap(badPath), /must be a JSON object/)
    } finally {
      if (fs.existsSync(badPath)) fs.unlinkSync(badPath)
    }
  })

  it("loadCollapseMap throws when file is invalid JSON", () => {
    const badPath = path.join(root, "lib", "category-collapse-bad.json")
    try {
      fs.writeFileSync(badPath, "{", "utf-8")
      assert.throws(() => loadCollapseMap(badPath), /invalid/)
    } finally {
      if (fs.existsSync(badPath)) fs.unlinkSync(badPath)
    }
  })

  it("loadCollapseMap throws when object value is not a string", () => {
    const badPath = path.join(root, "lib", "category-collapse-bad.json")
    try {
      fs.writeFileSync(badPath, '{"hero": 123}', "utf-8")
      assert.throws(() => loadCollapseMap(badPath), /values must be strings/)
    } finally {
      if (fs.existsSync(badPath)) fs.unlinkSync(badPath)
    }
  })
})

describe("build-registry category collapse file", () => {
  it("fails when lib/category-collapse.json is missing", () => {
    if (process.env.COVERAGE_RUN) return
    const backup = fs.readFileSync(categoryCollapsePath, "utf-8")
    try {
      fs.unlinkSync(categoryCollapsePath)
      try {
        execSync("pnpm registry:build", { encoding: "utf-8", cwd: root, stdio: "pipe" })
        assert.fail("registry:build should fail when category-collapse.json is missing")
      } catch (err) {
        assert.ok(err.status !== 0, "expected non-zero exit")
      }
    } finally {
      fs.writeFileSync(categoryCollapsePath, backup, "utf-8")
    }
  })

  it("fails when lib/category-collapse.json is not a JSON object", () => {
    if (process.env.COVERAGE_RUN) return
    const backup = fs.readFileSync(categoryCollapsePath, "utf-8")
    try {
      fs.writeFileSync(categoryCollapsePath, "[]", "utf-8")
      try {
        execSync("pnpm registry:build", { encoding: "utf-8", cwd: root, stdio: "pipe" })
        assert.fail("registry:build should fail when category-collapse.json is not an object")
      } catch (err) {
        assert.ok(err.status !== 0, "expected non-zero exit")
      }
    } finally {
      fs.writeFileSync(categoryCollapsePath, backup, "utf-8")
    }
  })
})

describe("build-registry", () => {
  before(async () => {
    if (process.env.COVERAGE_RUN) {
      const { main } = await import("./build-registry.ts")
      main()
      return
    }
    try {
      execSync("pnpm registry:build", { encoding: "utf-8", cwd: root, stdio: "pipe" })
    } catch (err) {
      throw new Error(`registry:build failed (exit ${err.status}):\nSTDOUT: ${err.stdout}\nSTDERR: ${err.stderr}`)
    }
  })

  it("writes component-index.json with install commands using @kata-shadcn scope", () => {
    assert.ok(fs.existsSync(componentIndexPath))
    const raw = fs.readFileSync(componentIndexPath, "utf-8")
    const index = JSON.parse(raw)

    assert.ok(
      index.length > 0,
      `component-index.json is empty — registry:build produced 0 entries`
    )
    for (const entry of index) {
      assert.ok(entry.name, `entry missing name field: ${JSON.stringify(entry)}`)
      assert.strictEqual(
        entry.installCommand,
        `npx shadcn add @kata-shadcn/${entry.name}`
      )
    }
  })

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

  it("completes registry:build in under 60s (manual/CI check)", () => {
    if (process.env.COVERAGE_RUN) return
    const start = Date.now()
    execSync("pnpm registry:build", { encoding: "utf-8", cwd: root, stdio: "pipe" })
    const duration = Date.now() - start
    assert.ok(duration < 60000, `registry:build took ${duration}ms (must be < 60s)`)
  })

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

  it("enriches component-index and index.json with tags, complexity, contentHash, lastModified, peerComponents", () => {
    assert.ok(fs.existsSync(componentIndexPath))
    const index = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
    assert.ok(index.length > 0)
    const entry = index[0]
    assert.ok(Array.isArray(entry.tags), "entry must have tags array")
    assert.ok(
      index.some((e) => e.tags.length >= 1),
      "at least one entry should have derived tags"
    )
    // Optional tag coverage: design accepts best-effort ~90%; assert >= 50% so we don't ship empty tags everywhere
    const withTags = index.filter((e) => e.tags && e.tags.length > 0).length
    const total = index.length
    assert.ok(
      withTags >= Math.ceil(total * 0.5),
      `at least 50% of entries should have non-empty tags (got ${withTags}/${total})`
    )
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

  it("fails with clear message when registry.json is missing (coverage)", async () => {
    if (!process.env.COVERAGE_RUN) return
    const { main } = await import("./build-registry.ts")
    const missingPath = path.join(root, "nonexistent-registry.json")
    const orig = process.env.THROW_ON_EXIT
    process.env.THROW_ON_EXIT = "1"
    try {
      main({ registryJsonPath: missingPath })
      assert.fail("main should throw when registry is missing")
    } catch (err) {
      assert.ok(err.message.includes("Exit 1"), `expected Exit 1, got: ${err.message}`)
    } finally {
      if (orig !== undefined) process.env.THROW_ON_EXIT = orig
      else delete process.env.THROW_ON_EXIT
    }
  })

  it("fails with clear message when registry.json is invalid JSON (coverage)", async () => {
    if (!process.env.COVERAGE_RUN) return
    const badPath = path.join(root, "lib", "registry-invalid-test.json")
    try {
      fs.writeFileSync(badPath, "{", "utf-8")
      const { main } = await import("./build-registry.ts")
      const orig = process.env.THROW_ON_EXIT
      process.env.THROW_ON_EXIT = "1"
      try {
        main({ registryJsonPath: badPath })
        assert.fail("main should throw when registry is invalid JSON")
      } catch (err) {
        assert.ok(err.message.includes("Exit 1"), `expected Exit 1, got: ${err.message}`)
      } finally {
        if (orig !== undefined) process.env.THROW_ON_EXIT = orig
        else delete process.env.THROW_ON_EXIT
      }
    } finally {
      if (fs.existsSync(badPath)) fs.unlinkSync(badPath)
    }
  })

  it("fails when registry.json has no items array (coverage)", async () => {
    if (!process.env.COVERAGE_RUN) return
    const badPath = path.join(root, "lib", "registry-no-items-test.json")
    try {
      fs.writeFileSync(badPath, '{"items": null}', "utf-8")
      const { main } = await import("./build-registry.ts")
      const orig = process.env.THROW_ON_EXIT
      process.env.THROW_ON_EXIT = "1"
      try {
        main({ registryJsonPath: badPath })
        assert.fail("main should throw when items is not an array")
      } catch (err) {
        assert.ok(err.message.includes("Exit 1"), `expected Exit 1, got: ${err.message}`)
      } finally {
        if (orig !== undefined) process.env.THROW_ON_EXIT = orig
        else delete process.env.THROW_ON_EXIT
      }
    } finally {
      if (fs.existsSync(badPath)) fs.unlinkSync(badPath)
    }
  })

  it("uses explicit item.category from registry when present", () => {
    if (process.env.COVERAGE_RUN) return
    const regPath = path.join(root, "registry.json")
    const backup = fs.readFileSync(regPath, "utf-8")
    const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])
    try {
      const manifest = JSON.parse(backup)
      const item = manifest.items.find((i) => !templateNames.has(i.name))
      assert.ok(item, "registry must have at least one non-template item")
      item.category = "ExplicitTestCategory"
      fs.writeFileSync(regPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8")
      execSync("pnpm registry:build", { encoding: "utf-8", cwd: root, stdio: "pipe" })
      const index = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
      const entry = index.find((e) => e.name === item.name)
      assert.ok(entry, `index should have entry for ${item.name}`)
      assert.strictEqual(entry.category, "ExplicitTestCategory", "explicit item.category must appear in index")
    } finally {
      fs.writeFileSync(regPath, backup)
    }
  })

  it("writes index-compact.json with name, category, url only and size under limit", () => {
    assert.ok(fs.existsSync(compactIndexPath), "index-compact.json missing after registry:build")
    const raw = fs.readFileSync(compactIndexPath, "utf-8")
    const compact = JSON.parse(raw)

    assert.strictEqual(
      compact.items.length,
      compact.total,
      "index-compact.json items.length must equal total"
    )
    const componentIndex = JSON.parse(fs.readFileSync(componentIndexPath, "utf-8"))
    assert.strictEqual(
      compact.total,
      componentIndex.length,
      "compact index total must match component-index.json length"
    )

    const manifest = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"))
    const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])
    const expectedCount = manifest.items.filter((i) => !templateNames.has(i.name)).length
    assert.strictEqual(
      compact.total,
      expectedCount,
      `compact total (${compact.total}) must equal non-template registry.json item count (${expectedCount})`
    )

    for (const item of compact.items) {
      const keys = Object.keys(item).sort()
      assert.deepStrictEqual(
        keys,
        ["category", "name", "url"],
        `each compact item must have only name, category, url; got ${keys.join(", ")}`
      )
      assert.strictEqual(
        item.url,
        `/r/${item.name}.json`,
        `compact item url must be /r/<name>.json; got ${item.url}`
      )
    }

    const sizeBytes = fs.statSync(compactIndexPath).size
    assert.ok(
      sizeBytes < MAX_COMPACT_INDEX_BYTES,
      `index-compact.json size ${(sizeBytes / 1024).toFixed(1)}KB must be under ${MAX_COMPACT_INDEX_BYTES / 1024}KB`
    )
    assert.ok(
      !raw.startsWith("{\n"),
      "index-compact.json must be minified (no leading whitespace after opening brace)"
    )
  })
})

describe("generate-manifest", () => {
  const regPath = path.join(root, "registry.json")
  let originalRegistryJson

  before(() => {
    originalRegistryJson = fs.readFileSync(regPath, "utf-8")
    try {
      execSync("pnpm generate-manifest", { encoding: "utf-8", cwd: root, stdio: "pipe" })
    } catch (err) {
      throw new Error(`generate-manifest failed (exit ${err.status}):\nSTDOUT: ${err.stdout}\nSTDERR: ${err.stderr}`)
    }
  })

  after(() => {
    fs.writeFileSync(regPath, originalRegistryJson)
  })

  it("does not add index-compact or index entries to registry.json", () => {
    const manifest = JSON.parse(fs.readFileSync(regPath, "utf-8"))
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
    const manifest = JSON.parse(fs.readFileSync(regPath, "utf-8"))
    const names = manifest.items.map((i) => i.name)
    assert.ok(names.includes("hello-world"), "template hello-world must be preserved")
    assert.ok(names.includes("example-form"), "template example-form must be preserved")
  })
})
