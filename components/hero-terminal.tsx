"use client";

import * as React from "react";
import { ClaudeHeader, ClaudeLogo } from "@/registry/brainless/claude/claude-header";
import { ClaudeMessage } from "@/registry/brainless/claude/claude-message";
import { ClaudeThinking } from "@/registry/brainless/claude/claude-thinking";
import { ClaudeToolCall } from "@/registry/brainless/claude/claude-tool-call";
import { ClaudeDiff } from "@/registry/brainless/claude/claude-diff";
import { ClaudePrompt } from "@/registry/brainless/claude/claude-prompt";
import { CodexHeader } from "@/registry/brainless/codex/codex-header";
import { CodexMessage } from "@/registry/brainless/codex/codex-message";
import { CodexExec } from "@/registry/brainless/codex/codex-exec";
import { CodexWorking } from "@/registry/brainless/codex/codex-working";
import { CodexPrompt } from "@/registry/brainless/codex/codex-prompt";
import { GrokStatus } from "@/registry/brainless/grok/grok-status";
import { GrokHeader } from "@/registry/brainless/grok/grok-header";
import { GrokMessage } from "@/registry/brainless/grok/grok-message";
import { GrokEvent } from "@/registry/brainless/grok/grok-event";
import { GrokThought } from "@/registry/brainless/grok/grok-thought";
import { GrokTool } from "@/registry/brainless/grok/grok-tool";
import { GrokWrite } from "@/registry/brainless/grok/grok-write";
import { GrokTurnEnd } from "@/registry/brainless/grok/grok-turn-end";
import { GrokPrompt } from "@/registry/brainless/grok/grok-prompt";
import { CodexIcon } from "@/components/agent-icons";

type TabId = "claude" | "codex" | "grok";

const TABS: { id: TabId; label: string }[] = [
  { id: "claude", label: "Claude Code" },
  { id: "codex", label: "Codex" },
  { id: "grok", label: "Grok" },
];

/** Solid Grok mark for the tab bar — brand path, not the CLI braille dots. */
function GrokTabLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      fillRule="evenodd"
    >
      <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
    </svg>
  );
}

function TabIcon({ id, className }: { id: TabId; className?: string }) {
  if (id === "claude") return <ClaudeLogo className={className} />;
  if (id === "grok") return <GrokTabLogo className={className} />;
  return <CodexIcon className={className} />;
}

export function HeroTerminal() {
  const [tab, setTab] = React.useState<TabId>("claude");

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-3 sm:px-4">
        <div className="flex gap-2" aria-hidden>
          <i className="size-3 rounded-full bg-[#ff5f57]" />
          <i className="size-3 rounded-full bg-[#febc2e]" />
          <i className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div role="tablist" aria-label="Agent" className="flex items-center gap-1">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                aria-label={t.label}
                onClick={() => setTab(t.id)}
                className={
                  "flex size-7 items-center justify-center rounded-md text-white transition-colors " +
                  (active ? "bg-white/10" : "hover:bg-white/5")
                }
                style={{ opacity: active ? 1 : 0.45 }}
              >
                <TabIcon id={t.id} className="h-3.5 w-auto" />
              </button>
            );
          })}
        </div>
      </div>

      {/* the agent's header + session — all panels share one grid cell so the
          window height stays constant (tallest tab wins) and switching tabs
          doesn't jump the layout. */}
      <div className="grid min-w-0 overflow-hidden px-3 py-4 font-mono text-[13px] leading-[1.65] sm:px-5 sm:py-5">
        {TABS.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            aria-hidden={t.id !== tab}
            className="flex h-full min-w-0 flex-col gap-3 overflow-hidden break-words [grid-area:1/1]"
            style={{ visibility: t.id === tab ? "visible" : "hidden" }}
          >
            {t.id === "claude" ? <ClaudeSession /> : null}
            {t.id === "codex" ? <CodexSession /> : null}
            {t.id === "grok" ? <GrokSession /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaudeSession() {
  return (
    <>
      <ClaudeHeader
        cwd="~/acme-site"
        model="Fable 7 with xhigh effort · Claude Max"
      />
      <ClaudeMessage role="user">
        add the brainless pricing block to our landing page
      </ClaudeMessage>
      <ClaudeToolCall
        tool="Bash"
        arg="bunx shadcn add brainless/pricing"
        result="Added 1 block · 2 files"
      />
      <ClaudeDiff
        file="app/page.tsx"
        summary="Updated app/page.tsx with 3 additions"
        lines={[
          { type: "ctx", n: 41, text: "  <Features />" },
          { type: "add", n: 42, text: "  <Pricing tiers={TIERS} />" },
          { type: "ctx", n: 43, text: "  <Footer />" },
        ]}
      />
      <div className="pt-1">
        <ClaudeThinking />
      </div>
      <div className="pt-2">
        <ClaudePrompt />
      </div>
    </>
  );
}

function CodexSession() {
  return (
    <>
      <CodexHeader directory="~/acme-site" model="gpt-6.9 low" />
      <CodexMessage role="user">
        add the brainless pricing section to the docs site
      </CodexMessage>
      <CodexExec command="Read app/(marketing)/page.tsx" />
      <CodexExec command="Edited components/pricing.tsx" result="(+22 −0)" />
      <div className="pt-1">
        <CodexWorking label="Running pnpm build" />
      </div>
      <div className="pt-2">
        <CodexPrompt directory="~/acme-site" model="gpt-6.9 low" />
      </div>
    </>
  );
}

function GrokSession() {
  return (
    <>
      <GrokStatus
        branch="main"
        directory="~/acme-site"
        contextUsed="16K"
        contextLimit="500K"
        turn={2}
        turnTotal={3}
      />

      <GrokHeader
        headline="Grok 4.21 is here!"
        subhead="Grok 4.21 is now available. Try it out in the /model picker."
      />

      <div className="text-[#6c6c6c]">
        Tip: Use Shift+Tab to cycle between modes, like Plan mode.
      </div>

      <div className="space-y-2 pt-1">
        <GrokMessage role="user" time="4:38 PM">
          put the brainless pricing block on the marketing page
        </GrokMessage>

        <GrokEvent label="user_prompt_submit" hooks={3} hooksOk={1} />
        <GrokThought elapsed="0.4s" />

        <GrokMessage time="4:38 PM">
          I&apos;ll open the marketing page, drop in the pricing block, then
          verify the build.
        </GrokMessage>

        <GrokTool verb="read" path="app/(marketing)/page.tsx" />
        <GrokTool
          variant="card"
          title="Run Write components/pricing.tsx"
          hooks={3}
        />
        <GrokWrite
          before={[{ n: 41, text: "  <Features />" }]}
          after={[{ n: 41, text: "  <Pricing tiers={TIERS} />" }]}
        />

        <GrokEvent label="stop" hooks={3} hooksOk={1} />
        <GrokTurnEnd elapsed="9.2s" />
      </div>

      <div className="mt-auto pt-2">
        <GrokPrompt
          mode="always-approve"
          showShortcuts={false}
          model="Grok 4.21 (xhigh)"
        />
      </div>
    </>
  );
}
