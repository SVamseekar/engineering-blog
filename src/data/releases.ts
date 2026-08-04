/**
 * Content OS release unit — short + podcast + blog.
 * Source of truth: content/glasshouse/releases.json (desk publishes here).
 */
import fs from "fs";
import path from "path";

export type Release = {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  badge?: string;
  project?: string;
  shortVideo?: string | null;
  podcast?: string | null;
  podcastLabel?: string | null;
  longVideo?: string | null;
  articleSlug?: string | null;
  coverImage?: string | null;
};

function loadReleases(): Release[] {
  const candidates = [
    path.join(process.cwd(), "content/glasshouse/releases.json"),
    path.join(process.cwd(), "src/data/releases.fallback.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, "utf8"));
        if (Array.isArray(raw)) return raw as Release[];
      }
    } catch {
      /* try next */
    }
  }
  return [];
}

export const releases: Release[] = loadReleases();

export function releaseForArticle(slug: string): Release | undefined {
  return releases.find((r) => r.articleSlug === slug);
}

export function glasshouseReleases(): Release[] {
  return releases;
}

export function youtubeWatchUrl(idOrUrl: string): string {
  if (!idOrUrl) return "";
  if (/^[\w-]{11}$/.test(idOrUrl)) {
    return `https://www.youtube.com/watch?v=${idOrUrl}`;
  }
  return idOrUrl;
}

export function youtubeVideoId(idOrUrl: string): string {
  if (!idOrUrl) return "";
  if (/^[\w-]{11}$/.test(idOrUrl)) return idOrUrl;
  try {
    const u = new URL(idOrUrl);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
    return u.searchParams.get("v") || idOrUrl;
  } catch {
    return idOrUrl;
  }
}

export function youtubeThumb(idOrUrl: string): string {
  const id = youtubeVideoId(idOrUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function releaseThumb(r: Release): string | null {
  const vid = r.shortVideo || r.longVideo || r.podcast;
  if (!vid) return r.coverImage || null;
  // coverImage for blog art; prefer video thumb for play tiles
  const t = youtubeThumb(vid);
  return t || r.coverImage || null;
}

/** Normalize podcast field: YouTube id → watch URL for outbound links */
export function podcastHref(r: Release): string | undefined {
  if (!r.podcast) return undefined;
  const p = r.podcast;
  if (p.startsWith("http")) return p;
  if (/^[\w-]{11}$/.test(p)) return youtubeWatchUrl(p);
  return p;
}
