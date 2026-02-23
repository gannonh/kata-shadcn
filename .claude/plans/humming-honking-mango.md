# Plan: Scrub upstream vendor references from repository

## Context

Components are permanently licensed for our use. The licensing terms prohibit using the upstream vendor name. All references must be removed or replaced throughout the codebase. The offering is called "kata-shadcn."

## Scope

~1,050 files contained the vendor name. Work splits into two phases: code/docs changes (immediate) and CDN asset re-hosting (requires infrastructure setup).

---

## Phase 1: Code, docs, and directory rename

### 1. Rename shared component directory
- `registry/components/[vendor]/` → `registry/components/shared/`
- 16 files to move (logo.tsx, sparkles.tsx, cover.tsx, etc.)

### 2. Update import paths (124 block files, 141 imports)
- Find/replace: `@/components/shared/` → `@/components/shared/`
- Affects blocks that import logo, sparkles, pattern-placeholder, rating, emoji-picker, etc.

### 3. Update display text in shared components
- `registry/components/shared/pattern-placeholder.tsx:9` — `[vendor].com` badge text → `Kata`
- `registry/components/shared/pattern-template.tsx:12` — same
- Update `registry.json` `registryDependencies` paths if they reference the old directory name

### 4. Update display text in block files
- ~90 files reference `[vendor]-logo.svg` with alt/title text "[vendor]" → replace with "Kata" or generic placeholder
- ~83 files contain hardcoded `https://www.[vendor].com` URLs → replace with `#`

### 5. Update app/page.tsx
- Line 115: Remove `previewUrl` construction pointing to [vendor].com
- Line 126-134: Replace preview link with placeholder `#` route (ready for milestone 3 previews)
- Line 130: Update aria-label

### 6. Update build scripts
- `scripts/build-registry.ts:18` — path comment: `[vendor]/logo.tsx` → `shared/logo.tsx`
- `scripts/generate-manifest.ts:74` — console.log text: remove "[vendor]"
- `scripts/download-components.py` — update docstring, `BASE_URL`, env var name

### 7. Update project docs
- `CLAUDE.md:46` — remove `[VENDOR_API_KEY]` line (download scripts are one-time use). Update "What this is" to reflect agent-first positioning: private component registry optimized for AI agent discovery.
- `README.md` — remove all "[vendor]" references. Reframe description around agent-first discovery: 2555 components with enriched metadata, semantic search, and agent-optimized endpoints. Update structure section (`[vendor]/logo.tsx` → `shared/logo.tsx`). Remove `[VENDOR_API_KEY]` from env table.
- `AGENTS.md` — no direct references (already clean)
- `.env.example` — remove `[VENDOR_API_KEY]` lines

### 8. Update reference docs
- `docs/reference/getting-started.md` — remove `@[vendor]` install examples, remove `[VENDOR_API_KEY]`
- `docs/reference/shadcn-mcp.md` — remove "[vendor] Integration" section, remove `@[vendor]` registry config
- `docs/reference/shadcn-cli.md` — remove `@[vendor]` registry config and install examples
- `docs/reference/theming.md` — replace "[vendor] uses" with "The registry uses"

### 9. Update planning/brainstorm docs
- Replace "[vendor].com" references with "the upstream vendor" or "the component source" in all `.planning/` files
- These are internal docs but should be clean for consistency

### 10. Rebuild and verify
- `pnpm registry:build` — verify build succeeds with renamed paths
- `pnpm build` — verify Next.js build succeeds
- Spot-check generated `public/r/` JSON files for any remaining references

---

## Phase 2: CDN asset re-hosting (separate PR)

4,617 references across 902 files use `deifkwefumgah.cloudfront.net/[vendor]/block/` URLs for images, icons, and SVGs.

### Approach
1. Extract all unique CDN URLs from the codebase
2. Download all assets locally
3. Re-host under a new path (options: Vercel Blob, Cloudflare R2, or `public/assets/`)
4. Global find/replace old CDN base URL → new base URL across 902 block files
5. Rebuild registry

This is a separate issue — requires choosing a hosting solution and running a bulk download/upload. Approximately 2,555 components worth of placeholder images, icons, logos, and photos.

---

## Execution method

Phase 1 steps 1-4 (directory rename, import paths, display text, block URLs) will use `git mv` for the directory and scripted find/replace via bash for the bulk changes across 124+ files. Steps 5-9 are manual edits to specific files.

## Verification

```bash
# After all changes:
pnpm registry:build   # registry generation succeeds
pnpm build            # Next.js build succeeds
grep -ri "[vendor]" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" --include="*.py" . | grep -v node_modules | grep -v .next | grep -v "cloudfront.net"
# ^ Should return zero matches (excluding CDN URLs deferred to Phase 2)
```
