import type { Metadata } from "next";
import Link from "next/link";
import { author, site } from "@/data/author";
import { channelVideos } from "@/data/videos";
import { VideoTile } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: `Videos · ${author.youtubeChannelName}`,
  description: `Episodes from ${author.youtubeChannelName} — companion deep dives to ${site.name}.`,
  openGraph: {
    title: `${author.youtubeChannelName} on ${site.name}`,
    description: `Watch engineering and policy deep dives, then read the companion notes.`,
    url: `${site.url}/videos`,
  },
};

export default function VideosPage() {
  return (
    <div className="section-pad">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          YouTube
        </p>
        <h1 className="mt-2 font-display text-display text-[var(--fg)]">
          {author.youtubeChannelName}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Engineering and policy deep dives that bridge legal mandates with
          production software. Companion writing lives on this site when a note
          ships alongside an episode.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={author.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Open YouTube channel
          </a>
          <Link href="/articles" className="btn-secondary">
            Engineering articles
          </Link>
        </div>
      </header>

      {channelVideos.length ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {channelVideos.map((v) => (
            <li key={v.id}>
              <VideoTile video={v} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-[var(--muted)]">
          Episodes will appear here. Add them in{" "}
          <code className="text-sm">src/data/videos.ts</code>.
        </p>
      )}
    </div>
  );
}
