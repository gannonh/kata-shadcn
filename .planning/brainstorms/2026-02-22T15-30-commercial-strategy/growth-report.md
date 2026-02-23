# Growth & User Acquisition Strategy -- Final Report

Explorer: explorer-growth | Challenger: challenger-growth
Date: 2026-02-22
Rounds of debate: 3

---

## Executive Summary

Seven growth proposals were evaluated across three rounds of structured debate. Five survived with revised scope. Two were killed. The core strategic insight: **build a minimal conversion mechanism before shipping awareness channels, then run both in parallel.**

The recommended execution plan delivers externally visible artifacts (free tier, OSS template, agent endpoints) by week 3, with the full growth infrastructure operational by week 7. A Phase 2 SEO play (contingent on license verification and upstream milestones) extends the strategy's reach.

---

## Approved Proposals

### 1. Free Tier -- Static Token Allowlist (Critical Enabler)

**Status:** Approved. Phased delivery.

**What (revised):** Add a tiered access system to the existing middleware. Phase 1 uses two env vars (`REGISTRY_TOKEN` for full access, `REGISTRY_TOKEN_FREE` for the free tier) plus a JSON allowlist file checked when the free-tier token is used. No user database, no registration flow in Phase 1. Manual token distribution via a simple landing page or form. 50 curated components across key categories (1-2 high-quality blocks per major category -- enough to build one page, not a full site). Upgrade prompts in the browser UI only, never in CLI output.

**Why:** Every other growth strategy drives traffic to the registry. Without a free tier, that traffic hits a locked door. This is the conversion mechanism that makes awareness channels productive. The static token approach keeps the architecture simple (still a static file server with middleware) while enabling evaluation and building an addressable user list.

**Scope (revised):**
- Phase 1 (weeks 1-2): Static free-tier token + component allowlist in middleware (~20 lines of middleware change) + curate 50-component subset + simple distribution page. This unblocks #2 and #3.
- Phase 2 (weeks 4-6): Registration form for email collection, browser UI free/premium distinction, analytics on free-tier usage patterns.
- Phase 3 (future): Automated token provisioning, usage-based limits, team seat expansion.

**Risks:** Subset selection is a strategic decision requiring thought (too generous = no upgrade motivation; too weak = poor quality impression). Must select a cross-section that demonstrates quality while leaving obvious gaps. No CLI upsell messages -- developers actively despise promotional terminal output.

**Debate outcome:** Explorer's original 2-3 week estimate was optimistic. Challenger correctly identified this as an architectural change. The phased approach (challenger's suggestion) reduces Phase 1 to a plausible 1-2 week scope while deferring the complex registration system.

---

### 2. AI Agent Integration -- Search Endpoint + AGENTS.md

**Status:** Approved with reduced scope.

**What (revised):** Two deliverables: (a) enhance the existing AGENTS.md with structured component metadata and clear documentation of the search endpoint, auth header, and install flow; (b) add a `/r/search.json?q=pricing&category=ecommerce&limit=10` endpoint that returns filtered, ranked results from the component index. Ensure 401 error responses include a URL for obtaining registry access. Skip MCP server definition entirely.

**Why:** AI coding agents are a zero-marginal-cost distribution channel on static JSON. Agents already know how to `curl` endpoints. A well-documented search endpoint + AGENTS.md gets 80% of the value of a full MCP server at 10% of the cost. The search endpoint also serves the browser UI and any future integrations.

**Scope (revised):** 3-4 days total. Search endpoint (1-2 days as a Next.js API route with text matching + category filtering). AGENTS.md improvements (1 day). Error message updates (half day).

