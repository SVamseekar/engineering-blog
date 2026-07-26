import Link from "next/link";
import { loadSeriesDefs, getSeriesPosts } from "@/lib/content/load";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Series",
  description: "Long-form engineering series with recommended reading order.",
};

export default function SeriesIndexPage() {
  const series = loadSeriesDefs();

  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Series</h1>
      <p className="mt-2 text-[var(--muted)]">
        Ordered deep dives across product lines and systems topics.
      </p>
      {series.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No series defined"
          description="Series definitions live in content/series/."
        />
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {series.map((s) => {
            const count = getSeriesPosts(s.id).length;
            return (
              <li key={s.id}>
                <Link
                  href={`/series/${s.id}`}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--accent)]"
                >
                  <h2 className="font-display text-xl">{s.title}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {s.description}
                  </p>
                  <p className="mt-4 text-xs text-[var(--accent)]">
                    {count} articles
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
