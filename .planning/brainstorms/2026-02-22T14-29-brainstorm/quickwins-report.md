# Quick-Wins Report: kata-shadcn Registry

Date: 2026-02-22
Explorer: explorer-quickwins
Challenger: challenger-quickwins

---

## Context

kata-shadcn is a private self-hosted shadcn component registry with 2555 licensed shadcnblocks.com components. Deployed on Vercel. The registry is functional but has no tests, no analytics, limited discoverability tooling, and several rough edges. This report identifies 6 quick-win improvements achievable in 1-2 days of focused work, plus 1 item reclassified to the high-value features track.

---

## Recommended Quick-Wins (Priority Order)

### 1. Fix Install Command Prefix Bug

**Effort:** 30 minutes
**Impact:** High (trust/correctness)

`scripts/build-registry.ts:87` hardcodes `@ourorg/` in the install commands written to `lib/component-index.json`. The correct prefix is `@kata-shadcn` (per README and CLAUDE.md). Every component card in the browser UI displays a broken install command.

**Action:** Replace the hardcoded string with a top-of-file constant. A constant is sufficient; an env var adds deployment surface area for a value that changes once in the project's lifetime. Requires `pnpm registry:build` and redeploy.

---

### 2. Clean Up Category Taxonomy

**Effort:** 2-4 hours (Phase 1)
**Impact:** High (discoverability)

The build script derives categories by stripping trailing digits from component names. This produces 451 categories, many with compound names like `alert-dialog-alert-dialog-destructive` or `button-group-button-group-standard`. The browser UI's category filter is unusable at this scale.

**Approach (hybrid, two-phase):**

- Phase 1: Extract the first segment before the first hyphen to reduce 451 categories to ~133. Apply a manually curated collapse table (~100 entries) to map those 133 down to ~25-30 clean categories. Update `build-registry.ts` to use explicit `category` fields in `registry.json` when present, falling back to the improved derivation.
- Phase 2 (ongoing): Review and correct category assignments over time. Consider a two-level taxonomy (e.g., `form > input`, `marketing > cta`) if single-level categories prove too coarse.

**Key finding from challenge:** The distribution is skewed. A naive collapse produces a `form` mega-category with 543 components (21% of the registry) spanning inputs, selects, comboboxes, date pickers, file uploaders, and settings panels. The collapse mapping table needs deliberate splits for oversized categories. The mapping table is where the design judgment lives, not in the code.

**Validated category distribution (approximate, post-collapse):**
- form: 543 (needs subcategory splits)
- feature: 274
- marketing: 257
- hero: 177
- data: 156
- navigation: 115
- feedback: 113
- chart: 112
- overlay: 111
- ecommerce: 87
- 19 additional categories with <75 each

---

### 3. Compact Agent Discovery Index

**Effort:** 1-2 hours
**Impact:** Medium-high (agent DX)

The current `public/r/index.json` is 766KB. Agents must download and parse the entire file to find components. A compact index (`public/r/index-compact.json`) containing only `name`, `category`, and `url` fields would be ~80-100KB, fitting comfortably in agent context windows.

**Implementation:** Add ~15 lines to `build-registry.ts` to emit the compact index alongside the existing full index. Both artifacts coexist: full index for the browser UI, compact index for agents. The compact index lives under `/r/*` and is automatically auth-protected by middleware.

**Future iteration:** If agents still struggle with the compact index, a server-side search endpoint (`GET /r/search.json?q=...&category=...`) is the next step. Defer this until there's evidence the compact index is insufficient.

---

### 4. Structured Usage Logging

**Effort:** 2-4 hours
**Impact:** Medium (measurement, commercial)

Add structured JSON logging to `middleware.ts` for authenticated component fetches. Log component name and timestamp to stdout. Vercel captures stdout via log drains, enabling analysis with any log tool.

**Implementation:** Add `console.log(JSON.stringify({ event: "component_fetch", name, timestamp }))` in the middleware's success path, after auth check passes and before `NextResponse.next()`. Only log actual component fetches, not the proxy passthroughs for `/r/styles/*`, `/r/colors/*`, `/r/icons/*`.

**Why not a database or analytics service:** Console.log to Vercel log drains is zero-dependency, zero-cost, and zero-latency. "Which components are popular this month" doesn't need real-time dashboards. A proper analytics backend can come later if the data proves valuable.

**Commercial angle:** Usage data reveals which components justify investment in quality, testing, and documentation. It also informs pricing and packaging if the registry is offered externally.

---

### 5. AGENTS.md for the Registry

**Effort:** 1-2 hours
**Impact:** Medium (agent integration)

The README has a recommended AGENTS.md snippet for consuming projects, but no guidance for agents interacting with the registry itself. Create an AGENTS.md documenting:

- How to discover components (compact index endpoint)
- How to search/filter (by name, category)
- Authentication requirements
- Install flow via shadcn CLI
- Available endpoints and their response shapes

**Deferred:** An MCP tool definition was originally proposed alongside the AGENTS.md. This is premature. MCP tools need either a running server or are just JSON schemas describing HTTP calls. An agent with good documentation can make HTTP calls directly. Defer MCP tooling until a search endpoint exists and there's evidence of how agents actually interact with the registry.

---

### 6. Curated Page Recipes

**Effort:** 2-4 hours
**Impact:** Medium (discovery, commercial packaging)

Create curated multi-component combinations for common page types (landing page, SaaS dashboard, blog, e-commerce storefront). Present as a section in the browser UI or a standalone page with:

- Recipe name and description
- Component list with install command (`npx shadcn add @kata-shadcn/hero3 @kata-shadcn/features2 @kata-shadcn/pricing1 @kata-shadcn/cta4 @kata-shadcn/footer2`)
- One-click copy

**Why not a bundle system:** The shadcn CLI already supports `npx shadcn add comp1 comp2 comp3`. Custom bundle resolution adds engineering complexity with no functional benefit over a copy-paste multi-component command. The value is curation and visual validation, not plumbing.

**Key constraint:** Components from different shadcnblocks design series may have visual conflicts (spacing, color, typography). Recipes should group components from the same numbered series when possible (e.g., all `*1` components, all `*3` components). Visual QA of each recipe is the real cost.

---

## Reclassified to High-Value Features

### Preview Screenshots

**Original estimate:** 1-2 days
**Revised estimate:** 1-2 weeks

Automated screenshot capture of 2555 components via Playwright requires: a render harness handling diverse component signatures and props, mock data for data-dependent components, ~125MB of image storage (CDN, not git), and ~85 minutes of render time per full run. This is a proper project, not a quick-win.

**Low-cost probe first:** Check if shadcnblocks.com exposes OG images or a thumbnail API for their components. If so, hotlinking those images costs zero infrastructure and zero build time. If not, pursue the full Playwright approach as a high-value feature.

---

## Execution Summary

| Priority | Idea | Effort | Category |
|----------|------|--------|----------|
| 1 | Fix install command prefix | 30 min | Bug fix |
| 2 | Clean up category taxonomy | 2-4 hrs | Discoverability |
| 3 | Compact agent index | 1-2 hrs | Agent DX |
| 4 | Structured usage logging | 2-4 hrs | Measurement |
| 5 | AGENTS.md | 1-2 hrs | Documentation |
| 6 | Curated page recipes | 2-4 hrs | Discovery/commercial |

**Total: 10-16 hours of focused work.** Achievable in a single sprint.

All 6 items are independent PRs with no shared code changes, so they can be parallelized across developers. The listed sequence is the recommended solo path: fix the trust bug first, improve discoverability, enable agent use, measure adoption, document, then package.
