"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;

  const list = (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        On this page
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(item.level === 3 && "pl-3")}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-[var(--muted)] transition-colors hover:text-[var(--fg)]",
                active === item.id && "font-medium text-[var(--accent)]"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="mb-8 lg:hidden">
        <button
          type="button"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-left text-sm font-medium"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Hide contents" : "Show contents"}
        </button>
        {open ? <div className="mt-3">{list}</div> : null}
      </div>
      <div className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
        {list}
      </div>
    </>
  );
}
