import type { Metadata } from "next";
import Link from "next/link";
import { Showcase } from "@/components/showcase";
import { DocsSection, DocsShell } from "@/components/docs/docs-shell";
import { AGENT_GROUPS, COMPONENTS, componentsByGroup } from "@/lib/catalog";
import { ClaudeHeader } from "@/registry/brainless/claude/claude-header";
import { ClaudeMessage } from "@/registry/brainless/claude/claude-message";
import { ClaudeThinking } from "@/registry/brainless/claude/claude-thinking";
import { ClaudeToolCall } from "@/registry/brainless/claude/claude-tool-call";
import { ClaudeTodoList } from "@/registry/brainless/claude/claude-todo-list";
import { ClaudeDiff } from "@/registry/brainless/claude/claude-diff";
import { ClaudePermission } from "@/registry/brainless/claude/claude-permission";
import { ClaudePrompt } from "@/registry/brainless/claude/claude-prompt";
import { ClaudeSlashMenu } from "@/registry/brainless/claude/claude-slash-menu";
import { CodexHeader } from "@/registry/brainless/codex/codex-header";
import { CodexMessage } from "@/registry/brainless/codex/codex-message";
import { CodexExec } from "@/registry/brainless/codex/codex-exec";
import { CodexWorking } from "@/registry/brainless/codex/codex-working";
import { CodexDiff } from "@/registry/brainless/codex/codex-diff";
import { CodexPermissions } from "@/registry/brainless/codex/codex-permissions";
import { CodexSlashMenu } from "@/registry/brainless/codex/codex-slash-menu";
import { CodexPrompt } from "@/registry/brainless/codex/codex-prompt";
import { GrokHeader } from "@/registry/brainless/grok/grok-header";
import { GrokStatus } from "@/registry/brainless/grok/grok-status";
import { GrokMessage } from "@/registry/brainless/grok/grok-message";
import { GrokEvent } from "@/registry/brainless/grok/grok-event";
import { GrokThought } from "@/registry/brainless/grok/grok-thought";
import { GrokThinking } from "@/registry/brainless/grok/grok-thinking";
import { GrokWorking } from "@/registry/brainless/grok/grok-working";
import { GrokTool } from "@/registry/brainless/grok/grok-tool";
import { GrokWrite } from "@/registry/brainless/grok/grok-write";
import { GrokPermission } from "@/registry/brainless/grok/grok-permission";
import { GrokPlan } from "@/registry/brainless/grok/grok-plan";
import { GrokProjectPicker } from "@/registry/brainless/grok/grok-project-picker";
import { GrokShortcuts } from "@/registry/brainless/grok/grok-shortcuts";
import { GrokSettings } from "@/registry/brainless/grok/grok-settings";
import { GrokTurnEnd } from "@/registry/brainless/grok/grok-turn-end";
import { GrokSlashMenu } from "@/registry/brainless/grok/grok-slash-menu";
import { GrokPrompt } from "@/registry/brainless/grok/grok-prompt";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Terminal-agent UIs rebuilt as accessible React components, installable via shadcn.",
};

export default function ComponentsPage() {
  return (
    <DocsShell
      title="Components"
      basePath="/components"
      items={COMPONENTS}
      description={
        <>
          Each captured terminal state, rebuilt as an accessible React component.
          Use the sidebar to jump around. Looking for full compositions?{" "}
          <Link href="/blocks" className="text-foreground underline-offset-4 hover:underline">
            See blocks →
          </Link>
        </>
      }
    >
      {AGENT_GROUPS.filter((g) => componentsByGroup(g.id).length > 0).map(
        (group) => (
          <DocsSection
            key={group.id}
            id={group.id}
            title={group.label}
            color={group.color}
          >
            {group.id === "claude" ? <ClaudeDemos /> : null}
            {group.id === "codex" ? <CodexDemos /> : null}
            {group.id === "grok" ? <GrokDemos /> : null}
          </DocsSection>
        ),
      )}
    </DocsShell>
  );
}

