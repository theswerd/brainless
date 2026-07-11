"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  sidebarGroups,
  type CatalogItem,
} from "@/lib/catalog";

export function DocsSidebar({
  items,
  basePath,
}: {
  items: CatalogItem[];
  basePath: "/components" | "/blocks";
}) {
  const pathname = usePathname();
  const [active, setActive] = React.useState<string | null>(null);
  const groups = sidebarGroups(items);

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setActive(hash);

    const nodes = items
      .map((item) => document.getElementById(item.name))
      .filter((el): el is HTMLElement => Boolean(el));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items, pathname]);

  return (
    <aside className="sticky top-14 hidden max-h-[calc(100svh-3.5rem)] w-56 shrink-0 self-start overflow-y-auto lg:block">
      <nav aria-label="Registry items" className="pr-3">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              <div
                className="mb-2 px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                style={{ color: group.color }}
              >
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = active === item.name;
                  return (
                    <li key={item.name}>
                      <Link
                        href={`${basePath}#${item.name}`}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "block rounded-none px-2 py-1.5 text-[13px] transition-colors",
                          isActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                        )}
                        onClick={() => setActive(item.name)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

/** Mobile jump list — compact substitute for the desktop sidebar. */
export function DocsMobileNav({
  items,
  basePath,
}: {
  items: CatalogItem[];
  basePath: "/components" | "/blocks";
}) {
  const groups = sidebarGroups(items);

  return (
    <nav
      aria-label="Jump to item"
      className="sticky top-14 z-30 -mx-4 mb-8 border-b border-border/70 bg-background/85 px-4 py-2 backdrop-blur lg:hidden"
    >
      <div className="flex gap-1 overflow-x-auto font-mono text-[12px]">
        {groups.flatMap((group) =>
          group.items.map((item) => (
            <a
              key={item.name}
              href={`${basePath}#${item.name}`}
              className="shrink-0 rounded-none px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.name}
            </a>
          )),
        )}
      </div>
    </nav>
  );
}
