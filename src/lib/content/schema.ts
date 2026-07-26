import { z } from "zod";

export const AuthorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  avatar: z.string().optional(),
});

export const SeriesRefSchema = z.object({
  id: z.string(),
  order: z.number(),
});

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const FrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  slug: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  author: AuthorSchema.default({
    name: "Marti Soura Vamseekar",
    url: "https://souravamseekar.com",
  }),
  status: z.enum(["draft", "scheduled", "published"]).default("published"),
  scheduledFor: z.string().optional(),
  series: SeriesRefSchema.optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  github: z.array(z.string()).optional(),
  demo: z.string().optional(),
  docs: z.string().optional(),
  youtube: z.array(z.string()).optional(),
  notebook: z.string().optional(),
  apiDocs: z.string().optional(),
  faq: z.array(FaqSchema).optional(),
  ogImage: z.string().optional(),
  coverImage: z.string().optional(),
  canonical: z.string().optional(),
  // Legacy portfolio fields (normalized in loader)
  date: z.string().optional(),
  project: z.string().optional(),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export const SeriesDefSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
  coverImage: z.string().optional(),
  projects: z.array(z.string()).default([]),
  recommendedOrder: z.array(z.string()).optional(),
  audience: z.string().optional(),
  prerequisites: z.string().optional(),
});

export type SeriesDef = z.infer<typeof SeriesDefSchema>;

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type PostMeta = Frontmatter & {
  readingTimeMinutes: number;
  wordCount: number;
  filePath: string;
  extension: ".md" | ".mdx";
};

export type Post = PostMeta & {
  content: string;
  toc: TocItem[];
};
