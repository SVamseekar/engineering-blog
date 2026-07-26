import { notFound } from "next/navigation";
import {
  getAllCategories,
  getPostsByCategory,
} from "@/lib/content/load";
import { ArticleCard } from "@/components/home/HomeSections";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Category: ${decodeURIComponent(slug)}` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const posts = getPostsByCategory(name);
  if (!posts.length) notFound();

  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Category: {name}</h1>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <ArticleCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
