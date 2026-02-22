# Kata ShadCN

Private component registry hosting 2555 licensed [shadcnblocks.com](https://shadcnblocks.com) blocks. Deployed at [shadcn-registry-eight.vercel.app](https://shadcn-registry-eight.vercel.app).

## What this is

A self-hosted shadcn registry containing 2555 shadcnblocks components. Source files live in `registry/` under version control. The registry JSON served to the shadcn CLI is generated at build time and protected by a secret token.

We own these sources going forward — components can be modified, extended, or made public.

## Structure

```
app/
  page.tsx               # searchable component browser UI
  styles/*               # fallback proxy for unscoped shadcn dependencies
  r/styles/*             # compatibility proxy when REGISTRY_URL includes /r
  r/colors/*             # upstream shadcn color registry passthrough
  r/icons/*              # upstream shadcn icon registry passthrough
components/              # shared UI components
docs/
  plans/                 # design docs and implementation plans
  reference/             # shadcnblocks and shadcn CLI reference
  components.txt         # full component list
  registry-manifest.json # original manifest from shadcnblocks API
lib/
  component-index.json   # generated browser index (gitignored)
middleware.ts            # protects /r/* with x-registry-token header
public/r/                # generated output (gitignored)
registry/
  blocks/                # one directory per component (e.g. hero1/, about1/)
  components/            # shared helpers (e.g. shadcnblocks/logo.tsx)
registry.json            # component manifest
scripts/
  build-registry.ts      # regenerates public/r/ from registry/ sources
  download-components.py # bulk downloader (one-time use)
  extract-sources.ts     # migrated inline JSON to registry/ (one-time use)
  generate-manifest.ts   # generated registry.json (one-time use)
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Required | Description |
|---|---|---|
| `REGISTRY_TOKEN` | Yes | Secret protecting `/r/*` endpoints. Set in Vercel project env vars too. |
| `REGISTRY_URL` | Yes | Base URL of the deployed registry (e.g. `https://shadcn-registry-eight.vercel.app`). |
| `SHADCNBLOCKS_API_KEY` | Yes | API key for shadcnblocks.com. Used by download scripts. |
| `SHADCN_FALLBACK_REGISTRY_URL` | No | Override for the unscoped dependency proxy. Defaults to `https://ui.shadcn.com/r`. |

## Editing a component

1. Edit the source file in `registry/blocks/{name}/` or `registry/components/`
2. Run `pnpm registry:build`
3. Deploy

## Adding a component

1. Create `registry/blocks/{name}/{name}.tsx`
2. Add an entry to `registry.json`
3. Run `pnpm registry:build`
4. Deploy

## Building and deploying

```bash
# Regenerate public/r/ and lib/component-index.json from source
pnpm registry:build

# Full build (runs registry:build then next build)
pnpm build

# Deploy to production (Vercel auto-deploys on push to main)
git push
```

## Auth

Registry endpoints (`/r/*`) require an `x-registry-token` header. Three routes are public passthroughs for built-in shadcn dependencies:

- `/r/styles/*` — style definitions
- `/r/colors/*` — color registry
- `/r/icons/*` — icon registry

Compatibility endpoints under `/styles/*` proxy to the public shadcn registry for unscoped dependencies (e.g. `utils`, `button`) that the CLI resolves via `styles/{style}/{name}.json`.

When `REGISTRY_TOKEN` is not set, all requests are allowed (local dev mode).

```bash
source .env.local
# 401 without token
curl -s "$REGISTRY_URL/r/hero1.json" | head -c 100
# 200 with token
curl -s "$REGISTRY_URL/r/hero1.json" -H "x-registry-token: $REGISTRY_TOKEN"
```

## Consuming project setup

In the consuming project's `components.json`:

```json
{
  "registries": {
    "kata": {
      "url": "https://shadcn-registry-eight.vercel.app/r/{name}.json",
      "headers": {
        "x-registry-token": "${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Add to the consuming project's `.env`:

```
REGISTRY_TOKEN=<your-token>
```

Install a component:

```bash
npx shadcn add kata/hero1
```

## AI agent discovery

Agents can query the full component index in one request:

```
GET /r/index.json
x-registry-token: <secret>
```

Returns `{ total, items: [{ name, title, description, category, url }] }` with all 2555 components. Fetch `/r/{name}.json` for full source.
