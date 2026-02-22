# Registry Browser + Auth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the shadcn-registry from a static JSON mirror into an owned, version-controlled component library with auth-protected registry endpoints, a searchable browser UI, and a machine-readable index optimized for AI agent discovery.

**Architecture:** A migration script extracts source code from downloaded JSON blobs into `registry/blocks/` and `registry/components/`. A custom build script regenerates `public/r/*.json` from those sources and also produces `public/r/index.json` — a single endpoint agents can query to find any component by name, category, or description without fetching individual files. A Next.js middleware protects registry routes. A client-side browser page indexes all components with search and category filtering.

**Agent workflow:** `GET /r/index.json` (with token) → scan descriptions → `GET /r/{name}.json` (with token) → read inline source from `files[].content`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, shadcn/ui, Node.js scripts via `tsx`

---

### Task 1: Extract source files from downloaded JSONs

**Files:**
- Create: `scripts/extract-sources.ts`

This is a one-time migration. It reads every `public/r/*.json` that came from shadcnblocks, extracts the inline `content` from each file entry, and writes it to `registry/blocks/{name}/` or `registry/components/` depending on the file type. Shared helper files (same path appearing in multiple components) are deduplicated — written once, not once per component.

**Step 1: Create the script**

```typescript
// scripts/extract-sources.ts
import * as fs from "fs"
import * as path from "path"

const PUBLIC_R = path.join(process.cwd(), "public/r")
const REGISTRY_BLOCKS = path.join(process.cwd(), "registry/blocks")
const REGISTRY_COMPONENTS = path.join(process.cwd(), "registry/components")

// Skip template examples — keep those as-is
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
      // Main block file → registry/blocks/{name}/{basename}
      const basename = path.basename(filePath)
      destDir = path.join(REGISTRY_BLOCKS, name)
      destPath = path.join(destDir, basename)
    } else {
      // Shared helper → registry/components/{original-path-relative}
      // e.g. components/shadcnblocks/logo.tsx → registry/components/shadcnblocks/logo.tsx
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
```

**Step 2: Install tsx (needed to run TypeScript scripts)**

```bash
cd shadcn-registry && pnpm add -D tsx
```

**Step 3: Run the script**

```bash
cd shadcn-registry && npx tsx scripts/extract-sources.ts
```

Expected output: `Extracted ~1544 files (N shared deduplicated)`

**Step 4: Spot-check output**

```bash
ls shadcn-registry/registry/blocks/ | head -5
ls shadcn-registry/registry/blocks/hero1/
cat shadcn-registry/registry/blocks/about1/about1.tsx | head -5
```

Expected: directories like `about1/`, `hero1/`, each containing a `.tsx` file with React component source.

**Step 5: Commit**

```bash
cd shadcn-registry
git add registry/ scripts/extract-sources.ts
git commit -m "feat: extract shadcnblocks sources into registry/"
```

---

### Task 2: Generate updated registry.json

**Files:**
- Create: `scripts/generate-manifest.ts`
- Modify: `registry.json`

Reads every `public/r/*.json` and generates `registry.json` entries pointing to the extracted source files in `registry/blocks/` and `registry/components/`. Preserves the 4 template examples already in `registry.json`.

**Step 1: Create the script**

```typescript
// scripts/generate-manifest.ts
import * as fs from "fs"
import * as path from "path"

const PUBLIC_R = path.join(process.cwd(), "public/r")
const SKIP = new Set([
  "registry.json",
  "complex-component.json",
  "example-form.json",
  "example-with-css.json",
  "hello-world.json",
])

const existing = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "registry.json"), "utf8")
)

// Keep template items
const templateItems = existing.items.filter((item: any) =>
  ["hello-world", "example-form", "complex-component", "example-with-css"].includes(item.name)
)

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

console.log(`Generated registry.json with ${newItems.length} shadcnblocks + ${templateItems.length} template items`)
```

**Step 2: Run the script**

```bash
cd shadcn-registry && npx tsx scripts/generate-manifest.ts
```

Expected: `Generated registry.json with 1409 shadcnblocks + 4 template items`

**Step 3: Spot-check registry.json**

```bash
cd shadcn-registry && python3 -c "
import json
with open('registry.json') as f:
    d = json.load(f)
print('Total items:', len(d['items']))
# Print first shadcnblocks entry
sb = [i for i in d['items'] if i['name'] not in ['hello-world','example-form','complex-component','example-with-css']]
import json; print(json.dumps(sb[0], indent=2))
"
```

Expected: an entry like `{ "name": "about1", "type": "registry:block", "files": [{"path": "registry/blocks/about1/about1.tsx", ...}] }`

**Step 4: Commit**

```bash
cd shadcn-registry
git add registry.json scripts/generate-manifest.ts
git commit -m "feat: generate registry.json with 1409 component manifest"
```

---

### Task 3: Write custom build script

**Files:**
- Create: `scripts/build-registry.ts`
- Modify: `package.json`

Replaces `shadcn build`. Reads `registry.json`, reads source files from `registry/`, embeds content into `public/r/{name}.json` using the original shadcnblocks consumer paths (preserving `block/` and `components/shadcnblocks/` paths). Also generates `lib/component-index.json` for the browser.

