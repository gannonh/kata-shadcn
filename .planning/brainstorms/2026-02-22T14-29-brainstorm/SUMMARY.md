# Brainstorm Summary: kata-shadcn Next Steps

Date: 2026-02-22
Session: 3 explorer/challenger pairs, 2-3 rounds of debate each

## Quick Wins (10-16 hours total)

| # | Idea | Effort | Impact |
|---|------|--------|--------|
| 1 | Fix `@ourorg/` install command prefix bug | 30 min | High — every component card shows a broken command |
| 2 | Clean up 451 categories to ~25-30 via collapse table | 2-4 hrs | High — category filter is currently unusable |
| 3 | Compact agent index (~80-100KB vs 766KB) | 1-2 hrs | Medium-high — fits agent context windows |
| 4 | Structured usage logging (console.log + Vercel log drains) | 2-4 hrs | Medium — zero-dependency analytics foundation |
| 5 | AGENTS.md for registry interaction | 1-2 hrs | Medium — agent integration docs |
| 6 | Curated page recipes (multi-component install combos) | 2-4 hrs | Medium — discovery and commercial packaging |

[Full report](quickwins-report.md)

## High-Value Features (4-5 weeks total)

| # | Feature | Effort | Status |
|---|---------|--------|--------|
| 1 | Usage analytics and consumption tracking | 1 week | Approved — foundation for all other decisions |
| 2 | Component index enrichment (tags, complexity, hashes) | 1 week | Approved — structured metadata for agents |
| 3 | Component preview screenshots (top 200, Playwright) | 1-2 weeks | Approved — visual catalog for humans and agents |
| 4 | Page builder bundles (3-5 curated templates with scaffolding) | 1 week | Approved — encode design decisions into installable sets |
| — | Multi-tenant SaaS registry platform | — | Killed — fundamental rearchitecture, unvalidated demand |
| — | Private component marketplace with licenses | — | Killed — unenforceable license model, cold-start problem |
| — | Component versioning | — | Deferred — reframed as change detection via content hashes |
| — | Agent search API | — | Deferred — enriched index may be sufficient |

[Full report](highvalue-report.md)

## Radical Ideas

| # | Idea | Effort | Status |
|---|------|--------|--------|
| 1 | Semantic search and component knowledge base | 2-4 weeks | Build now — AST extraction, LLM-enriched descriptions, vector search |
| 2 | Build-time visual previews (all 2555 components) | 1-2 months | Build now — Playwright renders as GitHub Actions job |
| 3 | Open-source registry template | Low | Validate then build — blog post + template repo, measure signal |
| — | Theme switcher overlay | — | Deferred — depends on visual previews existing first |
| — | Design-to-registry search via Figma | — | Deferred — depends on semantic search existing first |
| — | Agent recommendation/composition API | — | Collapsed into semantic search — agents own composition |
| — | Multi-tenant registry platform | — | Shelved — this is a company, not a feature |

[Full report](radical-report.md)

## Dropped/Deferred Items

- **MCP tool definition for registry**: premature without a search endpoint; agents can use HTTP directly
- **Preview screenshots as quick-win**: reclassified to high-value (1-2 weeks, not 1-2 days)
- **Full semantic versioning**: shadcn CLI doesn't support `@version` syntax; content hashes provide change detection without version management
- **Agent search API with embeddings**: the enriched index with tags may suffice; defer until evidence says otherwise
- **Multi-tenant SaaS / marketplace**: both killed across two independent pairs; requires months of work with unvalidated demand

## Cross-Cutting Themes

**Discovery is the bottleneck.** The registry has 2555 components. The problem is finding the right one. Every surviving proposal across all three pairs improves discovery: better categories, richer metadata, semantic search, visual previews, curated recipes.

**Build-time computation, not runtime services.** The static-JSON-on-Vercel architecture is a strength. Surviving proposals follow the same pattern: compute at build time, serve statically. Runtime services (embedding search, rendering APIs) are deferred or scoped to separate CI jobs.

**Let agents own composition, let the registry own knowledge.** Composition is a generic capability that LLMs improve at for free. The registry's value is the 2555 components and the metadata about them. Make the knowledge maximally accessible; let agents handle assembly.

**The infrastructure is not the moat.** The ~310 lines of registry code are commoditizable. The licensed component library and its enrichments are the defensible assets.

## Recommended Sequence

```
Immediate     Fix @ourorg/ bug, clean up categories (day 1)
Week 1        Compact agent index, usage logging, AGENTS.md
Week 2        Analytics dashboard, index enrichment
Weeks 3-4     Visual previews (audit + Playwright harness)
Week 5        Page builder bundles
Week 6+       Semantic search, OSS template (if signal warrants)
```
