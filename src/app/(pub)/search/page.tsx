import { getAllPostMeta, loadAllPosts } from "@/lib/content/load";
import { postsToSearchDocs } from "@/lib/search/index";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Full-text search across engineering articles.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = loadAllPosts();
  const docs = postsToSearchDocs(posts);
  // ensure meta-only posts still searchable if content empty
  if (!docs.length) {
    postsToSearchDocs(getAllPostMeta());
  }

  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Search</h1>
      <p className="mt-2 text-[var(--muted)]">
        Full-text with facets. Press ⌘K anywhere for the command palette.
      </p>
      <div className="mt-8">
        <SearchPageClient docs={docs} initialQ={q || ""} />
      </div>
    </div>
  );
}
