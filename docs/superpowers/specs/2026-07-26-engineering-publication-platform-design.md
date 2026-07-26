# Engineering Publication Platform — Design Spec

**Date:** 2026-07-26  
**Status:** Draft for review  
**Product:** Technical publication at `blog.souravamseekar.com`  
**Repo:** `/Users/souravamseekarmarti/Projects/engineering-blog` (sibling of portfolio and product repos)  
**Related:** `martisouravamseekar-portfolio` (portfolio only), `social-poster` (content OS)

---

## 1. Purpose

Build a production-grade engineering publication platform—not a personal WordPress-style blog. The experience should sit with Stripe Engineering, Vercel Blog, Cloudflare Blog, Netflix Tech Blog, and Linear-level product craft: fast, discoverable, visually refined, deeply technical, and wired to real products (MaSoVa, Aequitas, WorkforceGuard AI, EU AI Assurance, Meridian).

This is a **complete** product surface. Features listed in the product brief are requirements, not a backlog of optional ideas.

---

## 2. Problem with the current state

Today, portfolio and blog share one Next.js app (`martisouravamseekar-portfolio`):

- Host-based middleware rewrites `blog.*` → `/blog-site` and `desk.*` → `/desk-site`
- Posts live in `posts/*.md`; rendering is gray-matter + marked HTML
- UI is a minimal proof of concept (readable, fast, under-designed)
- Publish path: `social-poster` → portfolio `posts/` + `public/blog/`

That coupling blocks independent deploy cadence, dependency weight (MDX, Mermaid, search), Lighthouse isolation, and a clear product identity.

---

## 3. Goals and non-goals

### Goals

1. **Separate** portfolio and blog into independent apps, domains, and Vercel projects.
2. Deliver the **full** publication experience: design system, homepage IA, rich articles, production search, series, SEO, CMS/DX, integrations, reader features, performance bar.
3. Keep **`social-poster`** as the generation → review → approve → publish factory, targeted at the blog repo.
4. Make every article a node in a **product + code + writing** ecosystem.

### Non-goals (for this product; not “never”)

- Multi-author SaaS CMS / team roles beyond a single operator desk
- Comments / social login as core v1 (bookmarks may be local-first)
- Replacing Dev.to / LinkedIn distribution channels in `social-poster`

---

## 4. System topology

| Surface | Path | Vercel project | Domains |
|---------|------|----------------|---------|
| Portfolio | `Projects/Portfolio/martisouravamseekar-portfolio` | existing | `souravamseekar.com`, `www` |
| **Publication** | `Projects/engineering-blog` | **new** | `blog.souravamseekar.com` |
| **Desk** | same as publication | same | `desk.souravamseekar.com` |
| Content OS | `Projects/social-poster` | optional desk host already | CLI-first; publish into blog repo |

### Cross-links only (no shared runtime monorepo)

- Portfolio “Writing” / project cards → blog URLs
- Blog author / about / projects → portfolio URLs
- Blog integrations → GitHub, live demos, docs, YouTube, notebooks, API docs

### Portfolio after split

- Remove blog-site, desk-site, desk APIs, posts directory, blog middleware branches
- Keep production redirect: `/blog` and `/blog/*` → `https://blog.souravamseekar.com` (308)
- Optional: consume blog RSS or `/api/latest.json` for a “Latest notes” strip (HTTP only)

### `social-poster` after split

- Publish target: `engineering-blog/content/posts` (or `posts/`) and `public/` assets
- Env: `BLOG_REPO_DIR` / `GITHUB_REPO` for the blog repository
- Emit the full frontmatter contract (Section 7)

---

