import registry from "@/registry.json";
import { BLOCKS, COMPONENTS, getCatalogItem } from "@/lib/catalog";

export type SearchEntry = {
  name: string;
  title: string;
  description: string;
  href: string;
  group: string;
  kind: "component" | "block";
};

function hrefFor(name: string, type: string): string {
  const catalog = getCatalogItem(name);
  if (type === "registry:block" || BLOCKS.some((b) => b.name === name)) {
    return `/blocks#${name}`;
  }
  if (catalog || COMPONENTS.some((c) => c.name === name)) {
    return `/components#${name}`;
  }
  return `/components#${name}`;
}

function groupFor(name: string): string {
  return getCatalogItem(name)?.group ?? name.split("-")[0] ?? "other";
}

/**
 * Compile-time search corpus — bundled from registry.json + catalog routes.
 * No server, no postbuild indexer.
 */
export const searchIndex: SearchEntry[] = registry.items
  .filter((item) => item.name !== "index")
  .map((item) => {
  const kind = item.type === "registry:block" ? "block" : "component";
  return {
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    href: hrefFor(item.name, item.type),
    group: groupFor(item.name),
    kind,
  };
});

export const searchComponents = searchIndex.filter((e) => e.kind === "component");
export const searchBlocks = searchIndex.filter((e) => e.kind === "block");
