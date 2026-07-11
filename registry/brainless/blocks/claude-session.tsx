import { ClaudeHeader } from "@/registry/brainless/claude/claude-header";
import { ClaudeMessage } from "@/registry/brainless/claude/claude-message";
import { ClaudeTodoList } from "@/registry/brainless/claude/claude-todo-list";
import { ClaudeToolCall } from "@/registry/brainless/claude/claude-tool-call";
import { ClaudeDiff } from "@/registry/brainless/claude/claude-diff";
import { ClaudePermission } from "@/registry/brainless/claude/claude-permission";
import { ClaudeThinking } from "@/registry/brainless/claude/claude-thinking";
import { ClaudePrompt } from "@/registry/brainless/claude/claude-prompt";

/**
 * ClaudeSession — a complete Claude Code screen: welcome header, a full turn
 * (prompt → plan → tool calls → diff → approval → working line) and the pinned
 * input composer. Everything a Claude Code session shows, as one block.
 */
export function ClaudeSession() {
  return (
    <div className="space-y-3 font-mono text-[13px] leading-[1.6] text-[#c0caf5]">
      <ClaudeHeader cwd="~/dev/acme-app" />

      <div style={{ color: "#e0af68" }}>
        <span aria-hidden>⚠ </span>3 MCP servers need authentication · run /mcp
      </div>

      <div className="space-y-3 pt-1">
        <ClaudeMessage role="user">
          add a dark-mode toggle to the settings page and run the tests
        </ClaudeMessage>

        <ClaudeMessage>
          I&apos;ll add the toggle, wire it into the theme provider, then run the
          suite.
        </ClaudeMessage>

        <ClaudeTodoList
          todos={[
            { label: "Read the settings page", status: "done" },
            { label: "Add the dark-mode toggle", status: "active" },
            { label: "Run the test suite", status: "todo" },
          ]}
        />

        <ClaudeToolCall tool="Read" arg="app/settings/page.tsx" result="Read 48 lines" />

        <ClaudeDiff
          file="app/settings/page.tsx"
          summary="Updated app/settings/page.tsx with 3 additions and 1 removal"
          lines={[
            { type: "ctx", n: 11, text: "export function Settings() {" },
            { type: "del", n: 12, text: "  return <Panel>{sections}</Panel>" },
            { type: "add", n: 12, text: "  return (" },
            { type: "add", n: 13, text: "    <Panel header={<ThemeToggle />}>" },
            { type: "add", n: 14, text: "      {sections}" },
            { type: "ctx", n: 15, text: "    </Panel>" },
          ]}
        />

        <ClaudeToolCall
          tool="Bash"
          arg="bun test"
          result="12 passed, 0 failed in 1.4s"
        >
          {`bun test v1.2.21
✓ settings > renders the theme toggle
✓ theme > persists across reloads
 12 pass
 0 fail`}
        </ClaudeToolCall>

        <ClaudePermission
          title="Bash command"
          command="git commit -am 'Add dark-mode toggle'"
          question="Do you want to proceed?"
        />

        <ClaudeThinking />
      </div>

      <div className="pt-2">
        <ClaudePrompt />
      </div>
    </div>
  );
}
