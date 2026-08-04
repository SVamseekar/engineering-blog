import Link from "next/link";
import { author, site } from "@/data/author";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg text-[var(--fg)]">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
            {site.description}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Navigate
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/articles">Articles</Link>
            </li>
            <li>
              <Link href="/series">Series</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <Link href="/topics">Topics</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Elsewhere
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={author.portfolio}>Portfolio</a>
            </li>
            <li>
              <a href={author.github}>GitHub</a>
            </li>
            <li>
              <a
                href={author.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                {author.youtubeChannelName}
              </a>
            </li>
            <li>
              <Link href="/glasshouse">The Compliance Glasshouse</Link>
            </li>
            <li>
              <Link href="/videos">All releases</Link>
            </li>
            <li>
              <Link href="/rss.xml">RSS</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} {author.name}
      </div>
    </footer>
  );
}
