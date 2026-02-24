// scripts/build-registry.ts
import * as fs from "fs"
import * as path from "path"

const REGISTRY_JSON = path.join(process.cwd(), "registry.json")
const PUBLIC_R = path.join(process.cwd(), "public/r")
const LIB = path.join(process.cwd(), "lib")
const REGISTRY_SCOPE = "@kata-shadcn"

fs.mkdirSync(PUBLIC_R, { recursive: true })
fs.mkdirSync(LIB, { recursive: true })

const manifest = JSON.parse(fs.readFileSync(REGISTRY_JSON, "utf8"))
const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])

// Map registry source paths → original consumer paths
// registry/blocks/about1/about1.tsx → block/about1.tsx
// registry/components/shared/logo.tsx → components/shared/logo.tsx
function toConsumerPath(registryPath: string): string {
  if (registryPath.startsWith("registry/blocks/")) {
    return `block/${path.basename(registryPath)}`
  }
  if (registryPath.startsWith("registry/components/")) {
    return registryPath.replace("registry/components/", "components/")
  }
  return registryPath
}

const index: Array<{ name: string; title: string; description: string; category: string; installCommand: string }> = []
let built = 0
let skipped = 0
let missing = 0

for (const item of manifest.items) {
  if (templateNames.has(item.name)) {
    skipped++
    continue
  }

  const builtFiles: Array<{ path: string; content: string; type: string }> = []

  for (const fileEntry of item.files ?? []) {
    const sourcePath = path.join(process.cwd(), fileEntry.path)

    if (!fs.existsSync(sourcePath)) {
      console.warn(`  Missing source: ${fileEntry.path}`)
      missing++
      continue
    }

    const content = fs.readFileSync(sourcePath, "utf8")
    const consumerPath = toConsumerPath(fileEntry.path)

    builtFiles.push({
      path: consumerPath,
      content,
      type: fileEntry.type,
    })
  }

  if (builtFiles.length === 0) {
    console.warn(`  Skipping ${item.name}: all source files missing`)
    continue
  }

  const registryItem: Record<string, unknown> = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    files: builtFiles,
  }

  if (item.dependencies?.length) registryItem.dependencies = item.dependencies
  if (item.registryDependencies?.length) registryItem.registryDependencies = item.registryDependencies

  fs.writeFileSync(
    path.join(PUBLIC_R, `${item.name}.json`),
    JSON.stringify(registryItem, null, 2) + "\n",
    "utf8"
  )

  const category = item.name.replace(/\d.*$/, "").replace(/-+$/, "")

  index.push({
    name: item.name,
    title: item.title,
    description: item.description,
    category,
    installCommand: `npx shadcn add ${REGISTRY_SCOPE}/${item.name}`,
  })

  built++
}

// Browser UI index
fs.writeFileSync(
  path.join(LIB, "component-index.json"),
  JSON.stringify(index, null, 2) + "\n",
  "utf8"
)

// Agent discovery index
const agentIndex = {
  _description: "Machine-readable index of all available registry components. Fetch /r/{name}.json to get full source. Requires x-registry-token header.",
  total: index.length,
  items: index.map((c) => ({
    name: c.name,
    title: c.title,
    description: c.description,
    category: c.category,
    url: `/r/${c.name}.json`,
  })),
}
fs.writeFileSync(
  path.join(PUBLIC_R, "index.json"),
  JSON.stringify(agentIndex, null, 2) + "\n",
  "utf8"
)

// Compact agent index (name, category, url only; minified)
const compactIndex = {
  total: index.length,
  items: index.map((c) => ({
    name: c.name,
    category: c.category,
    url: `/r/${c.name}.json`,
  })),
}
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

console.log(`Built ${built} components. Skipped ${skipped} templates. Missing sources: ${missing}. Index: ${index.length} entries.`)
if (missing > 0) {
  console.error(`Error: ${missing} source file(s) missing. Fix registry.json or restore missing files.`)
  process.exit(1)
}
