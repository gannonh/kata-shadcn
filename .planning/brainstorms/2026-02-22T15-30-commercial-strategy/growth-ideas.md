# Growth & User Acquisition Ideas for Discovery & Growth Milestone

Explorer: explorer-growth
Date: 2026-02-22

---

## 1. AI Agent Integration Network

**What:** Build first-class integrations that let AI coding agents (Claude Code, Cursor, Copilot, Windsurf) discover, search, and install registry components through their native workflows. This includes: (a) publishing an MCP server definition so Claude Code can natively search/install components, (b) creating a well-formed `AGENTS.md` at the registry root that any agent crawling the site can parse, (c) adding structured metadata to the agent index (semantic tags, complexity scores, prop signatures) that agents can reason over, and (d) a lightweight `/r/search.json` endpoint so agents avoid loading the full 2555-item index.

**Why:** AI coding agents are becoming the primary way developers discover and install UI components. Cursor has 1M+ users, Claude Code adoption is growing rapidly, and GitHub Copilot is embedded in most editors. If an agent can natively query the registry, every developer using that agent becomes a potential user without visiting a website or reading docs. The registry becomes embedded in the workflow, not a separate destination. This is a distribution channel where the marginal cost of serving another agent user is zero (static JSON on Vercel). The network effect compounds: the more agents that know about the registry, the more developers who hear "I found this component in the kata registry" in their IDE.

**Scope:** 1-2 weeks. MCP server definition (2-3 days), AGENTS.md (already partially done per AGENTS.md file), search endpoint (1-2 days), metadata enrichment (3-5 days, overlaps with KAT-86).

**Risks:** MCP protocol is still maturing; the server definition may need updates. Agent adoption is outside your control. The enriched metadata feeding agent queries needs to be accurate or agents will recommend wrong components.

---

## 2. Open-Source Registry Template as Top-of-Funnel

**What:** Extract the registry infrastructure (~310 lines of build script + middleware + Next.js routes) into a standalone open-source template repository. Publish it on GitHub with a permissive license, a blog post explaining the architecture, and a one-click Vercel deploy button. The template ships empty (no components) with clear docs on how to add your own. Cross-reference the Kata Shadcn Registry as the canonical example of a production deployment with 2555+ components.

**Why:** The shadcn ecosystem lacks a standard way to host private component registries. Every team rolling their own re-solves the same problems: authentication middleware, build scripts, consumer path mapping, upstream shadcn dependency proxying. An OSS template positions Kata as the authority on private shadcn registries. Growth model: developers find the template via GitHub/SEO/Hacker News, deploy their own registry, and discover Kata's commercial component library in the process. The template creates awareness; the 2555-component library is the upsell. This is the classic "give away the razor, sell the blades" play. The template also generates GitHub stars and community discussion, which feed SEO and social proof.

**Scope:** 1 week. Extract build-registry.ts, middleware.ts, route handlers, and browser UI into a clean template. Strip component sources, add comprehensive README, add Vercel deploy button, write announcement blog post. This is mostly packaging work since the code already exists.

**Risks:** The template could enable competitors to replicate the infrastructure, but the infrastructure is already simple enough to build from scratch (the CLAUDE.md itself says "~310 lines of registry code are commoditizable"). A poorly maintained template becomes a liability. Needs a clear boundary between what's OSS (infrastructure) and what's proprietary (components + enriched metadata).

---

## 3. Content-Led SEO via Component Documentation Pages

**What:** Generate a public documentation page for each of the 2555 components. Each page includes: the component name, category, description, a screenshot preview (from the visual catalog milestone), the shadcn dependency tree, prop interface (from AST extraction in KAT-86), and a "Install with shadcn CLI" call-to-action that requires registry access. These pages are statically generated at build time from the enriched component index. They're publicly accessible (no auth) and optimized for search engines with structured data markup (JSON-LD for SoftwareSourceCode).

**Why:** The registry is currently invisible to search engines. A developer googling "shadcn pricing table component" or "react hero section with gradient" finds shadcn/ui, shadcnblocks.com, or generic component libraries. Public documentation pages create 2555 long-tail SEO entry points. Each page is a lightweight landing page that demonstrates what the component looks like and what it does, then funnels interest toward registry access. At 2555 pages, even modest per-page traffic aggregates meaningfully. The AST extraction and LLM descriptions from KAT-86 provide the content; the Playwright screenshots from milestone 3 provide the visuals.

**Scope:** 2-3 weeks. Static page generation (1 week), screenshot integration (depends on milestone 3), structured data markup (2-3 days), sitemap generation (1 day), analytics integration (1 day).

**Risks:** Public pages might expose too much about the components, reducing purchase motivation. Mitigation: show screenshots and metadata but not source code. The pages must look polished; a low-quality 2555-page documentation site hurts credibility more than it helps. Google may treat mass-generated thin pages as low quality if descriptions are too generic.

---

## 4. Developer Community Showcase and Contribution Program

**What:** Create a public gallery where developers can submit screenshots or live demos of pages/apps they've built using Kata Shadcn Registry components. This lives at a `/showcase` route on the registry site. Contributors submit via a GitHub issue template or a simple form. Featured projects get highlighted. Optionally, contributors who build full page templates (combinations of registry components into complete pages) can submit those as "community recipes" that get promoted to the curated bundles list.

