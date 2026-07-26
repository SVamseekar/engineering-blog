/** Local-first reader storage with sync-ready boundary */

const PREFIX = "eng-blog:";

export type BookmarksStore = string[];
export type ProgressStore = Record<string, number>; // slug → 0..1
export type RecentStore = { slug: string; title: string; at: number }[];
export type SeriesProgressStore = Record<string, string[]>; // seriesId → completed slugs

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export const readerStorage = {
  getBookmarks: () => read<BookmarksStore>("bookmarks", []),
  setBookmarks: (v: BookmarksStore) => write("bookmarks", v),
  toggleBookmark(slug: string) {
    const cur = this.getBookmarks();
    const next = cur.includes(slug)
      ? cur.filter((s) => s !== slug)
      : [...cur, slug];
    this.setBookmarks(next);
    return next;
  },
  getProgress: () => read<ProgressStore>("progress", {}),
  setProgress(slug: string, ratio: number) {
    const cur = this.getProgress();
    cur[slug] = Math.min(1, Math.max(0, ratio));
    write("progress", cur);
  },
  getRecent: () => read<RecentStore>("recent", []),
  pushRecent(slug: string, title: string) {
    const cur = this.getRecent().filter((r) => r.slug !== slug);
    cur.unshift({ slug, title, at: Date.now() });
    write("recent", cur.slice(0, 12));
  },
  getSeriesProgress: () => read<SeriesProgressStore>("series-progress", {}),
  markSeriesComplete(seriesId: string, slug: string) {
    const cur = this.getSeriesProgress();
    const set = new Set(cur[seriesId] || []);
    set.add(slug);
    cur[seriesId] = [...set];
    write("series-progress", cur);
  },
  getTheme: () =>
    read<"light" | "dark" | "system">("theme", "system"),
  setTheme(t: "light" | "dark" | "system") {
    write("theme", t);
  },
  getRecentSearches: () => read<string[]>("recent-searches", []),
  pushSearch(q: string) {
    const cur = this.getRecentSearches().filter((s) => s !== q);
    cur.unshift(q);
    write("recent-searches", cur.slice(0, 8));
  },
};

/** Future account sync boundary — no-op for now */
export interface ReaderSyncAdapter {
  pull(): Promise<void>;
  push(): Promise<void>;
}

export const noopSync: ReaderSyncAdapter = {
  async pull() {},
  async push() {},
};
