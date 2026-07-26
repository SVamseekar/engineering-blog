# Implementation Plan — Engineering Publication Platform

**Date:** 2026-07-26  
**Spec:** `docs/superpowers/specs/2026-07-26-engineering-publication-platform-design.md`

## Phase M — Split & cutover
1. Scaffold Next.js App Router + TS + Tailwind in `engineering-blog`
2. Port blog + desk + posts to feature parity (then expand to full IA)
3. Vercel project + domains (document; deploy when credentials available)
4. Slim portfolio: remove blog/desk/posts; keep `/blog` 308
5. Retarget social-poster publish path
6. README/env docs

## Waves W1–W10
Implement design system, content pipeline, homepage IA, rich articles, SEO, search, series, integrations, reader features, performance — all in repo structure from spec §17.

## Verification
- `npm run build` green
- Requirements table §19 satisfied in code
