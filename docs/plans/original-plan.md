# Plan: Self-hosted component registry

## Context

We have a license from the component source (1350 blocks, 1189 components, 12 templates). Goal: download everything and host a private registry so any project can `npx shadcn add @ourorg/hero-1` without hitting the upstream vendor or needing their API key.

The shadcn CLI v3 registry system serves components as static JSON files. A self-hosted registry is just a web server returning JSON at `/r/{name}.json`. The official [registry template](https://github.com/shadcn-ui/registry-template) provides the scaffolding.

## Approach

### Step 1: Create a new private registry project

Clone the official registry template (Tailwind v4 version) into a standalone repo:

```bash
npx create-next-app@latest shadcn-registry --example https://github.com/shadcn-ui/registry-template
```

This gives us:
- `registry.json` — component manifest
- `registry/` — source components
- `public/r/` — built JSON output (what the CLI fetches)
- `shadcn build` — compiles registry sources into distributable JSON

### Step 2: Enumerate all component names

This is the main unknown. The component source doesn't expose a component manifest API. Three approaches, in order of preference:

**A. Scrape the blocks page** — Write a script that fetches the upstream blocks page (and subpages per category) and extracts component slugs from the DOM. Each block page links to a registry name like `hero-1`, `pricing-3`, etc.

**B. Use the shadcn MCP** — Configure the MCP server, then query by category programmatically ("show me all hero blocks", "show me all pricing blocks", etc.) to build the list.

**C. Hit the registry endpoint directly** — Try the upstream `/r/index.json` or the upstream `/r/registry.json` with the bearer token. Some registries serve a manifest at the root. If the vendor follows the standard, it may return a full item list.

**D. Ask the vendor for support** — Licensed users may be able to request a full manifest.

Output: a `components.txt` file with one component name per line.

### Step 3: Bulk download into staging project

Create a temporary staging project with the upstream registry configured:

```bash
# staging project with components.json pointing to upstream
REGISTRY_API_KEY=sk_live_xxx

# bulk install
while read -r name; do
  npx shadcn add "@upstream/$name" --yes
done < components.txt
```

This downloads all source files, dependencies, and CSS into the staging project.

### Step 4: Transfer to registry structure

Move downloaded components from the staging project into the registry project's `registry/` directory. For each component:

1. Copy the component files to `registry/new-york/{name}/`
2. Add an entry to `registry.json`:

```json
{
  "name": "hero-1",
  "type": "registry:block",
  "title": "Hero 1",
  "description": "Hero section with centered content",
  "dependencies": ["lucide-react"],
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "registry/new-york/hero-1/hero-1.tsx",
      "type": "registry:component"
    }
  ]
}
```

This step can be partially automated: when the shadcn CLI installs a component, the downloaded JSON at the upstream `/r/{name}.json` contains the full registry-item metadata (dependencies, registryDependencies, files, cssVars). We can cache these JSON responses during the bulk download and use them to generate `registry.json` entries.

### Step 5: Build the registry

```bash
cd shadcn-registry
npx shadcn build
```

Produces `public/r/{name}.json` for every component. These are the static files the CLI fetches.

### Step 6: Deploy

Deploy the Next.js app. Options:
- **Vercel** — Zero config, the template is designed for it
- **Static export** — `next export` + any static host (S3, Cloudflare Pages, GitHub Pages)
- **Docker** — For fully private internal hosting

### Step 7: Configure consuming projects

Each project's `components.json`:

```json
{
  "registries": {
    "@ourorg": {
      "url": "https://registry.ourorg.com/r/{name}"
    }
  }
}
```

Install components: `npx shadcn add @ourorg/hero-1`

## Decisions

- **Hosting:** Vercel
- **Styles:** All 10 variants (5 styles × 2 libraries)
- **Updates:** One-time snapshot, manual refresh if needed

## Verification

- `curl https://your-registry/r/hero-1.json` returns valid registry-item JSON
- `npx shadcn add @ourorg/hero-1` installs successfully in a clean test project
- All components resolve their `registryDependencies` within the private registry
- No calls to the upstream vendor from consuming projects

## Estimated scope

This is a standalone project, not part of the kata-orchestrator codebase. The registry is its own repo deployed independently.
