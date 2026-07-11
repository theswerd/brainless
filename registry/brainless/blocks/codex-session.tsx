import { CodexHeader } from "@/registry/brainless/codex/codex-header";
import { CodexMessage } from "@/registry/brainless/codex/codex-message";
import { CodexExec } from "@/registry/brainless/codex/codex-exec";
import { CodexWorking } from "@/registry/brainless/codex/codex-working";
import { CodexPrompt } from "@/registry/brainless/codex/codex-prompt";

/**
 * CodexSession — a complete Codex CLI screen: launch card, a full turn
 * (prompt → reply → exec lines → working) and the pinned › composer.
 */
export function CodexSession() {
  return (
    <div className="space-y-3 font-mono text-[13px] leading-[1.6] text-[#ededed]">
      <CodexHeader directory="~/dev/acme-app" />

      <div className="text-[#e0af68]">
        <span aria-hidden>⚠ </span>
        MCP startup incomplete (failed: github)
      </div>

      <div className="space-y-3 pt-1">
        <CodexMessage role="user">
          add a dark-mode toggle to the settings page and run the tests
        </CodexMessage>

        <CodexMessage>
          I&apos;ll read the settings page, add the toggle, then run the suite.
        </CodexMessage>

        <div className="space-y-1">
          <CodexExec command="Read app/settings/page.tsx" />
          <CodexExec
            command="Edited app/settings/page.tsx"
            result="(+12 −1)"
          />
          <CodexExec command="Edited components/theme-toggle.tsx" result="(+48 −0)" />
          <CodexExec command="Ran bun test" result="→ passed">
            {`bun test v1.2.21
✓ settings > renders the theme toggle
✓ theme > persists across reloads
 12 pass
 0 fail`}
          </CodexExec>
        </div>

        <CodexWorking />
      </div>

      <div className="pt-2">
        <CodexPrompt directory="~/dev/acme-app" />
      </div>
    </div>
  );
}
