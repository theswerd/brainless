"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BoxesIcon, ComponentIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  searchBlocks,
  searchComponents,
  type SearchEntry,
} from "@/lib/search-index";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();

  const go = React.useEffectEvent((entry: SearchEntry) => {
    onOpenChange(false);
    const [path, hash] = entry.href.split("#");
    if (window.location.pathname === path && hash) {
      window.history.pushState(null, "", entry.href);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(entry.href);
  });

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search brainless"
      description="Jump to a component or block"
      className="rounded-none! sm:max-w-lg"
    >
      <CommandInput placeholder="Search components and blocks…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Components">
          {searchComponents.map((entry) => (
            <CommandItem
              key={entry.name}
              value={`${entry.title} ${entry.name} ${entry.description} ${entry.group}`}
              onSelect={() => go(entry)}
              className="**:[svg:last-child]:hidden"
            >
              <ComponentIcon className="text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate">{entry.title}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">
                  {entry.name}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Blocks">
          {searchBlocks.map((entry) => (
            <CommandItem
              key={entry.name}
              value={`${entry.title} ${entry.name} ${entry.description} ${entry.group} block`}
              onSelect={() => go(entry)}
              className="**:[svg:last-child]:hidden"
            >
              <BoxesIcon className="text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate">{entry.title}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">
                  {entry.name}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
