"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchDoc } from "@/lib/search/index";
import { readerStorage } from "@/components/reader/storage";

export function SearchPageClient({
  docs,
  initialQ = "",
}: {
  docs: SearchDoc[];
  initialQ?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [tags, setTags] = useState<string[]>([]);
  const [tech, setTech] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = docs;
    if (term) {
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.body.toLowerCase().includes(term) ||
          d.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (tags.length) list = list.filter((d) => tags.some((t) => d.tags.includes(t)));
    if (tech.length)
      list = list.filter((d) => tech.some((t) => d.technologies.includes(t)));
    if (projects.length)
      list = list.filter((d) => projects.some((t) => d.projects.includes(t)));
    if (categories.length)
      list = list.filter((d) =>
        categories.some((t) => d.categories.includes(t))
      );
    return list;
  }, [docs, q, tags, tech, projects, categories]);

  const facetOpts = useMemo(
    () => ({
      tags: [...new Set(docs.flatMap((d) => d.tags))],
      tech: [...new Set(docs.flatMap((d) => d.technologies))],
      projects: [...new Set(docs.flatMap((d) => d.projects))],
      categories: [...new Set(docs.flatMap((d) => d.categories))],
    }),
    [docs]
  );

  function toggle(list: string[], set: (v: string[]) => void, v: string) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-6 text-sm">
        <FacetGroup
          title="Projects"
          items={facetOpts.projects}
          selected={projects}
          onToggle={(v) => toggle(projects, setProjects, v)}
        />
        <FacetGroup
          title="Categories"
          items={facetOpts.categories}
          selected={categories}
          onToggle={(v) => toggle(categories, setCategories, v)}
        />
        <FacetGroup
          title="Technologies"
          items={facetOpts.tech}
          selected={tech}
          onToggle={(v) => toggle(tech, setTech, v)}
        />
        <FacetGroup
          title="Tags"
          items={facetOpts.tags}
          selected={tags}
          onToggle={(v) => toggle(tags, setTags, v)}
        />
      </aside>
      <div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => {
            if (q.trim()) readerStorage.pushSearch(q.trim());
          }}
          placeholder="Full-text search…"
          className="mb-6 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--fg)] outline-none ring-[var(--accent)] focus:ring-2"
        />
        <p className="mb-4 text-sm text-[var(--muted)]">
          {results.length} result{results.length === 1 ? "" : "s"}
        </p>
        <ul className="divide-y divide-[var(--border)]">
          {results.map((r) => (
            <li key={r.slug} className="py-5">
              <Link
                href={`/${r.slug}`}
                className="text-xl font-medium text-[var(--fg)] hover:text-[var(--accent)]"
              >
                {r.title}
              </Link>
              <p className="mt-1 text-[var(--muted)]">{r.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {r.projects.map((p) => (
                  <span key={p} className="rounded-full bg-[var(--muted-bg)] px-2 py-0.5">
                    {p}
                  </span>
                ))}
                {r.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FacetGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => onToggle(item)}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
