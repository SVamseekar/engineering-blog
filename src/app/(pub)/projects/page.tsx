import Link from "next/link";
import { projects } from "@/data/projects";
import { getPostsByProject } from "@/lib/content/load";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Product ecosystem hub — articles and links per system.",
};

export default function ProjectsHubPage() {
  return (
    <div className="py-10">
      <h1 className="font-display text-3xl">Projects</h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">
        Every article is a node in the product + code + writing ecosystem.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => {
          const count = getPostsByProject(p.id).length;
          return (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:shadow-[var(--shadow-md)]"
                style={{ borderTopColor: p.color, borderTopWidth: 3 }}
              >
                <h2 className="text-xl font-medium">{p.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{p.tagline}</p>
                <p className="mt-4 text-xs text-[var(--accent)]">
                  {count} articles
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
