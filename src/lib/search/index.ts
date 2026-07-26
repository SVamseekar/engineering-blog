import { create, insertMultiple, search } from "@orama/orama";
import type { PostMeta } from "@/lib/content/schema";

export type SearchDoc = {
  id: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  technologies: string[];
  projects: string[];
  categories: string[];
  slug: string;
  publishedAt: string;
};

export type SearchIndexPayload = {
  docs: SearchDoc[];
};

const schema = {
  id: "string",
  title: "string",
  description: "string",
  body: "string",
  tags: "string[]",
  technologies: "string[]",
  projects: "string[]",
  categories: "string[]",
  slug: "string",
  publishedAt: "string",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbPromise: Promise<any> | null = null;

export function postsToSearchDocs(
  posts: (PostMeta & { content?: string })[]
): SearchDoc[] {
  return posts.map((p) => ({
    id: p.slug,
    title: p.title,
    description: p.description,
    body: (p.content || "").slice(0, 8000),
    tags: p.tags,
    technologies: p.technologies,
    projects: p.projects,
    categories: p.categories,
    slug: p.slug,
    publishedAt: p.publishedAt,
  }));
}

export async function buildSearchDb(docs: SearchDoc[]) {
  const db = await create({ schema });
  if (docs.length) {
    await insertMultiple(db, docs);
  }
  return db;
}

export async function getSearchDb(docs: SearchDoc[]) {
  if (!dbPromise) {
    dbPromise = buildSearchDb(docs);
  }
  return dbPromise;
}

export async function runSearch(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  term: string,
  facets?: {
    tags?: string[];
    technologies?: string[];
    projects?: string[];
    categories?: string[];
  }
): Promise<SearchDoc[]> {
  const result = await search(db, {
    term: term || "",
    properties: ["title", "description", "body", "tags"],
    limit: 40,
    tolerance: 1,
  });

  let hits = result.hits.map((h: { document: SearchDoc }) => h.document);

  if (facets?.tags?.length) {
    hits = hits.filter((d: SearchDoc) =>
      facets.tags!.some((t) => d.tags.includes(t))
    );
  }
  if (facets?.technologies?.length) {
    hits = hits.filter((d: SearchDoc) =>
      facets.technologies!.some((t) => d.technologies.includes(t))
    );
  }
  if (facets?.projects?.length) {
    hits = hits.filter((d: SearchDoc) =>
      facets.projects!.some((t) => d.projects.includes(t))
    );
  }
  if (facets?.categories?.length) {
    hits = hits.filter((d: SearchDoc) =>
      facets.categories!.some((t) => d.categories.includes(t))
    );
  }

  return hits;
}
