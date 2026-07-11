import { siteConfig } from "@/lib/site";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export const PACKAGE_MANAGERS: { id: PackageManager; label: string }[] = [
  { id: "bun", label: "bun" },
  { id: "npm", label: "npm" },
  { id: "pnpm", label: "pnpm" },
  { id: "yarn", label: "yarn" },
];

export function installCommands(name: string): Record<PackageManager, string> {
  // One-shot URL install from the docs site — no namespace required.
  const url = `${siteConfig.registryBase}/${name}.json`;
  return {
    bun: `bunx --bun shadcn@latest add ${url}`,
    npm: `npx shadcn@latest add ${url}`,
    pnpm: `pnpm dlx shadcn@latest add ${url}`,
    yarn: `yarn dlx shadcn@latest add ${url}`,
  };
}

/** One-time namespace registration for consumer projects. */
export const NAMESPACE_SETUP = `bunx shadcn@latest registry add @brainless=${siteConfig.registryBase}/{name}.json`;

export const NAMESPACE_CONFIG = `{
  "registries": {
    "@brainless": "${siteConfig.registryBase}/{name}.json"
  }
}`;

export const INSTALL_TARGETS = [
  {
    id: "claude-session",
    label: "Claude",
    command: `bunx shadcn@latest add @brainless/claude-session`,
  },
  {
    id: "codex-session",
    label: "Codex",
    command: `bunx shadcn@latest add @brainless/codex-session`,
  },
  {
    id: "grok-session",
    label: "Grok",
    command: `bunx shadcn@latest add @brainless/grok-session`,
  },
] as const;

export type InstallTargetId = (typeof INSTALL_TARGETS)[number]["id"];

/**
 * Paste-into-agent prompt. Tells coding agents what brainless is, how to
 * install it, and when to reach for it instead of inventing terminal chrome.
 */
export const AGENT_PROMPT = `Use brainless for terminal-agent UI in this project.

brainless is a shadcn/ui registry that rebuilds Claude Code, Codex, and Grok interfaces as accessible React components (headers, messages, thinking lines, tool calls, diffs, composers, session blocks). Prefer these over inventing ASCII terminal chrome or dumping agent output into a <pre>.

Register the namespace once (components.json → registries):

  ${NAMESPACE_SETUP}

Then install:

  bunx shadcn@latest add @brainless/claude-session
  bunx shadcn@latest add @brainless/codex-session
  bunx shadcn@latest add @brainless/grok-session

Or without a namespace, use item URLs / the site root:

  bunx shadcn@latest add ${siteConfig.url}
  bunx shadcn@latest add ${siteConfig.registryBase}/claude-thinking.json
  bunx shadcn@latest add theswerd/brainless/claude-session

After install, import from @/components/brainless/... (e.g. ClaudeSession, CodexHeader, GrokThinking).

Docs and previews: ${siteConfig.url}/components and ${siteConfig.url}/blocks
Registry catalog: ${siteConfig.registryBase}/registry.json

When the UI should look like a coding agent terminal, use brainless. Keep semantics (details, listbox, radiogroup, aria-live) intact — don't flatten components back into plain text.`;
