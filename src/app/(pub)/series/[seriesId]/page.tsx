import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSeriesById,
  getSeriesPosts,
  loadSeriesDefs,
} from "@/lib/content/load";
import { formatDate } from "@/lib/utils";
import { SeriesProgressClient } from "@/components/series/SeriesProgressClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ seriesId: string }>;
}

export async function generateStaticParams() {
  return loadSeriesDefs().map((s) => ({ seriesId: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesId } = await params;
  const s = getSeriesById(seriesId);
  if (!s) return {};
  return { title: s.title, description: s.description };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { seriesId } = await params;
  const series = getSeriesById(seriesId);
  if (!series) notFound();
  const posts = getSeriesPosts(seriesId);

  return (
    <div className="py-10">
      <Link href="/series" className="text-sm text-[var(--muted)]">
        ← All series
      </Link>
      <h1 className="mt-4 font-display text-3xl">{series.title}</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{series.description}</p>
      {series.audience ? (
        <p className="mt-2 text-sm text-[var(--muted)]">
          <strong className="text-[var(--fg)]">Audience:</strong>{" "}
          {series.audience}
        </p>
      ) : null}
      {series.prerequisites ? (
        <p className="mt-1 text-sm text-[var(--muted)]">
          <strong className="text-[var(--fg)]">Prerequisites:</strong>{" "}
          {series.prerequisites}
        </p>
      ) : null}

      <SeriesProgressClient
        seriesId={series.id}
        slugs={posts.map((p) => p.slug)}
      />

      <ol className="mt-8 space-y-3">
        {posts.map((p, i) => (
          <li
            key={p.slug}
            className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--muted-bg)] text-sm font-medium">
              {p.series?.order ?? i + 1}
            </span>
            <div>
              <Link
                href={`/${p.slug}`}
                className="font-medium text-[var(--fg)] hover:text-[var(--accent)]"
              >
                {p.title}
              </Link>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatDate(p.publishedAt)} · {p.readingTimeMinutes} min
              </p>
            </div>
          </li>
        ))}
      </ol>

      {series.coverImage ? (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Shared diagrams
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={series.coverImage}
            alt=""
            className="mt-4 max-w-full rounded-xl border border-[var(--border)]"
          />
        </div>
      ) : null}
    </div>
  );
}
