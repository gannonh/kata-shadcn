# Radical Ideas: Consolidated Report

Explorer: explorer-radical | Challenger: challenger-radical | Date: 2026-02-22

## Summary

Seven paradigm-shift proposals were evaluated through adversarial debate. Three survived scrutiny as actionable. Two were downgraded to features of other proposals. Two were shelved. The overarching finding: the registry's next evolution should prioritize **discovery and visibility** (semantic search, visual previews) before attempting **generation or composition** (AI assembly, design pipelines). The agent should own composition logic; the registry should own the knowledge layer.

---

## Final Priority Ranking

### Tier 1: Build Now

#### 1. Semantic Search and Component Knowledge Base (originally #3)

**What:** Parse every component's AST to extract structured metadata (prop interfaces, import dependencies, layout patterns, accessibility features). Generate enriched descriptions by running each component's source through an LLM once at build time. Store vector embeddings of the enriched descriptions. Expose a `GET /r/search?q=...` endpoint for semantic queries.

**Why this survived:** Highest value-to-effort ratio. Addresses the real bottleneck (discovery across 2555 opaque component names). Prerequisite for proposals #1 and #5. Immediately useful for both human browsing and agent workflows.

**Agreed scope (v1, 2-4 weeks):**
1. Extract prop interfaces and import lists from all 2555 components using the TypeScript compiler API. Budget 30-40% of effort for AST edge cases (dynamic imports, spread props, re-exports).
2. Generate enriched descriptions by feeding each component's code to an LLM once. Store these alongside components in the index (pay LLM cost at build time, not query time).
3. Compute and store vector embeddings of enriched descriptions.
4. Add `GET /r/search?q=kanban+board+with+drag+drop` endpoint returning ranked results.
5. Feed enriched descriptions back into the browser UI, replacing the current sparse/empty description fields.