**What was cut:** MCP server definition (premature for a single-person project; doubles operational surface). Metadata enrichment beyond what exists (depends on KAT-86, which hasn't shipped).

**Risks:** Agent adoption is outside your control. The auth gap (agents discover components, developers still need tokens) is mitigated by the free tier shipping first.

**Debate outcome:** Explorer proposed a 1-2 week MCP integration. Challenger correctly identified MCP as a separate running process that doubles operational surface. The scoped version (AGENTS.md + search endpoint) is the right unit of work.

---

### 3. Open-Source Registry Template

**Status:** Approved. Ships after Free Tier Phase 1.

**What (revised):** Extract build-registry.ts, middleware.ts, example registry.json, and route handlers into a standalone GitHub repository with a permissive license and a one-click Vercel deploy button. No browser UI, no analytics, no extras. The template ships empty (no components) with a comprehensive README documenting how to add your own. The README includes a "Premium Component Library" section linking to the Kata registry's free tier.

**Why:** The shadcn ecosystem lacks a standard private registry template. Packaging existing commodity infrastructure as OSS converts a liability into an asset. The template generates GitHub stars, Hacker News discussion, and backlinks that compound over time. These are awareness and credibility outputs, not direct conversion -- but they position Kata as the authority on private shadcn registries and create organic discovery of the component library.

**Scope (revised):** 3-4 days of packaging work. Must ship within the same 2-week window as the free tier Phase 1 so the README links to something concrete, not vaporware.

**What was cut:** Blog post deferred to when there's something to announce (free tier + template together). Browser UI removed from template scope (adds maintenance burden, not core value).

**Risks:** Maintenance burden from GitHub issues. Mitigation: scope the template narrowly and set clear "no support" expectations in README. "Coming soon" links expire after 2-4 weeks -- the template and free tier must ship together.

**Debate outcome:** Explorer wanted to ship the template before the free tier. Challenger argued it drives traffic to a locked door. Resolution: Explorer's distinction between awareness value (doesn't need a purchase path) and conversion value (does) was accepted. The template ships after Phase 1 of the free tier but before the full registration system. Both agreed on minimal scope.

---

### 4. Shadcn Themes (extracted from Ecosystem Integration)

**Status:** Approved as standalone deliverable.

**What (revised):** Create 2-3 polished shadcn-compatible themes that pair with registry components. These are original works (no licensing issues) that demonstrate the registry components in different visual contexts. Published as standalone assets.

**Why:** Themes are concrete, shareable, and create a real reason to visit the registry. They demonstrate that Kata components are true shadcn citizens. Each theme is a standalone artifact that can be shared on social media, in the shadcn Discord, and referenced from the OSS template.

**Scope:** 3-5 days.

**What was cut from original #5:** Component submissions to shadcn docs (licensing issue -- these are licensed Kataponents, not original work). Dedicated "2-4 hours per week" community participation commitment. Integration guides (deferred, not killed).

**Community presence note:** Lurk and learn from the shadcn Discord. Post when there's something genuinely useful to share (the template, a theme). Don't allocate dedicated hours or track it as a strategy. It's background activity, not a workstream.

**Debate outcome:** Challenger correctly split the original proposal into a concrete deliverable (themes) and a vague commitment (community presence). Explorer pushed back that community presence has market research value. Resolution: community lurking is free and useful, but dedicated time allocation is not justified for a single-person project at this stage.

---

### 5. kata-init Onboarding Script

**Status:** Approved, minimal scope.

**What (revised):** A shell script that patches `components.json` with the registry URL and sets the `REGISTRY_TOKEN` env var. One command to go from "new project" to "ready to install components."

**Scope:** One afternoon.

**What was cut from original #7:** Pre-built starter projects (maintenance traps, one person can maintain one at most). Slack bot (absurd for a team of one). Usage dashboards in team channels (no team).

**Debate outcome:** Challenger identified the original proposal as over-engineered for the project's scale. Explorer agreed.

---

## Killed Proposals

### Developer Community Showcase (original #4)

**Status:** Killed.

**Reason:** Fatal cold-start problem. A "community showcase" requires a community. The current user base is presumably 1 person. A showcase with zero or 1-3 internal submissions looks worse than no showcase. The underlying need (curated component combinations) is better addressed by internally curated page recipes from milestone 4. If external users materialize later, a showcase becomes a natural addition.

**Debate outcome:** Explorer flagged the cold-start risk but didn't take it to its conclusion. Challenger did. Both agreed: build the showcase after users arrive, not before.

---

### Content-Led SEO Pages (original #3)

