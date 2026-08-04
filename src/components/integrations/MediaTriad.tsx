import type { ReactNode } from "react";
import Link from "next/link";
import { Headphones, FileText, Clapperboard, Play } from "lucide-react";
import { YouTubeFacade } from "@/components/integrations/YouTubeFacade";
import type { Release } from "@/data/releases";
import { youtubeWatchUrl, youtubeVideoId } from "@/data/releases";

type MediaTriadProps = {
  /** From post frontmatter and/or releases catalog */
  shortVideo?: string;
  podcast?: string;
  podcastLabel?: string;
  longVideo?: string;
  /** Extra youtube ids from frontmatter */
  youtube?: string[];
  title?: string;
};

/**
 * Shows the three legs of a release: Short · Podcast · (blog is the page itself).
 * Embeds short/long video; podcast is a strong outbound CTA.
 */
export function MediaTriad({
  shortVideo,
  podcast,
  podcastLabel = "Podcast",
  longVideo,
  youtube = [],
  title,
}: MediaTriadProps) {
  // Podcast may be a YouTube id (common for Glasshouse) or Spotify/Apple URL
  const podcastIsYt =
    Boolean(podcast) &&
    (/^[\w-]{11}$/.test(podcast!) ||
      (podcast!.includes("youtu") && Boolean(youtubeVideoId(podcast!))));
  const podcastYtId = podcastIsYt
    ? /^[\w-]{11}$/.test(podcast!)
      ? podcast!
      : youtubeVideoId(podcast!)
    : null;
  const podcastLink =
    podcast &&
    (podcast.startsWith("http")
      ? podcast
      : podcastIsYt
        ? youtubeWatchUrl(podcastYtId || podcast)
        : podcast);

  const longIds = [
    ...(longVideo ? [longVideo] : []),
    ...youtube.filter(
      (y) =>
        y &&
        y !== shortVideo &&
        y !== longVideo &&
        y !== podcast &&
        y !== podcastYtId
    ),
  ];
  // If podcast is YouTube and no separate longVideo, embed it as podcast episode
  if (podcastYtId && !longIds.includes(podcastYtId) && podcastYtId !== shortVideo) {
    // shown under podcast embed section below
  }

  const hasAny = shortVideo || podcast || longIds.length > 0;
  if (!hasAny) return null;

  return (
    <section
      className="my-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
      aria-label="Watch, listen, read"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        The Compliance Glasshouse
      </p>
      <h2 className="mt-1 font-display text-xl text-[var(--fg)]">
        Short · Podcast · Written note
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Same idea in three formats — pick the surface that fits.
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        <Leg
          icon={<Clapperboard className="h-4 w-4" />}
          label="Short"
          status={shortVideo ? "ready" : "soon"}
          href={shortVideo ? youtubeWatchUrl(shortVideo) : undefined}
          external
        >
          {shortVideo ? "Watch the short" : "Short coming soon"}
        </Leg>
        <Leg
          icon={<Headphones className="h-4 w-4" />}
          label={podcastLabel}
          status={podcast ? "ready" : "soon"}
          href={podcastLink || undefined}
          external
        >
          {podcast ? `Open ${podcastLabel}` : "Podcast coming soon"}
        </Leg>
        <Leg
          icon={<FileText className="h-4 w-4" />}
          label="Blog"
          status="here"
        >
          You&apos;re reading the note
        </Leg>
      </ul>

      {shortVideo ? (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">Short</p>
          <YouTubeFacade id={shortVideo} title={title ? `${title} (short)` : "Short"} />
        </div>
      ) : null}

      {podcastYtId ? (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">
            Podcast episode
          </p>
          <YouTubeFacade
            id={podcastYtId}
            title={title ? `${title} (podcast)` : "Podcast"}
          />
        </div>
      ) : null}

      {longIds
        .filter((id) => id !== podcastYtId)
        .map((id) => (
          <div key={id} className="mt-6">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">
              Full episode / video
            </p>
            <YouTubeFacade id={id} title={title} />
          </div>
        ))}
    </section>
  );
}

function Leg({
  icon,
  label,
  status,
  href,
  external,
  children,
}: {
  icon: ReactNode;
  label: string;
  status: "ready" | "soon" | "here";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const base =
    "flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition";
  const ready = status === "ready";
  const className = `${base} ${ready ? "hover:border-[var(--accent)]" : "opacity-80"}`;

  const inner = (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {icon}
        {label}
        {status === "here" ? (
          <span className="ml-auto rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] text-[var(--accent)]">
            Here
          </span>
        ) : status === "soon" ? (
          <span className="ml-auto text-[10px] text-[var(--muted)]">Soon</span>
        ) : (
          <Play className="ml-auto h-3.5 w-3.5 text-[var(--accent)]" />
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-[var(--fg)]">{children}</p>
    </>
  );

  if (href && external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {inner}
        </a>
      </li>
    );
  }
  if (href) {
    return (
      <li>
        <Link href={href} className={className}>
          {inner}
        </Link>
      </li>
    );
  }
  return <li className={className}>{inner}</li>;
}

/** Merge frontmatter media with catalog release for one article */
export function mediaFromPostAndRelease(
  post: {
    youtubeShort?: string;
    podcast?: string;
    podcastLabel?: string;
    youtube?: string[];
    title?: string;
  },
  release?: Release
): MediaTriadProps {
  return {
    shortVideo: post.youtubeShort || release?.shortVideo || undefined,
    podcast: post.podcast || release?.podcast || undefined,
    podcastLabel:
      post.podcastLabel || release?.podcastLabel || "Podcast" || undefined,
    longVideo: release?.longVideo || undefined,
    youtube: post.youtube,
    title: post.title || release?.title,
  };
}
