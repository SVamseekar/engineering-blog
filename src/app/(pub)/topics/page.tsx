import Link from "next/link";
import { getAllTopics } from "@/lib/content/load";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Topics" };

export default function TopicsPage() {
  const items = getAllTopics();
  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Topics</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {items.map((t) => (
          <Link
            key={t.slug}
            href={`/topics/${encodeURIComponent(t.slug)}`}
            className="rounded-md bg-[var(--muted-bg)] px-3 py-1.5 text-sm hover:text-[var(--accent)]"
          >
            #{t.slug} ({t.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