function ClaudeDemos() {
  return (
    <>
      <Showcase name="claude-header">
        <ClaudeHeader />
      </Showcase>

      <Showcase name="claude-message">
        <div className="space-y-2">
          <ClaudeMessage role="user">
            add a dark-mode toggle and run the tests
          </ClaudeMessage>
          <ClaudeMessage>
            I&apos;ll add the toggle, wire it into the theme provider, then run
            the suite.
          </ClaudeMessage>
        </div>
      </Showcase>

      <Showcase name="claude-thinking">
        <ClaudeThinking />
      </Showcase>

      <Showcase name="claude-tool-call">
        <div className="space-y-2">
          <ClaudeToolCall tool="Read" arg="next.config.ts" result="Read 5 lines" />
          <ClaudeToolCall
            tool="Bash"
            arg="bun run build"
            result="Compiled successfully in 1.2s"
          >
            {`▲ Next.js 16.2.10
✓ Compiled successfully
✓ Generating static pages (5/5)`}
          </ClaudeToolCall>
          <ClaudeToolCall tool="Bash" arg="bun test" result="1 test failed" status="error">
            {`FAIL ./captures.test.ts
  ✕ manifest is well-formed`}
          </ClaudeToolCall>
        </div>
      </Showcase>

      <Showcase name="claude-todo-list">
        <ClaudeTodoList
          todos={[
            { label: "Scaffold the app", status: "done" },
            { label: "Build the capture harness", status: "done" },
            { label: "Wire up the eval loop", status: "active" },
            { label: "Ship the components", status: "todo" },
          ]}
        />
      </Showcase>

      <Showcase name="claude-diff">
        <ClaudeDiff
          file="lib/theme.ts"
          summary="Updated lib/theme.ts with 2 additions and 1 removal"
          lines={[
            { type: "ctx", n: 8, text: "export function resolveTheme() {" },
            { type: "del", n: 9, text: "  return 'light'" },
            { type: "add", n: 9, text: "  const stored = readStored()" },
            { type: "add", n: 10, text: "  return stored ?? systemTheme()" },
            { type: "ctx", n: 11, text: "}" },
          ]}
        />
      </Showcase>

      <Showcase name="claude-permission">
        <ClaudePermission />
      </Showcase>

      <Showcase name="claude-slash-menu">
        <ClaudeSlashMenu />
      </Showcase>

      <Showcase name="claude-prompt">
        <div className="space-y-4">
          <ClaudePrompt mode="auto" effort="low" />
          <ClaudePrompt mode="auto" effort="medium" />
          <ClaudePrompt mode="auto" effort="high" />
          <ClaudePrompt mode="auto" effort="xhigh" />
          <ClaudePrompt mode="auto" effort="max" />
          <ClaudePrompt mode="auto" effort="ultracode" />
          <ClaudePrompt mode="manual" effort={false} />
          <ClaudePrompt mode="accept-edits" effort={false} />
          <ClaudePrompt mode="plan" effort={false} />
        </div>
      </Showcase>
    </>
  );
}

function CodexDemos() {
  return (
    <>
      <Showcase name="codex-header">
        <CodexHeader />
      </Showcase>
      <Showcase name="codex-message">
        <div className="space-y-2">
          <CodexMessage role="user">
            add a pricing section to the docs site
          </CodexMessage>
          <CodexMessage>
            Added a three-tier Pricing section and verified the build.
          </CodexMessage>
        </div>
      </Showcase>
      <Showcase name="codex-exec">
        <div className="space-y-1">
          <CodexExec command="Read app/(marketing)/page.tsx" />
          <CodexExec command="Edited components/pricing.tsx" result="(+22 −0)" />
          <CodexExec command="Ran pnpm build" result="→ passed">
            {`pnpm build
✓ compiled successfully`}
          </CodexExec>
        </div>
      </Showcase>
      <Showcase name="codex-working">
        <CodexWorking />
      </Showcase>
      <Showcase name="codex-diff">
        <CodexDiff />
      </Showcase>
      <Showcase name="codex-permissions">
        <CodexPermissions />
      </Showcase>
      <Showcase name="codex-slash-menu">
        <CodexSlashMenu />
      </Showcase>
      <Showcase name="codex-prompt">
        <div className="space-y-4">
          <CodexPrompt mode="default" />
          <CodexPrompt mode="plan" />
        </div>
      </Showcase>
    </>
  );
}

