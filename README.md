# Kata ShadCN

Private component registry hosting our licensed [shadcnblocks.com](https://shadcnblocks.com) blocks. Deployed at [shadcn-registry-eight.vercel.app](https://shadcn-registry-eight.vercel.app).

## What this is

A self-hosted shadcn registry containing ~2500 shadcnblocks components. Source files live in `registry/` under version control. The registry JSON served to the shadcn CLI is generated at build time and protected by a secret token.

We own these sources going forward — components can be modified, extended, or made public.

## Structure

```
registry/
  blocks/          # one directory per component (e.g. hero1/, about1/)
  components/      # shared helpers (e.g. shadcnblocks/logo.tsx)
registry.json      # component manifest
scripts/
  build-registry.ts      # regenerates public/r/ from registry/ sources
  download-components.py # bulk downloader (one-time use)
  extract-sources.ts     # migrated inline JSON content to registry/ (one-time use)
  generate-manifest.ts   # generated registry.json (one-time use)
public/r/          # generated output — gitignored
lib/
  component-index.json   # generated browser index — gitignored
middleware.ts      # protects /r/* with x-registry-token header
app/page.tsx       # searchable component browser UI
app/styles/*       # fallback proxy for unscoped shadcn dependencies
docs/
  plans/           # design docs and implementation plans
  reference/       # shadcnblocks and shadcn CLI reference
```

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

# Deploy to production (Vercel auto-deploys on push to main)
git push
```

## Auth

Registry endpoints (`/r/*`) require an `x-registry-token` header. Set `REGISTRY_TOKEN` in Vercel project environment variables.

Compatibility endpoints under `/styles/*` proxy to the public shadcn registry for unscoped dependencies (e.g. `utils`, `button`) that the CLI resolves via `styles/{style}/{name}.json`.

Credentials are in `.env.local` (gitignored). See `.env.example` for the required variables.

Example:

```bash
source .env.local
curl "$REGISTRY_URL/r/index.json" -H "x-registry-token: $REGISTRY_TOKEN"
```

## Consuming project setup

Add to `components.json`:

```json
{
  "registries": {
    "@ourorg": {
      "url": "https://shadcn-registry-eight.vercel.app/r/{name}.json",
      "headers": {
        "x-registry-token": "${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Add to `.env`:

```
REGISTRY_TOKEN=<secret>
```

Install a component:

```bash
npx shadcn add @ourorg/hero1
```

## AI agent discovery

Agents can query the full component index in one request:

```
GET /r/index.json
x-registry-token: <secret>
```

Returns `{ total, items: [{ name, title, description, category, url }] }`. Fetch `/r/{name}.json` to get full source.