**Why:** Social proof is the strongest growth signal for developer tools. Seeing real projects built with these components is more persuasive than any feature list. A showcase also creates a community feedback loop: users become promoters, promoters attract new users. Community-contributed recipes solve the bundle curation problem at scale without requiring the core team to design every combination. The showcase doubles as content marketing: each featured project is shareable on social media and indexable by search engines.

**Scope:** 1-2 weeks. Simple gallery page (2-3 days), submission flow via GitHub issues (1 day), moderation process (ongoing), community recipe format and submission guidelines (2-3 days).

**Risks:** Cold start: a showcase with zero submissions looks worse than no showcase at all. Needs 5-10 seed projects before launching publicly. Moderation burden if submissions are low quality. Community recipes may not meet quality standards without review.

---

## 5. Shadcn Ecosystem Integration and Cross-Promotion

**What:** Position the Kata registry as a premium extension of the shadcn ecosystem by integrating deeply with existing shadcn community touchpoints: (a) submit select high-quality components as examples to the shadcn official documentation, (b) create shadcn themes that pair with specific registry components, (c) publish integration guides showing how to use Kata components alongside popular shadcn-compatible libraries (next-themes, cmdk, vaul, sonner), (d) participate in the shadcn Discord and GitHub discussions as a known provider.

**Why:** The shadcn ecosystem is where the target users already live. Rather than building a separate audience from scratch, embed within the existing community. Developers who use shadcn/ui are the exact audience for a premium component library built on the same primitives. Cross-promotion with existing community members creates organic word-of-mouth. Theme compatibility demonstrates that Kata components are true shadcn citizens, not a foreign system with a shadcn wrapper.

**Scope:** Ongoing, 2-4 hours per week. Initial integration guides (1-2 days each). Theme creation (2-3 days). Community participation is a sustained effort, not a one-time task.

**Risks:** The shadcn community may perceive commercial promotion as unwelcome. Must lead with value (genuine contributions, useful guides) before promoting the registry. If Kata components have rough edges or compatibility issues with upstream shadcn, public visibility amplifies those problems.

---

## 6. Usage-Gated Free Tier with Team Expansion Incentive

**What:** Offer a free tier that grants access to a curated subset of the registry (50-100 components across key categories: hero, feature, pricing, footer, contact). The free tier requires registration (email) and a registry token. When a free-tier user installs a component, the response includes a header or console message: "This component is part of Kata Shadcn Registry. Unlock all 2555 components at [URL]." Free-tier tokens have rate limits (100 installs/month). The free tier also shows a "recommended upgrade" section in the browser UI showing premium components related to what the user just installed.

**Why:** The registry is currently all-or-nothing: either you have the token or you don't. A free tier creates a funnel. Developers can evaluate the component quality, integrate a few blocks into their project, and experience the workflow before committing. Once 3-4 registry components are in a codebase, switching costs increase and the upgrade to full access becomes natural. The email registration builds an addressable list for announcements, new component releases, and upgrade prompts. Rate limits prevent abuse while allowing genuine evaluation.

**Scope:** 2-3 weeks. Token tier system in middleware (3-5 days), free component subset selection (1-2 days), registration flow (3-5 days), browser UI modifications for tiered display (2-3 days).

**Risks:** A free tier could cannibalize paid usage if the free subset is too generous. The "freemium" messaging must be tasteful; aggressive upsell messaging in CLI output will irritate developers. Token management adds operational complexity. Must ensure the free components are good enough to demonstrate quality but don't cover full use cases (e.g., free hero but not free hero+pricing+footer+CTA combo).

---

## 7. Internal Adoption Acceleration via Onboarding Automation

**What:** Build a zero-friction onboarding flow for internal teams: (a) a `kata-init` CLI command that configures `components.json` with the registry URL and token in one step, (b) pre-built starter projects (Next.js 15, Remix, Vite+React) with registry access pre-configured, (c) a Slack bot or internal tool that lets developers ask "I need a pricing page" and returns the recommended component bundle + install command, (d) usage dashboards (from the analytics milestone) shared in team channels showing which components are popular.

**Why:** External growth is premature until internal adoption is strong. Internal teams are the first market. Every developer on the team who uses the registry is a data point proving value and a source of feedback improving quality. Onboarding friction is the main barrier: setting up `components.json`, getting the token, understanding what's available. Each friction point loses a potential internal user. The Slack bot and usage dashboards create ambient awareness: developers see colleagues installing components and naturally try it themselves. Internal adoption metrics also serve as proof points for any external commercialization.

**Scope:** 1-2 weeks. CLI onboarding command (2-3 days), starter projects (1-2 days each, 3 projects), Slack bot (3-5 days), usage dashboard sharing (1 day, depends on analytics milestone).

**Risks:** Over-investing in internal tooling before validating external demand. The Slack bot could be annoying if poorly tuned. Starter projects need ongoing maintenance as dependencies update. If internal teams don't adopt despite removing friction, the problem may be component quality or relevance, not discoverability.
