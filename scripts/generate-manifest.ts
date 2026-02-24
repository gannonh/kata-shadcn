// scripts/generate-manifest.ts
import * as fs from "fs"
import * as path from "path"

const PUBLIC_R = path.join(process.cwd(), "public/r")
const SKIP = new Set([
  "registry.json",
  "index.json",
  "index-compact.json",
  "complex-component.json",
  "example-form.json",
  "example-with-css.json",
  "hello-world.json",
])

const existing = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "registry.json"), "utf8")
)

const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])
const templateItems = existing.items.filter((item: { name: string }) => templateNames.has(item.name))

const newItems: Array<Record<string, unknown>> = []

if (!fs.existsSync(PUBLIC_R)) {
  console.error(`Error: ${PUBLIC_R} does not exist. Run 'pnpm registry:build' first.`)
  process.exit(1)
}

const files = fs.readdirSync(PUBLIC_R).filter(
  (f) => f.endsWith(".json") && !SKIP.has(f)
)

for (const file of files) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let item: Record<string, any>
  try {
    const raw = fs.readFileSync(path.join(PUBLIC_R, file), "utf8")
    item = JSON.parse(raw)
  } catch (err) {
    console.warn(`  Skipping ${file}: failed to read or parse (${(err as Error).message})`)
    continue
  }

  if (!item.name || typeof item.name !== "string") {
    console.warn(`  Skipping ${file}: missing or invalid name field`)
    continue
  }
  const name = item.name

  const registryFiles = (item.files ?? []).map((entry: { path: string; type: string }) => {
    const type: string = entry.type
    let registryPath: string

    if (type === "registry:block") {
      const basename = path.basename(entry.path)
      registryPath = `registry/blocks/${name}/${basename}`
    } else {
      const relative = (entry.path as string).replace(/^components\//, "")
      registryPath = `registry/components/${relative}`
    }

    return { path: registryPath, type }
  })

  newItems.push({
    name,
    type: item.type ?? "registry:block",
    title: item.title ?? name,
    description: item.description ?? "",
    ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies?.length
      ? { registryDependencies: item.registryDependencies }
      : {}),
    files: registryFiles,
  })
}

const manifest = {
  ...existing,
  name: "shadcn-registry",
  homepage: "https://shadcn-registry-eight.vercel.app",
  items: [...templateItems, ...newItems],
}

const registryJsonPath = path.join(process.cwd(), "registry.json")
const tmpPath = registryJsonPath + ".tmp"
try {
  fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2) + "\n", "utf8")
  fs.renameSync(tmpPath, registryJsonPath)
} catch (err) {
  try { fs.unlinkSync(tmpPath) } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e
  }
  console.error(`Error writing registry.json: ${(err as NodeJS.ErrnoException).message}`)
  process.exit(1)
}

console.log(`Generated registry.json with ${newItems.length} registry + ${templateItems.length} template items`)