**Step 1: Create the build script**

```typescript
// scripts/build-registry.ts
import * as fs from "fs"
import * as path from "path"

const REGISTRY_JSON = path.join(process.cwd(), "registry.json")
const PUBLIC_R = path.join(process.cwd(), "public/r")
const LIB = path.join(process.cwd(), "lib")

fs.mkdirSync(PUBLIC_R, { recursive: true })
fs.mkdirSync(LIB, { recursive: true })

const manifest = JSON.parse(fs.readFileSync(REGISTRY_JSON, "utf8"))
const templateNames = new Set(["hello-world", "example-form", "complex-component", "example-with-css"])

// Map registry source paths back to original consumer paths
// registry/blocks/{name}/{file}.tsx → block/{file}.tsx
// registry/components/shadcnblocks/{file}.tsx → components/shadcnblocks/{file}.tsx
function toConsumerPath(registryPath: string): string {
  if (registryPath.startsWith("registry/blocks/")) {
    // registry/blocks/about1/about1.tsx → block/about1.tsx
    const basename = path.basename(registryPath)
    return `block/${basename}`
  }
  if (registryPath.startsWith("registry/components/")) {
    // registry/components/shadcnblocks/logo.tsx → components/shadcnblocks/logo.tsx
    return registryPath.replace("registry/components/", "components/")
  }
  return registryPath
}

const index: any[] = []
let built = 0
let skipped = 0

for (const item of manifest.items) {
  if (templateNames.has(item.name)) {
    skipped++
    continue
  }

  const builtFiles: any[] = []

  for (const fileEntry of item.files ?? []) {
    const sourcePath = path.join(process.cwd(), fileEntry.path)

    if (!fs.existsSync(sourcePath)) {
      console.warn(`  Missing source: ${fileEntry.path}`)
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

  if (builtFiles.length === 0) continue

  const registryItem: any = {
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

  // Category = everything before the first digit
  const category = item.name.replace(/\d.*$/, "").replace(/-+$/, "")

  index.push({
    name: item.name,
    title: item.title,
    description: item.description,
    category,
    installCommand: `npx shadcn add @ourorg/${item.name}`,
  })

  built++
}

// Write lib/component-index.json for the browser UI
fs.writeFileSync(
  path.join(LIB, "component-index.json"),
  JSON.stringify(index, null, 2) + "\n",
  "utf8"
)

// Write public/r/index.json for agent discovery
// This is the single endpoint agents query to find components.
// Structure: { "items": [{ name, title, description, category, url }] }
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

console.log(`Built ${built} components. Skipped ${skipped} templates. Index: ${index.length} entries.`)
```

**Step 2: Add scripts to package.json**

In `shadcn-registry/package.json`, update the `scripts` section:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "npx tsx scripts/build-registry.ts && next build",
  "start": "next start",
  "lint": "next lint",
  "registry:build": "npx tsx scripts/build-registry.ts"
}
```

**Step 3: Run the build script**

```bash
cd shadcn-registry && pnpm registry:build
```

Expected: `Built 1409 components. Skipped 4 templates. Index: 1409 entries.`

**Step 4: Spot-check a rebuilt JSON**

```bash
python3 -c "
import json
with open('shadcn-registry/public/r/hero1.json') as f:
    d = json.load(f)
print('name:', d['name'])
print('path:', d['files'][0]['path'])
print('has_content:', bool(d['files'][0].get('content')))
"
```

Expected: `path: block/hero1.tsx` and `has_content: True`

**Step 5: Commit**

```bash
cd shadcn-registry
git add scripts/build-registry.ts package.json
git commit -m "feat: add custom registry build script"
```

---

### Task 4: Update .gitignore

**Files:**
- Modify: `shadcn-registry/.gitignore`

`public/r/` is now generated output. `lib/component-index.json` is also generated. Neither should be committed.

**Step 1: Read the existing .gitignore**

```bash
cat shadcn-registry/.gitignore
```

**Step 2: Add generated paths**

Append to `shadcn-registry/.gitignore`:
```
# Generated registry output
/public/r/
!/public/r/complex-component.json
!/public/r/example-form.json
!/public/r/example-with-css.json
!/public/r/hello-world.json
!/public/r/registry.json

