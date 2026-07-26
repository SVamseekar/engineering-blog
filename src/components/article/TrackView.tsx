"use client";

import { useEffect } from "react";
import { readerStorage } from "@/components/reader/storage";

export function TrackView({
  slug,
  title,
  seriesId,
}: {
  slug: string;
  title: string;
  seriesId?: string;
}) {
  useEffect(() => {
    readerStorage.pushRecent(slug, title);
    if (seriesId) {
      // mark complete when viewed end via progress elsewhere; soft-mark on open
    }
  }, [slug, title, seriesId]);
  return null;
}
