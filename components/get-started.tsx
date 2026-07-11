"use client";

import * as React from "react";
import { Check, Copy, Terminal, Sparkles } from "lucide-react";
import {
  AGENT_PROMPT,
  INSTALL_TARGETS,
  NAMESPACE_SETUP,
  type InstallTargetId,
} from "@/lib/install";
import { cn } from "@/lib/utils";

function useCopy(value: string) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore — clipboard can fail in insecure contexts
    }
  }, [value]);

  return { copied, copy };
}

function CopyAction({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const { copied, copy } = useCopy(value);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90",
        className,
      )}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied" : label}
    </button>
  );
}

function Panel({
  icon,
  eyebrow,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-col border border-border bg-card/40">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-muted-foreground" aria-hidden>
            {icon}
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h2>
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">{children}</div>
    </div>
  );
}

function InstallPanel() {
  const [target, setTarget] = React.useState<InstallTargetId>("claude-session");
  const active =
    INSTALL_TARGETS.find((t) => t.id === target) ?? INSTALL_TARGETS[0];
  const combined = `${NAMESPACE_SETUP}\n${active.command}`;

  return (
    <Panel
      icon={<Terminal size={18} />}
      eyebrow="Install"
      title="Add a session block"
      action={<CopyAction value={combined} label="Copy commands" />}
    >
      <pre className="mb-4 overflow-x-auto bg-background/80 p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
        <code>{NAMESPACE_SETUP}</code>
      </pre>

      <div
        role="tablist"
        aria-label="Agent"
        className="mb-4 flex flex-wrap gap-1"
      >
        {INSTALL_TARGETS.map((t) => {
          const selected = t.id === target;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTarget(t.id)}
              className={cn(
                "px-3 py-1.5 font-mono text-xs transition-colors",
                selected
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <pre className="flex-1 overflow-x-auto bg-background/80 p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{active.command}</code>
      </pre>

      <p className="mt-3 text-sm text-muted-foreground">
        Register <span className="font-mono text-foreground">@brainless</span>{" "}
        once, then add the {active.label} session (and its dependencies).
      </p>
    </Panel>
  );
}

function PromptPanel() {
  return (
    <Panel
      icon={<Sparkles size={18} />}
      eyebrow="For your agent"
      title="Copy prompt"
      action={<CopyAction value={AGENT_PROMPT} label="Copy prompt" />}
    >
      <pre className="max-h-[14.5rem] flex-1 overflow-auto bg-background/80 p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-muted-foreground sm:max-h-[16rem]">
        <code>{AGENT_PROMPT}</code>
      </pre>

      <p className="mt-3 text-sm text-muted-foreground">
        Paste into Claude Code, Codex, Cursor, or Grok — tells the agent what
        brainless is and how to install it.
      </p>
    </Panel>
  );
}

export function GetStarted() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-xl">
          <h2 className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
            Get it into a project
          </h2>
          <p className="mt-2 text-pretty text-muted-foreground">
            Install yourself, or hand your coding agent a prompt that already
            knows the registry.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <InstallPanel />
          <PromptPanel />
        </div>
      </div>
    </section>
  );
}
