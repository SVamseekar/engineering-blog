import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import {
  FrontmatterSchema,
  SeriesDefSchema,
  type Frontmatter,
  type Post,
  type PostMeta,
  type SeriesDef,
} from "./schema";
import { computeReadingTime } from "./reading-time";
import { extractToc } from "./toc";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const SERIES_DIR = path.join(CONTENT_DIR, "series");

function normalizeRaw(data: Record<string, unknown>): Record<string, unknown> {
  const out = { ...data };

  // Legacy portfolio: date → publishedAt, project → projects[]
  if (!out.publishedAt && out.date) {
    out.publishedAt = out.date;
  }
  if ((!out.projects || (Array.isArray(out.projects) && out.projects.length === 0)) && out.project) {
    out.projects = [String(out.project)];
  }
  if (!out.status) {
    out.status = "published";
  }
  if (!out.categories) out.categories = [];
  if (!out.tags) out.tags = [];
  if (!out.technologies) out.technologies = [];
  if (!out.projects) out.projects = [];
  if (!out.author) {
    out.author = {
      name: "Marti Soura Vamseekar",
      url: "https://souravamseekar.com",
    };
  }
  if (!out.description) out.description = "";
  return out;
}

function isPubliclyVisible(fm: Frontmatter, now = new Date()): boolean {
  if (fm.status === "draft") return false;
  if (fm.status === "scheduled") {
    if (!fm.scheduledFor) return false;
    return new Date(fm.scheduledFor) <= now;
  }
  // published
  const pub = new Date(fm.publishedAt);
  if (Number.isNaN(pub.getTime())) return true;
  return pub <= now;
}

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => path.join(POSTS_DIR, f));
}

function parsePostFile(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const normalized = normalizeRaw(data as Record<string, unknown>);
  const parsed = FrontmatterSchema.safeParse(normalized);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filePath}: ${parsed.error.message}`
    );
  }
  const fm = parsed.data;
  const { minutes, words } = computeReadingTime(content);
  const ext = filePath.endsWith(".mdx") ? ".mdx" : ".md";
  const toc = extractToc(content);

  return {
    ...fm,
    content,
    toc,
    readingTimeMinutes: minutes,
    wordCount: words,
    filePath,
    extension: ext,
  };
}

let cache: Post[] | null = null;

export function loadAllPosts(opts?: { includeUnpublished?: boolean }): Post[] {
  if (!opts?.includeUnpublished && cache) return cache;
  const posts = listPostFiles().map(parsePostFile);
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  if (!opts?.includeUnpublished) {
    const visible = posts.filter((p) => isPubliclyVisible(p));
    cache = visible;
    return visible;
  }
  return posts;
}

export function getAllPostMeta(opts?: {
  includeUnpublished?: boolean;
}): PostMeta[] {
  return loadAllPosts(opts).map(({ content: _c, toc: _t, ...meta }) => meta);
}

export function getPostBySlug(
  slug: string,
  opts?: { includeUnpublished?: boolean }
): Post | null {
  const posts = loadAllPosts(opts);
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(post: PostMeta, limit = 4): PostMeta[] {
  const all = getAllPostMeta().filter((p) => p.slug !== post.slug);
  const score = (p: PostMeta) => {
    let s = 0;
    if (post.series && p.series?.id === post.series.id) s += 10;
    for (const t of post.tags) if (p.tags.includes(t)) s += 3;
    for (const t of post.technologies)
      if (p.technologies.includes(t)) s += 3;
    for (const pr of post.projects) if (p.projects.includes(pr)) s += 4;
    for (const c of post.categories) if (p.categories.includes(c)) s += 2;
    return s;
  };
  return all
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (a.p.publishedAt < b.p.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.p);
}

export function getAllCategories(): { slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPostMeta()) {
    for (const c of p.categories) {
      map.set(c, (map.get(c) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getAllTopics(): { slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPostMeta()) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPostMeta().filter((p) =>
    p.categories.map((c) => c.toLowerCase()).includes(category.toLowerCase())
  );
}

export function getPostsByTopic(topic: string): PostMeta[] {
  return getAllPostMeta().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(topic.toLowerCase())
  );
}

export function getPostsByProject(projectId: string): PostMeta[] {
  return getAllPostMeta().filter((p) => p.projects.includes(projectId));
}

export function loadSeriesDefs(): SeriesDef[] {
  if (!fs.existsSync(SERIES_DIR)) return [];
  return fs
    .readdirSync(SERIES_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml") || f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(SERIES_DIR, f), "utf8");
      const data = f.endsWith(".json") ? JSON.parse(raw) : loadYaml(raw);
      return SeriesDefSchema.parse(data);
    });
}

export function getSeriesById(id: string): SeriesDef | null {
  return loadSeriesDefs().find((s) => s.id === id) ?? null;
}

export function getSeriesPosts(seriesId: string): PostMeta[] {
  const def = getSeriesById(seriesId);
  const posts = getAllPostMeta().filter((p) => p.series?.id === seriesId);
  if (def?.recommendedOrder?.length) {
    const order = new Map(def.recommendedOrder.map((s, i) => [s, i]));
    return posts.sort(
      (a, b) =>
        (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999) ||
        (a.series?.order ?? 0) - (b.series?.order ?? 0)
    );
  }
  return posts.sort(
    (a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0)
  );
}

export function getFeaturedPost(): PostMeta | null {
  const featured = getAllPostMeta().find((p) => p.featured);
  return featured ?? getAllPostMeta()[0] ?? null;
}

export function getEditorsPicks(limit = 4): PostMeta[] {
  const picks = getAllPostMeta().filter((p) => p.editorsPick);
  if (picks.length) return picks.slice(0, limit);
  return getAllPostMeta().slice(0, limit);
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.souravamseekar.com"
  ).replace(/\/$/, "");
}
