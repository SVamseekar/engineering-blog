"use client";

import { useEffect, useState } from "react";
import { readerStorage } from "@/components/reader/storage";

export function SeriesProgressClient({
  seriesId,
  slugs,
}: {
  seriesId: string;
  slugs: string[];
}) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const all = readerStorage.getSeriesProgress();
    setDone(all[seriesId] || []);
  }, [seriesId]);

  const pct = slugs.length
    ? Math.round((done.filter((s) => slugs.includes(s)).length / slugs.length) * 100)
    : 0;

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">Your progress (local)</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted-bg)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Marked complete when you finish articles in this series (localStorage;
        sync-ready boundary).
      </p>
    </div>
  );
}
