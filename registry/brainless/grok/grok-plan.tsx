"use client";

import * as React from "react";
import { GrokPrompt } from "@/registry/brainless/grok/grok-prompt";
import { cn } from "@/lib/utils";

/**
 * GrokPlan — Grok CLI's plan.md approval card.
 *
 * Captured grammar (v0.2.93): a framed `plan.md` viewer with line numbers,
 * an action row (`a approve | s request changes | c comment | q quit plan`),
 * a yellow `◆ Waiting on plan approval` status (38;5;11 — plan accent only),
 * and the composer in `· plan approval` mode.
 */
const BORDER = "#808080";
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";
const PLAN = "#ffff00"; // 38;5;11 — plan-mode accent only

const DEFAULT_LINES = [
  "Plan: Touch planned.txt",
  "",
  "Context",
  "",
  "Create an empty marker file planned.txt in the workspace root so a planned touch can be verified. No other files or changes.",
  "",
  "Steps",
  "",
  "1. Create planned.txt — Write (or touch) an empty file at the workspace root.",
  "2. Verify — Confirm the file exists (e.g. read or ls) and stop.",
  "",
  "Critical files",
  "",
  "• planned.txt (new) — workspace root",
];

const ACTIONS = [
  { key: "a", label: "approve" },
  { key: "s", label: "request changes" },
  { key: "c", label: "comment" },
  { key: "q", label: "quit plan" },
] as const;

export function GrokPlan({
  filename = "plan.md",
  lines = DEFAULT_LINES,
  status = "Waiting on plan approval",
  onAction,
  className,
}: {
  filename?: string;
  lines?: string[];
  status?: string;
  onAction?: (key: (typeof ACTIONS)[number]["key"]) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 font-mono text-[13px] leading-[1.5]", className)}>
      <div
        className="overflow-hidden rounded-sm border"
        style={{ borderColor: BORDER }}
        role="region"
        aria-label={`${filename} plan`}
      >
        <div
          className="flex items-center justify-between border-b px-2 py-1 text-[12px]"
          style={{ borderColor: BORDER, color: MUTED }}
        >
          <span>
            <span aria-hidden>─ </span>
            {filename}
          </span>
          <span aria-hidden title="Open">
            [↗]
          </span>
        </div>

        <ol className="max-h-[16rem] overflow-auto px-2 py-1.5" style={{ color: FG }}>
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span
                aria-hidden
                className="w-5 shrink-0 select-none text-right tabular-nums"
                style={{ color: DIM }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 whitespace-pre-wrap">{line || "\u00a0"}</span>
            </li>
          ))}
        </ol>

        <div
          className="flex flex-wrap items-center justify-center gap-x-2 border-t px-2 py-1.5 text-[12px]"
          style={{ borderColor: BORDER, color: MUTED }}
        >
          {ACTIONS.map((a, i) => (
            <React.Fragment key={a.key}>
              {i > 0 ? <span aria-hidden>|</span> : null}
              <button
                type="button"
                onClick={() => onAction?.(a.key)}
                className="rounded-none px-0.5 outline-none hover:text-white focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <span className="font-semibold" style={{ color: FG }}>
                  {a.key}
                </span>{" "}
                {a.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        className="flex items-baseline gap-2"
        role="status"
        aria-live="polite"
        style={{ color: PLAN }}
      >
        <span aria-hidden>◆</span>
        <span>{status}</span>
      </div>

      <GrokPrompt mode="plan-approval" showShortcuts={false} />

      <div
        className="flex flex-wrap items-center gap-x-2 text-[12px]"
        style={{ color: DIM }}
      >
        <span>
          <span className="font-semibold" style={{ color: FG }}>
            c
          </span>
          :comment
        </span>
        <span aria-hidden>│</span>
        <span>
          <span className="font-semibold" style={{ color: FG }}>
            a
          </span>
          :approve
        </span>
        <span aria-hidden>│</span>
        <span>
          <span className="font-semibold" style={{ color: FG }}>
            q
          </span>
          :quit plan
        </span>
        <span aria-hidden>│</span>
        <span>
          <span className="font-semibold" style={{ color: FG }}>
            Tab
          </span>
          :prompt
        </span>
      </div>
    </div>
  );
}
