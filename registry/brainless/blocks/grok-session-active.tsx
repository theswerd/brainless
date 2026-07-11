import { GrokStatus } from "@/registry/brainless/grok/grok-status";
import { GrokMessage } from "@/registry/brainless/grok/grok-message";
import { GrokEvent } from "@/registry/brainless/grok/grok-event";
import { GrokThought } from "@/registry/brainless/grok/grok-thought";
import { GrokTool } from "@/registry/brainless/grok/grok-tool";
import { GrokWrite } from "@/registry/brainless/grok/grok-write";
import { GrokWorking } from "@/registry/brainless/grok/grok-working";
import { GrokPrompt } from "@/registry/brainless/grok/grok-prompt";

/**
 * GrokSessionActive — a mid-turn Grok CLI screen: status bar, live transcript
 * (hooks → streaming thought → tool card → write preview), the working footer
 * with token count / stop, and the composer in cancel mode.
 */
export function GrokSessionActive() {
  return (
    <div className="space-y-3 font-mono text-[13px] leading-[1.6] text-[#e8e8e8]">
      <GrokStatus
        branch="main"
        directory="~/dev/acme-app"
        contextUsed="16.6k"
        contextLimit="500K"
        turn={1}
        turnTotal={3}
      />

      <div className="space-y-2 pt-1">
        <GrokMessage role="user" time="4:51 PM">
          overwrite theme-toggle.tsx so the label reads &quot;Dark mode&quot;.
          Nothing else.
        </GrokMessage>

        <GrokEvent label="user_prompt_submit" hooks={3} hooksOk={1} />

        <GrokThought streaming>
          theme-toggle.tsx already exports ThemeToggle. I&apos;ll patch the
          visible label to &quot;Dark mode&quot;, then stop.
        </GrokThought>

        <GrokTool
          variant="card"
          title="Run Write components/theme-toggle.tsx"
          hooks={3}
        />

        <GrokWrite
          before={[{ n: 18, text: 'aria-label="Toggle theme"' }]}
          after={[{ n: 18, text: 'aria-label="Dark mode"' }]}
          hooks={{
            pre: [
              {
                label: "global/settings:pre_tool_use[0].hooks[0]",
                ok: true,
                ms: 11,
              },
            ],
          }}
        />

        <GrokWorking
          diamond
          label="Write components/theme-toggle.tsx…"
          tokens="16.6k"
          showScrollHint
        />
      </div>

      <div className="pt-3">
        <GrokPrompt mode="always-approve" busy showShortcuts />
      </div>
    </div>
  );
}
