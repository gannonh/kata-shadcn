# High-Value Features: Consolidated Report

Brainstorm date: 2026-02-22
Explorer: explorer-highvalue | Challenger: challenger-highvalue
Debate rounds: 3

7 proposals evaluated. 4 approved with scope constraints. 2 killed. 2 deferred pending demand signals. Total estimated effort for approved items: 4-5 weeks.

---

## Approved

### 1. Usage Analytics & Consumption Tracking

**What**: Log every authenticated component download. Surface data through a read-only dashboard.

**Why**: With 2555 components and zero visibility into actual usage, every other decision (what to improve, what to preview, what to bundle, what to deprecate) is guesswork. Analytics is the foundation layer that informs all subsequent work.

**Scope constraints**:
- Event logging only: component name, timestamp, consumer identifier (derived from token), user-agent
- Storage: Turso (serverless SQLite) or Vercel KV
- Use Next.js 15 `waitUntil` API in the middleware to ensure writes complete on Vercel's serverless model without adding latency to the response
- Dashboard: single page showing most-installed components, install trends over time, per-project breakdown
- No real-time streaming, no per-developer tracking, no alerting, no export

**Effort**: 1 week

**Implementation notes**: The middleware at `middleware.ts` already intercepts every `/r/{name}.json` request. The instrumentation point exists. Add async event logging after the auth check passes.

---

### 2. Component Index Enrichment

**What**: Add structured metadata to the static `index.json` and `component-index.json` at build time. Includes tags, complexity ratings, peer components (commonly co-installed), content hashes, and `lastModified` timestamps.

**Why**: Agents currently receive 2555 items with name, title, description, and category. That's enough for basic text matching but insufficient for informed selection. Better metadata enables agents to filter by complexity, find related components, and detect when components have changed, all without any runtime infrastructure.

**Scope constraints**:
- Tags: derived from component names and descriptions at build time (e.g., `hero1` → `["hero", "landing"]`). No manual curation in v1.
- Complexity rating: computed from file count, line count, and dependency count per component
- Peer components: components from the same category, listed as suggestions. Use analytics-derived co-occurrence data when available.
- Content hash: SHA-256 of the built component JSON, computed during `build-registry.ts`
- `lastModified`: derived from git history of the component's source files
- No embeddings, no vector database, no runtime search endpoint
- Change detection (content hashes + timestamps) replaces the original versioning proposal. This gives consumers enough signal to know when something changed without inventing semver for UI components.

**Effort**: 1 week

**Implementation notes**: All enrichment happens in `scripts/build-registry.ts` as part of the existing build pipeline. Output format is the same (`index.json`, `component-index.json`) with additional fields per entry. No new runtime dependencies.

---

### 3. Component Preview & Visual Catalog

**What**: Generate static screenshot images for the top 200 components. Display in the browser UI as a visual grid. Include thumbnail URLs in the agent index.

**Why**: The browser UI currently shows component names and text descriptions with no visuals. Preview links point to shadcnblocks.com, which only works for unmodified upstream components and requires leaving the registry. Visual previews make the registry self-contained and dramatically improve component discovery for both humans and agents.

