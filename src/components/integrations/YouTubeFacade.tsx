"use client";

import { useState } from "react";
import { Play } from "lucide-react";

function extractId(input: string): string {
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v") || input;
  } catch {
    return input;
  }
}

export function YouTubeFacade({
  id,
  title = "YouTube video",
}: {
  id: string;
  title?: string;
}) {
  const [play, setPlay] = useState(false);
  const vid = extractId(id);
  const thumb = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

  if (play) {
    return (
      <div className="my-6 aspect-video overflow-hidden rounded-xl border border-[var(--border)]">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="group relative my-6 block aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)] bg-black"
      aria-label={`Play ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
        loading="lazy"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shadow-lg">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
      </span>
    </button>
  );
}
