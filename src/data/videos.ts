/**
 * Featured YouTube videos for homepage tiles + /videos.
 * Add new episodes here (id = 11-char YouTube video id or full URL).
 * Optional articleSlug links the tile to a companion blog post.
 */
export type ChannelVideo = {
  /** YouTube video id (preferred) or full watch URL */
  id: string;
  title: string;
  description?: string;
  /** Companion article on this blog */
  articleSlug?: string;
  /** ISO date for sorting/display */
  publishedAt?: string;
  /** Tag line e.g. "Debut episode" */
  badge?: string;
};

export const channelVideos: ChannelVideo[] = [
  {
    id: "IexegJZcKmI",
    title: "Uncapped Liability: The Math & Law Behind EU Pay Transparency",
    description:
      "Debut episode of The Compliance Glasshouse — is your pay software a compliance tool or audit evidence?",
    publishedAt: "2026-07-01",
    badge: "Debut",
    // When you ship the companion article, set:
    // articleSlug: "uncapped-liability-eu-pay-transparency",
  },
];

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
