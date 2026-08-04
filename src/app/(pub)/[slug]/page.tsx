import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPostMeta,
  getPostBySlug,
  getSeriesPosts,
  getSiteUrl,
} from "@/lib/content/load";
import { renderMdx } from "@/lib/mdx/render";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils";
import { ScrollProgress } from "@/components/article/ScrollProgress";
import { TrackView } from "@/components/article/TrackView";
import { ArticleCard } from "@/components/home/HomeSections";

const COMPLIANCE_GLASSHOUSE_SERIES = "compliance-glasshouse";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const base = getSiteUrl();
  const url = post.canonical || `${base}/${post.slug}`;
  const image = post.ogImage || post.coverImage;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      images: image
        ? [{ url: image.startsWith("http") ? image : `${base}${image}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image
        ? [image.startsWith("http") ? image : `${base}${image}`]
        : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  // reserved routes handled by more specific segments; still guard common ones
  const reserved = new Set([
    "articles",
    "series",
    "categories",
    "topics",
    "projects",
    "search",
    "desk-site",
    "api",
  ]);
  if (reserved.has(slug)) notFound();

  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Desk pastes often start with `# Title`; the page header already shows it.
  const body = stripLeadingTitleHeading(post.content, post.title);
  const mdx = await renderMdx(body);

  // Related: only other posts in The Compliance Glasshouse series
  const related = getSeriesPosts(COMPLIANCE_GLASSHOUSE_SERIES).filter(
    (p) => p.slug !== post.slug
  );

  return (
    <>
      <ScrollProgress slug={post.slug} seriesId={post.series?.id} />
      <TrackView
        slug={post.slug}
        title={post.title}
        seriesId={post.series?.id}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post)),
        }}
      />

      <article className="py-10">
        <Link
          href="/articles"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← All articles
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <span>{post.projects[0] || "engineering"}</span>
            <span className="text-[var(--muted)]">·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt ? (
              <>
                <span className="text-[var(--muted)]">·</span>
                <span className="normal-case tracking-normal text-[var(--muted)]">
                  Updated {formatDate(post.updatedAt)}
                </span>
              </>
            ) : null}
            <span className="text-[var(--muted)]">·</span>
            <span className="normal-case tracking-normal text-[var(--muted)]">
              {post.readingTimeMinutes} min read
            </span>
          </div>
          <h1 className="mt-3 font-display text-display text-[var(--fg)]">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-4 text-lg text-[var(--muted)]">{post.description}</p>
          ) : null}
          <div className="mt-4 text-sm text-[var(--muted)]">
            <a
              href={post.author.url || "https://souravamseekar.com"}
              className="hover:text-[var(--accent)]"
            >
              {post.author.name}
            </a>
          </div>
        </header>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[2/1] max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 896px"
              priority
            />
          </div>
        ) : null}

        <div className="prose-blog mx-auto mt-10 max-w-3xl">{mdx}</div>

        {related.length ? (
          <section className="mx-auto mt-14 max-w-3xl border-t border-[var(--border)] pt-10 pb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related articles
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              From The Compliance Glasshouse
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <ArticleCard post={p} compact />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}

/** Drop a leading `# Title` that duplicates the article header. */
function stripLeadingTitleHeading(markdown: string, title: string): string {
  const trimmed = markdown.replace(/^\uFEFF?/, "").trimStart();
  const match = trimmed.match(/^#\s+(.+?)\s*\n+/);
  if (!match) return markdown;
  const heading = match[1].trim().replace(/^["']|["']$/g, "");
  if (heading.toLowerCase() !== title.trim().toLowerCase()) return markdown;
  return trimmed.slice(match[0].length);
}