**Scope constraints**:
- Render the top 200 components, not all 2539. Prioritize using analytics data (from item #1) if available; otherwise select ~5 representatives per category (~40 categories)
- Single viewport: desktop only (1280px width). No responsive captures in v1.
- Static PNG screenshots via Playwright rendering each component in a minimal Next.js shell
- Store in `public/previews/` and commit to git. 200 PNGs at ~100KB each = ~20MB. Acceptable for git.
- Browser UI: add thumbnail images to the component card grid
- Agent index: add `previewUrl` field to each indexed component that has a preview
- No live/interactive previews, no iframes, no per-component bundling

**Effort**: 1-2 weeks

**Implementation notes**: The main work is the Playwright rendering script. Components that fail to render in isolation (missing external resources, parent layout dependencies) get skipped and logged. Expect ~70-80% render success rate on first pass. The browser UI changes are straightforward (add `<img>` to `ComponentCard`).

---

### 4. Page Builder Bundles

**What**: Curate 3-5 page templates that group components into coherent, installable sets with layout scaffolding.

**Why**: Individual components create a composition problem. With 2555 components across 40+ categories, selecting a coherent set and wiring them into a page requires expertise. Bundles encode design decisions and provide ready-to-use page templates. For agent workflows, "build me a landing page" produces a tested, coherent result instead of a random component selection.

**Scope constraints**:
- 3-5 hardcoded bundles. No `bundles.json` schema, no resolution framework, no dynamic bundle creation.
- Candidate bundles: SaaS landing page, blog/content site, portfolio, dashboard layout, documentation site
- Each bundle is a list of specific component names + a `page.tsx` template file that imports, composes, and spaces them correctly
- The page template scaffolding is the primary deliverable. The component list alone is a glorified shopping list; the wired-up layout with proper spacing and data flow is where the value lives.
- Installation: bundle page in the browser UI lists individual `npx shadcn add @kata-shadcn/{name}` commands. No custom CLI wrapper, no bundle protocol. Works with the existing shadcn CLI today.
- Bundle definitions live in a `bundles/` directory with one subdirectory per bundle containing the component list and template files
- Curation is ongoing work. Budget for periodic updates as new components are added.

**Effort**: 1 week

**Implementation notes**: Start with the SaaS landing page bundle (hero + features + pricing + testimonials + CTA + footer). Build the page template first, validate it works end-to-end, then replicate the pattern for other bundles. The browser UI gets a "Bundles" section above the component grid.

---

## Killed

### Multi-Tenant SaaS Registry Platform

**Original proposal**: Transform into a hosted multi-tenant platform with per-org namespaces, admin dashboards, and billing.

**Why killed**:
- The current build model (single `registry.json` → static files in `public/r/`) doesn't scale to multi-tenancy without fundamental rearchitecture. Multi-tenancy requires either N separate builds or a dynamic serving model.
- The 2-3 week estimate was unrealistic. Postgres, tenant provisioning, admin UI, billing, onboarding, data isolation testing is 2-3 months of work. And then you're operating a SaaS, not building a registry.
- Unvalidated demand. The shadcn CLI already supports custom registries. Teams that care enough have already self-hosted.
- Competes directly with shadcnblocks.com, who could trivially add hosted registry support on their own platform.

### Private Component Marketplace with License Management

**Original proposal**: Marketplace with license tiers, publishing workflows, per-component access control, Stripe billing, contributor revenue sharing.

**Why killed**:
- License enforcement is unenforceable. Components are source code. Once downloaded via `npx shadcn add`, the code lives in the consumer's repo permanently. No runtime check, no obfuscation. The entire license model is a gentleman's agreement.
- Cold-start problem: a marketplace needs both supply (component authors) and demand (paying consumers) simultaneously. For an internal tool with licensed shadcnblocks content, the contributor pool is the internal team. A marketplace with one supplier isn't a marketplace.
- 3-4 week estimate was unrealistic. License model, access control, publishing workflow, review system, billing, contributor dashboard, admin interface — each is a week individually. Realistic timeline: 3+ months.
- Revenue sharing with external contributors adds legal, tax, and accounting complexity that is an entirely different business problem.

---

## Deferred

### Component Versioning (reframed as Change Detection)

**Original proposal**: Full semantic versioning with version-specific paths (`/r/{name}@{version}.json`) and auto-generated changelogs.

**Why deferred**: The shadcn CLI doesn't support `@version` syntax in registry URLs, making the primary delivery mechanism incompatible. Semantic versioning for UI components is philosophically unresolvable (is changing a padding value a patch? is flex→grid a major bump?). Retroactive versioning of 2539 components at 1.0.0 with no history is meaningless.

**What survives**: Content hashes and `lastModified` timestamps in the enriched index (folded into item #2). This provides change detection without version management. If multiple consumer projects emerge and demand pinned versions, revisit using git-tag-based immutable build snapshots.

### Agent Search API

**Original proposal**: Semantic search endpoint using embeddings and a recommendation engine.

**Why deferred**: 2555 items at ~300KB is not a scale problem for modern LLM context windows. Agents can ingest the full index in a single call. Embedding quality depends on component descriptions, which are currently formulaic and auto-generated. The recommendation engine requires co-occurrence data from analytics that doesn't exist yet.

**What survives**: The enriched index (item #2) with tags, categories, and complexity ratings gives agents structured data to filter client-side. If that proves insufficient after shipping, a text-search endpoint can be added later with minimal effort.

---

## Recommended Execution Sequence

```
Week 1:     Analytics (#1) — event logging + dashboard
Week 2:     Index Enrichment (#2) — tags, complexity, hashes, timestamps
Weeks 3-4:  Previews (#3) — Playwright rendering, browser UI, analytics-informed prioritization
Week 5:     Bundles (#4) — 3-5 curated page templates with scaffolding
On demand:  Change detection — only if consumer projects demand version pinning
On demand:  Search API — only if enriched index proves insufficient for agent workflows
```

Each phase delivers standalone value. No phase depends on a subsequent phase to be useful. Analytics informs the prioritization of later phases but is not a hard blocker.
