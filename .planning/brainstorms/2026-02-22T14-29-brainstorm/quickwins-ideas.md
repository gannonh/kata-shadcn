# Quick-Win Ideas for kata-shadcn Registry

Explorer: explorer-quickwins
Date: 2026-02-22

---

## 1. Fix Install Command Prefix Bug + Make It Configurable

**What:** The build script (`scripts/build-registry.ts:87`) hardcodes `@ourorg/` in install commands written to `lib/component-index.json`. The CLAUDE.md and README both reference `@kata-shadcn` as the correct prefix. Fix the hardcoded string and extract it to a config constant or env var so future registry-name changes require a single edit.

**Why:** Every component card in the browser UI displays a wrong install command. Users who copy-paste from the UI will get a broken install. This is a trust-damaging bug for a tool meant to be the team's component source of truth.

**Scope:** ~30 minutes. One line change in build-registry.ts, plus optionally reading from an env var or top-of-file constant.

**Risks:** Minimal. Requires a rebuild (`pnpm registry:build`) and redeploy. No runtime behavior change.

---

## 2. Semantic Category Tags in registry.json

**What:** Currently, categories are derived at build time by stripping trailing digits from the component name (`about1` -> `about`). This produces 250+ categories, many of which are overly granular compound names like `alert-dialog-alert-dialog-destructive` or `button-group-button-group-standard`. Add a `category` field (or `tags` array) directly to each registry.json entry using a curated taxonomy (e.g., `layout`, `navigation`, `form`, `data-display`, `feedback`, `marketing`, `ecommerce`, `chart`). A one-time script can auto-assign initial categories based on name pattern matching, then the build script uses the explicit field instead of the regex derivation.

**Why:** The browser UI's category filter is currently overwhelmed with 250+ pills, most holding 1-7 components. A 15-20 category taxonomy makes the registry browsable at a glance. Agents also benefit from cleaner categorical filtering when selecting components. This directly improves both human and agent discovery.

**Scope:** 2-4 hours. Write a migration script to populate initial categories. Update build-registry.ts to prefer explicit category over derived. Update browser UI if needed (mostly just fewer pills).

**Risks:** Initial auto-categorization may be imperfect. Manual review of edge cases needed. Non-breaking: the derived category remains as fallback.

---

## 3. Component Preview Screenshots via Automated Capture

**What:** Add static preview thumbnail images for each component. Run a headless browser script (Playwright) that renders each component in isolation and captures a screenshot. Store as `public/r/previews/{name}.png`. Expose the preview URL in the agent index and browser UI.

**Why:** The browser UI currently shows only text (name + description + install command). A thumbnail preview transforms the browsing experience from "read 2555 descriptions" to "scan visual grid." For agents, an image URL in the index enables multimodal AI to visually match components to design mockups. The preview link currently points to shadcnblocks.com, which requires the user to leave the registry.

**Scope:** 1-2 days. The script needs a minimal render harness (wrap each component in a page with Tailwind), run Playwright across all components, and store output. Build script needs minor updates to include preview URLs.

**Risks:** Some components depend on external data, APIs, or specific props that make isolated rendering non-trivial. Start with the simple ones (static marketing blocks like hero, about, footer) and progressively cover more. Image storage adds ~50-100MB to the repo or could use a CDN. Build time increases.

---

## 4. Agent-Optimized Component Selection Endpoint

**What:** Add a `GET /r/search.json?q=pricing+table&category=ecommerce&limit=10` endpoint that returns filtered, ranked results from the component index. Support query-string params for text search, category filter, and pagination. Return component metadata plus the install command.

**Why:** The current agent discovery flow requires fetching the entire 2555-item `index.json` (likely 500KB+), parsing it client-side, and filtering in the agent's context window. A search endpoint lets agents make targeted queries, reducing token consumption and improving response speed. This is the single highest-leverage change for agent usability.

**Scope:** 3-6 hours. Add a Next.js API route, load the component index at startup, implement basic text matching + category filtering. No external dependencies needed.

**Risks:** Low. Server-side search on a 2555-item JSON array is trivially fast. Main design question: how sophisticated should ranking be (exact match > prefix > substring > fuzzy)?

---

## 5. AGENTS.md + MCP Tool Definition for the Registry

**What:** Create an `AGENTS.md` in the registry repo documenting how AI agents should interact with the registry. Include: the search endpoint (idea #4), the install flow, authentication, and a suggested MCP tool definition that wraps the registry API. The MCP definition would let Claude Code and similar tools natively search and install components.

**Why:** The README has a recommended AGENTS.md section for consumers, but no guidance for agents operating on the registry itself or discovering components programmatically. A standardized MCP tool definition means any project using Claude Code can install registry components through natural language. This turns the registry from "a URL you configure" into "a tool the agent knows how to use."

**Scope:** 3-6 hours. Writing the AGENTS.md is documentation work. The MCP tool definition is a JSON schema describing available actions. If combined with idea #4, the search endpoint backs the tool.

**Risks:** MCP spec is still evolving. The tool definition may need updates as the protocol matures. The documentation itself has zero risk.

---

## 6. Usage Analytics via Vercel Edge Middleware

**What:** Add lightweight analytics to `middleware.ts` that logs component fetch events. For each authenticated `/r/{name}.json` request, send a non-blocking event to Vercel Analytics (or a simple JSON log endpoint). Track: component name, timestamp, and optionally a client identifier header.

**Why:** With 2555 components, knowing which ones are actually installed tells you where to focus quality, testing, and documentation effort. It also reveals which categories have zero adoption (candidates for removal or promotion). Commercial opportunity: usage data proves the registry's value to stakeholders and informs pricing if the registry is offered to external teams.

**Scope:** 4-8 hours. Extend middleware.ts with a non-blocking fetch to an analytics endpoint. Use Vercel's built-in analytics API or a lightweight custom solution (append to a KV store or log drain).

**Risks:** Must not add latency to component fetches. Use fire-and-forget pattern (don't await the analytics call). Privacy: ensure no sensitive data is logged. If using Vercel KV, check pricing for high-volume writes.

---

## 7. Composable Page Template Bundles

**What:** Create curated multi-component bundles that combine related blocks into complete page templates. For example, a "Landing Page" bundle installs hero1 + feature1 + pricing1 + cta1 + footer1 in one command. Define bundles in a `bundles.json` manifest. Add a `GET /r/bundles.json` endpoint and support `npx shadcn add @kata-shadcn/bundle-landing-page` which resolves to its constituent components.

**Why:** The #1 friction point with a 2555-component registry is choice paralysis. Bundles provide opinionated starting points. Agents can recommend a bundle instead of picking 5 individual blocks. Bundles also serve as product packaging for commercial use: sell "Landing Page Kit" or "SaaS Dashboard Kit" as higher-value offerings.

**Scope:** 1-2 days. Define 5-10 initial bundles manually. Add bundle resolution logic to the build script or a new API route. Update the browser UI to show bundles as a separate section.

**Risks:** Bundle composition is subjective. Components in a bundle may have visual conflicts when combined (different spacing, color assumptions). Needs visual QA for each bundle. The shadcn CLI may not natively support "install multiple components from one name" without a wrapper.