## 5. Technical stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS + **8px spacing scale** design tokens |
| Components | shadcn/ui (accessible primitives) |
| Motion | Framer Motion (subtle, reduced-motion aware) |
| Content | MDX + Markdown, frontmatter (Zod-validated) |
| Images | `next/image`, automatic optimization |
| SEO | App Router `metadata` / `generateMetadata`; JSON-LD helpers |
| Diagrams | Mermaid (dynamic import) |
| Math | KaTeX |
| Search | Build-time full-text index (Orama or Pagefind; decision in implementation: prefer **Orama** in-process for faceted filter + fuzzy without extra static host path complexity) |
| Analytics | Vercel Analytics |
| Delivery | Vercel Edge Network, static generation where possible |
| Desk auth | Password cookie HMAC (port existing desk auth pattern) |

---

## 6. Information architecture

### 6.1 Public routes (`blog.souravamseekar.com`)

| Route | Purpose |
|-------|---------|
| `/` | Publication homepage (full section stack) |
| `/articles` or `/blog` | Paginated latest (canonical list; homepage also shows latest) |
| `/[slug]` | Article |
| `/series` | Series index |
| `/series/[seriesId]` | Series overview + order + progress |
| `/categories` | Category index |
| `/categories/[slug]` | Category listing |
| `/topics` or `/tags` | Topic/tag index |
| `/topics/[slug]` | Topic listing |
| `/projects` | Project hub (ecosystem) |
| `/projects/[id]` | Articles + links for one product line |
| `/search` | Full search UI (also command palette) |
| `/rss.xml` | RSS feed |
| `/sitemap.xml` | XML sitemap |
| `/robots.txt` | Robots |

### 6.2 Homepage sections (required order)

1. **Hero** — publication positioning, primary CTA (latest / subscribe / explore series)
2. **Latest Featured Article** — large feature card
3. **Editor’s Picks** — curated set (`editorsPick: true`)
4. **Latest Articles** — chronological grid
5. **Popular Series** — series cards with progress affordance when applicable
6. **Categories** — browse by category
7. **Topics** — tag cloud or chips
8. **Newsletter** — capture (provider pluggable; UI + API route stub with env-based provider)
9. **Projects** — MaSoVa, Aequitas, WorkforceGuard, EU AI Assurance, Meridian, etc.
10. **Footer** — nav, social, legal, portfolio link, RSS

### 6.3 Desk routes (`desk.souravamseekar.com`)

- Login, board, post editor/preview, draft/schedule/publish actions
- Middleware host rewrite pattern ported from portfolio (desk hosts only)

---

## 7. Content model

### 7.1 Frontmatter (Zod schema)

All fields are first-class for UI, search, SEO, or desk:

```ts
{
  title: string
  description: string          // meta + cards
  slug: string
  publishedAt: string          // ISO date
  updatedAt?: string
  author: {
    name: string
    url?: string
    avatar?: string
  }
  status: "draft" | "scheduled" | "published"
  scheduledFor?: string        // ISO datetime
  series?: { id: string; order: number }
  categories: string[]
  tags: string[]
  technologies: string[]
  projects: string[]           // product keys
  featured?: boolean
  editorsPick?: boolean
  github?: string[]
  demo?: string
  docs?: string
  youtube?: string[]
  notebook?: string
  apiDocs?: string
  faq?: { question: string; answer: string }[]
  ogImage?: string
  coverImage?: string
  canonical?: string
}
```

**Visibility rules**

- Public site: only `status === "published"` and `publishedAt <= now` (and not future-only scheduled)
- `scheduled`: excluded from public until `scheduledFor <= now` (build/ISR or request-time filter)
- `draft`: desk only

### 7.2 Series definition files

`content/series/{id}.yaml` (or `.json`):

- `id`, `title`, `description`, `coverImage?`, `projects[]`, `recommendedOrder: slug[]` (optional override; else order by `series.order`)
- Shared diagram assets under `public/series/{id}/`

### 7.3 Taxonomy

- Categories and tags generated from frontmatter at build; optional curated labels in `content/taxonomy/`

### 7.4 Derived fields

