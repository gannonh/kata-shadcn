import { describe, it, before } from "node:test"
import assert from "node:assert"
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const componentIndexPath = path.join(root, "lib", "component-index.json")

describe("build-registry", () => {
  before(() => {
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
})
