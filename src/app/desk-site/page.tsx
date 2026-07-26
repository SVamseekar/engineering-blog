import { getAllPostMeta } from "@/lib/content/load";
import { isDeskAuthed } from "@/lib/desk-auth";
import { DeskClient } from "./DeskClient";

export const dynamic = "force-dynamic";

export default async function DeskHome() {
  const authed = await isDeskAuthed();
  const posts = getAllPostMeta({ includeUnpublished: true });
  const passwordConfigured = Boolean(process.env.DESK_PASSWORD);

  return (
    <div className="desk-shell min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-white">
          Editorial <em className="text-sky-300 not-italic">Desk</em>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Hosted control surface for{" "}
          <a
            href="https://blog.souravamseekar.com"
            className="text-sky-300 hover:underline"
          >
            blog.souravamseekar.com
          </a>
          . Full Mon–Fri pipeline runs best locally via{" "}
          <code className="text-slate-300">social-poster</code>.
        </p>
        <DeskClient
          authed={authed}
          passwordConfigured={passwordConfigured}
          posts={posts.map((p) => ({
            title: p.title,
            slug: p.slug,
            date: p.publishedAt,
            project: p.projects[0] || "general",
            status: p.status,
          }))}
        />
        <div className="mt-8 flex gap-4 text-sm text-slate-500">
          <a href="https://blog.souravamseekar.com">Blog</a>
          <a href="https://souravamseekar.com">Portfolio</a>
        </div>
      </div>
    </div>
  );
}
