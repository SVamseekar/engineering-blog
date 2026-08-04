import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { PostMeta } from "@/lib/content/schema";
import type { SeriesDef } from "@/lib/content/schema";
import { projects } from "@/data/projects";
import { author } from "@/data/author";
import {
  channelVideos,
  type ChannelVideo,
  youtubeThumb,
  youtubeVideoId,
  youtubeWatchUrl,
} from "@/data/videos";
import { formatDate } from "@/lib/utils";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ContinueReading } from "@/components/reader/ContinueReading";
import { FadeIn } from "@/components/home/Motion";

export function Hero() {
  return (
    <section className="section-pad">
      <FadeIn>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Engineering publication
        </p>
        <h1 className="font-display text-display max-w-3xl text-[var(--fg)]">
          Systems that earn their keep in production
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Field notes on restaurant ops, EU AI assurance, workforce compliance,
          transit safety, and commercial analytics — wired to real products, not
          tutorial demos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles" className="btn-primary">
            Latest articles
          </Link>
          <Link href="/videos" className="btn-secondary">
            Channel videos
          </Link>
          <a
            href={author.youtube}
            className="btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            {author.youtubeChannelName}
          </a>
          <a href="#newsletter" className="btn-ghost">
            Subscribe
          </a>
        </div>
        <ContinueReading />
      </FadeIn>
    </section>
  );
}

export function FeaturedArticle({ post }: { post: PostMeta | null }) {
  if (!post) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <SectionLabel>Latest featured</SectionLabel>
      <Link
        href={`/${post.slug}`}
        className="group mt-4 grid gap-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] transition hover:shadow-[var(--shadow-lg)] md:grid-cols-2"
      >
        {post.coverImage ? (
          <div className="relative min-h-[220px] bg-[var(--muted-bg)]">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="min-h-[220px] bg-gradient-to-br from-[var(--accent)]/20 to-[var(--muted-bg)]" />
        )}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {post.projects[0] || "general"} · {formatDate(post.publishedAt)}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] md:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 text-[var(--muted)]">{post.description}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {post.readingTimeMinutes} min read
          </p>
        </div>
      </Link>
    </section>
  );
}

export function EditorsPicks({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <SectionLabel>Editor&apos;s picks</SectionLabel>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <ArticleCard post={p} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LatestArticles({ posts }: { posts: PostMeta[] }) {
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <div className="flex items-end justify-between gap-4">
        <SectionLabel>Latest articles</SectionLabel>
        <Link
          href="/articles"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          View all →
        </Link>
      </div>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <ArticleCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** YouTube tiles — thumbnail + play affordance, links to video / companion article */
export function ChannelVideosSection({
  videos = channelVideos,
}: {
  videos?: ChannelVideo[];
}) {
  if (!videos.length) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>From the channel</SectionLabel>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
            {author.youtubeChannelName} — engineering and policy deep dives that
            pair with these notes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/videos" className="text-[var(--muted)] hover:text-[var(--accent)]">
            All videos →
          </Link>
          <a
            href={author.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)]"
          >
            YouTube channel ↗
          </a>
        </div>
      </div>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.slice(0, 6).map((v) => (
          <li key={youtubeVideoId(v.id)}>
            <VideoTile video={v} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function VideoTile({ video }: { video: ChannelVideo }) {
  const id = youtubeVideoId(video.id);
  const watch = youtubeWatchUrl(video.id);
  const thumb = youtubeThumb(video.id);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]">
      <a
        href={watch}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-black"
        aria-label={`Watch ${video.title} on YouTube`}
      >
        <Image
          src={thumb}
          alt=""
          fill
          className="object-cover opacity-90 transition group-hover:opacity-100 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shadow-lg">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
        {video.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {video.badge}
          </span>
        ) : null}
      </a>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          {author.youtubeChannelName}
          {video.publishedAt ? ` · ${formatDate(video.publishedAt)}` : ""}
        </p>
        <h3 className="mt-1 font-display text-base leading-snug text-[var(--fg)]">
          <a
            href={watch}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)]"
          >
            {video.title}
          </a>
        </h3>
        {video.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
            {video.description}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-3 pt-4 text-xs">
          <a
            href={watch}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Watch on YouTube
          </a>
          {video.articleSlug ? (
            <Link
              href={`/${video.articleSlug}`}
              className="text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Read companion note →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PopularSeries({
  series,
  counts,
}: {
  series: SeriesDef[];
  counts: Record<string, number>;
}) {
  if (!series.length) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <SectionLabel>Popular series</SectionLabel>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => (
          <li key={s.id}>
            <Link
              href={`/series/${s.id}`}
              className="block h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
            >
              <h3 className="font-display text-lg text-[var(--fg)]">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {s.description}
              </p>
              <p className="mt-4 text-xs text-[var(--accent)]">
                {counts[s.id] || 0} articles · track progress
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CategoriesSection({
  items,
}: {
  items: { slug: string; count: number }[];
}) {
  if (!items.length) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <SectionLabel>Categories</SectionLabel>
      <ul className="mt-6 flex flex-wrap gap-3">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/categories/${encodeURIComponent(c.slug)}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm hover:border-[var(--accent)]"
            >
              {c.slug}
              <span className="text-[var(--muted)]">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TopicsSection({
  items,
}: {
  items: { slug: string; count: number }[];
}) {
  if (!items.length) return null;
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <SectionLabel>Topics</SectionLabel>
      <div className="mt-6 flex flex-wrap gap-2">
        {items.map((t) => (
          <Link
            key={t.slug}
            href={`/topics/${encodeURIComponent(t.slug)}`}
            className="rounded-md bg-[var(--muted-bg)] px-3 py-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
            style={{ fontSize: `${Math.min(1.25, 0.85 + t.count * 0.08)}rem` }}
          >
            #{t.slug}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section
      id="newsletter"
      className="section-pad border-t border-[var(--border)]"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)] md:p-10">
        <SectionLabel>Newsletter</SectionLabel>
        <h2 className="mt-2 font-display text-2xl text-[var(--fg)]">
          Domain systems in your inbox
        </h2>
        <p className="mt-2 max-w-lg text-[var(--muted)]">
          Occasional notes when something ships worth reading. No spam, no
          growth hacks.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section className="section-pad border-t border-[var(--border)]">
      <div className="flex items-end justify-between">
        <SectionLabel>Projects</SectionLabel>
        <Link
          href="/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          Project hub →
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="block h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:shadow-[var(--shadow-md)]"
              style={{ borderTopColor: p.color, borderTopWidth: 3 }}
            >
              <h3 className="font-medium text-[var(--fg)]">{p.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{p.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
      {children}
    </h2>
  );
}

export function ArticleCard({
  post,
  compact,
}: {
  post: PostMeta;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
        {(post.projects[0] || "general") + " · " + formatDate(post.publishedAt)}
      </p>
      <h3
        className={
          compact
            ? "mt-2 font-display text-base leading-snug text-[var(--fg)] group-hover:text-[var(--accent)]"
            : "mt-2 font-display text-lg leading-snug text-[var(--fg)] group-hover:text-[var(--accent)]"
        }
      >
        {post.title}
      </h3>
      {!compact ? (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--muted)]">
          {post.description}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-[var(--muted)]">
        {post.readingTimeMinutes} min
      </p>
    </Link>
  );
}