**Status:** Deferred to Phase 2. Contingent on two blockers.

**Reason:** Strong idea with two hard dependencies and one potential deal-breaker.

**Blocker 1 -- License verification:** Publishing 2555 public metadata pages about licensed Kataponents (even without source code) could violate license terms. This must be verified with the component vendor before any work starts. If the answer is "no public metadata," this proposal is dead.

**Blocker 2 -- Upstream milestones:** Quality SEO pages require enriched descriptions (KAT-86, not yet built) and screenshot previews (milestone 3, not yet started). Without these, the pages are thin text-only descriptions that Google will index poorly and that offer a worse experience than Kata itself.

**If both blockers clear:** Pilot with the top 50 components (1 per category). Measure organic traffic for 4-6 weeks. Scale to 2555 only if the pilot shows meaningful search impressions. Use JSON-LD structured data (SoftwareSourceCode schema). Estimated scope: 2-3 weeks for the pilot.

**Debate outcome:** Explorer proposed this as a near-term play. Challenger identified the thin content penalty risk, the milestone dependencies, and the license question. Explorer conceded the timing and accepted the Phase 2 classification but maintained the idea is sound if blockers clear.

---

## Execution Plan

```
Week 1:    #6 Phase 1 (static free-tier token + allowlist middleware)
           Curate 50-component free subset
           kata-init script (#5)
           Verify license terms for public metadata (action item for #3)

Week 2:    #6 Phase 1 continued (distribution landing page)
           #1 search endpoint (/r/search.json)
           #1 AGENTS.md improvements

Week 3:    #2 OSS template (extract, package, deploy button, README)
           Ship template + free tier together

Weeks 4-6: #6 Phase 2 (registration form, email collection, browser UI tiers)
           #4 Shadcn themes (2-3 themes, 3-5 days)

Week 7+:   #6 Phase 3 (automated provisioning, usage limits)
           Community presence begins (post template + themes in shadcn Discord)

Phase 2:   #3 SEO pages (only if license verified + KAT-86 + milestone 3 done)
           Pilot: 50 components. Scale: conditional on pilot metrics.
```

**First externally visible artifacts:** Week 3 (free tier + template + agent search endpoint).
**Full growth infrastructure:** Week 7.
**Phase 2 SEO (conditional):** After milestones 3-4 complete.

---

## Strategic Principles (from debate)

1. **Conversion before awareness.** Build the door before building the road. A minimal free tier (static token + allowlist) is the smallest unit that makes awareness channels productive.

2. **Parallel execution after minimum viability.** Once Phase 1 of the free tier ships, awareness channels (#1, #2) can run in parallel with the full conversion system (#6 Phases 2-3). Don't wait for perfection.

3. **Infrastructure is not the moat.** The ~310 lines of registry code are commodity. Open-sourcing them costs nothing defensible. The 2555 licensed components and their enriched metadata are the assets.

4. **Scope to the operator.** This is a single-person project. Slack bots, multi-framework starters, MCP server deployments, and community moderation are all out of scale. Every proposal must pass the "can one person maintain this?" test.

5. **Verify before building.** The license question for SEO pages is a potential deal-breaker that costs an email to resolve. Don't defer cheap validation.

6. **No CLI upsell.** Developers despise promotional terminal output. Upgrade prompts belong in the browser UI only.

---

## Open Items Requiring Decisions

1. **License terms for public component metadata** -- Email the vendor to verify whether public documentation pages (screenshots + descriptions, no source code) are within license terms. Blocks the SEO strategy entirely. Resolve in week 1.

2. **Free subset composition** -- Which 50 components? Needs 1-2 per major category, quality high enough to demonstrate value, gaps obvious enough to motivate upgrade. This is a curation decision, not an engineering task.

3. **Free tier distribution mechanism** -- Simple landing page with a form? Manual email? Self-serve token generation? Phase 1 can be fully manual; Phase 2 should automate.

4. **Template repo naming and hosting** -- Separate GitHub org? Same org as other Kata projects? Naming affects discoverability (e.g., "shadcn-registry-template" is more searchable than "kata-registry-template").
