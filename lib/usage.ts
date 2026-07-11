import type { CatalogItem } from "@/lib/catalog";

/** Default usage snippets shown in the Usage tab. Override per-item as needed. */
const USAGE: Record<string, string> = {
  "claude-message": `import { ClaudeMessage } from "@/components/brainless/claude/claude-message"

export function Example() {
  return (
    <div className="space-y-2">
      <ClaudeMessage role="user">
        add a dark-mode toggle and run the tests
      </ClaudeMessage>
      <ClaudeMessage>
        I'll add the toggle, then run the suite.
      </ClaudeMessage>
    </div>
  )
}`,
  "claude-tool-call": `import { ClaudeToolCall } from "@/components/brainless/claude/claude-tool-call"

export function Example() {
  return (
    <ClaudeToolCall
      tool="Bash"
      arg="bun run build"
      result="Compiled successfully in 1.2s"
    >
      {\`▲ Next.js
✓ Compiled successfully\`}
    </ClaudeToolCall>
  )
}`,
  "claude-todo-list": `import { ClaudeTodoList } from "@/components/brainless/claude/claude-todo-list"

export function Example() {
  return (
    <ClaudeTodoList
      todos={[
        { label: "Scaffold the app", status: "done" },
        { label: "Wire up the eval loop", status: "active" },
        { label: "Ship the components", status: "todo" },
      ]}
    />
  )
}`,
  "claude-diff": `import { ClaudeDiff } from "@/components/brainless/claude/claude-diff"

export function Example() {
  return (
    <ClaudeDiff
      file="lib/theme.ts"
      summary="Updated lib/theme.ts with 2 additions and 1 removal"
      lines={[
        { type: "ctx", n: 8, text: "export function resolveTheme() {" },
        { type: "del", n: 9, text: "  return 'light'" },
        { type: "add", n: 9, text: "  return stored ?? systemTheme()" },
        { type: "ctx", n: 10, text: "}" },
      ]}
    />
  )
}`,
  "claude-prompt": `import { ClaudePrompt } from "@/components/brainless/claude/claude-prompt"

export function Example() {
  return <ClaudePrompt mode="auto" effort="xhigh" />
}`,
  "codex-message": `import { CodexMessage } from "@/components/brainless/codex/codex-message"

export function Example() {
  return (
    <div className="space-y-2">
      <CodexMessage role="user">
        add a pricing section to the docs site
      </CodexMessage>
      <CodexMessage>
        Added a three-tier Pricing section and verified the build.
      </CodexMessage>
    </div>
  )
}`,
  "codex-exec": `import { CodexExec } from "@/components/brainless/codex/codex-exec"

export function Example() {
  return (
    <CodexExec command="Ran pnpm build" result="→ passed">
      {\`pnpm build
✓ compiled successfully\`}
    </CodexExec>
  )
}`,
  "codex-prompt": `import { CodexPrompt } from "@/components/brainless/codex/codex-prompt"

export function Example() {
  return <CodexPrompt mode="default" />
}`,
  "codex-diff": `import { CodexDiff } from "@/components/brainless/codex/codex-diff"

export function Example() {
  return <CodexDiff />
}`,
  "codex-permissions": `import { CodexPermissions } from "@/components/brainless/codex/codex-permissions"

export function Example() {
  return <CodexPermissions />
}`,
  "codex-slash-menu": `import { CodexSlashMenu } from "@/components/brainless/codex/codex-slash-menu"

export function Example() {
  return <CodexSlashMenu />
}`,
  "grok-message": `import { GrokMessage } from "@/components/brainless/grok/grok-message"

export function Example() {
  return (
    <div className="space-y-2">
      <GrokMessage role="user" time="4:38 PM">
        put the pricing block on the marketing page
      </GrokMessage>
      <GrokMessage time="4:38 PM">
        Dropped in a Pricing block with three tiers.
      </GrokMessage>
    </div>
  )
}`,
  "grok-status": `import { GrokStatus } from "@/components/brainless/grok/grok-status"

export function Example() {
  return (
    <GrokStatus
      branch="main"
      directory="~/dev/brainless"
      turn={2}
      turnTotal={3}
    />
  )
}`,
  "grok-event": `import { GrokEvent } from "@/components/brainless/grok/grok-event"

export function Example() {
  return (
    <div className="space-y-1">
      <GrokEvent label="user_prompt_submit" hooks={3} hooksOk={1} />
      <GrokEvent label="stop" hooks={3} hooksOk={1} />
    </div>
  )
}`,
  "grok-thought": `import { GrokThought } from "@/components/brainless/grok/grok-thought"

export function Example() {
  return (
    <div className="space-y-3">
      <GrokThought elapsed="0.2s" />
      <GrokThought streaming>
        Checking whether scratch.txt exists…
      </GrokThought>
    </div>
  )
}`,
  "grok-working": `import { GrokWorking } from "@/components/brainless/grok/grok-working"

export function Example() {
  return <GrokWorking tokens="16.6k" />
}`,
  "grok-tool": `import { GrokTool } from "@/components/brainless/grok/grok-tool"

export function Example() {
  return (
    <div className="space-y-2">
      <GrokTool verb="read" path="app/(marketing)/page.tsx" />
      <GrokTool
        variant="card"
        title="Run Write components/pricing.tsx"
        hooks={3}
      />
    </div>
  )
}`,
  "grok-write": `import { GrokWrite } from "@/components/brainless/grok/grok-write"

export function Example() {
  return (
    <GrokWrite
      before={[{ n: 1, text: "hello" }]}
      after={[{ n: 1, text: "world" }]}
    />
  )
}`,
  "grok-permission": `import { GrokPermission } from "@/components/brainless/grok/grok-permission"

export function Example() {
  return <GrokPermission />
}`,
  "grok-plan": `import { GrokPlan } from "@/components/brainless/grok/grok-plan"

export function Example() {
  return <GrokPlan />
}`,
  "grok-project-picker": `import { GrokProjectPicker } from "@/components/brainless/grok/grok-project-picker"

export function Example() {
  return <GrokProjectPicker />
}`,
  "grok-shortcuts": `import { GrokShortcuts } from "@/components/brainless/grok/grok-shortcuts"

export function Example() {
  return <GrokShortcuts />
}`,
  "grok-settings": `import { GrokSettings } from "@/components/brainless/grok/grok-settings"

export function Example() {
  return <GrokSettings />
}`,
  "grok-turn-end": `import { GrokTurnEnd } from "@/components/brainless/grok/grok-turn-end"

export function Example() {
  return <GrokTurnEnd elapsed="8.0s" />
}`,
  "grok-slash-menu": `import { GrokSlashMenu } from "@/components/brainless/grok/grok-slash-menu"

export function Example() {
  return <GrokSlashMenu />
}`,
  "grok-prompt": `import { GrokPrompt } from "@/components/brainless/grok/grok-prompt"

export function Example() {
  return <GrokPrompt mode="normal" />
}`,
  "pied-piper-onboarding": `import { PiedPiperOnboarding } from "@/components/brainless/blocks/pied-piper-onboarding"

export function Example() {
  return <PiedPiperOnboarding />
}`,
};

export function usageFor(item: CatalogItem, override?: string): string {
  if (override) return override.trimEnd();
  const custom = USAGE[item.name];
  if (custom) return custom.trimEnd();
  return `import { ${item.exportName} } from "${item.importPath}"

export function Example() {
  return <${item.exportName} />
}`;
}