**Architecture decisions:**
- Storage: JSON file or SQLite. No graph database needed.
- Embeddings: precomputed at build time, stored as static assets.
- Query: vector similarity search. No runtime LLM dependency for search.
- The recommendation API (originally proposal #1) collapses into this as a feature: given a description, return ranked component suggestions. Let the consuming agent do assembly.

**Risks (accepted):**
- AST parsing will hit edge cases across 2555 heterogeneous components.
- Embedding quality depends on enriched description quality; may need iteration.
- Components rarely change (licensed third-party), so maintenance cost is low.

---

#### 2. Build-Time Visual Previews (originally #7)

**What:** Render all 2555 components at build time using Playwright in a headless browser. Store screenshots as static PNGs. Serve from `/r/{name}/preview.png`. Add `preview` field to the component index. Enhance the browser UI with thumbnail previews.

**Why this survived:** High leverage -- unlocks visual browsing, agent visual reasoning (vision-capable LLMs can evaluate screenshots), Slack/Discord embeds, and automated visual regression testing. Well-understood technology.

**Key design decisions from debate:**
- **Build-time, not runtime.** Vercel serverless has a 50MB compressed limit; Playwright requires ~130MB Chromium. Runtime rendering on Vercel is not viable. Static PNGs generated during a build step are the correct approach.
- **Separate CI job, not Vercel build.** Rendering 2555 components at ~2s each = ~85 minutes. Vercel build limits are 10min (free) / 45min (Pro). This must run as a GitHub Actions job that uploads screenshots to a CDN or commits them to the repo.
- **Audit standalone-render coverage first.** Many shadcnblocks components have default prop values and render in isolation (e.g., `about1.tsx` has all props defaulted). Components with required props, context providers, or data dependencies will crash. The first step is auditing how many of the 2555 components render standalone. Codebase inspection during the debate suggests ~80-90% of shadcnblocks components render standalone (they are designed as self-contained demo blocks with hardcoded sample content). The remaining ~10-20% likely need a wrapper with mock providers (router, theme). This is manageable with a standard provider harness.

**Agreed scope (v1, 1-2 months, after audit):**
1. Audit: attempt headless render of all 2555 components, record success/failure/error for each.
2. Build rendering harness: minimal React app that mounts each component in isolation with necessary providers.
3. GitHub Actions workflow: render all viable components, upload PNGs.
4. Add `preview` URL to index and browser UI.
5. Defer dynamic rendering API (`GET /r/{name}/preview?theme=dark`) to a later version.

**Risks (accepted):**
- Some components will not render in isolation. Incomplete coverage is expected in v1.
- Screenshot storage and CDN costs for 2555 images.
- Build time for the rendering job.

---

### Tier 2: Validate Then Build

#### 3. Open-Source Registry Template (originally #4)

**What:** Publish a blog post explaining how to set up a private shadcn component registry, accompanied by a cloneable GitHub template repository. Not an npm package. Not a framework with semver commitments. A documented, opinionated starting point.

**Why this survived (with debate adjustments):**
- Explorer argued the market is broader than the challenger estimated. Every agency and SaaS team adopting shadcn/ui eventually wants private components. The shadcn CLI already supports custom registries, but there's no tutorial or reference implementation.
- Challenger correctly noted the infrastructure code is ~310 lines and "so simple extraction barely saves anyone time." Explorer countered: the code is simple if you already know the registry protocol. The value is in the documented, tested scaffold, not the line count.
- Challenger withdrew the market-size objection, acknowledging that the shadcn ecosystem is growing and demand for private registries will grow with it. The disagreement was always about timing and commitment level, not whether the need exists.
- Both agreed: validate demand before investing in maintenance. Blog post + template repo is low-cost, high-signal. A template repo ("fork and make it yours") sets the right expectation level vs. a framework ("depend on this, we'll maintain it").

**Agreed scope:**
1. Write a blog post / tutorial showing the setup process.
2. Publish a companion GitHub template repo (cleaned-up version of the existing infra without proprietary components).
3. Measure: GitHub stars, clones, inbound questions, referral traffic.
4. If signal exceeds a threshold, upgrade to a maintained framework with proper docs.

**Risks (accepted):**
- Open-sourcing infrastructure could commoditize the registry. Mitigated by: the proprietary component library is the actual moat, not the infra.
- Template maintenance expectations may arise even without an npm package commitment.

---

### Tier 3: Deferred (Dependencies on Tier 1)

#### 4. Theme Switcher Overlay (originally #2, downgraded)

**Original proposal:** Live component playground with hot-wired design tokens.

**Why it was downgraded:** Challenger demonstrated that shadcnblocks components use hardcoded Tailwind classes (e.g., `text-4xl font-semibold tracking-tighter`), not CSS custom properties. Refactoring 2555 components for token-based theming is out of scope. The "shadcn ecosystem uses CSS variables" argument applies to shadcn/ui primitives, not to the blocks layer built on top of them.

**Revised scope:** After visual previews (#2) exist, add a theme switcher (light/dark/2-3 preset palettes) that applies CSS variable overrides to the preview rendering. This gives ~80% of the value (seeing components in different visual contexts) at ~10% of the cost (no component refactoring needed).

**Depends on:** #2 (visual previews) existing first.

#### 5. Design-to-Registry Search via Figma (originally #5, downgraded)

**Original proposal:** Visual embedding pipeline for design-to-component matching.

**Why it was downgraded:** Visual embedding of UI components (CLIP, DINOv2) performs poorly on structural layouts where DOM structure matters more than pixel content. The Figma MCP is already available in the project toolchain. Content extraction from Figma's API is well-solved.

**Revised scope:** Lightweight integration: take a Figma frame via MCP, have an LLM describe it in natural language, then query the semantic search API (#1). Skip visual embeddings entirely.

**Depends on:** #1 (semantic search) existing first.

#### 6. Agent Recommendation API (originally #1, collapsed)

**Original proposal:** Composition engine with `POST /r/compose`.

**Why it was collapsed:** Challenger's core insight -- agents already have the intelligence to browse, select, and compose components. The composition logic improves for free as LLMs improve. Moving that logic into the registry creates a maintenance liability that gets outpaced by general-purpose AI capabilities.

**What remains:** The recommendation/search aspect collapses into #1 (semantic search) as a feature. Given a natural language description of a UI need, return ranked component suggestions. The agent handles assembly.

---

### Shelved

#### 7. Multi-Tenant Registry Platform (originally #6)

**Verdict:** Shelved entirely. This is a company, not a feature. Requires user management, billing, tenant isolation, per-tenant CI/CD, marketplace liquidity, and enterprise features. Competes with Bit.dev, npm, and Vercel's own ambitions. 6-12 month estimate is optimistic for a solo operator (realistically 12-24 months). Revisit only if #3 (OSS template) generates strong market signal for hosted registries.

---

## Key Insights from the Debate

1. **Let agents own composition, let the registry own knowledge.** The registry's competitive advantage is its 2555 production components and the metadata about them. Composition is a generic capability that LLMs do and will do better over time. The registry should make its knowledge maximally accessible (semantic search, visual previews, structured metadata) and let AI agents handle the assembly step.

2. **Discovery is the bottleneck, not availability.** The registry already has 2555 components across 435 categories. The problem is finding the right one. Every radical proposal that survived scrutiny improves discovery (semantic search, visual previews, enriched descriptions).

3. **Build-time computation, not runtime services.** The current architecture (static JSON generated at build time, served by Vercel) is a strength. Proposals that require runtime computation (Playwright rendering, LLM query processing, composition engines) add infrastructure complexity. The surviving proposals all follow the existing pattern: compute at build time, serve statically.

4. **The infrastructure is not the moat.** The ~310 lines of registry infrastructure are commoditizable. The 2555 licensed production components and the knowledge layer built on top of them are the defensible assets. OSS strategy should freely share the infrastructure while protecting the component library and its metadata enrichments.
