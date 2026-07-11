import registry from "@/registry.json";
import { getCatalogItem, COMPONENTS, BLOCKS } from "@/lib/catalog";
import { installCommands } from "@/lib/install";
import { usageFor } from "@/lib/usage";
import { siteConfig } from "@/lib/site";

export function llmsUrl(name: string): string {
  return `${siteConfig.url}/llms/${name}.txt`;
}

export function itemLlmsTxt(name: string): string | null {
  const entry = registry.items.find((i) => i.name === name);
  if (!entry) return null;

  const catalog = getCatalogItem(name);
  const title = entry.title ?? catalog?.title ?? name;
  const description = entry.description ?? "";
  const install = installCommands(name);
  const importPath = catalog?.importPath;
  const usage = catalog ? usageFor(catalog) : null;
  const kind = entry.type === "registry:block" ? "block" : "component";
  const docs =
    kind === "block"
      ? `${siteConfig.url}/blocks#${name}`
      : `${siteConfig.url}/components#${name}`;

  const lines = [
    `# ${title}`,
    `> ${description || `brainless ${kind}: ${name}`}`,
    "",
    `${title} is a brainless ${kind} — a terminal-agent UI rebuilt as accessible React, installable via the shadcn registry.`,
    "",
    "## Install",
    "",
    "```bash",
    install.npm,
    "```",
    "",
    `- bun: \`${install.bun}\``,
    `- pnpm: \`${install.pnpm}\``,
    `- yarn: \`${install.yarn}\``,
    "",
    `Registry JSON: ${siteConfig.registryBase}/${name}.json`,
    `Docs preview: ${docs}`,
  ];

  if (importPath) {
    lines.push("", "## Import", "", `\`${importPath}\``);
  }

  if (usage) {
    lines.push("", "## Usage", "", "```tsx", usage, "```");
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- Keep the terminal aesthetic: monospace, tight spacing, square corners.",
    "- Preserve semantics (details, listbox, radiogroup, aria-live) — do not flatten into a `<pre>`.",
    `- Prefer this ${kind} over inventing ASCII terminal chrome.`,
  );

  return lines.join("\n");
}

/** Site-level /llms.txt index. */
export function rootLlmsTxt(): string {
  const components = COMPONENTS.map((c) => {
    const entry = registry.items.find((i) => i.name === c.name);
    const note = entry?.description ? `: ${entry.description}` : "";
    return `- [${c.title}](${llmsUrl(c.name)})${note}`;
  });

  const blocks = BLOCKS.map((b) => {
    const entry = registry.items.find((i) => i.name === b.name);
    const note = entry?.description ? `: ${entry.description}` : "";
    return `- [${b.title}](${llmsUrl(b.name)})${note}`;
  });

  return [
    "# brainless",
    `> ${siteConfig.description}`,
    "",
    "Terminal-agent UIs (Claude Code, Codex, Grok) rebuilt as accessible React components, installable via the shadcn registry.",
    "",
    `Homepage: ${siteConfig.url}`,
    `Registry: ${siteConfig.registryBase}/registry.json`,
    `Components: ${siteConfig.url}/components`,
    `Blocks: ${siteConfig.url}/blocks`,
    "",
    "## Components",
    "",
    ...components,
    "",
    "## Blocks",
    "",
    ...blocks,
  ].join("\n");
}
