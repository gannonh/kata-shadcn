// scripts/build-registry.ts
import crypto from "crypto"
import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"
import { pathToFileURL } from "url"
import { createRequire } from "module"

type CategoryCollapseMap = Record<string, string>

interface Complexity {
  files: number
  lines: number
  dependencies: number
}

// Extend ComponentIndexEntry with optional lastModified (omit when not in git)
interface ComponentIndexEntry {
  name: string
  title: string
  description: string
  category: string
  installCommand: string
  tags: string[]
  complexity: Complexity
  contentHash: string
  lastModified?: string
  peerComponents: string[]
}

interface RegistryItem {
  name: string
  type?: string
  title?: string
  description?: string
  category?: string
  files?: Array<{ path: string; type: string }>
  dependencies?: string[]
  registryDependencies?: string[]
}

interface RegistryManifest {
  items: RegistryItem[]
}

export interface BuildRegistryOptions {
  /** Override registry.json path (for testing error paths under coverage). */
  registryJsonPath?: string
}

const REGISTRY_JSON_DEFAULT = path.join(process.cwd(), "registry.json")
const PUBLIC_R = path.join(process.cwd(), "public/r")
const LIB = path.join(process.cwd(), "lib")
const CATEGORY_COLLAPSE_PATH = path.join(process.cwd(), "lib", "category-collapse.json")
const REGISTRY_SCOPE = "@kata-shadcn"

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "with", "for", "to", "in", "on", "of",
  "section", "component", "block",
])

function deriveTags(
  name: string,
  description: string,
  deriveSegment: (n: string) => string
): string[] {
  const seg = deriveSegment(name)
  const fromName = seg ? [seg] : []
  const words = (description ?? "")
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  const seen = new Set<string>(fromName)
  const fromDesc: string[] = []
  for (const w of words) {
    if (seen.has(w)) continue
    seen.add(w)
    fromDesc.push(w)
    if (fromDesc.length >= 8) break
  }
  return [...fromName, ...fromDesc]
}

function exit(code: number): never {
  if (process.env.THROW_ON_EXIT) {
    throw new Error(`Exit ${code}`)
  }
  process.exit(code)
}

