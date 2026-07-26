import Link from "next/link";
import { getAllCategories } from "@/lib/content/load";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  const items = getAllCategories();
  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Categories</h1>
      <ul className="mt-8 flex flex-wrap gap-3">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/categories/${encodeURIComponent(c.slug)}`}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--accent)]"
            >
              {c.slug} ({c.count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
