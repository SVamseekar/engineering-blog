"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMsg(data.message || "Thanks — you're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="h-11 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--fg)] outline-none ring-[var(--accent)] focus:ring-2"
      />
      <Button type="submit">Subscribe</Button>
      {msg ? (
        <p
          className={
            status === "err"
              ? "text-sm text-[var(--destructive)] sm:col-span-2"
              : "text-sm text-[var(--success)] sm:basis-full"
          }
          role="status"
        >
          {msg}
        </p>
      ) : null}
    </form>
  );
}
