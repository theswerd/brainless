"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search-dialog";

export function SearchTrigger() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="sm:hidden"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden h-8 gap-2 border-border/70 bg-transparent px-2.5 text-muted-foreground sm:inline-flex"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-3.5" />
        <span className="text-xs">Search…</span>
        <kbd className="pointer-events-none ml-1 hidden items-center gap-0.5 rounded-none border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground md:inline-flex">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
