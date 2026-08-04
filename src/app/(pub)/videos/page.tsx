import type { Metadata } from "next";
import Link from "next/link";
import { author, site } from "@/data/author";
import { releases } from "@/data/releases";
import { ReleaseTile } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: `Releases · ${author.youtubeChannelName}`,
  description: `Shorts, podcasts, and written notes from ${author.youtubeChannelName} — each idea in three formats.`,
  openGraph: {
    title: `${author.youtubeChannelName} releases`,
    description:
      "One idea · short video · podcast · blog post. Engineering and policy deep dives.",
    url: `${site.url}/videos`,
  },
};

export default function VideosPage() {
  return (
    <div className="section-pad">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Content system
        </p>
        <h1 className="mt-2 font-display text-display text-[var(--fg)]">
          Short · Podcast · Note
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Every release from{" "}
          <strong className="font-medium text-[var(--fg)]">
            {author.youtubeChannelName}
          </strong>{" "}
          is meant to land in three places: a short for the feed, a podcast for
          deep listen, and a written field note on this site.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={author.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            YouTube channel
          </a>
          <Link href="/articles" className="btn-secondary">
            All articles
          </Link>
        </div>
      </header>

      {releases.length ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r) => (
            <li key={r.id}>
              <ReleaseTile release={r} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-[var(--muted)]">
          Releases will appear here. Add them in{" "}
          <code className="text-sm">src/data/releases.ts</code>.
        </p>
      )}
    </div>
  );
}
