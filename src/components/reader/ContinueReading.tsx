"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readerStorage } from "./storage";

export function ContinueReading() {
  const [items, setItems] = useState<
    { slug: string; title: string; progress?: number }[]
  >([]);

  useEffect(() => {
    const recent = readerStorage.getRecent().slice(0, 3);
    const progress = readerStorage.getProgress();
    setItems(
      recent.map((r) => ({
        slug: r.slug,
        title: r.title,
        progress: progress[r.slug],
      }))
    );
  }, []);

  if (!items.length) return null;

  return (
    <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Continue reading
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((i) => (
          <li key={i.slug}>
            <Link
              href={`/${i.slug}`}
              className="text-sm text-[var(--fg)] hover:text-[var(--accent)]"
            >
              {i.title}
              {i.progress && i.progress < 0.95 ? (
                <span className="ml-2 text-xs text-[var(--muted)]">
                  {Math.round(i.progress * 100)}%
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
