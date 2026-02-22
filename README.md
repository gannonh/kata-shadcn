# Kata Shadcn Registry

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

| Variable                       | Required | Description                                                                          |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------ |
| `REGISTRY_TOKEN`               | Yes      | Secret protecting `/r/*` endpoints. Set in Vercel project env vars too.              |
| `REGISTRY_URL`                 | Yes      | Base URL of the deployed registry (e.g. `https://shadcn-registry-eight.vercel.app`). |
| `SHADCNBLOCKS_API_KEY`         | Yes      | API key for shadcnblocks.com. Used by download scripts.                              |
| `SHADCN_FALLBACK_REGISTRY_URL` | No       | Override for the unscoped dependency proxy. Defaults to `https://ui.shadcn.com/r`.   |

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

On the deployed registry (`https://shadcn-registry-eight.vercel.app`), endpoints under `/r/*` require an `x-registry-token` header except these public passthroughs for built-in shadcn dependencies:

- `/r/styles/*` — style definitions
- `/r/colors/*` — color registry
- `/r/icons/*` — icon registry

Compatibility endpoints under `/styles/*` proxy to the public shadcn registry for unscoped dependencies (e.g. `utils`, `button`) that the CLI resolves via `styles/{style}/{name}.json`.

When running a local copy of this registry, auth can be disabled when `REGISTRY_TOKEN` is not set (local dev mode). Do not assume this for the deployed Vercel URL.

```bash
# Load env if present.
[ -f .env.local ] && source .env.local
REGISTRY_URL="${REGISTRY_URL:-https://shadcn-registry-eight.vercel.app}"

# 401 expected without token on private component route:
curl -s -o /dev/null -w "%{http_code}\n" "$REGISTRY_URL/r/hero1.json"

# 200 expected without token on public passthrough:
curl -s -o /dev/null -w "%{http_code}\n" "$REGISTRY_URL/r/styles/default/button.json"

# 200 expected with token (skip if unset):
if [ -n "${REGISTRY_TOKEN:-}" ]; then
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "x-registry-token: $REGISTRY_TOKEN" \
    "$REGISTRY_URL/r/hero1.json"
fi
```

## Consuming project setup

In the consuming project's `components.json`:

```json
{
  "registries": {
    "@kata-shadcn": {
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
npx shadcn add @kata-shadcn/hero1
```

The install prefix must match the registry key in `components.json` (`<registry-key>/<component-name>`). If you choose a different key, use that key in `shadcn add`.

### Safe verification in a consuming repo

For smoke-testing registry installs without touching production component folders:

```bash
npx shadcn add @kata-shadcn/alert-alert-warning-1 --path ./tmp/registry-install --yes
```

`shadcn add` can still run dependency resolution and may modify the lockfile. Always run `git status` after verification and restore unintended changes before committing.

## Recommended AGENTS.md section for consumers

Copy this section into the consuming project's `AGENTS.md`:

```md
## Private Component Registry (React Source of Truth)

- Prefer installing from `@kata-shadcn` before creating one-off UI components.
- Shared component changes belong in `kata-shadcn`, not in generated downstream copies.
- In `components.json`, configure:
  - URL: `https://shadcn-registry-eight.vercel.app/r/{name}.json`
  - Header: `x-registry-token: ${REGISTRY_TOKEN}`
- Add `REGISTRY_TOKEN=<token>` to the consuming project environment.
- Install using the registry key from `components.json`:
  - `npx shadcn add @kata-shadcn/<name>`
- Auth behavior:
  - Deployed `/r/*` endpoints are token-protected except `/r/styles/*`, `/r/colors/*`, `/r/icons/*`.
  - Local registry dev mode may allow requests without a token when `REGISTRY_TOKEN` is unset.
- For install smoke tests, use `--path` into a temp folder and verify `git status` after running `shadcn add`.
```

## AI agent discovery

Agents can query the full component index in one request:

```
GET /r/index.json
x-registry-token: <secret>
```

Returns `{ total, items: [{ name, title, description, category, url }] }` where `total` is the current component count. Fetch `/r/{name}.json` for full source.
