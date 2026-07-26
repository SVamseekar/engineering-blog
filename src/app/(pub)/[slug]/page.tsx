import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPostMeta,
  getPostBySlug,
  getRelatedPosts,
  getSeriesPosts,
  getSeriesById,
  getSiteUrl,
} from "@/lib/content/load";
import { renderMdx } from "@/lib/mdx/render";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ScrollProgress } from "@/components/article/ScrollProgress";
import { BookmarkButton } from "@/components/article/BookmarkButton";
import { TrackView } from "@/components/article/TrackView";
import { LinkCard } from "@/components/integrations/LinkCard";
import { YouTubeFacade } from "@/components/integrations/YouTubeFacade";
import { getProject } from "@/data/projects";
import { ArticleCard } from "@/components/home/HomeSections";

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
      images: image ? [{ url: image.startsWith("http") ? image : `${base}${image}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image ? [image.startsWith("http") ? image : `${base}${image}`] : undefined,
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

  const mdx = await renderMdx(post.content);
  const related = getRelatedPosts(post, 4);
  const relatedByTech = getAllPostMeta()
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.technologies.some((t) => post.technologies.includes(t))
    )
    .slice(0, 3);

  const seriesDef = post.series ? getSeriesById(post.series.id) : null;
  const seriesPosts = post.series ? getSeriesPosts(post.series.id) : [];
  const seriesIdx = seriesPosts.findIndex((p) => p.slug === post.slug);
  const prev = seriesIdx > 0 ? seriesPosts[seriesIdx - 1] : null;
  const next =
    seriesIdx >= 0 && seriesIdx < seriesPosts.length - 1
      ? seriesPosts[seriesIdx + 1]
      : null;

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

        {seriesDef ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
            <span className="text-[var(--muted)]">Series:</span>
            <Link
              href={`/series/${seriesDef.id}`}
              className="font-medium text-[var(--accent)]"
            >
              {seriesDef.title}
            </Link>
            <span className="text-[var(--muted)]">
              · Part {post.series?.order ?? seriesIdx + 1} of{" "}
              {seriesPosts.length}
            </span>
          </div>
        ) : null}

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
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <a
              href={post.author.url || "https://souravamseekar.com"}
              className="hover:text-[var(--accent)]"
            >
              {post.author.name}
            </a>
            <BookmarkButton slug={post.slug} />
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

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <div className="lg:hidden">
              <TableOfContents items={post.toc} />
            </div>
            <div className="prose-blog">{mdx}</div>
            <div className="mt-10 space-y-2">
              {post.github?.map((url) => (
                <LinkCard
                  key={url}
                  href={url}
                  title="GitHub repository"
                  description={url}
                  kind="github"
                />
              ))}
              {post.demo ? (
                <LinkCard href={post.demo} title="Live demo" kind="demo" />
              ) : null}
              {post.docs ? (
                <LinkCard href={post.docs} title="Documentation" kind="docs" />
              ) : null}
              {post.notebook ? (
                <LinkCard
                  href={post.notebook}
                  title="Interactive notebook"
                  kind="notebook"
                />
              ) : null}
              {post.apiDocs ? (
                <LinkCard
                  href={post.apiDocs}
                  title="API documentation"
                  kind="api"
                />
              ) : null}
              {post.youtube?.map((id) => (
                <YouTubeFacade key={id} id={id} />
              ))}
            </div>
          </div>
          <aside className="hidden lg:block">
            <TableOfContents items={post.toc} />
          </aside>
        </div>

        {seriesDef && (prev || next) ? (
          <nav
            className="mt-12 grid gap-4 border-t border-[var(--border)] pt-8 sm:grid-cols-2"
            aria-label="Series navigation"
          >
            {prev ? (
              <Link
                href={`/${prev.slug}`}
                className="rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]"
              >
                <span className="text-xs text-[var(--muted)]">Previous</span>
                <span className="mt-1 block font-medium">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/${next.slug}`}
                className="rounded-xl border border-[var(--border)] p-4 text-right hover:border-[var(--accent)]"
              >
                <span className="text-xs text-[var(--muted)]">Next</span>
                <span className="mt-1 block font-medium">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        {post.projects.length ? (
          <section className="mt-12 border-t border-[var(--border)] pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related projects
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {post.projects.map((id) => {
                const pr = getProject(id);
                if (!pr) return null;
                return (
                  <li key={id}>
                    <Link
                      href={`/projects/${id}`}
                      className="block rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]"
                    >
                      <span className="font-medium">{pr.name}</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {pr.tagline}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {related.length ? (
          <section className="mt-12 border-t border-[var(--border)] pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related articles
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <ArticleCard post={p} compact />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relatedByTech.length ? (
          <section className="mt-12 border-t border-[var(--border)] pt-8 pb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related by technology
            </h2>
            <ul className="mt-4 space-y-2">
              {relatedByTech.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="text-[var(--fg)] hover:text-[var(--accent)]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
