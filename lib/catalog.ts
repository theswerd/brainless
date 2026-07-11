export type AgentGroup = "claude" | "codex" | "grok" | "demo";

export type CatalogItem = {
  name: string;
  title: string;
  group: AgentGroup;
  exportName: string;
  /** Import path after install (matches registry `target`, without extension). */
  importPath: string;
};

export const AGENT_GROUPS: {
  id: AgentGroup;
  label: string;
  color: string;
}[] = [
  { id: "claude", label: "Claude Code", color: "var(--agent-claude)" },
  { id: "codex", label: "Codex", color: "var(--agent-codex)" },
  { id: "grok", label: "Grok", color: "var(--agent-grok)" },
  { id: "demo", label: "Demo", color: "#39b54a" },
];

/** Gallery order for /components — learnable conversation flow per agent. */
export const COMPONENTS: CatalogItem[] = [
  {
    name: "claude-header",
    title: "Claude Header",
    group: "claude",
    exportName: "ClaudeHeader",
    importPath: "@/components/brainless/claude/claude-header",
  },
  {
    name: "claude-message",
    title: "Claude Message",
    group: "claude",
    exportName: "ClaudeMessage",
    importPath: "@/components/brainless/claude/claude-message",
  },
  {
    name: "claude-thinking",
    title: "Claude Thinking",
    group: "claude",
    exportName: "ClaudeThinking",
    importPath: "@/components/brainless/claude/claude-thinking",
  },
  {
    name: "claude-tool-call",
    title: "Claude Tool Call",
    group: "claude",
    exportName: "ClaudeToolCall",
    importPath: "@/components/brainless/claude/claude-tool-call",
  },
  {
    name: "claude-todo-list",
    title: "Claude Todo List",
    group: "claude",
    exportName: "ClaudeTodoList",
    importPath: "@/components/brainless/claude/claude-todo-list",
  },
  {
    name: "claude-diff",
    title: "Claude Diff",
    group: "claude",
    exportName: "ClaudeDiff",
    importPath: "@/components/brainless/claude/claude-diff",
  },
  {
    name: "claude-permission",
    title: "Claude Permission",
    group: "claude",
    exportName: "ClaudePermission",
    importPath: "@/components/brainless/claude/claude-permission",
  },
  {
    name: "claude-slash-menu",
    title: "Claude Slash Menu",
    group: "claude",
    exportName: "ClaudeSlashMenu",
    importPath: "@/components/brainless/claude/claude-slash-menu",
  },
  {
    name: "claude-prompt",
    title: "Claude Prompt",
    group: "claude",
    exportName: "ClaudePrompt",
    importPath: "@/components/brainless/claude/claude-prompt",
  },
  {
    name: "codex-header",
    title: "Codex Header",
    group: "codex",
    exportName: "CodexHeader",
    importPath: "@/components/brainless/codex/codex-header",
  },
  {
    name: "codex-message",
    title: "Codex Message",
    group: "codex",
    exportName: "CodexMessage",
    importPath: "@/components/brainless/codex/codex-message",
  },
  {
    name: "codex-exec",
    title: "Codex Exec",
    group: "codex",
    exportName: "CodexExec",
    importPath: "@/components/brainless/codex/codex-exec",
  },
  {
    name: "codex-working",
    title: "Codex Working",
    group: "codex",
    exportName: "CodexWorking",
    importPath: "@/components/brainless/codex/codex-working",
  },
  {
    name: "codex-diff",
    title: "Codex Diff",
    group: "codex",
    exportName: "CodexDiff",
    importPath: "@/components/brainless/codex/codex-diff",
  },
  {
    name: "codex-permissions",
    title: "Codex Permissions",
    group: "codex",
    exportName: "CodexPermissions",
    importPath: "@/components/brainless/codex/codex-permissions",
  },
  {
    name: "codex-slash-menu",
    title: "Codex Slash Menu",
    group: "codex",
    exportName: "CodexSlashMenu",
    importPath: "@/components/brainless/codex/codex-slash-menu",
  },
  {
    name: "codex-prompt",
    title: "Codex Prompt",
    group: "codex",
    exportName: "CodexPrompt",
    importPath: "@/components/brainless/codex/codex-prompt",
  },
  {
    name: "grok-header",
    title: "Grok Header",
    group: "grok",
    exportName: "GrokHeader",
    importPath: "@/components/brainless/grok/grok-header",
  },
  {
    name: "grok-status",
    title: "Grok Status",
    group: "grok",
    exportName: "GrokStatus",
    importPath: "@/components/brainless/grok/grok-status",
  },
  {
    name: "grok-message",
    title: "Grok Message",
    group: "grok",
    exportName: "GrokMessage",
    importPath: "@/components/brainless/grok/grok-message",
  },
  {
    name: "grok-event",
    title: "Grok Event",
    group: "grok",
    exportName: "GrokEvent",
    importPath: "@/components/brainless/grok/grok-event",
  },
  {
    name: "grok-thought",
    title: "Grok Thought",
    group: "grok",
    exportName: "GrokThought",
    importPath: "@/components/brainless/grok/grok-thought",
  },
  {
    name: "grok-thinking",
    title: "Grok Thinking",
    group: "grok",
    exportName: "GrokThinking",
    importPath: "@/components/brainless/grok/grok-thinking",
  },
  {
    name: "grok-working",
    title: "Grok Working",
    group: "grok",
    exportName: "GrokWorking",
    importPath: "@/components/brainless/grok/grok-working",
  },
  {
    name: "grok-tool",
    title: "Grok Tool",
    group: "grok",
    exportName: "GrokTool",
    importPath: "@/components/brainless/grok/grok-tool",
  },
  {
    name: "grok-write",
    title: "Grok Write",
    group: "grok",
    exportName: "GrokWrite",
    importPath: "@/components/brainless/grok/grok-write",
  },
  {
    name: "grok-permission",
    title: "Grok Permission",
    group: "grok",
    exportName: "GrokPermission",
    importPath: "@/components/brainless/grok/grok-permission",
  },
  {
    name: "grok-plan",
    title: "Grok Plan",
    group: "grok",
    exportName: "GrokPlan",
    importPath: "@/components/brainless/grok/grok-plan",
  },
  {
    name: "grok-project-picker",
    title: "Grok Project Picker",
    group: "grok",
    exportName: "GrokProjectPicker",
    importPath: "@/components/brainless/grok/grok-project-picker",
  },
  {
    name: "grok-shortcuts",
    title: "Grok Shortcuts",
    group: "grok",
    exportName: "GrokShortcuts",
    importPath: "@/components/brainless/grok/grok-shortcuts",
  },
  {
    name: "grok-settings",
    title: "Grok Settings",
    group: "grok",
    exportName: "GrokSettings",
    importPath: "@/components/brainless/grok/grok-settings",
  },
  {
    name: "grok-turn-end",
    title: "Grok Turn End",
    group: "grok",
    exportName: "GrokTurnEnd",
    importPath: "@/components/brainless/grok/grok-turn-end",
  },
  {
    name: "grok-slash-menu",
    title: "Grok Slash Menu",
    group: "grok",
    exportName: "GrokSlashMenu",
    importPath: "@/components/brainless/grok/grok-slash-menu",
  },
  {
    name: "grok-prompt",
    title: "Grok Prompt",
    group: "grok",
    exportName: "GrokPrompt",
    importPath: "@/components/brainless/grok/grok-prompt",
  },
];