# Generated browser index
/lib/component-index.json
```

The `!` lines keep the template examples tracked (they aren't rebuilt by our script).

**Step 3: Commit**

```bash
cd shadcn-registry
git add .gitignore
git commit -m "chore: gitignore generated public/r/ and lib/component-index.json"
```

---

### Task 5: Auth middleware

**Files:**
- Create: `shadcn-registry/middleware.ts`
- Create: `shadcn-registry/.env.example`

**Step 1: Create middleware.ts**

```typescript
// shadcn-registry/middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.headers.get("x-registry-token")
  const expected = process.env.REGISTRY_TOKEN

  if (!expected) {
    // If REGISTRY_TOKEN is not set, allow all (dev mode)
    return NextResponse.next()
  }

  if (token !== expected) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid x-registry-token header required." },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/r/:path*",
}
```

**Step 2: Create .env.example**

```bash
# shadcn-registry/.env.example
# Secret token protecting /r/* registry endpoints.
# Set this in Vercel project environment variables.
# Consuming projects add this to their .env and components.json headers.
REGISTRY_TOKEN=your-secret-token-here
```

**Step 3: Verify middleware compiles**

```bash
cd shadcn-registry && pnpm build 2>&1 | tail -5
```

Expected: build succeeds with no TypeScript errors.

**Step 4: Commit**

```bash
cd shadcn-registry
git add middleware.ts .env.example
git commit -m "feat: add auth middleware protecting /r/* routes"
```

---

### Task 6: Component browser UI

**Files:**
- Modify: `shadcn-registry/app/page.tsx`

Replaces the template boilerplate with a searchable component index. Reads from `lib/component-index.json` as a static import. Client component for search/filter interactivity.

**Step 1: Replace app/page.tsx**

```tsx
// shadcn-registry/app/page.tsx
"use client"

import { useState, useMemo } from "react"
import componentIndex from "@/lib/component-index.json"

type Component = {
  name: string
  title: string
  description: string
  category: string
  installCommand: string
}

const components = componentIndex as Component[]

const categories = Array.from(
  new Set(components.map((c) => c.category))
).sort()

export default function Home() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return components.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      const matchesCategory =
        !activeCategory || c.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Component Registry</h1>
        <p className="text-muted-foreground">
          {components.length} components · Private registry
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <input
          type="search"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({components.length})
          </button>
          {categories.map((cat) => {
            const count = components.filter((c) => c.category === cat).length
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((component) => (
          <ComponentCard key={component.name} component={component} />
        ))}
      </div>
    </div>
  )
}

function ComponentCard({ component }: { component: Component }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(component.installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const previewUrl = `https://www.shadcnblocks.com/blocks/${component.category}#${component.name}`

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{component.name}</span>
          <span className="text-xs capitalize text-muted-foreground">
            {component.category}
          </span>
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline-offset-2 hover:underline shrink-0"
        >
          Preview ↗
        </a>
      </div>

      {component.description && (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {component.description}
        </p>
      )}

      <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5">
        <code className="flex-1 truncate text-xs">{component.installCommand}</code>
        <button
          onClick={copy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Verify it builds**

```bash
cd shadcn-registry && pnpm build 2>&1 | tail -10
```

Expected: build succeeds. `lib/component-index.json` must exist for this to work — if it's missing, run `pnpm registry:build` first.

**Step 3: Run dev server to visually verify**

```bash
cd shadcn-registry && pnpm dev
```

Open `http://localhost:3000`. Expected: search bar, category chips, grid of component cards with copy buttons.

**Step 4: Commit**

```bash
cd shadcn-registry
git add app/page.tsx
git commit -m "feat: replace homepage with searchable component browser"
```

---

### Task 7: Set REGISTRY_TOKEN in Vercel and deploy

**Step 1: Generate a secret token**

```bash
openssl rand -hex 32
```

Copy the output. This is your `REGISTRY_TOKEN`.

**Step 2: Set the env var in Vercel**

```bash
cd shadcn-registry && vercel env add REGISTRY_TOKEN production
```

Paste the token when prompted.

**Step 3: Run full build + deploy**

```bash
cd shadcn-registry && pnpm registry:build && vercel --prod
```

The `pnpm registry:build` regenerates `public/r/` and `lib/component-index.json` from source before deploying.

**Step 4: Verify auth and agent index**

```bash
REGISTRY_URL="https://shadcn-registry-eight.vercel.app"
REGISTRY_TOKEN=<your-token>

# Should return 401 (no token)
curl -s "$REGISTRY_URL/r/hero1.json" | python3 -m json.tool

# Should return component JSON
curl -s "$REGISTRY_URL/r/hero1.json" \
  -H "x-registry-token: $REGISTRY_TOKEN" | python3 -c "
import json,sys; d=json.load(sys.stdin)
print('name:', d['name'])
print('has_content:', bool(d['files'][0].get('content')))
"

# Agent index: should return JSON with total and items array
curl -s "$REGISTRY_URL/r/index.json" \
  -H "x-registry-token: $REGISTRY_TOKEN" | python3 -c "
import json,sys; d=json.load(sys.stdin)
print('total:', d['total'])
print('first item:', json.dumps(d['items'][0], indent=2))
"
```

**Step 5: Document consuming project setup**

In any project that wants to use this registry, add to `components.json`:
```json
{
  "registries": {
    "@ourorg": {
      "url": "https://shadcn-registry-eight.vercel.app/r/{name}",
      "headers": {
        "x-registry-token": "${REGISTRY_TOKEN}"
      }
    }
  }
}
```

And to `.env`:
```
REGISTRY_TOKEN=<the-same-secret>
```

Install: `npx shadcn add @ourorg/hero1`

**Step 6: Commit**

```bash
cd shadcn-registry
git add .
git commit -m "chore: post-deploy config and consuming project docs"
```