- **Reading time** — word count / 200–238 wpm
- **TOC** — from MDX headings (h2/h3)
- **Related articles** — shared tags/technologies/projects/series + recency
- **Related projects** — from `projects[]` + portfolio/product URL map

### 7.5 Body formats

- Markdown and **MDX**
- MDX components: `Note`, `Warning`, `Tip`, `Callout`, pre/code with copy, Mermaid, math (KaTeX), embeds (GitHub, YouTube, Demo, Docs, Notebook, ApiDocs)

---

## 8. Visual identity

### 8.1 Principles

- Premium engineering publication, not generic blog theme
- Strong type hierarchy; restrained color; high contrast in both themes
- **8px spacing system** (4/8/12/16/24/32/48/64…)
- Consistent elevation (shadow scale); glassmorphism **only** on overlays/nav where it improves hierarchy
- Smooth transitions; respect `prefers-reduced-motion`
- High-quality icons (e.g. lucide via shadcn)
- Professional empty states and loading skeletons for every major list/detail view

### 8.2 Design tokens

Defined in CSS variables + Tailwind theme:

- Color: background, surface, border, muted, accent, destructive, success, warning
- Type: display, h1–h4, body, small, mono (code)
- Radius, shadow-sm/md/lg, glass blur token
- Dark / light themes with system preference + user toggle (persisted)

### 8.3 Motion

- Page section entrance subtle; TOC active state; command palette; theme switch
- No gratuitous parallax that hurts performance or a11y

---

## 9. Rich article experience

Each article page includes:

| Feature | Implementation notes |
|---------|----------------------|
| Reading time | Derived + shown in header |
| Published / updated dates | Frontmatter |
| Author | Frontmatter + schema |
| Table of contents | Sticky desktop; collapsible mobile |
| Scroll progress | Top bar or thin indicator |
| Syntax-highlighted code | Shiki or rehype-pretty-code |
| Copy-to-clipboard | Per code block |
| Mermaid | Client island, lazy |
| Architecture diagrams | Mermaid + static images in `/public` |
| Callouts | Note / Warning / Tip components |
| Math | KaTeX via remark-math / rehype-katex |
| GitHub links | Frontmatter + inline component |
| Related projects | Cards from project registry |
| Related articles | Algorithm in Section 7.4 |

Layout: documentation-like (content measure ~65–75ch, generous leading, optional right TOC rail).

---

## 10. Search (production-grade)

| Capability | Behavior |
|------------|----------|
| Full-text | Title, description, body, tags |
| Instant suggestions | Debounced as-you-type, keyboard navigable |
| Fuzzy matching | Typo-tolerant ranking |
| Facets | Tags, technologies, projects, categories |
| Keyboard shortcuts | `⌘K` / `Ctrl+K` open; `Esc` close; arrow + enter |
| Recent searches | `localStorage` |

Index built at build time from published posts; client loads compact index chunk (code-split).

---

## 11. CMS / developer experience

| Capability | Owner |
|------------|--------|
| Markdown + MDX + frontmatter | Blog content pipeline |
| Draft mode | Desk + `status: draft` |
| Scheduled publishing | `status: scheduled` + `scheduledFor`; desk UI; public filter |
| Automatic image optimization | `next/image` + cover pipeline |
| Automatic Open Graph generation | `opengraph-image` routes + optional static covers |
| RSS feed | `/rss.xml` |
| XML sitemap | `sitemap.ts` |
| Tag / category generation | Build-time from frontmatter |
| Related article generation | Build-time or request pure function |
| Series support | Series files + frontmatter |
| Estimated reading time | Derived |
| Code / math / Mermaid / TOC | MDX pipeline |

Desk remains password-protected; publish may write via GitHub API (existing pattern) into `engineering-blog` or local filesystem in CLI.

---

## 12. Series system

Named series examples (content, not hard-coded exclusivity):

- Building Masova  
- Inside Aequitas  
- Spring Boot Deep Dive  
- Production AI Systems  
- LLM Engineering  
- Distributed Systems  
- Database Internals  
- System Design  
- EU AI Assurance  

