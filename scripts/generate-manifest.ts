// scripts/generate-manifest.ts
import * as fs from "fs"
import * as path from "path"

const PUBLIC_R = path.join(process.cwd(), "public/r")
const SKIP = new Set([
  "registry.json",
  "index.json",
  "complex-component.json",
  "example-form.json",
  "example-with-css.json",
  "hello-world.json",
])

const existing = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "registry.json"), "utf8")
)

const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])
const templateItems = existing.items.filter((item: any) => templateNames.has(item.name))

const newItems: any[] = []

const files = fs.readdirSync(PUBLIC_R).filter(
  (f) => f.endsWith(".json") && !SKIP.has(f)
)

for (const file of files) {
  const raw = fs.readFileSync(path.join(PUBLIC_R, file), "utf8")
  const item = JSON.parse(raw)
  const name = item.name as string

  const registryFiles = (item.files ?? []).map((entry: any) => {
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

fs.writeFileSync(
  path.join(process.cwd(), "registry.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
)

console.log(`Generated registry.json with ${newItems.length} registry + ${templateItems.length} template items`)
