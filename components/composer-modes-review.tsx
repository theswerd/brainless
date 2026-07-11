"use client";

import * as React from "react";
import {
  ClaudePrompt,
  type ClaudeMode,
} from "@/registry/brainless/claude/claude-prompt";
import {
  CodexPrompt,
  type CodexMode,
} from "@/registry/brainless/codex/codex-prompt";
import {
  GrokPrompt,
  type GrokMode,
} from "@/registry/brainless/grok/grok-prompt";
import { cn } from "@/lib/utils";

type Captures = {
  claude: Record<"auto" | "manual" | "accept" | "plan", string>;
  codex: Record<"default" | "plan", string>;
  grok: Record<"always" | "normal" | "plan" | "auto", string>;
};

function Panel({
  side,
  title,
  children,
}: {
  side: "capture" | "component";
  title: string;
  children: React.ReactNode;
}) {
  const capture = side === "capture";
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider",
            capture
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40",
          )}
        >
          {capture ? "Capture" : "Component"}
        </span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="term-window">
        <div className="term-titlebar">
          <span className="term-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="term-title">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function CaptureComposer({ html }: { html: string }) {
  return (
    <pre
      className="term-screen overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Pair({
  id,
  title,
  note,
  captureHtml,
  captureTitle,
  children,
}: {
  id: string;
  title: string;
  note: string;
  captureHtml: string;
  captureTitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border/60 pt-8">
      <div className="mb-4 max-w-3xl">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 font-mono text-[12px] text-muted-foreground">{note}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel side="capture" title={captureTitle}>
          <CaptureComposer html={captureHtml} />
        </Panel>
        <Panel side="component" title="live component">
          <div className="bg-[var(--term-bg)] p-4">{children}</div>
        </Panel>
      </div>
    </section>
  );
}

const TOC = [
  { id: "claude", label: "Claude" },
  { id: "codex", label: "Codex" },
  { id: "grok", label: "Grok" },
];

export function ComposerModesReview({ captures }: { captures: Captures }) {
  return (
    <div>
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] text-muted-foreground">
          fidelity review · composers + shift+tab modes
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Prompt boxes &amp; modes
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Capture (left) vs component (right). Composer-only crops from the
          shift+tab mode runs.
        </p>
      </header>

      <nav className="sticky top-14 z-30 mt-8 -mx-4 border-y border-border/70 bg-background/85 px-4 py-2 backdrop-blur sm:mx-0 sm:border">
        <ol className="flex gap-1 overflow-x-auto font-mono text-[11px]">
          {TOC.map((t) => (
            <li key={t.id} className="shrink-0">
              <a
                href={`#${t.id}`}
                className="block rounded px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div id="claude" className="scroll-mt-28 mt-10">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--agent-claude)" }}
        >
          Claude Code
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Dual rules + ❯ · auto gold · manual gray · accept lavender · plan teal
        </p>

        {(
          [
            ["auto", "auto", "auto mode"],
            ["manual", "manual", "manual mode"],
            ["accept-edits", "accept", "accept edits"],
            ["plan", "plan", "plan mode"],
          ] as const
        ).map(([mode, key, label]) => (
          <Pair
            key={mode}
            id={`claude-${mode}`}
            title={label}
            note={`ClaudePrompt mode="${mode}"`}
            captureHtml={captures.claude[key]}
            captureTitle={`claude/modes → ${key}`}
          >
            <ClaudePrompt mode={mode as ClaudeMode} />
          </Pair>
        ))}
      </div>

      <div id="codex" className="scroll-mt-28 mt-14">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--agent-codex)" }}
        >
          Codex
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          › + dim placeholder · warm model · green cwd · plan tag magenta
        </p>

        {(
          [
            ["default", "default", "default"],
            ["plan", "plan", "plan mode"],
          ] as const
        ).map(([mode, key, label]) => (
          <Pair
            key={mode}
            id={`codex-${mode}`}
            title={label}
            note={`CodexPrompt mode="${mode}"`}
            captureHtml={captures.codex[key]}
            captureTitle={`codex/modes → ${key}`}
          >
            <CodexPrompt mode={mode as CodexMode} />
          </Pair>
        ))}
      </div>

      <div id="grok" className="scroll-mt-28 mt-14">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--agent-grok)" }}
        >
          Grok
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Rounded box · legend on bottom edge · plan caret yellow
        </p>

        {(
          [
            ["always-approve", "always", "always-approve", false],
            ["normal", "normal", "normal", true],
            ["plan", "plan", "plan", true],
            ["auto", "auto", "auto", true],
          ] as const
        ).map(([mode, key, label, shortcuts]) => (
          <Pair
            key={mode}
            id={`grok-${mode}`}
            title={label}
            note={`GrokPrompt mode="${mode}"`}
            captureHtml={captures.grok[key]}
            captureTitle={`grok/modes → ${key}`}
          >
            <GrokPrompt mode={mode as GrokMode} showShortcuts={shortcuts} />
          </Pair>
        ))}
      </div>
    </div>
  );
}
