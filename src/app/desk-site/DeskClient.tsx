"use client";

import { useState } from "react";

type PostLite = {
  title: string;
  slug: string;
  date: string;
  project: string;
  status: string;
};

export function DeskClient({
  authed: initialAuthed,
  passwordConfigured,
  posts,
}: {
  authed: boolean;
  passwordConfigured: boolean;
  posts: PostLite[];
}) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  const [project, setProject] = useState("masova");
  const [topic, setTopic] = useState("");
  const [guidance, setGuidance] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(
    "published"
  );
  const [scheduledFor, setScheduledFor] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [technologies, setTechnologies] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/desk/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuthed(true);
      setMsg({ kind: "ok", text: "Signed in." });
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/desk/login", { method: "DELETE" });
    setAuthed(false);
  }

  async function generate() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/desk/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, topic, guidance }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");
      setTitle(data.title || "");
      setDescription(data.description || "");
      setMarkdown(data.markdown || "");
      setMsg({ kind: "ok", text: "Draft generated — review, then publish." });
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Generate failed",
      });
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/desk/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          markdown,
          description,
          project,
          status,
          scheduledFor: status === "scheduled" ? scheduledFor : undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          categories: categories
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          technologies: technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setMsg({
        kind: "ok",
        text: `Published (${data.mode}, ${data.status}): ${data.url}`,
      });
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Publish failed",
      });
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/80 p-6">
        {!passwordConfigured ? (
          <p className="text-amber-300 text-sm">
            DESK_PASSWORD is not set. In development, desk is open; set the env
            var for production.
          </p>
        ) : null}
        <form onSubmit={login} className="mt-4 space-y-3">
          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
        {msg ? (
          <p
            className={
              msg.kind === "err" ? "mt-3 text-red-400" : "mt-3 text-emerald-400"
            }
          >
            {msg.text}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-emerald-400">Signed in</p>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign out
        </button>
      </div>

      {msg ? (
        <p
          className={
            msg.kind === "err"
              ? "rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300"
              : "rounded-lg bg-emerald-950/50 px-3 py-2 text-sm text-emerald-300"
          }
        >
          {msg.text}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-6">
        <h2 className="text-lg font-medium text-white">Generate draft</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-300">
            Project
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            >
              <option value="masova">MaSoVa</option>
              <option value="eu-ai-assurance">EU AI Assurance</option>
              <option value="workforceguard">WorkforceGuard</option>
              <option value="aequitas">Aequitas</option>
              <option value="meridian">Meridian</option>
            </select>
          </label>
          <label className="text-sm text-slate-300">
            Topic
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm text-slate-300">
          Guidance
          <textarea
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          Generate with Gemini
        </button>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-6">
        <h2 className="text-lg font-medium text-white">Review & publish</h2>
        <label className="mt-4 block text-sm text-slate-300">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm text-slate-300">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm text-slate-300">
          Markdown body
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={16}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-sm"
          />
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-slate-300">
            Status
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "scheduled" | "published")
              }
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </label>
          {status === "scheduled" ? (
            <label className="text-sm text-slate-300 sm:col-span-2">
              Scheduled for (ISO)
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </label>
          ) : null}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-slate-300">
            Tags (comma)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-300">
            Categories
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-300">
            Technologies
            <input
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={busy || !title || !markdown}
          onClick={publish}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {status === "draft"
            ? "Save draft"
            : status === "scheduled"
              ? "Schedule"
              : "Publish"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-6">
        <h2 className="text-lg font-medium text-white">Posts board</h2>
        <ul className="mt-4 divide-y divide-slate-800">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm"
            >
              <span className="text-slate-200">{p.title}</span>
              <span className="text-slate-500">
                {p.status} · {p.project} · {p.date}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
