import { getAllPostMeta, getSiteUrl } from "@/lib/content/load";

export const dynamic = "force-static";

/** Optional portfolio consumer — HTTP only, no shared runtime */
export async function GET() {
  const base = getSiteUrl();
  const posts = getAllPostMeta().slice(0, 5).map((p) => ({
    title: p.title,
    slug: p.slug,
    url: `${base}/${p.slug}`,
    description: p.description,
    publishedAt: p.publishedAt,
    coverImage: p.coverImage
      ? p.coverImage.startsWith("http")
        ? p.coverImage
        : `${base}${p.coverImage}`
      : null,
  }));

  return Response.json(
    { posts },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
