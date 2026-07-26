"use client";

import { useEffect, useId, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "dark"
              : "default",
          securityLevel: "strict",
        });
        const { svg: out } = await mermaid.render(`mmd-${id}`, chart);
        if (!cancelled) setSvg(out);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Mermaid render failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-xl border border-[var(--warning)] bg-[var(--surface)] p-4 text-sm">
        {chart}
      </pre>
    );
  }
  if (!svg) {
    return (
      <div className="my-6 h-40 animate-pulse rounded-xl bg-[var(--muted-bg)]" />
    );
  }
  return (
    <div
      className="my-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
