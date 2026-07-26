import type { MetadataRoute } from "next";
import {
  getAllPostMeta,
  getAllCategories,
  getAllTopics,
  loadSeriesDefs,
  getSiteUrl,
} from "@/lib/content/load";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/articles",
    "/series",
    "/categories",
    "/topics",
    "/projects",
    "/search",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const posts = getAllPostMeta().map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const series = loadSeriesDefs().map((s) => ({
    url: `${base}/series/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cats = getAllCategories().map((c) => ({
    url: `${base}/categories/${encodeURIComponent(c.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const topics = getAllTopics().map((t) => ({
    url: `${base}/topics/${encodeURIComponent(t.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const projs = projects.map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts, ...series, ...cats, ...topics, ...projs];
}
