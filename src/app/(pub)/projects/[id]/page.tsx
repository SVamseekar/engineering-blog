import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { getPostsByProject } from "@/lib/content/load";
import { ArticleCard } from "@/components/home/HomeSections";
import { LinkCard } from "@/components/integrations/LinkCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  if (!p) return {};
  return { title: p.name, description: p.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const posts = getPostsByProject(id);

  return (
    <div className="py-10">
      <Link href="/projects" className="text-sm text-[var(--muted)]">
        ← Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl">{project.name}</h1>
      <p className="mt-2 text-[var(--muted)]">{project.tagline}</p>
      <div className="mt-6 max-w-xl space-y-2">
        {project.repo ? (
          <LinkCard href={project.repo} title="Repository" kind="github" />
        ) : null}
        {project.demo ? (
          <LinkCard href={project.demo} title="Live demo" kind="demo" />
        ) : null}
        {project.docs ? (
          <LinkCard href={project.docs} title="Docs" kind="docs" />
        ) : null}
        {project.url ? (
          <LinkCard href={project.url} title="Product" kind="default" />
        ) : null}
      </div>
      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Articles
      </h2>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <ArticleCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
