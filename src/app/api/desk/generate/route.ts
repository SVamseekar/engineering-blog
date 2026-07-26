import { NextRequest, NextResponse } from "next/server";
import { isDeskAuthed } from "@/lib/desk-auth";

export async function POST(req: NextRequest) {
  if (!(await isDeskAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured on Vercel." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const project = String(body.project || "masova");
  const topic = String(body.topic || "Domain field note");
  const guidance = String(body.guidance || "");
  const level = String(body.level || "Basic");

  const projects: Record<string, string> = {
    masova:
      "MaSoVa Restaurant OS — kitchen queue, KDS, delivery + fiscal-safe tickets.",
    "eu-ai-assurance":
      "EU AI Assurance OS — risk tiers, lineage, CI gates for EU AI Act.",
    workforceguard:
      "WorkforceGuard AI — fair scheduling, rest rules, labor compliance.",
    aequitas: "Aequitas — GIS transit safety, corridors, dispatcher awareness.",
    meridian:
      "Meridian — multi-channel commercial analytics and defendable revenue.",
  };

  const system = `You are Marti writing first-person domain field notes (never corporate "we").
Domain first; tech is a helping hand; no Java tutorials; minimal code; introduce the system for new readers.
Return strict JSON with keys: blog_title, blog_body, post_summary, linkedin_body.`;

  const user = `Project: ${projects[project] || project}
Level: ${level}
Topic: ${topic}
${guidance ? `Editorial guidance:\n${guidance}` : ""}

Write a 900–1600 word markdown blog_body that opens with a concrete domain scene.`;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json(
        { error: `Gemini error: ${err.slice(0, 500)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || "")
        .join("") || "";

    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { blog_title: topic, blog_body: text, post_summary: "" };
    }

    return NextResponse.json({
      title: parsed.blog_title || "",
      description: parsed.post_summary || "",
      markdown: parsed.blog_body || "",
      linkedin: parsed.linkedin_body || "",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generate failed" },
      { status: 500 }
    );
  }
}
