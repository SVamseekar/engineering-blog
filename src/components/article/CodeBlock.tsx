"use client";

import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative my-6">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 z-10 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--success)]" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-[var(--muted)]" />
        )}
      </button>
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-4 text-sm leading-relaxed",
          className
        )}
        {...props}
      >
        {children as ReactNode}
      </pre>
    </div>
  );
}
