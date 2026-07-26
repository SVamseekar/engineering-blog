# Engineering Publication Platform

Production engineering blog for **[blog.souravamseekar.com](https://blog.souravamseekar.com)** with editorial desk on **[desk.souravamseekar.com](https://desk.souravamseekar.com)**.

Sibling of the personal portfolio (`martisouravamseekar-portfolio`) and content OS (`social-poster`). This repo owns all publication UI, content, search, series, and desk.

## Stack

Next.js App Router · React · TypeScript · Tailwind · MDX · Shiki · Mermaid · KaTeX · Orama-style client search · Framer-ready motion tokens · Vercel Analytics

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for desk
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Desk (local): [http://desk.localhost:3000](http://desk.localhost:3000) or `/desk-site`

## Content

| Path | Purpose |
|------|---------|
| `content/posts/*.md(x)` | Articles + Zod-validated frontmatter |
| `content/series/*.yaml` | Series definitions |
| `content/taxonomy/` | Optional curated labels |
| `public/blog/` | Cover images |

### Frontmatter contract

`title`, `description`, `slug`, `publishedAt`, `updatedAt?`, `author`, `status` (`draft` \| `scheduled` \| `published`), `scheduledFor?`, `series?`, `categories`, `tags`, `technologies`, `projects`, `featured?`, `editorsPick?`, `github?`, `demo?`, `docs?`, `youtube?`, `notebook?`, `apiDocs?`, `faq?`, `ogImage?`, `coverImage?`, `canonical?`

Public site only shows `published` (and due `scheduled`). Drafts are desk-only.

## Deploy (Vercel)

1. Create project from `SVamseekar/engineering-blog` (or local import).
2. Attach domains: `blog.souravamseekar.com`, `desk.souravamseekar.com`.
3. Set env vars from `.env.example` (`DESK_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO=SVamseekar/engineering-blog`, etc.).

## social-poster

Publish target:

```bash
export BLOG_REPO_DIR=/path/to/engineering-blog
# or BLOG_DIR / GITHUB_REPO=SVamseekar/engineering-blog
```

Posts land in `content/posts/` and covers in `public/blog/`.

## Architecture

See `docs/superpowers/specs/2026-07-26-engineering-publication-platform-design.md`.