export const BLOCKS: CatalogItem[] = [
  {
    name: "claude-session",
    title: "Claude Session",
    group: "claude",
    exportName: "ClaudeSession",
    importPath: "@/components/brainless/blocks/claude-session",
  },
  {
    name: "codex-session",
    title: "Codex Session",
    group: "codex",
    exportName: "CodexSession",
    importPath: "@/components/brainless/blocks/codex-session",
  },
  {
    name: "grok-session",
    title: "Grok Session",
    group: "grok",
    exportName: "GrokSession",
    importPath: "@/components/brainless/blocks/grok-session",
  },
  {
    name: "grok-session-active",
    title: "Grok Session Active",
    group: "grok",
    exportName: "GrokSessionActive",
    importPath: "@/components/brainless/blocks/grok-session-active",
  },
  {
    name: "pied-piper-onboarding",
    title: "Pied Piper Onboarding",
    group: "demo",
    exportName: "PiedPiperOnboarding",
    importPath: "@/components/brainless/blocks/pied-piper-onboarding",
  },
];

export function getCatalogItem(name: string): CatalogItem | undefined {
  return (
    COMPONENTS.find((c) => c.name === name) ??
    BLOCKS.find((b) => b.name === name)
  );
}

export function componentsByGroup(group: AgentGroup): CatalogItem[] {
  return COMPONENTS.filter((c) => c.group === group);
}

export function sidebarGroups(
  items: CatalogItem[],
): { id: AgentGroup; label: string; color: string; items: CatalogItem[] }[] {
  return AGENT_GROUPS.map((g) => ({
    ...g,
    items: items.filter((i) => i.group === g.id),
  })).filter((g) => g.items.length > 0);
}
