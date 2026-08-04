import type { Metadata } from "next";
import Link from "next/link";
import { author, site } from "@/data/author";
import { releases } from "@/data/releases";
import { ReleaseTile } from "@/components/home/HomeSections";
import { getSeriesPosts, getSeriesById } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "The Compliance Glasshouse",
  description:
    "Engineering and policy deep dives — each idea as a short, a podcast, and a written field note.",
  openGraph: {
    title: "The Compliance Glasshouse",
    description:
      "Short · podcast · blog. Bridging legal mandates with production software.",
    url: `${site.url}/glasshouse`,
  },
};

export default function GlasshousePage() {
  const series = getSeriesById("compliance-glasshouse");
  const seriesPosts = getSeriesPosts("compliance-glasshouse");

  return (
    <div className="section-pad">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Channel + publication
        </p>
        <h1 className="mt-2 font-display text-display text-[var(--fg)]">
          The Compliance Glasshouse
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Engineering and policy deep dives that bridge complex legal mandates
          with production-grade architecture. Every release is meant to land in{" "}
          <strong className="font-medium text-[var(--fg)]">three formats</strong>
          : a short for the feed, a podcast for deep listen, and a written note
          on this site.
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
          <Link href="/series/compliance-glasshouse" className="btn-secondary">
            Written series
          </Link>
          <Link href="/videos" className="btn-ghost">
            All releases
          </Link>
        </div>
      </header>

      <section className="mt-14">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Releases
        </h2>
        {releases.length ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((r) => (
              <li key={r.id}>
                <ReleaseTile release={r} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[var(--muted)]">No releases yet.</p>
        )}
      </section>

      {seriesPosts.length > 0 ? (
        <section className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Field notes in this series
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {series?.description}
          </p>
          <ul className="mt-6 space-y-3">
            {seriesPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--accent)]"
                >
                  <span className="font-medium text-[var(--fg)]">{p.title}</span>
                  {p.description ? (
                    <span className="mt-1 block text-sm text-[var(--muted)]">
                      {p.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
