"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CodexPermissions — Codex CLI's `/permissions` chooser.
 *
 * Captured grammar (v0.132): a title, then a numbered list with a `›` on the
 * active row and wrapped descriptions. Footer: "Press enter to confirm or esc
 * to go back".
 */
const FG = "#ededed";
const DIM = "#7a7a7a";
const ACCENT = "#f6e2b7";

export type CodexPermissionOption = {
  label: string;
  description: string;
  current?: boolean;
};

const DEFAULT_OPTIONS: CodexPermissionOption[] = [
  {
    label: "Default",
    current: true,
    description:
      "Codex can read and edit files in the current workspace, and run commands. Approval is required to access the internet or edit other files.",
  },
  {
    label: "Auto-review",
    description:
      "Same workspace-write permissions as Default, but eligible `on-request` approvals are routed through the auto-reviewer subagent.",
  },
  {
    label: "Full Access",
    description:
      "Codex can edit files outside this workspace and access the internet without asking for approval. Exercise caution when using.",
  },
];

export function CodexPermissions({
  title = "Update Model Permissions",
  options = DEFAULT_OPTIONS,
  defaultSelected = 0,
  onChoose,
  className,
}: {
  title?: string;
  options?: CodexPermissionOption[];
  defaultSelected?: number;
  onChoose?: (index: number) => void;
  className?: string;
}) {
  const [sel, setSel] = React.useState(defaultSelected);

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? (i + 1) % options.length
          : (i - 1 + options.length) % options.length;
      setSel(next);
      (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSel(i);
      onChoose?.(i);
    }
  }

  return (
    <div className={cn("font-mono text-[13px] leading-[1.55]", className)}>
      <div className="mb-2 font-semibold" style={{ color: FG }}>
        {title}
      </div>

      <div role="radiogroup" aria-label={title} className="space-y-2">
        {options.map((opt, i) => {
          const active = sel === i;
          return (
            <div
              key={opt.label}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => {
                setSel(i);
                onChoose?.(i);
              }}
              className="flex cursor-pointer gap-2 outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <span
                aria-hidden
                className="inline-block w-[2ch] shrink-0 font-bold"
                style={{ color: active ? FG : "transparent" }}
              >
                ›
              </span>
              <div className="min-w-0">
                <div style={{ color: active ? ACCENT : FG }}>
                  <span className="tabular-nums">{i + 1}.</span> {opt.label}
                  {opt.current ? (
                    <span style={{ color: DIM }}> (current)</span>
                  ) : null}
                </div>
                <p
                  className="mt-0.5 max-w-prose pl-0 text-[12px]"
                  style={{ color: DIM }}
                >
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[12px]" style={{ color: DIM }}>
        Press enter to confirm or esc to go back
      </p>
    </div>
  );
}
