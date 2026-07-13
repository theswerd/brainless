"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { ClaudeIcon, CodexIcon } from "@/components/agent-icons";
import { AGENT_PROMPT } from "@/lib/install";
import { claudeCodeDeepLink, codexDeepLink } from "@/lib/agent-prompt";
import { cn } from "@/lib/utils";

/**
 * Hero CTA — copy the brainless agent prompt, or open it in Claude Code / Codex.
 */
export function HeroAgentPrompt({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can fail in insecure contexts
    }
  }

  return (
    <div className={cn("flex min-w-0 max-w-full flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={copy}
        className="inline-flex max-w-full items-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied" : "Copy agent prompt"}
      </button>

      <a
        href={claudeCodeDeepLink(AGENT_PROMPT)}
        aria-label="Open prompt in Claude Code"
        title="Open in Claude Code"
        className="inline-flex size-10 items-center justify-center border border-border bg-background/40 text-[var(--agent-claude)] backdrop-blur-sm transition-colors hover:bg-accent"
      >
        <ClaudeIcon className="size-4" />
      </a>

      <a
        href={codexDeepLink(AGENT_PROMPT)}
        aria-label="Open prompt in Codex"
        title="Open in Codex"
        className="inline-flex size-10 items-center justify-center border border-border bg-background/40 backdrop-blur-sm transition-colors hover:bg-accent"
      >
        <CodexIcon className="size-4" />
      </a>
    </div>
  );
}
