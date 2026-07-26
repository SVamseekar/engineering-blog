import type { PostMeta } from "@/lib/content/schema";
import { author, site } from "@/data/author";
import { getSiteUrl } from "@/lib/content/load";

export function articleJsonLd(post: PostMeta) {
  const base = getSiteUrl();
  const url = post.canonical || `${base}/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      image: post.ogImage || post.coverImage
        ? [`${base}${post.ogImage || post.coverImage}`]
        : undefined,
      author: {
        "@type": "Person",
        name: post.author.name,
        url: post.author.url || author.url,
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      publisher: {
        "@type": "Person",
        name: author.name,
        url: author.url,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: post.title, item: url },
      ],
    },
  ];

  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: getSiteUrl(),
    description: site.description,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
