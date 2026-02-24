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
// 300KB cap; design target is ~80–100KB — test allows headroom for growth
const MAX_COMPACT_INDEX_BYTES = 300 * 1024

describe("build-registry", () => {
  before(() => {
    if (process.env.COVERAGE_RUN) {
      // Build already ran under c8; skip duplicate exec to keep coverage for build-registry.ts only
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
