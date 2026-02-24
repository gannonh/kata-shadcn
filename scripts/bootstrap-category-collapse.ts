// One-time script to generate a suggested lib/category-collapse.json for hand-editing.
// Run: npx tsx scripts/bootstrap-category-collapse.ts
import * as fs from "fs"
import * as path from "path"

const REGISTRY_JSON = path.join(process.cwd(), "registry.json")
const CATEGORY_COLLAPSE_PATH = path.join(process.cwd(), "lib", "category-collapse.json")
const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])

function deriveSegment(name: string): string {
  const beforeHyphen = name.split("-")[0] ?? name
  return beforeHyphen.replace(/\d+$/, "").replace(/-+$/, "") || beforeHyphen
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

if (!fs.existsSync(REGISTRY_JSON)) {
  console.error(`Error: ${REGISTRY_JSON} not found.`)
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(REGISTRY_JSON, "utf8")) as {
  items: Array<{ name: string }>
}
const bySegment: Record<string, number> = {}
for (const item of manifest.items) {
  if (templateNames.has(item.name)) continue
  const seg = deriveSegment(item.name)
  bySegment[seg] = (bySegment[seg] ?? 0) + 1
}

const total = Object.values(bySegment).reduce((a, b) => a + b, 0)
const cap = Math.ceil(total * 0.15)
const entries = Object.entries(bySegment).sort((a, b) => b[1] - a[1])

for (const [seg, count] of entries) {
  if (count > cap) {
    const pct = ((100 * count) / total).toFixed(1)
    console.warn(`Segment "${seg}" has ${count} components (${pct}%); consider splitting.`)
  }
}

const suggested: Record<string, string> = {}
for (const [seg] of entries) {
  suggested[seg] = titleCase(seg)
}

try {
  fs.mkdirSync(path.dirname(CATEGORY_COLLAPSE_PATH), { recursive: true })
  fs.writeFileSync(
    CATEGORY_COLLAPSE_PATH,
    JSON.stringify(suggested, null, 2) + "\n",
    "utf8"
  )
} catch (err) {
  console.error(`Error writing ${CATEGORY_COLLAPSE_PATH}: ${(err as NodeJS.ErrnoException).message}`)
  process.exit(1)
}

console.log(`Wrote ${CATEGORY_COLLAPSE_PATH} with ${Object.keys(suggested).length} segment mappings. Edit to merge into 20–35 categories and fix over-15% segments.`)