Each series provides:

- Overview page (pitch, audience, prerequisites)
- Progress tracking (local: completed slugs in `localStorage`; optional future sync)
- Recommended reading order
- Cross-links (prev/next in series)
- Shared diagrams
- Consistent series subnav on article pages when `series` is set

---

## 13. Integrations

Reusable MDX/UI components and frontmatter fields:

| Integration | UX |
|-------------|-----|
| GitHub repositories | Link cards / repo badges |
| Live project demos | External CTA buttons |
| Documentation sites | Doc link cards |
| YouTube | Privacy-aware embed (facade → iframe) |
| Architecture diagrams | Mermaid + images |
| Interactive notebooks | External notebook links (Colab/etc.) |
| API documentation | Link cards |

Project registry (`src/data/projects.ts`) maps keys → name, URL, demo, repo, docs, color.

---

## 14. Reader experience

| Feature | v1 behavior |
|---------|-------------|
| Dark / light themes | Toggle + system; persisted |
| Estimated completion time | Reading time in UI |
| Recently viewed | `localStorage` ring buffer |
| Keyboard navigation | Search palette; optional j/k list patterns on index pages |
| Continue reading | From recently viewed + incomplete series |
| Related by technology | Facet overlap on article footer |
| Bookmarking | Local bookmarks UI + storage API; account sync designed as later backend without blocking UI |
| Reading progress sync | Local progress per slug; sync interface stubbed for future auth |

---

## 15. SEO and discoverability

Per article (and relevant index pages):

- Canonical URL (`https://blog.souravamseekar.com/{slug}` or `canonical` override)
- Meta description
- Open Graph image (generated or cover)
- Twitter Card
- JSON-LD: `Article`, `Person` (author), `BreadcrumbList`, `FAQPage` when `faq` present
- Site-level `WebSite` + `Organization`/`Person` as appropriate
- RSS + sitemap for crawl and AI retrieval surfaces

---

## 16. Performance targets

| Lighthouse category | Target |
|---------------------|--------|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Technical means:

- Static generation for published articles and taxonomy pages
- Edge caching via Vercel
- Image optimization and lazy loading below fold
- Font optimization (next/font, subset)
- Route prefetching for primary nav
- Code splitting; dynamic import Mermaid, heavy search, embeds
- Bundle analysis in CI or script; avoid shipping desk code to public blog bundles (route-level separation)

---

## 17. Application structure (blog repo)

```text
engineering-blog/
  content/
    posts/                 # *.md, *.mdx
    series/                # series definitions
    taxonomy/              # optional curated labels
  public/
    blog/                  # covers
    series/
  src/
    app/
      (pub)/               # public publication layout
        page.tsx           # homepage
        [slug]/page.tsx
        series/...
        categories/...
        topics/...
        projects/...
        search/...
      desk-site/           # desk UI
      api/desk/...
      api/latest.json/     # optional portfolio consumer
      rss.xml/route.ts
      sitemap.ts
      robots.ts
      opengraph-image...
    components/            # shadcn + blog UI
    blog/
      design-system/
      home/
      article/
      search/
      series/
      integrations/
      seo/
      reader/
    lib/
      content/             # load, validate, index
      mdx/
      search/
    data/
      projects.ts
      author.ts
    middleware.ts          # blog + desk hosts
  docs/superpowers/specs/  # this document
```

Portfolio middleware loses blog/desk host handling after cutover.

---

## 18. Migration plan

### Phase M — Split and cutover

1. Scaffold `engineering-blog` (Next.js App Router, Tailwind, TS).
2. Port current blog-site + posts + desk + blog lib as baseline (feature-parity first).
3. Create Vercel project; attach `blog.souravamseekar.com` and `desk.souravamseekar.com`.
4. Verify DNS/SSL; smoke-test article + desk login.
5. Remove blog/desk/posts from portfolio; keep apex `/blog` redirect.
6. Point `social-poster` publish paths and GitHub repo at `engineering-blog`.
7. Git init/remote for `SVamseekar/engineering-blog` (or chosen name).

