"use client";

import { useEffect, useState } from "react";
import { readerStorage } from "@/components/reader/storage";

export function ScrollProgress({
  slug,
  seriesId,
}: {
  slug: string;
  seriesId?: string;
}) {
  const [p, setP] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const ratio = max > 0 ? el.scrollTop / max : 0;
      setP(ratio);
      readerStorage.setProgress(slug, ratio);
      if (ratio > 0.9 && seriesId) {
        readerStorage.markSeriesComplete(seriesId, slug);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, seriesId]);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-0.5 bg-[var(--accent)] transition-[width] duration-75"
      style={{ width: `${p * 100}%` }}
      role="progressbar"
      aria-valuenow={Math.round(p * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}
