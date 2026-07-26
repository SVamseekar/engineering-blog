import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isDeskAuthed } from "@/lib/desk-auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  if (!(await isDeskAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  const markdown = String(body.markdown || "").trim();
  const description = String(body.description || "").trim();
  const project = String(body.project || "general").trim();
  const status = String(body.status || "published") as
    | "draft"
    | "scheduled"
    | "published";
  const scheduledFor = body.scheduledFor
    ? String(body.scheduledFor)
    : undefined;
  const date = String(body.date || new Date().toISOString().slice(0, 10));
  const slug = String(body.slug || slugify(title));
  const categories = Array.isArray(body.categories) ? body.categories : [];
  const tags = Array.isArray(body.tags) ? body.tags : [];
  const technologies = Array.isArray(body.technologies)
    ? body.technologies
    : [];
  const series = body.series;

  if (!title || !markdown) {
    return NextResponse.json(
      { error: "title and markdown are required" },
      { status: 400 }
    );
  }

  const postsDir = path.join(process.cwd(), "content", "posts");
  fs.mkdirSync(postsDir, { recursive: true });
  const fileName = `${date}-${slug}.md`;
  const filePath = path.join(postsDir, fileName);

  const fmObj: Record<string, unknown> = {
    title,
    slug,
    publishedAt: date,
    description,
    status,
    projects: [project],
    categories,
    tags,
    technologies,
    coverImage: body.coverImage || "",
    featured: Boolean(body.featured),
    editorsPick: Boolean(body.editorsPick),
    author: {
      name: "Marti Soura Vamseekar",
      url: "https://souravamseekar.com",
    },
  };
  if (scheduledFor) fmObj.scheduledFor = scheduledFor;
  if (series) fmObj.series = series;

  const lines = ["---"];
  for (const [k, v] of Object.entries(fmObj)) {
    lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push("---", "", markdown);
  const content = lines.join("\n");

  const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const ghRepo = process.env.GITHUB_REPO || "SVamseekar/engineering-blog";

  if (ghToken && process.env.VERCEL) {
    const apiPath = `https://api.github.com/repos/${ghRepo}/contents/content/posts/${fileName}`;
    const existing = await fetch(apiPath, {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    let sha: string | undefined;
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
    const put = await fetch(apiPath, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `publish: ${title}`,
        content: Buffer.from(content, "utf8").toString("base64"),
        sha,
        branch: process.env.GITHUB_BRANCH || "main",
      }),
    });
    if (!put.ok) {
      const err = await put.text();
      return NextResponse.json(
        { error: `GitHub publish failed: ${err.slice(0, 400)}` },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      mode: "github",
      slug,
      status,
      url: `https://blog.souravamseekar.com/${slug}`,
    });
  }

  fs.writeFileSync(filePath, content, "utf8");
  return NextResponse.json({
    ok: true,
    mode: "filesystem",
    slug,
    status,
    path: filePath,
    url: `https://blog.souravamseekar.com/${slug}`,
  });
}
