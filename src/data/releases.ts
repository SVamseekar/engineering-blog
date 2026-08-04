/**
 * Content OS release unit — always three surfaces for one idea:
 *
 *   1. Short video  (YouTube Short / vertical clip)
 *   2. Podcast      (long audio — Spotify, Apple, RSS, YouTube long-form, etc.)
 *   3. Blog post    (canonical written note on this site)
 *
 * Add a row here when any leg ships; fill the rest as they go live.
 * articleSlug must match frontmatter `slug` on the blog post.
 */
export type Release = {
  /** Stable id for keys (kebab-case) */
  id: string;
  title: string;
  description?: string;
  /** ISO date of the release cluster */
  publishedAt?: string;
  badge?: string;
  /** Product line key e.g. workforceguard, eu-ai-assurance */
  project?: string;

  /** YouTube Short id or full URL */
  shortVideo?: string;
  /** Podcast episode URL (Spotify / Apple / RSS / YouTube full episode) */
  podcast?: string;
  /** Optional label for podcast platform */
  podcastLabel?: string;
  /** Optional long-form video (not the short) if podcast is audio-only */
  longVideo?: string;

  /** Companion article slug on this blog */
  articleSlug?: string;
};

/**
 * Newest first. Example debut — fill short + podcast URLs when you have them.
 */
export const releases: Release[] = [
  {
    id: "uncapped-liability-eu-pay-transparency",
    title: "Uncapped Liability: The Math & Law Behind EU Pay Transparency",
    description:
      "Debut of The Compliance Glasshouse — is your pay software a compliance tool or audit evidence?",
    publishedAt: "2026-07-01",
    badge: "Debut",
    project: "workforceguard",
    // shortVideo: "XXXXXXXXXXX",
    // podcast: "https://open.spotify.com/episode/...",
    // podcastLabel: "Spotify",
    longVideo: "IexegJZcKmI",
    // articleSlug: "uncapped-liability-eu-pay-transparency",
  },
];

export function releaseForArticle(slug: string): Release | undefined {
  return releases.find((r) => r.articleSlug === slug);
}

export function youtubeWatchUrl(idOrUrl: string): string {
  if (/^[\w-]{11}$/.test(idOrUrl)) {
    return `https://www.youtube.com/watch?v=${idOrUrl}`;
  }
  return idOrUrl;
}

export function youtubeVideoId(idOrUrl: string): string {
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
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Best thumbnail for a release card */
export function releaseThumb(r: Release): string | null {
  const vid = r.shortVideo || r.longVideo;
  return vid ? youtubeThumb(vid) : null;
}
