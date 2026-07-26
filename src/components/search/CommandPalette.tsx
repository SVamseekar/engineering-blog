"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { SearchDoc } from "@/lib/search/index";
import { readerStorage } from "@/components/reader/storage";
import { cn } from "@/lib/utils";

function fuzzyScore(q: string, text: string): number {
  const a = q.toLowerCase();
  const b = text.toLowerCase();
  if (!a) return 0;
  if (b.includes(a)) return 100 - b.indexOf(a);
  let i = 0;
  for (const ch of b) {
    if (ch === a[i]) i++;
    if (i === a.length) return 40;
  }
  return 0;
}

export function CommandPalette({ docs }: { docs: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [facet, setFacet] = useState<{
    tags: string[];
    technologies: string[];
    projects: string[];
    categories: string[];
  }>({ tags: [], technologies: [], projects: [], categories: [] });
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setRecent(readerStorage.getRecentSearches());
  }, [open]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.trim();
    let list = docs
      .map((d) => ({
        d,
        s:
          fuzzyScore(term, d.title) * 3 +
          fuzzyScore(term, d.description) * 2 +
          fuzzyScore(term, d.body) +
          fuzzyScore(term, d.tags.join(" ")),
      }))
      .filter((x) => (term ? x.s > 0 : true))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.d);

    if (facet.tags.length)
      list = list.filter((d) => facet.tags.some((t) => d.tags.includes(t)));
    if (facet.technologies.length)
      list = list.filter((d) =>
        facet.technologies.some((t) => d.technologies.includes(t))
      );
    if (facet.projects.length)
      list = list.filter((d) =>
        facet.projects.some((t) => d.projects.includes(t))
      );
    if (facet.categories.length)
      list = list.filter((d) =>
        facet.categories.some((t) => d.categories.includes(t))
      );

    return list.slice(0, 12);
  }, [docs, q, facet]);

  const go = useCallback(
    (slug: string) => {
      if (q.trim()) readerStorage.pushSearch(q.trim());
      setOpen(false);
      router.push(`/${slug}`);
    },
    [q, router]
  );

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor].slug);
    }
  }

  const allTags = useMemo(
    () => [...new Set(docs.flatMap((d) => d.tags))].slice(0, 20),
    [docs]
  );
  const allTech = useMemo(
    () => [...new Set(docs.flatMap((d) => d.technologies))].slice(0, 20),
    [docs]
  );
  const allProjects = useMemo(
    () => [...new Set(docs.flatMap((d) => d.projects))],
    [docs]
  );
  const allCats = useMemo(
    () => [...new Set(docs.flatMap((d) => d.categories))],
    [docs]
  );

  function toggleFacet(
    key: keyof typeof facet,
    value: string
  ) {
    setFacet((f) => {
      const set = new Set(f[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, [key]: [...set] };
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--muted)] shadow-[var(--shadow-sm)] hover:text-[var(--fg)]"
        aria-label="Search (Command K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search articles, tags, technologies…"
                className="h-12 w-full bg-transparent text-[var(--fg)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>

            {(allTags.length || allTech.length || allProjects.length) && (
              <div className="flex flex-wrap gap-1.5 border-b border-[var(--border)] px-4 py-2">
                {allProjects.map((p) => (
                  <FacetChip
                    key={p}
                    label={p}
                    active={facet.projects.includes(p)}
                    onClick={() => toggleFacet("projects", p)}
                  />
                ))}
                {allCats.map((c) => (
                  <FacetChip
                    key={c}
                    label={c}
                    active={facet.categories.includes(c)}
                    onClick={() => toggleFacet("categories", c)}
                  />
                ))}
                {allTech.slice(0, 6).map((t) => (
                  <FacetChip
                    key={t}
                    label={t}
                    active={facet.technologies.includes(t)}
                    onClick={() => toggleFacet("technologies", t)}
                  />
                ))}
                {allTags.slice(0, 6).map((t) => (
                  <FacetChip
                    key={t}
                    label={`#${t}`}
                    active={facet.tags.includes(t)}
                    onClick={() => toggleFacet("tags", t)}
                  />
                ))}
              </div>
            )}

            <ul className="max-h-80 overflow-y-auto py-2">
              {!q && recent.length ? (
                <li className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Recent searches
                </li>
              ) : null}
              {!q &&
                recent.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                      onClick={() => setQ(r)}
                    >
                      {r}
                    </button>
                  </li>
                ))}
              {results.map((r, i) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-[var(--muted-bg)]",
                      i === cursor && "bg-[var(--muted-bg)]"
                    )}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(r.slug)}
                  >
                    <span className="block font-medium text-[var(--fg)]">
                      {r.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-[var(--muted)]">
                      {r.description}
                    </span>
                  </button>
                </li>
              ))}
              {q && !results.length ? (
                <li className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                  No matches
                </li>
              ) : null}
            </ul>
            <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">
              <a href="/search" className="hover:text-[var(--fg)]">
                Open full search →
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FacetChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px]",
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
          : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
      )}
    >
      {label}
    </button>
  );
}
