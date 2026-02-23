# Commercial Strategy: Discovery & Growth Milestone

Date: 2026-02-22
Session: 3 explorer/challenger pairs, 3 rounds of debate each
Lenses: Monetization, Growth, Competitive Positioning

## Central Thesis

No individual feature constitutes a durable moat. Every enrichment the registry builds, Kata can replicate from a stronger position. The defensible strategy is to use feature-driven head starts to accumulate switching costs (configuration lock-in, import paths, workflow integration, institutional knowledge) before the upstream vendor closes each gap. The enrichment advantage window is 6-12 months.

Revenue is 6-12 months away. The Discovery & Growth milestone should build the infrastructure for monetization without implementing billing. Billing activates when external consumers exist, validated by demand signals.

## Surviving Proposals by Category

### Monetization

| # | Proposal | Effort | Status |
|---|----------|--------|--------|
| 1 | Enriched Registry Premium Tier ($39/mo per team) | 1 week beyond planned enrichment work | Approved -- free tier gets all 2555 components; enriched tier adds semantic search, agent index, previews, recipes |
| 2 | Per-Team Token Model (Vercel KV) | 1-2 weeks | Approved -- replaces single shared REGISTRY_TOKEN with per-team tokens carrying metadata |
| 3 | Usage Metering (infrastructure only) | Included in token model | Approved -- meter downloads for insight, not billing |
| -- | Sponsored Component Slots | -- | Killed -- no audience, perverse incentives |
| -- | Registry-as-a-Service | -- | Killed (twice, across both brainstorms) |
| -- | Consulting | -- | Killed -- premature, scales linearly |

[Full report](monetization-report.md)

### Growth

| # | Proposal | Effort | Status |
|---|----------|--------|--------|
| 1 | Free Tier with 50 curated components | Weeks 1-2 (Phase 1) | Approved -- static token + allowlist, conversion mechanism for all other channels |
| 2 | AI Agent Integration (search endpoint + AGENTS.md) | 3-4 days | Approved -- `/r/search.json` endpoint + improved AGENTS.md |
| 3 | Open-Source Registry Template | 3-4 days | Approved -- ships after free tier Phase 1 |
| 4 | Shadcn Themes (2-3 polished themes) | 3-5 days | Approved -- shareable artifacts, original works |
| 5 | kata-init Onboarding Script | Half day | Approved -- patches components.json + sets env var |
| -- | Developer Community Showcase | -- | Killed -- fatal cold-start problem |
| -- | Content-Led SEO Pages | -- | Deferred to Phase 2 -- blocked by license verification + upstream milestones |

[Full report](growth-report.md)

### Competitive Positioning

| # | Proposal | Effort | Status |
|---|----------|--------|--------|
| 1 | OSS Registry Reference Architecture | 1-2 weeks | Build now -- official template is minimal (288 stars, no auth/agent/UI) |
| 2 | Agent-Optimized Knowledge Base | 3-4 weeks (= KAT-86) | Build now -- 6-12 month advantage window |
| 3 | Usage Analytics Infrastructure | 1-2 weeks | Build now -- internal asset, publish at 100+ consumers |
| 4 | Page-Level Composition Recipes | 2-3 weeks | Internal first -- validate against v0 output before marketing |
| 5 | Visual Screenshots | Milestone 3 | QA tool, not a positioning play |
| 6 | Cursor Rules File | Half day | Minimal effort convenience |
| -- | Vertical-Specific Collections | -- | Dropped -- generic repackaging is transparent |

[Full report](positioning-report.md)

## Cross-Cutting Themes

**Conversion before awareness.** Build the door before building the road. A minimal free tier (static token + allowlist) is the smallest unit that makes awareness channels productive. Every growth channel converges on this.

**Features buy time; switching costs buy durability.** Switching costs accumulate across five dimensions: configuration (components.json), import paths (@kata-shadcn/ throughout codebases), workflows (CI pipelines, agent configs), knowledge (enriched metadata in team workflows), and recipes (composition patterns in team practice).

**Position as convenience, not moat.** "We pre-computed the analysis so your agent doesn't have to read 2555 .tsx files" is defensible. "We understand components better than anyone" is not. The enrichment pipeline is commodity; having done it first is the advantage.

**Scope to the operator.** Single-person project. Every proposal was stress-tested against "can one person maintain this?" MCP servers, multi-framework starters, community moderation, and vertical marketing campaigns all failed this test.

**Infrastructure is freely commoditizable. Give it away.** The ~310 lines of registry code add no value to hoard. Open-sourcing creates inbound and switching costs for operators who adopt the patterns.

## Open Risk: Licensing

The 2555 components are licensed from Kata. The monetization strategy sells enrichment (semantic descriptions, metadata, previews, curation), not the components themselves. Before activating external billing or publishing public metadata pages, verify that the component license permits:
1. Commercial resale of derived metadata
2. Public documentation pages with screenshots (no source code)

This is a legal question requiring an email to the component vendor. Resolve in week 1.

## Consolidated Execution Sequence

```
Week 1     Free tier Phase 1 (static token + 50-component allowlist)
           kata-init onboarding script
           Cursor rules file
           Email the vendor re: license terms for public metadata
           Per-team token infrastructure (Vercel KV)

Week 2     Search endpoint (/r/search.json)
           AGENTS.md improvements
           Free tier distribution landing page

Week 3     OSS registry template (extract, package, deploy button)
           Ship template + free tier together (first externally visible artifacts)

Weeks 4-6  Free tier Phase 2 (registration form, email collection, browser UI tiers)
           Shadcn themes (2-3 themes)
           Agent knowledge base begins (AST extraction, LLM enrichment -- KAT-86)

Weeks 7-9  Agent knowledge base continues (semantic search endpoint, embeddings)
           Page recipes (3-5 recipes, validate against v0 output)
           Usage analytics infrastructure + internal dashboard

Post-validation triggers:
  - Activate enriched tier billing ($39/mo) when ANY demand signal is met:
    - OSS template: >50 GitHub stars or >20 clones in 30 days
    - >3 unprompted requests for managed registry access
    - Enriched search used >100 times in 4-8 week validation period
  - Publish usage/popularity metrics when 100+ distinct consumers exist
  - Launch SEO pages if license verification clears AND milestones 3-4 complete

Phase 2 (conditional):
  SEO pilot: 50 components, measure organic traffic 4-6 weeks
  Community presence: post template + themes in shadcn Discord
```

## Decisions Required

1. **License terms** -- Email the vendor about public metadata and derived-data resale. Blocks SEO strategy and external monetization.
2. **Free subset composition** -- Which 50 components? 1-2 per major category, quality demonstrates value, gaps motivate upgrade.
3. **Template repo naming** -- "shadcn-registry-template" (searchable) vs "kata-registry-template" (branded)?
4. **Free tier distribution** -- Manual form in week 1, automated provisioning later?