### Phase W1 — Design system

Tokens, themes, typography, shadows, skeletons, empty states, shadcn, Framer primitives, layout shell.

### Phase W2 — Content pipeline

MDX, Zod frontmatter, series/taxonomy files, reading time, TOC extraction, draft/schedule rules, related generation.

### Phase W3 — Homepage IA

All ten homepage sections, polished.

### Phase W4 — Rich article

Full article chrome + MDX component set.

### Phase W5 — SEO and feeds

Metadata, JSON-LD, OG, Twitter, RSS, sitemap.

### Phase W6 — Search

Full-text, fuzzy, facets, shortcuts, recent.

### Phase W7 — Series UX

Overview, order, progress, cross-links, shared diagrams, article subnav.

### Phase W8 — Integrations and projects hub

All integration components + `/projects`.

### Phase W9 — Reader + desk schedule

Theme polish, recently viewed, continue reading, keyboard nav, local bookmarks/progress; desk draft/schedule UX; `social-poster` full frontmatter.

### Phase W10 — Performance and quality bar

Lighthouse campaigns, bundle/font/image passes, a11y audit, empty/loading polish.

**Program done when:** every requirement row in Section 19 is true in production.

---

## 19. Requirements traceability

| Requirement area | Spec section | Wave |
|------------------|--------------|------|
| Separate portfolio and blog | 4, 18-M | M |
| Visual identity | 8 | W1, W10 |
| Homepage sections | 6.2 | W3 |
| Rich article | 9 | W4 |
| Production search | 10 | W6 |
| CMS/DX | 11, 7 | W2, W9 |
| Performance | 16 | continuous, W10 |
| SEO | 15 | W5 |
| Series | 12, 7.2 | W2, W7 |
| Integrations | 13 | W8 |
| Reader experience | 14 | W9 |
| Stack | 5 | M–W1 |
| Ecosystem / long-term vision | 1, 4, 13 | W3, W8 |

---

## 20. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| DNS cutover downtime | Deploy blog first with domains; switch DNS; keep portfolio redirect |
| Dual-repo publish confusion | Single env contract; document in both READMEs |
| Heavy MDX/Mermaid hurts Lighthouse | Dynamic import; static fallback images for critical diagrams |
| Scheduled posts on pure SSG | ISR/on-demand revalidation or filter by time at render with short revalidate |
| Scope duration | Waves ship incrementally; each wave is production-ready |

---

## 21. Success metrics

- Qualitative: “reads like a company eng blog,” ecosystem links obvious
- Quantitative: Lighthouse 100×4 on homepage + representative article on mobile/desktop
- Operational: generate → approve → publish from `social-poster` lands on blog within one pipeline run
- SEO: valid JSON-LD, sitemap, RSS, unique titles/descriptions

---

## 22. Open implementation choices (resolved defaults)

| Topic | Default |
|-------|---------|
| Repo path | `/Users/souravamseekarmarti/Projects/engineering-blog` |
| GitHub name | `SVamseekar/engineering-blog` (rename allowed before first push) |
| Search engine | Orama (revisit Pagefind if index size demands) |
| Code highlight | Shiki via rehype-pretty-code |
| Newsletter | UI + API; provider via env (e.g. Buttondown/Resend); no provider lock-in in core |
| Desk location | Same app as blog |
| Bookmarks / progress | Local-first with clear module boundary for future sync |

---

## 23. Approval

This document is the master design for:

1. Portfolio ↔ blog separation  
2. Full engineering publication platform (entire product brief)

**Next step after approval:** implementation plan (`docs/superpowers/plans/...`) and execution starting at Phase M (scaffold + migrate + cutover), then W1–W10 without dropping scope.

---

*End of design spec.*
