# High-Value Feature Ideas for kata-shadcn

## 1. Multi-Tenant SaaS Registry Platform

**What**: Transform the single-tenant registry into a multi-tenant platform where multiple organizations can host their own private shadcn registries. Each tenant gets an isolated namespace (`/r/{tenant}/{name}.json`), separate auth tokens, and an admin dashboard for managing components, tokens, and team access.

**Why**: The hardest part of this project (the build pipeline, shadcn CLI compatibility, auth middleware, agent index) is already solved. Multi-tenancy turns that infrastructure into a product. Organizations building design systems with shadcn already need private registries, and the current options are either self-hosting (which requires DevOps effort) or paying shadcnblocks for a pro plan (which doesn't support custom components). A hosted multi-tenant registry fills a real gap: teams get private component hosting without managing infrastructure.

**Scope**: 2-3 weeks. Key work includes: tenant data model (Postgres via Drizzle or Prisma), per-tenant namespace routing, tenant-scoped token management, admin UI for CRUD operations on components and API keys, onboarding flow, and billing integration (Stripe). The existing middleware pattern extends naturally to per-tenant token validation.

**Risks**:
- Multi-tenancy adds significant operational complexity (data isolation, noisy neighbor problems, tenant migrations)
- Requires a database, which the project currently avoids entirely
- Billing/payment handling is a product concern that pulls focus from the core technical value
- Tenant isolation bugs could expose one org's proprietary components to another
- Competes directly with shadcnblocks.com pro features if they expand their offering

---

## 2. Component Preview & Visual Catalog

**What**: Generate static screenshots or live interactive previews for every component in the registry. The build pipeline would render each component in isolation (using Playwright or a headless browser), capture screenshots at multiple viewport widths, and store them alongside the component JSON. The browser UI gets a visual grid view where users can see what components look like before installing. Agent workflows get image URLs in the index for visual context.

**Why**: The current browser UI shows component names and descriptions but no visuals. This forces users to click through to shadcnblocks.com for previews, and those links only work for the original upstream components (not for any modified or custom components). Agents selecting components currently work blind, picking based on text descriptions alone. Visual previews make the registry self-contained and dramatically improve both human and agent component selection. Preview images also enable similarity search and visual comparison across the 2539 blocks.

**Scope**: 1-2 weeks. Key work includes: a preview rendering script (Playwright + a minimal Next.js app shell), screenshot storage (local filesystem for now, S3 later), build pipeline integration, browser UI grid/gallery view, and thumbnail URLs in the agent index. The rendering script is the bulk of the work; the UI changes are straightforward.

**Risks**:
- Rendering 2539 components is computationally expensive (estimated 30-60 minutes per full run, even parallelized)
- Components may have external dependencies (fonts, images, API calls) that fail in isolation
- Screenshot fidelity varies; some components look broken without proper context (e.g., components that expect specific parent layouts)
- Storage costs scale linearly; at 3 viewport widths x 2539 components = ~7600 images
- Maintaining preview freshness when components are updated adds CI complexity

---

## 3. Usage Analytics & Consumption Tracking

**What**: Add per-component download/install tracking to the registry API. Each authenticated request to `/r/{name}.json` logs the component name, timestamp, consumer project identifier (derived from token or optional header), and client info. Store events in a lightweight store (SQLite, Turso, or Vercel KV). Surface analytics through a dashboard: most-installed components, install trends over time, per-project consumption, and unused components.

**Why**: With 2555 components, there's no visibility into which ones are actually used. This data drives several decisions: which components to invest in improving, which categories to expand, which to deprecate, and how to prioritize customization work. For a commercial offering, usage data is the foundation for usage-based billing, license compliance, and value demonstration ("your team installed 47 components this month"). It also enables proactive suggestions: "Projects similar to yours commonly use these 5 components."

**Scope**: 1 week. Key work includes: event logging in the route handler (minimal, just append to a store), a storage backend (Turso for serverless SQLite is the pragmatic choice on Vercel), an analytics API endpoint, and a basic dashboard page. The middleware already intercepts every component request, making the instrumentation point clear.

**Risks**:
- Logging on every request adds latency to component installs (mitigated with async/fire-and-forget writes)
- Storage costs for high-volume consumers could grow unexpectedly
- Privacy considerations if tracking per-developer usage in a team context
- Dashboard development can easily scope-creep into a full analytics product
- Vercel's serverless model makes persistent connections to databases more complex

---

## 4. Component Versioning & Change Management

**What**: Add semantic versioning to registry components. Each component gets a version field in `registry.json`. The build pipeline generates version-specific JSON files (`/r/{name}@{version}.json`) alongside the latest (`/r/{name}.json`). A changelog is auto-generated from git diffs of component source files. The agent index includes version info. Consumers can pin to specific versions in their `components.json` configuration.

**Why**: The registry currently serves whatever is on `main`. If a component is modified, every consumer gets the new version on their next install with no way to stay on the previous version. This is fine for a single-user setup but breaks down with multiple consumers or when components are modified in ways that change their API (prop changes, structural changes). Versioning is a prerequisite for any commercial or team use of the registry. It also enables safe experimentation: modify a component, ship it as a new version, let consumers opt in.

**Scope**: 1-2 weeks. Key work includes: version field in `registry.json` schema, versioned output paths in the build script, version resolution logic in the route handler (parse `@version` suffix), changelog generation from git history, and consumer-side documentation for pinning versions.

**Risks**:
- Versioning 2539 components retroactively is a cold-start problem (everything starts at 1.0.0 with no history)
- The shadcn CLI may not natively support `@version` syntax in registry URLs, requiring consumer-side workarounds
- Maintaining multiple versions inflates the build output (N versions x 2539 components)
- Semantic versioning requires judgment about what constitutes breaking vs. non-breaking changes for UI components (where the "API" is visual, not programmatic)
- Git-based changelog generation is noisy for components with many small edits

---

## 5. Agent-Optimized Component Selection API

**What**: Build a semantic search and recommendation API on top of the component index. Instead of dumping 2555 items and letting the agent filter, provide endpoints like `GET /r/search?q=pricing+table+with+toggle&limit=5` that return ranked results using embedding-based similarity. Add a `GET /r/recommend?context=saas+landing+page` endpoint that returns a curated set of components for a given use case. Include component metadata enrichment: tags, complexity rating, dependency count, peer components (components commonly installed together).

**Why**: The current agent workflow requires fetching the full 2555-item index and doing text matching. This is wasteful (large payload), imprecise (text search misses semantic similarity), and forces the agent to do work the registry could do better. A search API with semantic understanding means agents can describe what they need in natural language and get precise results. The recommendation endpoint enables "page builder" workflows: "I'm building a SaaS landing page" returns hero + features + pricing + testimonials + CTA + footer as a coherent set. This makes the registry dramatically more useful for agent-driven development.

**Scope**: 1-2 weeks. Key work includes: embedding generation for component descriptions (OpenAI embeddings API or a local model), vector storage (Turso with vector extension, or a simple in-memory index for the 2555-item corpus), search endpoint with ranking, recommendation engine (co-occurrence analysis from usage data or manually curated bundles), and metadata enrichment in the build pipeline.

**Risks**:
- Embedding quality depends heavily on component descriptions, which are currently formulaic and auto-generated
- Adding an LLM/embedding dependency introduces API costs and latency
- Recommendation quality requires usage data that doesn't exist yet (chicken-and-egg with analytics)
- Semantic search may over-promise and under-deliver for a 2555-item corpus where many components are similar
- Maintaining embedding freshness when components change adds build complexity

---

## 6. Component Composition & Page Builder Bundles

**What**: Define curated "page bundles" that group components into complete page templates. A bundle like `saas-landing-v1` would include specific hero, features, pricing, testimonials, CTA, and footer components that are designed to work together visually. Bundles are defined in a `bundles.json` manifest and installable via a single command: `npx shadcn add @kata-shadcn/bundle:saas-landing-v1`. The bundle endpoint returns all constituent components in one response, with optional layout scaffolding (a page.tsx template that imports and composes all the components).

**Why**: Individual components solve a composition problem: users must choose which hero, which features section, which pricing table, and then wire them together. With 2555 components across 40+ categories, the combinatorial space is overwhelming. Bundles encode expert design decisions about which components pair well together. This is especially valuable for agent workflows, where "build me a landing page" should produce a coherent result, not a random selection. Bundles also serve as upsell vectors in a commercial context: free registry gives individual components, paid tiers include curated bundles.

**Scope**: 1-2 weeks. Key work includes: bundle schema definition, `bundles.json` manifest, bundle resolution endpoint, scaffolding template generation, build pipeline support, browser UI for bundle browsing, and agent-facing bundle index.

**Risks**:
- Curation effort is manual and ongoing; bundles become stale as new components are added
- Components within a bundle may not actually compose well (inconsistent spacing, conflicting styles, different design languages)
- The shadcn CLI may not support bundle installation natively, requiring a custom CLI wrapper
- Layout scaffolding templates are opinionated and may not match consumer project structures
- Bundle count can proliferate, creating its own discovery problem

---

## 7. Private Component Marketplace with License Management

**What**: Build a marketplace layer where component authors (internal teams or external contributors) can publish components to the registry with license terms and access controls. Each component or bundle gets a license type (free, team, enterprise), and access is gated by the consumer's subscription tier. An admin dashboard manages component publishing workflows (submit, review, approve, publish), license assignment, and revenue sharing for external contributors.

**Why**: The current registry is a flat collection of 2555 components with uniform access. A marketplace adds economic structure: some components can be free (driving adoption), others premium (driving revenue). This creates a flywheel: revenue funds better components, better components attract more consumers, more consumers justify premium pricing. License management also solves the compliance question for enterprises: "what components are we using and are we licensed for them?" The publishing workflow enables growth beyond the initial shadcnblocks corpus, allowing custom components to enter the registry through a governed process.

**Scope**: 3-4 weeks. Key work includes: license model and schema, access control layer in middleware (check license entitlement per component), publishing workflow UI, review/approval system, Stripe integration for subscription billing, contributor dashboard, and admin management interface.

**Risks**:
- Marketplace dynamics are hard to bootstrap; needs both supply (components) and demand (consumers) simultaneously
- License enforcement at the middleware level can be circumvented once source code is downloaded (components are source code, not SaaS)
- Publishing workflow requires moderation effort and quality standards, which is operational overhead
- Revenue sharing with external contributors adds legal and tax complexity
- Competing with shadcnblocks.com's own marketplace directly
- Enterprise license management is a deep product area that can consume unlimited engineering effort
