import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { siteConfig } from "@/lib/site";

const R_DIR = path.join(process.cwd(), "public", "r");

export type RegistryFile = { path: string; name: string; content: string };
export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  type: string;
  files: RegistryFile[];
  install: string;
};

/** Read a built registry item (from `shadcn build` output in public/r). */
export const getRegistryItem = cache(
  async (name: string): Promise<RegistryItem | null> => {
    try {
      const raw = await fs.readFile(path.join(R_DIR, `${name}.json`), "utf8");
      const json = JSON.parse(raw);
      return {
        name: json.name,
        title: json.title ?? json.name,
        description: json.description ?? "",
        type: json.type ?? "registry:ui",
        files: (json.files ?? []).map(
          (f: { path: string; content: string }) => ({
            path: f.path,
            name: f.path.split("/").pop() ?? f.path,
            content: f.content ?? "",
          }),
        ),
        install: `bunx --bun shadcn@latest add ${siteConfig.registryBase}/${json.name}.json`,
      };
    } catch {
      return null;
    }
  },
);

export function itemSource(item: RegistryItem): string {
  return item.files.map((f) => f.content).join("\n\n");
}
