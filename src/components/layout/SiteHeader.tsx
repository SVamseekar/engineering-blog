import Link from "next/link";
import { ThemeToggle } from "@/components/reader/ThemeToggle";
import { CommandPalette } from "@/components/search/CommandPalette";
import type { SearchDoc } from "@/lib/search/index";

export function SiteHeader({ searchDocs }: { searchDocs: SearchDoc[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-lg tracking-tight text-[var(--fg)]">
          Engineering Notes
        </Link>
        <nav
          className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex"
          aria-label="Primary"
        >
          <Link href="/articles" className="hover:text-[var(--fg)]">
            Articles
          </Link>
          <Link href="/series" className="hover:text-[var(--fg)]">
            Series
          </Link>
          <Link href="/projects" className="hover:text-[var(--fg)]">
            Projects
          </Link>
          <Link href="/topics" className="hover:text-[var(--fg)]">
            Topics
          </Link>
          <a
            href="https://souravamseekar.com"
            className="hover:text-[var(--fg)]"
          >
            Portfolio
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <CommandPalette docs={searchDocs} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