function main(options: BuildRegistryOptions = {}): void {
  const REGISTRY_JSON = options.registryJsonPath ?? REGISTRY_JSON_DEFAULT

  try {
    fs.mkdirSync(PUBLIC_R, { recursive: true })
    fs.mkdirSync(LIB, { recursive: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`Error creating output directories: ${msg}. Paths: ${PUBLIC_R}, ${LIB}`)
    exit(1)
  }

  const require = createRequire(import.meta.url)
  const { deriveSegment, loadCollapseMap } = require("./category-collapse-loader.cjs") as {
    deriveSegment: (name: string) => string
    loadCollapseMap: (filePath: string) => CategoryCollapseMap
  }
  let collapseMap: CategoryCollapseMap
  try {
    collapseMap = loadCollapseMap(CATEGORY_COLLAPSE_PATH)
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`)
    exit(1)
  }

  let manifest: RegistryManifest
  try {
    manifest = JSON.parse(fs.readFileSync(REGISTRY_JSON, "utf8")) as RegistryManifest
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const code = err instanceof Error && "code" in err ? (err as NodeJS.ErrnoException).code : undefined
    if (code === "ENOENT") {
      console.error(`Error: ${REGISTRY_JSON} not found.`)
    } else {
      console.error(`Error: ${REGISTRY_JSON} is invalid JSON: ${msg}`)
    }
    exit(1)
  }
  if (!Array.isArray(manifest?.items)) {
    console.error(`Error: ${REGISTRY_JSON} must have an "items" array.`)
    exit(1)
  }

  const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])

  function resolveCategory(itemCategory: unknown, fallback: string): string {
    if (typeof itemCategory === "string" && itemCategory) return itemCategory
    return fallback
  }

  // Map registry source paths → original consumer paths.
  // registry/blocks/about1/about1.tsx → block/about1.tsx
  // registry/components/shared/logo.tsx → components/shared/logo.tsx
  // Paths that don't match these prefixes are returned unchanged.
  function toConsumerPath(registryPath: string): string {
    if (registryPath.startsWith("registry/blocks/")) {
      return `block/${path.basename(registryPath)}`
    }
    if (registryPath.startsWith("registry/components/")) {
      return registryPath.replace("registry/components/", "components/")
    }
    return registryPath
  }

  function canonicalString(val: unknown): string {
    if (val === null || typeof val !== "object") return JSON.stringify(val)
    if (Array.isArray(val)) return "[" + val.map(canonicalString).join(",") + "]"
    const obj = val as Record<string, unknown>
    const keys = Object.keys(obj).sort()
    const parts = keys.map((k) => JSON.stringify(k) + ":" + canonicalString(obj[k]))
    return "{" + parts.join(",") + "}"
  }
  function contentHash(registryItem: Record<string, unknown>): string {
    return crypto.createHash("sha256").update(canonicalString(registryItem), "utf8").digest("hex")
  }

  // Step 1: Collect paths and build lastModified map from batched git log
  const allPaths = [...new Set(manifest.items.flatMap((item) => (item.files ?? []).map((f) => f.path)))]
  let lastModifiedMap: Map<string, string> = new Map()
  if (allPaths.length > 0) {
    try {
      const isRepo = execSync("git rev-parse --is-inside-work-tree", { encoding: "utf8" }).trim() === "true"
      if (isRepo) {
        const out = execSync("git log -5000 -z --format=%cI%x00 --name-only -z -- registry/", {
          encoding: "utf8",
          maxBuffer: 10 * 1024 * 1024,
        })
        const tokens = out.split("\0").filter((s) => s.length > 0)
        let i = 0
        const isoDate = /^\d{4}-\d{2}-\d{2}T/
        while (i < tokens.length) {
          const date = tokens[i]
          if (!isoDate.test(date)) break
          i++
          while (i < tokens.length && !isoDate.test(tokens[i])) {
            const p = tokens[i].replace(/^\.\//, "")
            if (!lastModifiedMap.has(p)) lastModifiedMap.set(p, date)
            i++
          }
        }
      }
    } catch {
      console.warn("lastModified skipped: not a git repo or git failed")
    }
  }

  const index: ComponentIndexEntry[] = []
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

      let content: string
      try {
        content = fs.readFileSync(sourcePath, "utf8")
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`Error reading ${fileEntry.path}: ${msg}`)
        exit(1)
      }
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

    const hash = contentHash(registryItem)

    const componentJsonPath = path.join(PUBLIC_R, `${item.name}.json`)
    try {
      fs.writeFileSync(
        componentJsonPath,
        JSON.stringify(registryItem, null, 2) + "\n",
        "utf8"
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Error writing ${componentJsonPath}: ${msg}`)
      exit(1)
    }

    const seg = deriveSegment(item.name)
    const category = resolveCategory(item.category, collapseMap[seg] ?? seg)

    const lineCount = builtFiles.reduce((sum, f) => sum + f.content.split(/\n/).length, 0)
    const sourcePaths = (item.files ?? []).map((f) => f.path)
    let maxDate: string | undefined
    for (const p of sourcePaths) {
      const d = lastModifiedMap.get(p)
      if (d && (!maxDate || d > maxDate)) maxDate = d
    }
    index.push({
      name: item.name,
      title: item.title ?? "",
      description: item.description ?? "",
      category,
      installCommand: `npx shadcn add ${REGISTRY_SCOPE}/${item.name}`,
      tags: deriveTags(item.name, item.description ?? "", deriveSegment),
      complexity: {
        files: builtFiles.length,
        lines: lineCount,
        dependencies: (item.dependencies?.length ?? 0) + (item.registryDependencies?.length ?? 0),
      },
      contentHash: hash,
      ...(maxDate != null && { lastModified: maxDate }),
      peerComponents: [],
    })

    built++
  }

  const totalForCap = index.length
  const byCategory: Record<string, number> = {}
  for (const entry of index) {
    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1
  }
  for (const [cat, count] of Object.entries(byCategory)) {
    if (totalForCap > 0 && count / totalForCap > 0.15) {
      const pct = ((100 * count) / totalForCap).toFixed(1)
      console.warn(
        `Category "${cat}" has ${count} components (${pct}%); max 15% allowed.`
      )
    }
  }

  function writeJsonFile(filePath: string, data: unknown, minified = false): void {
    try {
      const content = minified ? JSON.stringify(data) + "\n" : JSON.stringify(data, null, 2) + "\n"
      fs.writeFileSync(filePath, content, "utf8")
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Error writing ${filePath}: ${msg}`)
      exit(1)
    }
  }

  // Browser UI index
  writeJsonFile(path.join(LIB, "component-index.json"), index)

  // Agent discovery index (same index, map to include enriched fields)
  const agentIndex = {
    _description: "Machine-readable index of all available registry components. Fetch /r/{name}.json to get full source. Requires x-registry-token header.",
    total: index.length,
    items: index.map((c) => ({
      name: c.name,
      title: c.title,
      description: c.description,
      category: c.category,
      url: `/r/${c.name}.json`,
      tags: c.tags,
      complexity: c.complexity,
      contentHash: c.contentHash,
      ...(c.lastModified != null && { lastModified: c.lastModified }),
      peerComponents: c.peerComponents,
    })),
  }
  writeJsonFile(path.join(PUBLIC_R, "index.json"), agentIndex)

  // Compact agent index (name, category, url only; minified)
  const compactIndex = {
    total: index.length,
    items: index.map((c) => ({
      name: c.name,
      category: c.category,
      url: `/r/${c.name}.json`,
    })),
  }
  writeJsonFile(path.join(PUBLIC_R, "index-compact.json"), compactIndex, true)

  console.log(`Built ${built} components. Skipped ${skipped} templates. Missing sources: ${missing}. Index: ${index.length} entries.`)
  if (missing > 0) {
    console.error(`Error: ${missing} source file(s) missing. Fix registry.json or restore missing files.`)
    exit(1)
  }
}

// Run when executed as script (not when imported by tests)
const runAsMain =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
if (runAsMain) {
  main()
}

export { main }
