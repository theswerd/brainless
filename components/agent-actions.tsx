"use client";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { ClaudeIcon, CodexIcon } from "@/components/agent-icons";
import {
  agentPromptParts,
  claudeCodeDeepLink,
  codexDeepLink,
  type AgentPromptInput,
} from "@/lib/agent-prompt";
import { cn } from "@/lib/utils";

export function AgentActions({
  item,
  className,
}: {
  item: AgentPromptInput;
  className?: string;
}) {
  const parts = agentPromptParts(item);

  return (
    <div className={cn("border border-border/60 bg-card/20", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">Prompt</span>
      </div>
      <div className="flex items-stretch gap-0">
        <p className="min-w-0 flex-1 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-foreground/85">
          Read{" "}
          <a
            href={parts.llmsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors hover:decoration-foreground"
          >
            {parts.llmsUrl}
          </a>{" "}
          and add the brainless &ldquo;{parts.title}&rdquo; component (
          <code className="text-foreground">{parts.name}</code>) to this project.
        </p>
        <div className="flex shrink-0 flex-col justify-center gap-0.5 p-1.5 sm:flex-row sm:items-center">
          <CopyButton
            value={parts.text}
            label="Copy prompt"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          />
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href={claudeCodeDeepLink(parts.text)}
              aria-label="Add to Claude Code"
              title="Add to Claude Code"
            >
              <ClaudeIcon className="size-3.5 text-[var(--agent-claude)]" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href={codexDeepLink(parts.text)}
              aria-label="Add to Codex"
              title="Add to Codex"
            >
              <CodexIcon className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
