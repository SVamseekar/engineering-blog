import { ExternalLink, FileText, GitBranch, BookOpen, Code2 } from "lucide-react";

const icons = {
  github: GitBranch,
  docs: FileText,
  demo: ExternalLink,
  notebook: BookOpen,
  api: Code2,
  default: ExternalLink,
};

export function LinkCard({
  href,
  title,
  description,
  kind = "default",
}: {
  href: string;
  title: string;
  description?: string;
  kind?: keyof typeof icons;
}) {
  const Icon = icons[kind] || icons.default;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-3 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
      <span>
        <span className="block font-medium text-[var(--fg)]">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-sm text-[var(--muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </a>
  );
}
