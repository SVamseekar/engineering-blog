import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Mermaid } from "@/components/article/Mermaid";
import { CodeBlock } from "@/components/article/CodeBlock";
import { YouTubeFacade } from "@/components/integrations/YouTubeFacade";
import { LinkCard } from "@/components/integrations/LinkCard";

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="callout callout-note" role="note">
      <strong className="callout-label">Note</strong>
      <div>{children}</div>
    </aside>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <aside className="callout callout-warn" role="alert">
      <strong className="callout-label">Warning</strong>
      <div>{children}</div>
    </aside>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <aside className="callout callout-tip">
      <strong className="callout-label">Tip</strong>
      <div>{children}</div>
    </aside>
  );
}

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "warn" | "tip";
  children: ReactNode;
}) {
  if (type === "warn") return <Warning>{children}</Warning>;
  if (type === "tip") return <Tip>{children}</Tip>;
  return <Note>{children}</Note>;
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return <CodeBlock {...props} />;
}

function H2(props: ComponentPropsWithoutRef<"h2">) {
  const text = String(props.children ?? "");
  const id =
    props.id ||
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  return (
    <h2 id={id} className="scroll-mt-24" {...props}>
      {props.children}
    </h2>
  );
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  const text = String(props.children ?? "");
  const id =
    props.id ||
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  return (
    <h3 id={id} className="scroll-mt-24" {...props}>
      {props.children}
    </h3>
  );
}

export const mdxComponents = {
  Note,
  Warning,
  Tip,
  Callout,
  Mermaid,
  YouTube: YouTubeFacade,
  LinkCard,
  pre: Pre,
  h2: H2,
  h3: H3,
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className={cn("text-[var(--link)] underline-offset-2 hover:underline", props.className)}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
    />
  ),
};
