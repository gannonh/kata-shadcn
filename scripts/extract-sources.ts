// scripts/extract-sources.ts
import * as fs from "fs"
import * as path from "path"

const PUBLIC_R = path.join(process.cwd(), "public/r")
const REGISTRY_BLOCKS = path.join(process.cwd(), "registry/blocks")
const REGISTRY_COMPONENTS = path.join(process.cwd(), "registry/components")

const SKIP = new Set([
  "registry.json",
  "complex-component.json",
  "example-form.json",
  "example-with-css.json",
  "hello-world.json",
])

const written = new Set<string>()

fs.mkdirSync(REGISTRY_BLOCKS, { recursive: true })
fs.mkdirSync(REGISTRY_COMPONENTS, { recursive: true })

const files = fs.readdirSync(PUBLIC_R).filter(
  (f) => f.endsWith(".json") && !SKIP.has(f)
)

let extracted = 0
let shared = 0

for (const file of files) {
  const raw = fs.readFileSync(path.join(PUBLIC_R, file), "utf8")
  const item = JSON.parse(raw)
  const name = item.name as string

  for (const entry of item.files ?? []) {
    const filePath: string = entry.path
    const content: string = entry.content ?? ""
    const type: string = entry.type

    let destDir: string
    let destPath: string

    if (type === "registry:block") {
      const basename = path.basename(filePath)
      destDir = path.join(REGISTRY_BLOCKS, name)
      destPath = path.join(destDir, basename)
    } else {
      const relative = filePath.replace(/^components\//, "")
      destDir = path.join(REGISTRY_COMPONENTS, path.dirname(relative))
      destPath = path.join(REGISTRY_COMPONENTS, relative)
    }

    if (written.has(destPath)) {
      shared++
      continue
    }

    fs.mkdirSync(destDir, { recursive: true })
    fs.writeFileSync(destPath, content, "utf8")
    written.add(destPath)
    extracted++
  }
}

console.log(`Extracted ${extracted} files (${shared} shared deduplicated)`)
