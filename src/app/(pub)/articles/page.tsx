import Link from "next/link";
import { getAllPostMeta } from "@/lib/content/load";
import { ArticleCard } from "@/components/home/HomeSections";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "All published engineering articles, newest first.",
};

export default function ArticlesPage() {
  const posts = getAllPostMeta();

  return (
    <div className="py-10">
      <h1 className="font-display text-3xl text-[var(--fg)]">Articles</h1>
      <p className="mt-2 text-[var(--muted)]">
        Chronological index of published notes.
      </p>
      {posts.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No articles yet"
          description="Published posts will appear here."
          action={
            <Link href="/" className="btn-secondary">
              Home
            </Link>
          }
        />
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <ArticleCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