function GrokDemos() {
  return (
    <>
      <Showcase name="grok-header">
        <GrokHeader />
      </Showcase>
      <Showcase name="grok-status">
        <div className="space-y-3">
          <GrokStatus directory="~/dev/brainless" />
          <GrokStatus
            directory="~/dev/brainless"
            mcp={2}
            mcpTotal={3}
            contextUsed="5.5K"
          />
          <GrokStatus
            directory="~/dev/brainless"
            turn={2}
            turnTotal={3}
          />
        </div>
      </Showcase>
      <Showcase name="grok-message">
        <div className="space-y-2">
          <GrokMessage role="user" time="4:38 PM">
            put the pricing block on the marketing page
          </GrokMessage>
          <GrokMessage time="4:38 PM">
            Dropped in a Pricing block with three tiers and a toggle.
          </GrokMessage>
        </div>
      </Showcase>
      <Showcase name="grok-event">
        <div className="space-y-1">
          <GrokEvent label="user_prompt_submit" hooks={3} hooksOk={1} />
          <GrokEvent label="List ." hooks={3} />
          <GrokEvent label="stop" hooks={3} hooksOk={1} />
        </div>
      </Showcase>
      <Showcase name="grok-thought">
        <div className="space-y-3">
          <GrokThought elapsed="0.2s" />
          <GrokThought elapsed="0.1s" gutter />
          <GrokThought streaming>
            scratch.txt exists with content &quot;hello&quot;. I&apos;ll overwrite
            it with world, then stop.
          </GrokThought>
        </div>
      </Showcase>
      <Showcase name="grok-thinking">
        <GrokThinking />
      </Showcase>
      <Showcase name="grok-working">
        <div className="space-y-3">
          <GrokWorking />
          <GrokWorking
            diamond
            label="Write permission probe output file…"
            tokens="16.0k"
            showScrollHint
          />
        </div>
      </Showcase>
      <Showcase name="grok-tool">
        <div className="space-y-2">
          <GrokTool verb="read" path="app/(marketing)/page.tsx" />
          <GrokTool verb="wrote" path="components/pricing.tsx" meta="+31" />
          <GrokTool
            variant="card"
            title="Run Write permission probe output file"
            hooks={3}
          />
        </div>
      </Showcase>
      <Showcase name="grok-write">
        <GrokWrite
          before={[{ n: 1, text: "hello" }]}
          after={[{ n: 1, text: "world" }]}
          hooks={{
            pre: [
              { label: "global/settings:pre_tool_use[0].hooks[0]", ok: true, ms: 11 },
              { label: "global/orca-status:pre_tool_use[0].hooks[0]", ok: true, ms: 9 },
            ],
            post: [
              { label: "global/settings:post_tool_use[0].hooks[0]", ok: true, ms: 9 },
              {
                label: "global/settings:post_tool_use[1].hooks[0]",
                ok: false,
                ms: 0,
                detail: "hook not executed: required env var(s) not set",
              },
            ],
          }}
        />
      </Showcase>
      <Showcase name="grok-permission">
        <GrokPermission />
      </Showcase>
      <Showcase name="grok-plan">
        <GrokPlan />
      </Showcase>
      <Showcase name="grok-project-picker">
        <GrokProjectPicker />
      </Showcase>
      <Showcase name="grok-shortcuts">
        <GrokShortcuts />
      </Showcase>
      <Showcase name="grok-settings">
        <GrokSettings />
      </Showcase>
      <Showcase name="grok-turn-end">
        <div className="space-y-2">
          <GrokEvent label="stop" hooks={3} hooksOk={1} />
          <GrokTurnEnd elapsed="8.0s" />
        </div>
      </Showcase>
      <Showcase name="grok-slash-menu">
        <GrokSlashMenu />
      </Showcase>
      <Showcase name="grok-prompt">
        <div className="space-y-4">
          <GrokPrompt mode="always-approve" showShortcuts={false} />
          <GrokPrompt mode="normal" />
          <GrokPrompt mode="plan" />
          <GrokPrompt mode="auto" />
        </div>
      </Showcase>
    </>
  );
}
