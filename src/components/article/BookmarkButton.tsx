"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { readerStorage } from "@/components/reader/storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BookmarkButton({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(readerStorage.getBookmarks().includes(slug));
  }, [slug]);

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={on}
      aria-label={on ? "Remove bookmark" : "Bookmark article"}
      onClick={() => {
        const next = readerStorage.toggleBookmark(slug);
        setOn(next.includes(slug));
      }}
    >
      <Bookmark className={cn("h-4 w-4", on && "fill-current text-[var(--accent)]")} />
      {on ? "Saved" : "Save"}
    </Button>
  );
}
